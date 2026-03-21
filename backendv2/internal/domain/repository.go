package domain

import "context"
import (
	"time"
)



// // 產品 Repository 介面
// type ProductRepository interface {
//     FindByID(ctx context.Context, id int64) (*Product, error)
//     FindAll(ctx context.Context, offset, limit int) ([]*Product, error)
//     FindByCategory(ctx context.Context, categoryID int64) ([]*Product, error)
//     Create(ctx context.Context, product *Product) error
//     Update(ctx context.Context, product *Product) error
//     SoftDelete(ctx context.Context, id int64) error
//     Count(ctx context.Context) (int64, error)
//     HasActiveOrders(ctx context.Context, productID int64) (bool, error)
// }

// // 訂單 Repository 介面
// type OrderRepository interface {
//     FindByID(ctx context.Context, id int64) (*Order, error)
//     FindByUserID(ctx context.Context, userID int64, offset, limit int) ([]*Order, error)
//     Create(ctx context.Context, order *Order) error
//     UpdateStatus(ctx context.Context, id int64, status string) error
//     CountByUserID(ctx context.Context, userID int64) (int64, error)
    
//     // 交易方法 (確保原子性)
//     CreateWithInventoryDeduction(ctx context.Context, order *Order, productID int64, qty int) error
//     CancelOrderWithInventoryReturn(ctx context.Context, orderID int64, productID int64, qty int) error
// }

// // 使用者 Repository 介面
// type UserRepository interface {
//     FindByID(ctx context.Context, id int64) (*User, error)
//     FindByEmail(ctx context.Context, email string) (*User, error)
//     FindByPhone(ctx context.Context, phone string) (*User, error)
//     Create(ctx context.Context, user *User) error
//     Update(ctx context.Context, user *User) error
//     SoftDelete(ctx context.Context, id int64) error
//     ListAll(ctx context.Context, offset, limit int) ([]*User, error)
//     Count(ctx context.Context) (int64, error)
//     ListAllByRole(ctx context.Context, role string, offset, limit int) ([]*User, error)
//     CountByRole(ctx context.Context, role string) (int64, error)
//     SearchByNameOrPhone(ctx context.Context, keyword string, offset, limit int) ([]*User, error)
// }

// // 站點 Repository 介面
// type SiteRepository interface {
//     FindByID(ctx context.Context, id int64) (*Site, error)
//     FindAll(ctx context.Context) ([]*Site, error)
//     Create(ctx context.Context, site *Site) error
//     Update(ctx context.Context, site *Site) error
// }

// // 庫存 Repository 介面
// type InventoryRepository interface {
//     GetSiteInventory(ctx context.Context, siteID, productID int64) (*SiteInventory, error)
//     DeductInventory(ctx context.Context, siteID, productID int64, qty int) error
//     ReturnInventory(ctx context.Context, siteID, productID int64, qty int) error
//     CreateLog(ctx context.Context, log *InventoryLog) error
// }

// Cache Repository 介面 (例如 Redis)
type CacheRepository interface {
    Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
    Get(ctx context.Context, key string) (string, error)
    Delete(ctx context.Context, key string) error
}

// Session Repository 介面 (專門用於 Session 管理)
type SessionRepository interface {
    Set(ctx context.Context, token string, status string, expiration time.Duration) error
    Get(ctx context.Context, token string) (int64, error)
    Delete(ctx context.Context, token string) error
    Exists(ctx context.Context, token string) (bool, error)
}