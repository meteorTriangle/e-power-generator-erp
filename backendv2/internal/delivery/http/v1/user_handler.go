package v1

import (
    "net/http"
	"encoding/json"

    "new-e-power/backend-v2/internal/usecase"
    "new-e-power/backend-v2/pkg/response"

    // "github.com/gin-gonic/gin"
)

type UserHandler struct {
    userUsecase usecase.UserUsecase
}

func NewUserHandler(userUsecase usecase.UserUsecase) *UserHandler {
    return &UserHandler{
        userUsecase: userUsecase,
    }
}

// Register
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
    var req usecase.RegisterRequest
    
    // 1. analyze request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "form validation error", err)
		return
	}

    // 2. call usecase
    if err := h.userUsecase.Register(r.Context(), &req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    // 3. 回傳成功回應
    response.Success(w, http.StatusCreated, "register success", nil)
}

// Login 登入
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
    var req usecase.LoginRequest

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    authResp, err := h.userUsecase.Login(r.Context(), &req)
    if err != nil {
        response.Error(w, http.StatusUnauthorized, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "login success", authResp)
}

// RefreshToken 刷新 Token
func (h *UserHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
    var req usecase.RefreshTokenRequest

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    authResp, err := h.userUsecase.RefreshToken(r.Context(), &req)
    if err != nil {
        response.Error(w, http.StatusUnauthorized, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "Token refresh success", authResp)
}

// Logout
func (h *UserHandler) Logout(w http.ResponseWriter, r *http.Request) {
    // Get Token from Header
    token := r.Header.Get("Authorization")
    if token == "" {
        response.Error(w, http.StatusUnauthorized, "Token not provided", nil)
        return
    }

    // Remove "Bearer " prefix if present
    if len(token) > 7 && token[:7] == "Bearer " {
        token = token[7:]
    }

    if err := h.userUsecase.Logout(r.Context(), token); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "logout success", nil)
}

// GetProfile Get user profile (requires JWT authentication)
func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
    // Get userID from Context (set by JWT Middleware)
    userID, exists := r.Context().Value("userID").(int64)
    if !exists {
        response.Error(w, http.StatusUnauthorized, "unauthorized", nil)
        return
    }

    profile, err := h.userUsecase.GetProfile(r.Context(), userID)
    if err != nil {
        response.Error(w, http.StatusNotFound, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "get profile success", profile)
}

// UpdateProfile Update user profile (requires JWT authentication)
func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
    userID, _ := r.Context().Value("userID").(int64)
    
    var req usecase.UpdateProfileRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    if err := h.userUsecase.UpdateProfile(r.Context(), userID, &req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "update profile success", nil)
}

// ChangePassword Change password (requires JWT authentication)
func (h *UserHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
    userID, _ := r.Context().Value("userID").(int64)
    
    var req usecase.ChangePasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    if err := h.userUsecase.ChangePassword(r.Context(), userID, &req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "change password success", nil)
}

// ForgotPassword Forgot password
func (h *UserHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
    var req usecase.ForgotPasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    if err := h.userUsecase.ForgotPassword(r.Context(), &req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "reset password email sent", nil)
}

// ResetPassword Reset password
func (h *UserHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
    var req usecase.ResetPasswordRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "request format error", err)
        return
    }

    if err := h.userUsecase.ResetPassword(r.Context(), &req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error(), nil)
        return
    }

    response.Success(w, http.StatusOK, "reset password success", nil)
}