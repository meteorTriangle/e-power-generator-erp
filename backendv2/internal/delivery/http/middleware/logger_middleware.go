package middleware

import (
	"net/http"
	"time"

	"go.uber.org/zap"
)

type responseWriter struct {
	http.ResponseWriter
	statusCode int
	bytes      int
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytes += n
	return n, err
}

func Logger(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// 從 context 取得 request_id 和 user_id
			requestID, _ := r.Context().Value("request_id").(string)
			userID, _ := r.Context().Value("userID").(int64)

			// 包裝 ResponseWriter
			wrapped := newResponseWriter(w)

			// 處理請求
			next.ServeHTTP(wrapped, r)

			// 計算耗時
			duration := time.Since(start)

			// 記錄日誌
			fields := []zap.Field{
				zap.String("request_id", requestID),
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.String("query", r.URL.RawQuery),
				zap.Int("status", wrapped.statusCode),
				zap.Int("bytes", wrapped.bytes),
				zap.Duration("duration", duration),
				zap.String("ip", getClientIP(r)),
				zap.String("user_agent", r.UserAgent()),
				zap.String("referer", r.Referer()),
			}

			if userID > 0 {
				fields = append(fields, zap.Int64("user_id", userID))
			}

			// 根據狀態碼決定日誌級別
			switch {
			case wrapped.statusCode >= 500:
				logger.Error("HTTP Request", fields...)
			case wrapped.statusCode >= 400:
				logger.Warn("HTTP Request", fields...)
			default:
				logger.Info("HTTP Request", fields...)
			}
		})
	}
}
