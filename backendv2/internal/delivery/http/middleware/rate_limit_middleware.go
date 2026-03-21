package middleware

import (
    "net/http"
    "sync"
    "time"

    "new-e-power/backend-v2/pkg/response"
)

type RateLimiter struct {
    visitors map[string]*visitor
    mu       sync.RWMutex
    rate     int           // 每分鐘請求數
    duration time.Duration // 時間窗口
}

type visitor struct {
    count      int
    lastAccess time.Time
}

func NewRateLimiter(rate int, duration time.Duration) *RateLimiter {
    rl := &RateLimiter{
        visitors: make(map[string]*visitor),
        rate:     rate,
        duration: duration,
    }

    // 定期清理過期的訪客記錄
    go rl.cleanupVisitors()

    return rl
}

func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ip := getClientIP(r)

        rl.mu.Lock()
        v, exists := rl.visitors[ip]
        
        if !exists {
            rl.visitors[ip] = &visitor{
                count:      1,
                lastAccess: time.Now(),
            }
            rl.mu.Unlock()
            next.ServeHTTP(w, r)
            return
        }

        // 檢查時間窗口
        if time.Since(v.lastAccess) > rl.duration {
            v.count = 1
            v.lastAccess = time.Now()
            rl.mu.Unlock()
            next.ServeHTTP(w, r)
            return
        }

        // 檢查請求數
        if v.count >= rl.rate {
            rl.mu.Unlock()
            response.Error(w, http.StatusTooManyRequests, "請求過於頻繁，請稍後再試", nil)
            return
        }

        v.count++
        rl.mu.Unlock()
        next.ServeHTTP(w, r)
    })
}

func (rl *RateLimiter) cleanupVisitors() {
    ticker := time.NewTicker(1 * time.Minute)
    defer ticker.Stop()

    for range ticker.C {
        rl.mu.Lock()
        for ip, v := range rl.visitors {
            if time.Since(v.lastAccess) > rl.duration {
                delete(rl.visitors, ip)
            }
        }
        rl.mu.Unlock()
    }
}

func getClientIP(r *http.Request) string {
    // 優先從 X-Forwarded-For 取得真實 IP
    if ip := r.Header.Get("X-Forwarded-For"); ip != "" {
        return ip
    }
    if ip := r.Header.Get("X-Real-IP"); ip != "" {
        return ip
    }
    return r.RemoteAddr
}