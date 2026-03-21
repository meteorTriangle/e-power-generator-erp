package middleware

import (
	"net/http"
	"strings"
	"context"

	"new-e-power/backend-v2/pkg/jwt"
	"new-e-power/backend-v2/pkg/response"

)

type AuthMiddleware struct {
    jwtService jwt.JWTService
}

func NewAuthMiddleware(jwtService jwt.JWTService) *AuthMiddleware {
    return &AuthMiddleware{
        jwtService: jwtService,
    }
}

// RequireAuth JWT 驗證中間件
func (m *AuthMiddleware) RequireAuth() func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // 這裡的邏輯與之前的 AuthMiddleware 相同
             authHeader := r.Header.Get("Authorization")
            if authHeader == "" {
                http.Error(w, "authorization header required", http.StatusUnauthorized)
                return
            }
            tokenString := strings.TrimPrefix(authHeader, "Bearer ")
            if tokenString == authHeader {
                http.Error(w, "invalid token format", http.StatusUnauthorized)
                return
            }
            claims, err := m.jwtService.ValidateAccessToken(tokenString)
            if err != nil {
                http.Error(w, err.Error(), http.StatusUnauthorized)
                return
            }
            ctx := context.WithValue(r.Context(), "userID", claims.UserID)
            ctx = context.WithValue(ctx, "email", claims.Email)
            ctx = context.WithValue(ctx, "role", claims.Role)
            ctx = context.WithValue(ctx, "tokenID", claims.TokenID)

            r = r.WithContext(ctx)
            next.ServeHTTP(w, r)
        })
    }

}

// RequireRole 角色驗證中間件
func (m *AuthMiddleware) RequireRole(allowedRoles ...string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            role := r.Context().Value("role")
            if role == nil {
                response.Error(w, http.StatusUnauthorized, "未授權", nil)
                return
            }

            userRole := role.(string)
            for _, allowedRole := range allowedRoles {
                if userRole == allowedRole {
                    next.ServeHTTP(w, r)
                    return
                }
            }

            response.Error(w, http.StatusForbidden, "權限不足", nil)
        })
    }
}
