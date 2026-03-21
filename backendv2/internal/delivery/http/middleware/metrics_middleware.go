package middleware

import (
	"net/http"
	"time"

	"go.uber.org/zap"
)

type Metrics struct {
    logger *zap.Logger
}

func NewMetrics(logger *zap.Logger) *Metrics {
    return &Metrics{logger: logger}
}

func (m *Metrics) Monitor(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        wrapped := newResponseWriter(w)
        
        next.ServeHTTP(wrapped, r)

        duration := time.Since(start)

        // 記錄慢查詢（超過 1 秒）
        if duration > 1*time.Second {
            m.logger.Warn("Slow Request",
                zap.String("method", r.Method),
                zap.String("path", r.URL.Path),
                zap.Duration("duration", duration),
                zap.Int("status", wrapped.statusCode),
            )
        }

        // 可以整合 Prometheus 或其他監控工具
        // prometheus.RecordMetrics(r.Method, r.URL.Path, wrapped.statusCode, duration)
    })
}