package jwt

import (
	"context"
	"fmt"
	"time"

	"new-e-power/backend-v2/config"
	"new-e-power/backend-v2/internal/domain"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTService interface {
	GenerateTokenPair(ctx context.Context, userID int64, email, role string) (*domain.TokenPair, error)
	ValidateAccessToken(tokenString string) (*domain.AccessTokenClaims, error)
	ValidateRefreshToken(tokenString string) (*domain.RefreshTokenClaims, error)
	GenerateAccessToken(userID int64, email, role, tokenID string) (string, error) // 新增：供外部調用
	RevokeToken(ctx context.Context, tokenID string) error
	IsTokenRevoked(ctx context.Context, tokenID string) (bool, error)
}

type jwtService struct {
	config      *config.JWTConfig
	redisClient domain.SessionRepository
}

// ✅ 移除 UserUsecase 依賴
func NewJWTService(cfg *config.JWTConfig, redis domain.SessionRepository) JWTService {
	return &jwtService{
		config:      cfg,
		redisClient: redis,
	}
}

// GenerateTokenPair 生成 Access Token 和 Refresh Token
func (s *jwtService) GenerateTokenPair(
	ctx context.Context,
	userID int64,
	email, role string,
) (*domain.TokenPair, error) {
	tokenID := uuid.New().String()

	accessToken, err := s.generateAccessToken(userID, email, role, tokenID)
	if err != nil {
		return nil, fmt.Errorf("生成 Access Token 失敗: %w", err)
	}

	refreshToken, err := s.generateRefreshToken(userID, tokenID)
	if err != nil {
		return nil, fmt.Errorf("生成 Refresh Token 失敗: %w", err)
	}

	sessionKey := fmt.Sprintf("session:%d:%s", userID, tokenID)
	err = s.redisClient.Set(ctx, sessionKey, "active", s.config.RefreshTokenDuration)
	if err != nil {
		return nil, fmt.Errorf("存儲 Session 失敗: %w", err)
	}

	return &domain.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    int64(s.config.AccessTokenDuration.Seconds()),
	}, nil
}

// generateAccessToken 生成 Access Token (私有方法)
func (s *jwtService) generateAccessToken(userID int64, email, role, tokenID string) (string, error) {
	now := time.Now()
	claims := domain.AccessTokenClaims{
		UserID:  userID,
		Email:   email,
		Role:    role,
		TokenID: tokenID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.config.Issuer,
			Subject:   fmt.Sprintf("%d", userID),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(s.config.AccessTokenDuration)),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.SecretKey))
}

// ✅ 新增：公開方法供 UseCase 調用 (刷新 Token 時使用)
func (s *jwtService) GenerateAccessToken(userID int64, email, role, tokenID string) (string, error) {
	return s.generateAccessToken(userID, email, role, tokenID)
}

// generateRefreshToken 生成 Refresh Token
func (s *jwtService) generateRefreshToken(userID int64, tokenID string) (string, error) {
	now := time.Now()
	claims := domain.RefreshTokenClaims{
		UserID:  userID,
		TokenID: tokenID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.config.Issuer,
			Subject:   fmt.Sprintf("%d", userID),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(s.config.RefreshTokenDuration)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.RefreshSecretKey))
}

// ValidateAccessToken 驗證 Access Token
func (s *jwtService) ValidateAccessToken(tokenString string) (*domain.AccessTokenClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&domain.AccessTokenClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("非法的簽名方法: %v", token.Header["alg"])
			}
			return []byte(s.config.SecretKey), nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("Token 解析失敗: %w", err)
	}

	claims, ok := token.Claims.(*domain.AccessTokenClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("無效的 Token")
	}

	isRevoked, err := s.IsTokenRevoked(context.Background(), claims.TokenID)
	if err != nil {
		return nil, fmt.Errorf("檢查 Token 狀態失敗: %w", err)
	}
	if isRevoked {
		return nil, fmt.Errorf("Token 已被撤銷")
	}

	return claims, nil
}

// ValidateRefreshToken 驗證 Refresh Token
func (s *jwtService) ValidateRefreshToken(tokenString string) (*domain.RefreshTokenClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&domain.RefreshTokenClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("非法的簽名方法: %v", token.Header["alg"])
			}
			return []byte(s.config.RefreshSecretKey), nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("Refresh Token 解析失敗: %w", err)
	}

	claims, ok := token.Claims.(*domain.RefreshTokenClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("無效的 Refresh Token")
	}

	sessionKey := fmt.Sprintf("session:%d:%s", claims.UserID, claims.TokenID)
	exists, err := s.redisClient.Exists(context.Background(), sessionKey)
	if err != nil || !exists {
		return nil, fmt.Errorf("Session 已失效")
	}

	return claims, nil
}

// RevokeToken 撤銷 Token (登出)
func (s *jwtService) RevokeToken(ctx context.Context, tokenID string) error {
	blacklistKey := fmt.Sprintf("blacklist:%s", tokenID)
	return s.redisClient.Set(ctx, blacklistKey, "revoked", s.config.RefreshTokenDuration)
}

// IsTokenRevoked 檢查 Token 是否已被撤銷
func (s *jwtService) IsTokenRevoked(ctx context.Context, tokenID string) (bool, error) {
	blacklistKey := fmt.Sprintf("blacklist:%s", tokenID)
	return s.redisClient.Exists(ctx, blacklistKey)
}