package config

import (
	"time"
    "fmt"
)

type JWTConfig struct {
    SecretKey            string
    RefreshSecretKey     string
    AccessTokenDuration  time.Duration
    RefreshTokenDuration time.Duration
    Issuer               string
}

func NewJWTConfig() *JWTConfig {
    return &JWTConfig{
        SecretKey:            GetEnvWithDefault("JWT_SECRET_KEY", "your-secret-key-change-in-production"),
        RefreshSecretKey:     GetEnvWithDefault("JWT_REFRESH_SECRET_KEY", "your-refresh-secret-key"),
        AccessTokenDuration:  time.Hour * 1,        // Access Token 有效期 1 小時
        RefreshTokenDuration: time.Hour * 24 * 7,   // Refresh Token 有效期 7 天
        Issuer:               "new-e-power",
    }
}

func (cfg *JWTConfig) Validate() error {
    if cfg.SecretKey == "" {
        return fmt.Errorf("JWT_SECRET_KEY 不能為空")
    }
    if cfg.RefreshSecretKey == "" {
        return fmt.Errorf("JWT_REFRESH_SECRET_KEY 不能為空")
    }
    if cfg.AccessTokenDuration <= 0 {
        return fmt.Errorf("AccessTokenDuration 必須大於 0")
    }
    if cfg.RefreshTokenDuration <= 0 {
        return fmt.Errorf("RefreshTokenDuration 必須大於 0")
    }
    return nil
}

func (cfg *JWTConfig) String() string {
    return fmt.Sprintf(
        "JWTConfig{SecretKey: %s, RefreshSecretKey: %s, AccessTokenDuration: %s, RefreshTokenDuration: %s, Issuer: %s}",
        cfg.SecretKey,
        cfg.RefreshSecretKey,
        cfg.AccessTokenDuration,
        cfg.RefreshTokenDuration,
        cfg.Issuer,
    )
}