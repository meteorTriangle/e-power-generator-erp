package http

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"go.uber.org/zap"

	"new-e-power/backend-v2/internal/delivery/http/middleware"
	v1 "new-e-power/backend-v2/internal/delivery/http/v1"
)

// spaHandler 處理 SPA 的靜態檔案服務
// 對於存在的靜態資源直接返回檔案，
// 對於不存在的路徑一律返回 index.html（讓前端 router 處理）
type spaHandler struct {
	staticDir string
	indexPath string
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// 取得請求路徑
	reqPath := r.URL.Path

	// 組合成檔案系統路徑
	absPath := filepath.Join(h.staticDir, filepath.Clean(reqPath))

	// 檢查檔案是否存在
	info, err := os.Stat(absPath)
	if err == nil && !info.IsDir() {
		// 檔案存在 → 直接 serve 靜態檔案
		http.ServeFile(w, r, absPath)
		return
	}

	// 如果是帶有副檔名的路徑但檔案不存在（例如 /foo.js），回傳 404
	if ext := filepath.Ext(reqPath); ext != "" && ext != ".html" {
		http.NotFound(w, r)
		return
	}

	// 其他路徑 → 回傳 index.html（SPA fallback）
	http.ServeFile(w, r, h.indexPath)
}

func SetupRouter(
	logger *zap.Logger,
	userHandler *v1.UserHandler,
	authMiddleware *middleware.AuthMiddleware,
) http.Handler {
	mux := http.NewServeMux()

	// rate limiter middleware
	rateLimiter := middleware.NewRateLimiter(100, time.Minute)

	// ========== API 路由 ==========

	// public routes
	mux_public := http.NewServeMux()
	mux_public.HandleFunc("/register", userHandler.Register)
	mux_public.HandleFunc("/login", userHandler.Login)
	mux_public.HandleFunc("/forgot-password", userHandler.ForgotPassword)
	mux_public.HandleFunc("/reset-password", userHandler.ResetPassword)
	mux_public.HandleFunc("/refresh-token", userHandler.RefreshToken)

	// protected routes
	mux_protected := http.NewServeMux()
	mux_protected.HandleFunc("/logout", userHandler.Logout)
	mux_protected.HandleFunc("/profile", userHandler.GetProfile)
	mux_protected.HandleFunc("/update-profile", userHandler.UpdateProfile)
	mux_protected.HandleFunc("/change-password", userHandler.ChangePassword)

	// 掛載 API 路由
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", mux_public))
	mux.Handle("/api/v1/auth/", http.StripPrefix("/api/v1/auth", authMiddleware.RequireAuth()(mux_protected)))

	// ========== 前端靜態檔案 (SPA) ==========

	staticDir := "./static"
	indexPath := filepath.Join(staticDir, "index.html")

	// 檢查 static 目錄是否存在
	if _, err := os.Stat(indexPath); err == nil {
		spa := &spaHandler{
			staticDir: staticDir,
			indexPath: indexPath,
		}
		mux.Handle("/", spa)
		logger.Info("前端靜態檔案已掛載", zap.String("dir", staticDir))
	} else {
		logger.Warn("找不到前端靜態檔案，跳過掛載",
			zap.String("dir", staticDir),
			zap.String("expected", indexPath),
		)
		// fallback: 當沒有前端檔案時，根路徑返回提示
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/api/") {
				return // 已由其他 handler 處理
			}
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("E-Power Backend API is running. Frontend not found.\nPlease build the frontend first: cd frontend_1/e-power-frontend && npm run build"))
		})
	}

	// 最終的 router（套用 middleware chain）
	handler := middleware.Chain(
		mux,
		middleware.Recovery(logger),
		middleware.Logger(logger),
		middleware.RequestID,
		middleware.CORS,
		rateLimiter.Limit,
	)

	return handler
}