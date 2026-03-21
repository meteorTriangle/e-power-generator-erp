package domain

import "errors"

var (
    // 產品相關錯誤
    ErrProductNotFound     = errors.New("產品不存在")
    ErrProductInactive     = errors.New("產品已下架")
    ErrInsufficientStock   = errors.New("庫存不足")
    
    // 訂單相關錯誤
    ErrOrderNotFound       = errors.New("訂單不存在")
    ErrOrderCannotCancel   = errors.New("訂單無法取消")
    ErrOrderCannotReturn   = errors.New("訂單無法歸還")
    ErrOrderOverdue        = errors.New("訂單已逾期")
    
    // 使用者相關錯誤
    ErrUserNotFound        = errors.New("使用者不存在")
    ErrUserInactive        = errors.New("使用者帳號已停用")
    ErrInvalidCredentials  = errors.New("帳號或密碼錯誤")
    ErrPermissionDenied    = errors.New("權限不足")
    
    // 站點相關錯誤
    ErrSiteNotFound        = errors.New("站點不存在")
    ErrSiteInactive        = errors.New("站點已停用")
    
    // 通用錯誤
    ErrInvalidInput        = errors.New("輸入資料無效")
    ErrDatabaseError       = errors.New("資料庫錯誤")
)