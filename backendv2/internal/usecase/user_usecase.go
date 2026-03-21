package usecase

import (
	"context"
	"fmt"

	"new-e-power/backend-v2/internal/domain"
	"new-e-power/backend-v2/internal/contract"
	"new-e-power/backend-v2/pkg/jwt"

	"golang.org/x/crypto/bcrypt"
)

type userUsecase struct {
	userRepo   contract.UserRepository
	jwtService jwt.JWTService
}

func NewUserUsecase(
	userRepo contract.UserRepository,
	jwtService jwt.JWTService,
) UserUsecase {
	return &userUsecase{
		userRepo:   userRepo,
		jwtService: jwtService,
	}
}

// RefreshToken 刷新 Token (UseCase 層負責查詢使用者)
func (u *userUsecase) RefreshToken(ctx context.Context, req *RefreshTokenRequest) (*AuthResponse, error) {
	// 1. 驗證 Refresh Token
	claims, err := u.jwtService.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, fmt.Errorf("無效的 Refresh Token: %w", err)
	}

	// 2. ✅ UseCase 負責查詢使用者資訊
	user, err := u.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("使用者不存在")
	}

	if !user.IsActive {
		return nil, fmt.Errorf("帳號已停用")
	}

	// 3. ✅ UseCase 調用 JWT Service 生成新的 Access Token (保持相同的 TokenID)
	newAccessToken, err := u.jwtService.GenerateAccessToken(
		user.ID,
		user.Email,
		user.Role,
		claims.TokenID, // 保持相同的 TokenID
	)
	if err != nil {
		return nil, fmt.Errorf("生成 Access Token 失敗: %w", err)
	}

	return &AuthResponse{
		AccessToken:  newAccessToken,
		RefreshToken: req.RefreshToken, // Refresh Token 不變
		TokenType:    "Bearer",
		ExpiresIn:    3600, // 從 config 讀取
		User: &UserInfo{
			ID:       user.ID,
			Name:     user.Name,
			Email:    user.Email,
			Phone:    user.Phone,
			Role:     user.Role,
			UserType: user.UserType,
			IsActive: user.IsActive,
		},
	}, nil
}

// Register 註冊
func (u *userUsecase) Register(ctx context.Context, req *RegisterRequest) error {
	// 1. 驗證 Email 或手機號碼是否已被註冊
	existingUserByEmail, _ := u.userRepo.FindByEmail(ctx, req.Email)
	if existingUserByEmail != nil {
		return fmt.Errorf("email 已被註冊")
	}

	existingUserByPhone, _ := u.userRepo.FindByPhone(ctx, req.Phone)
	if existingUserByPhone != nil {
		return fmt.Errorf("手機號碼已被註冊")
	}

	// 2. 密碼強度檢查
	if err := validatePasswordStrength(req.Password); err != nil {
			return err
	}

	// 3. 密碼加密
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return fmt.Errorf("密碼加密失敗: %w", err)
	}

	// 4. 建立使用者記錄
	user := &domain.User{
		Email:    req.Email,
		Phone:    req.Phone,
		Name:     req.Name,
		Password: string(hashedPassword),
		Role:     domain.RoleCustomer,
		UserType: req.UserType,
		IsActive: true,
	}

	if req.UserType == "company" {
		user.CompanyName = &req.CompanyName
		user.CompanyTaxID = &req.CompanyTaxID
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return fmt.Errorf("建立使用者失敗: %w", err)
	}

	return nil
}

// Login 登入
func (u *userUsecase) Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error) {
	var user *domain.User
	var err error

	user, err = u.userRepo.FindByEmail(ctx, req.Identifier)
	if err != nil {
		user, err = u.userRepo.FindByPhone(ctx, req.Identifier)
		if err != nil {
			return nil, fmt.Errorf("使用者不存在")
		}
	}

	if !user.IsActive {
		return nil, fmt.Errorf("帳號已停用")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, fmt.Errorf("密碼錯誤")
	}

	tokenPair, err := u.jwtService.GenerateTokenPair(ctx, user.ID, user.Email, user.Role)
	if err != nil {
		return nil, fmt.Errorf("生成 Token 失敗: %w", err)
	}

	go func() {
		_ = u.userRepo.UpdateLastLoginAt(context.Background(), user.ID)
	}()

	return &AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		TokenType:    tokenPair.TokenType,
		ExpiresIn:    tokenPair.ExpiresIn,
		User: &UserInfo{
			ID:       user.ID,
			Name:     user.Name,
			Email:    user.Email,
			Phone:    user.Phone,
			Role:     user.Role,
			UserType: user.UserType,
			IsActive: user.IsActive,
		},
	}, nil
}

// Logout 登出
func (u *userUsecase) Logout(ctx context.Context, token string) error {
	claims, err := u.jwtService.ValidateAccessToken(token)
	if err != nil {
		return fmt.Errorf("無效的 Token: %w", err)
	}
	return u.jwtService.RevokeToken(ctx, claims.TokenID)
}

// 其他方法...

func validatePasswordStrength(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("密碼長度至少 8 碼")
	}

	hasUpper := false
	hasLower := false
	hasDigit := false

	for _, c := range password {
		switch {
		case 'A' <= c && c <= 'Z':
			hasUpper = true
		case 'a' <= c && c <= 'z':
			hasLower = true
		case '0' <= c && c <= '9':
			hasDigit = true
		}
	}

	if !hasUpper || !hasLower || !hasDigit {
		return fmt.Errorf("密碼必須包含大小寫字母與數字")
	}

	return nil
}

// logoutAllDevices 登出所有裝置 (可選功能)
func (u *userUsecase) LogoutAllDevices(ctx context.Context, userID int64) error {
	// return u.jwtService.RevokeAllTokens(ctx, userID)
	return nil
}	

func (u *userUsecase) GetProfile(ctx context.Context, userID int64) (*UserInfo, error) {
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("使用者不存在")
	}

	return &UserInfo{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		Phone:    user.Phone,
		Role:     user.Role,
		UserType: user.UserType,
		IsActive: user.IsActive,
	}, nil
}

func (u *userUsecase) UpdateProfile(ctx context.Context, userID int64, req *UpdateProfileRequest) error {	
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("使用者不存在")
	}	

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Email != "" {
		user.Email = req.Email
	}

	if err := u.userRepo.Update(ctx, user); err != nil {
		return fmt.Errorf("更新使用者資料失敗: %w", err)
	}

	return nil
}

func (u *userUsecase) ChangePassword(ctx context.Context, userID int64, req *ChangePasswordRequest) error {
	user, err := u.userRepo.FindByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("使用者不存在")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword))
	if err != nil {
		return fmt.Errorf("舊密碼錯誤")
	}

	if err := validatePasswordStrength(req.NewPassword); err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("密碼加密失敗: %w", err)
	}

	return u.userRepo.UpdatePassword(ctx, userID, string(hashedPassword))
}

func (u *userUsecase) ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) error {
	user, err := u.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("使用者不存在")
	}
	_ = user.ID
	// 生成重置密碼的 Token 並發送 Email (此處省略實作細節)
	return nil
}

func (u *userUsecase) ResetPassword(ctx context.Context, req *ResetPasswordRequest) error {
	// 驗證重置密碼的 Token (此處省略實作細節)
	// 假設我們從 Token 中取得了 userID
	var userID int64 = 0 // 從 Token 解析出來的 userID

	if err := validatePasswordStrength(req.NewPassword); err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("密碼加密失敗: %w", err)
	}

	return u.userRepo.UpdatePassword(ctx, userID, string(hashedPassword))
}

func (u *userUsecase) SendVerificationEmail(ctx context.Context, userID int64) error {
	// 生成驗證 Email 的 Token 並發送 Email (此處省略實作細節)
	return nil
}

func (u *userUsecase) VerifyEmail(ctx context.Context, req *VerifyEmailRequest) error {
	// 驗證 Email 的 Token (此處省略實作細節)
	return nil
}