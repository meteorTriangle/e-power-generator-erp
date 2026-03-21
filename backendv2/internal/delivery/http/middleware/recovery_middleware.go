package middleware

import (
	"net/http"
    "go.uber.org/zap"

	"new-e-power/backend-v2/pkg/response"

)

func Recovery(logger *zap.Logger) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            defer func() {
                if err := recover(); err != nil {
                    logger.Error("Panic recovered:", zap.Any("error", err))
                    response.Error(w, http.StatusInternalServerError, "伺服器內部錯誤", nil)
                }
            }()

            next.ServeHTTP(w, r)
        })
    }
}
