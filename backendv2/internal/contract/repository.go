package contract

import (
    "context"
    "new-e-power/backend-v2/internal/domain"
)

// ========== UserRepository 使用者資料存取介面 ==========
type UserRepository interface {
    // 基本 CRUD
    FindByID(ctx context.Context, id int64) (*domain.User, error)
    FindByEmail(ctx context.Context, email string) (*domain.User, error)
    FindByPhone(ctx context.Context, phone string) (*domain.User, error)
    Create(ctx context.Context, user *domain.User) error
    Update(ctx context.Context, user *domain.User) error
    SoftDelete(ctx context.Context, id int64) error
    
    // 查詢方法
    ListAll(ctx context.Context, offset, limit int) ([]*domain.User, error)
    ListAllByRole(ctx context.Context, role string, offset, limit int) ([]*domain.User, error)
    SearchByNameOrPhone(ctx context.Context, keyword string, offset, limit int) ([]*domain.User, error)
    
    // 統計方法
    Count(ctx context.Context) (int64, error)
    CountByRole(ctx context.Context, role string) (int64, error)
    
    // 認證相關
    UpdateLastLoginAt(ctx context.Context, userID int64) error
    UpdatePassword(ctx context.Context, userID int64, hashedPassword string) error
    
    // // 業務方法
    // IsEmailExists(ctx context.Context, email string) (bool, error)
    // IsPhoneExists(ctx context.Context, phone string) (bool, error)
}