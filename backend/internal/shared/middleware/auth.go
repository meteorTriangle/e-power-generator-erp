// internal/shared/middleware/auth.go
package middleware

import (
	"context"
	"errors"
	"new-e-power-generator-sys/inventory/internal/auth" // 引用 auth 模組的 CustomClaims
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// CtxKey 用於在 context 中儲存和讀取使用者資料
type CtxKey string
const UserIDKey CtxKey = "userID"
const UserRoleKey CtxKey = "userRole"

// AuthMiddleware 驗證 Access Token
func AuthMiddleware(accessSecret string) func(http.Handler) http.Handler {
	// 這是一個工廠函式，回傳實際的中介軟體
	return func(next http.Handler) http.Handler {
		// 這是 http.HandlerFunc，它實作了 http.Handler 介面
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "authorization header required", http.StatusUnauthorized)
				return // 停止執行
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "invalid authorization header format", http.StatusUnauthorized)
				return
			}

			tokenString := parts[1]

			// 驗證 Token (這段邏輯與 auth_service 內的 validateToken 相同)
			token, err := jwt.ParseWithClaims(tokenString, &auth.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("unexpected signing method")
				}
				return []byte(accessSecret), nil
			})

			if err != nil {
				if errors.Is(err, jwt.ErrTokenExpired) {
					http.Error(w, `{"error": "token_expired"}`, http.StatusUnauthorized) // 讓前端知道是 "過期"
					return
				}
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			// 驗證通過，將使用者資訊存入 Context
			if claims, ok := token.Claims.(*auth.CustomClaims); ok && token.Valid {
				// 建立一個帶有使用者資料的新 context
				ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
				ctx = context.WithValue(ctx, UserRoleKey, claims.Role)
				
				// 呼叫下一個處理器 (next.ServeHTTP)，並傳入 *新的 context*
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				http.Error(w, "invalid token claims", http.StatusUnauthorized)
			}
		})
	}
}
