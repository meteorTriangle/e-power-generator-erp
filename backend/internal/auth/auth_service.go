// internal/auth/auth_service.go
package auth

// import (
// 	"context"
// 	"database/sql"
// 	"errors"
// 	"new-e-power-generator-sys/inventory/internal/shared/database"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// )

// // AuthConfig 儲存 JWT 相關的設定，從 config 讀取
// type AuthConfig struct {
// 	AccessSecret  string
// 	RefreshSecret string
// 	AccessExpiry  time.Duration // e.g., 15 * time.Minute
// 	RefreshExpiry time.Duration // e.g., 7 * 24 * time.Hour
// }

// // CustomClaims 定義我們要在 JWT 中儲存的自訂資料
// type CustomClaims struct {
// 	UserID int    `json:"user_id"`
// 	Role   string `json:"role"`
// 	jwt.RegisteredClaims
// }

// // AuthService 封裝了認證邏輯
// type AuthService struct {
// 	db     *sql.DB
// 	repo   *AuthRepo // 假設您有一個 AuthRepo
// 	config AuthConfig
// }

// func NewAuthService(db *sql.DB, repo *AuthRepo, cfg AuthConfig) *AuthService {
// 	return &AuthService{db: db, repo: repo, config: cfg}
// }

// // Login 處理使用者登入
// func (s *AuthService) Login(ctx context.Context, username, password string) (accessToken, refreshToken string, err error) {
// 	// 1. 從資料庫撈取使用者
// 	user, err := s.repo.GetByUsername(ctx, s.db, username)
// 	if err != nil {
// 		if errors.Is(err, database.ErrNotFound) {
// 			return "", "", errors.New("invalid credentials")
// 		}
// 		return "", "", err
// 	}

// 	// 2. 驗證密碼
// 	if !user.CheckPassword(password) {
// 		return "", "", errors.New("invalid credentials")
// 	}

// 	// 3. 產生 Access Token
// 	accessToken, err = s.generateToken(user.ID, user.Role, s.config.AccessExpiry, s.config.AccessSecret)
// 	if err != nil {
// 		return "", "", err
// 	}

// 	// 4. 產生 Refresh Token
// 	refreshToken, err = s.generateToken(user.ID, user.Role, s.config.RefreshExpiry, s.config.RefreshSecret)
// 	if err != nil {
// 		return "", "", err
// 	}

// 	return accessToken, refreshToken, nil
// }

// // Refresh 處理權杖更新
// func (s *AuthService) Refresh(ctx context.Context, refreshTokenString string) (newAccessToken string, err error) {
// 	// 1. 驗證 Refresh Token
// 	claims, err := s.validateToken(refreshTokenString, s.config.RefreshSecret)
// 	if err != nil {
// 		return "", errors.New("invalid refresh token")
// 	}

// 	// 2. (可選) 檢查使用者是否仍然存在/有效
// 	_, err = s.repo.GetByID(ctx, s.db, claims.UserID)
// 	if err != nil {
// 		return "", errors.New("user not found")
// 	}

// 	// 3. 產生新的 Access Token
// 	newAccessToken, err = s.generateToken(claims.UserID, claims.Role, s.config.AccessExpiry, s.config.AccessSecret)
// 	if err != nil {
// 		return "", err
// 	}

// 	return newAccessToken, nil
// }

// // generateToken 產生 JWT 的輔助函式
// func (s *AuthService) generateToken(userID int, role string, expiry time.Duration, secret string) (string, error) {
// 	claims := CustomClaims{
// 		UserID: userID,
// 		Role:   role,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
// 			IssuedAt:  jwt.NewNumericDate(time.Now()),
// 			Issuer:    "generator-erp",
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	return token.SignedString([]byte(secret))
// }

// // validateToken 驗證 JWT 的輔助函式
// func (s *AuthService) validateToken(tokenString string, secret string) (*CustomClaims, error) {
// 	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, errors.New("unexpected signing method")
// 		}
// 		return []byte(secret), nil
// 	})

// 	if err != nil {
// 		return nil, err
// 	}

// 	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
// 		return claims, nil
// 	}
// 	return nil, errors.New("invalid token")
// }
