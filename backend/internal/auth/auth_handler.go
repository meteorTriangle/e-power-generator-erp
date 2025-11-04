package auth

import (
	"encoding/json"
	"net/http"
	"time"
)




type AuthHandler struct {
	service       *AuthService
	refreshExpiry time.Duration
}

func NewAuthHandler(service *AuthService, refreshExpiry time.Duration) *AuthHandler {
	return &AuthHandler{service: service, refreshExpiry: refreshExpiry}
}

// RegisterRoutes 註冊路由到 net/http 的 ServeMux
func (h *AuthHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /login", h.handleLogin)
	mux.HandleFunc("POST /refresh", h.handleRefresh)
	mux.HandleFunc("POST /logout", h.handleLogout)
}

type loginRequest struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

type jsonResponse map[string]interface{}

// writeJSON 是一個輔助函式，用於回傳 JSON
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

func (h *AuthHandler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	
	// 解碼 JSON 請求
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// 呼叫 Service
	accessToken, refreshToken, err := h.service.Login(r.Context(), req.Username, req.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	// 設置 HttpOnly Cookie (net/http 版本)
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/api/v1/auth", // 限制 Cookie 只在 /api/v1/auth 路徑下發送
		MaxAge:   int(h.refreshExpiry.Seconds()),
		HttpOnly: true,
		Secure:   true, // 在生產環境中應設為 true
		SameSite: http.SameSiteLaxMode,
	})

	// 回傳 Access Token
	writeJSON(w, http.StatusOK, jsonResponse{
		"access_token": accessToken,
		"username":     h.service.name,
		"email":        h.service.email,
		"role":         h.service.role,
		"group":        h.service.group,
		"email_verify": h.service.emailVerify,
	})
}

func (h *AuthHandler) handleRefresh(w http.ResponseWriter, r *http.Request) {
	// 從 Cookie 讀取 Refresh Token
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "refresh token not found", http.StatusUnauthorized)
		return
	}

	// 呼叫 Service
	newAccessToken, err := h.service.Refresh(r.Context(), cookie.Value)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// 回傳新的 Access Token
	writeJSON(w, http.StatusOK, jsonResponse{
		"access_token": newAccessToken,
		"username":     h.service.name,
		"email":        h.service.email,
		"role":         h.service.role,
		"group":        h.service.group,
		"email_verify": h.service.emailVerify,})
}

func (h *AuthHandler) handleLogout(w http.ResponseWriter, r *http.Request) {
	// 設置一個立即過期的 Cookie 來清除它
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/api/v1/auth",
		MaxAge:   -1, // 立即過期
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	writeJSON(w, http.StatusOK, jsonResponse{"message": "logged out"})
}
