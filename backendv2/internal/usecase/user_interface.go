package usecase

import (
	"context"
)


type RegisterRequest struct {
    Email           string `json:"email" validate:"required,email"`
    Phone           string `json:"phone" validate:"required,e164"` // E.164 格式
    Name            string `json:"name" validate:"required,min=2,max=50"`
    Password        string `json:"password" validate:"required,min=8"`
    ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
    UserType        string `json:"user_type" validate:"required,oneof=individual business"` // 用戶類型: individual, business
    CompanyName     string `json:"company_name" validate:"omitempty,max=100"`
    CompanyTaxID    string `json:"company_tax_id" validate:"omitempty,max=20"`
}

type LoginRequest struct {
    Identifier string `json:"identifier"` // Email 或手機號碼
    Password   string `json:"password" validate:"required"`
}

type AuthResponse struct {
    AccessToken  string    `json:"access_token"`
    RefreshToken string    `json:"refresh_token"`
    TokenType    string    `json:"token_type"`
    ExpiresIn    int64     `json:"expires_in"` // 秒數
    User         *UserInfo `json:"user"`
}

type UserInfo struct {
    ID       int64  `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Phone    string `json:"phone"`
    Role     string `json:"role"`
    UserType string `json:"user_type"`
    IsActive bool   `json:"is_active"`
}

type RefreshTokenRequest struct {
    RefreshToken string `json:"refresh_token" validate:"required"`
}

type UpdateProfileRequest struct {
    Name  string `json:"name" validate:"omitempty,min=2,max=50"`
    Phone string `json:"phone" validate:"omitempty,e164"`
    Email string `json:"email" validate:"omitempty,email"`
}

type ChangePasswordRequest struct {
    OldPassword     string `json:"old_password" validate:"required"`
    NewPassword     string `json:"new_password" validate:"required,min=8"`
    ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=NewPassword"`
}

type ForgotPasswordRequest struct {
    Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
    Token           string `json:"token" validate:"required"`
    NewPassword     string `json:"new_password" validate:"required,min=8"`
    ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=NewPassword"`
}

type SendVerificationEmailRequest struct {
    UserID int64
}

type VerifyEmailRequest struct {
    Token string `json:"token" validate:"required"`
}

type UserUsecase interface {
    // ========== 認證相關 ==========
    Register(ctx context.Context, req *RegisterRequest) (error)
    Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error)
    Logout(ctx context.Context, token string) error
    LogoutAllDevices(ctx context.Context, userID int64) error
    RefreshToken(ctx context.Context, req *RefreshTokenRequest) (*AuthResponse, error)
    
    // ========== 個人資料 ==========
    GetProfile(ctx context.Context, userID int64) (*UserInfo, error)
    UpdateProfile(ctx context.Context, userID int64, req *UpdateProfileRequest) error
    ChangePassword(ctx context.Context, userID int64, req *ChangePasswordRequest) error
    ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) error
    ResetPassword(ctx context.Context, req *ResetPasswordRequest) error
    
    // ========== Email 驗證 ==========
    SendVerificationEmail(ctx context.Context, userID int64) error
    VerifyEmail(ctx context.Context, req *VerifyEmailRequest) error
    
    // // ========== 訂單管理 ==========
    // GetMyOrders(ctx context.Context, userID int64, req *MyOrdersRequest) (*MyOrdersResponse, error)
    // GetOrderDetail(ctx context.Context, userID, orderID int64) (*OrderDetail, error)
    // CancelOrder(ctx context.Context, userID int64, req *CancelOrderRequest) error
    
    // // ========== 站點查詢 ==========
    // GetAllSites(ctx context.Context) ([]*domain.Site, error)
    // GetNearbySites(ctx context.Context, req *NearbyRequest) ([]*SiteWithDistance, error)
    
    // // ========== 評價系統 ==========
    // SubmitReview(ctx context.Context, userID int64, req *SubmitReviewRequest) error
    // GetMyReviews(ctx context.Context, userID int64, page, pageSize int) ([]*ReviewDetail, int64, error)
    
    // // ========== 通知系統 ==========
    // GetMyNotifications(ctx context.Context, userID int64, unreadOnly bool, page, pageSize int) ([]*domain.Notification, int64, error)
    // MarkNotificationAsRead(ctx context.Context, userID, notificationID int64) error
    // MarkAllNotificationsAsRead(ctx context.Context, userID int64) error
    // GetUnreadNotificationCount(ctx context.Context, userID int64) (int64, error)
    
    // // ========== 偏好設定 ==========
    // UpdateNotificationPreferences(ctx context.Context, userID int64, prefs *NotificationPreferences) error
    
    // // ========== 安全相關 ==========
    // GetLoginHistory(ctx context.Context, userID int64, page, pageSize int) ([]*LoginHistory, int64, error)
    
    // // ========== 站長/員工功能 ==========
    // GetSiteOrders(ctx context.Context, managerID int64, filter domain.OrderFilter) ([]*domain.Order, error)
    // GetSiteInventory(ctx context.Context, managerID int64) ([]*domain.SiteInventory, error)
    // UpdateOrderStatus(ctx context.Context, employeeID, orderID int64, status string) error
    
    // // ========== 投資人功能 ==========
    // GetInvestorRevenue(ctx context.Context, investorID int64, startDate, endDate time.Time) (*InvestorRevenueReport, error)
    
    // // ========== 管理員功能 ==========
    // GetAllUsers(ctx context.Context, filter domain.UserFilter) ([]*domain.User, int64, error)
    // CreateEmployee(ctx context.Context, req *CreateEmployeeRequest) error
    // DeactivateUser(ctx context.Context, adminID, targetUserID int64) error
    // ActivateUser(ctx context.Context, adminID, targetUserID int64) error
    // ChangeUserRole(ctx context.Context, adminID, targetUserID int64, newRole string) error
}
