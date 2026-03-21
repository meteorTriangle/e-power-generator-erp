package domain

import (
	"fmt"
	"time"
)

// 使用者角色
const (
    RoleCustomer  = "customer"   // 一般客戶
    RoleEmployee  = "employee"   // 員工
    RoleManager   = "manager"    // 站長
    RoleInvestor  = "investor"   // 投資人
    RoleAdmin     = "admin"      // 總管理員
)

// 用戶類型
const (
    UserTypeIndividual = "individual" // 個人用戶
    UserTypeBusiness   = "business"   // 商業用戶
)

// 使用者實體
type User struct {
    ID             int64     `json:"id"`
    Email          string    `json:"email"`
    Phone          string    `json:"phone"`
    Name           string    `json:"name"`              // 個人用戶：姓名；商業用戶：聯絡人姓名
    Password       string    `json:"-"`                 // 不回傳密碼
    Role           string    `json:"role"`
    IsActive       bool      `json:"is_active"`
    SiteID         *int64    `json:"site_id,omitempty"` // 所屬站點 (員工/站長)
    UserType       string    `json:"user_type"`         // 用戶類型: individual, business
    CompanyName    *string   `json:"company_name,omitempty"`    // 公司抬頭 (商業用戶)
    CompanyTaxID   *string   `json:"company_tax_id,omitempty"`  // 公司統編 (商業用戶)
    CompanyAddress *string   `json:"company_address,omitempty"` // 公司地址 (商業用戶)
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}

// 業務方法：檢查權限
func (u *User) HasPermission(requiredRole string) bool {
    roleLevel := map[string]int{
        RoleCustomer: 1,
        RoleEmployee: 2,
        RoleManager:  3,
        RoleInvestor: 4,
        RoleAdmin:    5,
    }
    return roleLevel[u.Role] >= roleLevel[requiredRole]
}

// 業務方法：是否為站點管理者
func (u *User) IsSiteManager() bool {
    return u.Role == RoleManager && u.SiteID != nil
}

// 業務方法：是否為商業用戶
func (u *User) IsBusinessUser() bool {
    return u.UserType == UserTypeBusiness
}

// 業務方法：驗證使用者資料
func (u *User) Validate() error {
    if u.Email == "" && u.Phone == "" {
        return fmt.Errorf("Email 或手機號碼至少需填寫一項")
    }
    if u.Name == "" {
        return fmt.Errorf("姓名不能為空")
    }
    if u.Role == "" {
        return fmt.Errorf("角色不能為空")
    }
    if u.UserType == "" {
        return fmt.Errorf("用戶類型不能為空")
    }
    if u.UserType != UserTypeIndividual && u.UserType != UserTypeBusiness {
        return fmt.Errorf("用戶類型必須為 individual 或 business")
    }
    // 商業用戶必須填寫公司抬頭和統編
    if u.UserType == UserTypeBusiness {
        if u.CompanyName == nil || *u.CompanyName == "" {
            return fmt.Errorf("商業用戶必須填寫公司抬頭")
        }
        if u.CompanyTaxID == nil || *u.CompanyTaxID == "" {
            return fmt.Errorf("商業用戶必須填寫公司統編")
        }
    }
    return nil
}