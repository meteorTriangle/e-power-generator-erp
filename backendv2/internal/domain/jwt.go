package domain

import (
    "github.com/golang-jwt/jwt/v5"
)

// AccessTokenClaims Access Token 的 JWT Claims
type AccessTokenClaims struct {
    UserID   int64  `json:"user_id"`
    Email    string `json:"email"`
    Role     string `json:"role"`
    TokenID  string `json:"token_id"` // 用於追蹤和撤銷
    jwt.RegisteredClaims
}

// RefreshTokenClaims Refresh Token 的 JWT Claims
type RefreshTokenClaims struct {
    UserID  int64  `json:"user_id"`
    TokenID string `json:"token_id"`
    jwt.RegisteredClaims
}

// TokenPair Token 配對
type TokenPair struct {
    AccessToken  string `json:"access_token"`
    RefreshToken string `json:"refresh_token"`
    TokenType    string `json:"token_type"`
    ExpiresIn    int64  `json:"expires_in"` // 秒數
}