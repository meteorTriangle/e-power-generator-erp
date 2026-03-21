package postgres

import (
	"context"
	"database/sql"
	"fmt"
	"new-e-power/backend-v2/internal/domain"
	"new-e-power/backend-v2/internal/contract"
)

type userRepository struct {
    db *sql.DB
}

func NewUserRepository(db *sql.DB) contract.UserRepository {
    return &userRepository{db: db}
}

// 根據 ID 查詢使用者
func (r *userRepository) FindByID(ctx context.Context, id int64) (*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        WHERE id = $1
    `
    
    var user domain.User
    var siteID sql.NullInt64
    var companyName, companyTaxID, companyAddress sql.NullString
    
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &user.ID,
        &user.Email,
        &user.Phone,
        &user.Name,
        &user.Password,
        &user.Role,
        &user.IsActive,
        &siteID,
        &user.UserType,
        &companyName,
        &companyTaxID,
        &companyAddress,
        &user.CreatedAt,
        &user.UpdatedAt,
    )
    
    if err == sql.ErrNoRows {
        return nil, domain.ErrUserNotFound
    }
    if err != nil {
        return nil, fmt.Errorf("查詢使用者失敗: %w", err)
    }
    
    if siteID.Valid {
        val := siteID.Int64
        user.SiteID = &val
    }
    if companyName.Valid {
        user.CompanyName = &companyName.String
    }
    if companyTaxID.Valid {
        user.CompanyTaxID = &companyTaxID.String
    }
    if companyAddress.Valid {
        user.CompanyAddress = &companyAddress.String
    }
    
    return &user, nil
}

// 根據 Email 查詢使用者
func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        WHERE email = $1
    `
    
    var user domain.User
    var siteID sql.NullInt64
    var companyName, companyTaxID, companyAddress sql.NullString
    
    err := r.db.QueryRowContext(ctx, query, email).Scan(
        &user.ID,
        &user.Email,
        &user.Phone,
        &user.Name,
        &user.Password,
        &user.Role,
        &user.IsActive,
        &siteID,
        &user.UserType,
        &companyName,
        &companyTaxID,
        &companyAddress,
        &user.CreatedAt,
        &user.UpdatedAt,
    )
    
    if err == sql.ErrNoRows {
        return nil, domain.ErrUserNotFound
    }
    if err != nil {
        return nil, fmt.Errorf("查詢使用者失敗: %w", err)
    }
    
    if siteID.Valid {
        val := siteID.Int64
        user.SiteID = &val
    }
    if companyName.Valid {
        user.CompanyName = &companyName.String
    }
    if companyTaxID.Valid {
        user.CompanyTaxID = &companyTaxID.String
    }
    if companyAddress.Valid {
        user.CompanyAddress = &companyAddress.String
    }
    
    return &user, nil
}

// 根據手機號碼查詢使用者
func (r *userRepository) FindByPhone(ctx context.Context, phone string) (*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        WHERE phone = $1
    `
    
    var user domain.User
    var siteID sql.NullInt64
    var companyName, companyTaxID, companyAddress sql.NullString
    
    err := r.db.QueryRowContext(ctx, query, phone).Scan(
        &user.ID,
        &user.Email,
        &user.Phone,
        &user.Name,
        &user.Password,
        &user.Role,
        &user.IsActive,
        &siteID,
        &user.UserType,
        &companyName,
        &companyTaxID,
        &companyAddress,
        &user.CreatedAt,
        &user.UpdatedAt,
    )
    
    if err == sql.ErrNoRows {
        return nil, domain.ErrUserNotFound
    }
    if err != nil {
        return nil, fmt.Errorf("查詢使用者失敗: %w", err)
    }
    
    if siteID.Valid {
        val := siteID.Int64
        user.SiteID = &val
    }
    if companyName.Valid {
        user.CompanyName = &companyName.String
    }
    if companyTaxID.Valid {
        user.CompanyTaxID = &companyTaxID.String
    }
    if companyAddress.Valid {
        user.CompanyAddress = &companyAddress.String
    }
    
    return &user, nil
}

// 新增使用者
func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
    query := `
        INSERT INTO users (email, phone, name, password, role, is_active, site_id,
                          user_type, company_name, company_tax_id, company_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, created_at, updated_at
    `
    
    err := r.db.QueryRowContext(
        ctx, query,
        user.Email,
        user.Phone,
        user.Name,
        user.Password,
        user.Role,
        user.IsActive,
        user.SiteID,
        user.UserType,
        user.CompanyName,
        user.CompanyTaxID,
        user.CompanyAddress,
    ).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
    
    if err != nil {
        return fmt.Errorf("新增使用者失敗: %w", err)
    }
    
    return nil
}

// 更新使用者
func (r *userRepository) Update(ctx context.Context, user *domain.User) error {
    query := `
        UPDATE users
        SET email = $1, phone = $2, name = $3, role = $4, 
            is_active = $5, site_id = $6, user_type = $7,
            company_name = $8, company_tax_id = $9, company_address = $10,
            updated_at = NOW()
        WHERE id = $11
    `
    
    result, err := r.db.ExecContext(
        ctx, query,
        user.Email,
        user.Phone,
        user.Name,
        user.Role,
        user.IsActive,
        user.SiteID,
        user.UserType,
        user.CompanyName,
        user.CompanyTaxID,
        user.CompanyAddress,
        user.ID,
    )
    if err != nil {
        return fmt.Errorf("更新使用者失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return domain.ErrUserNotFound
    }
    
    return nil
}

// 軟刪除使用者
func (r *userRepository) SoftDelete(ctx context.Context, id int64) error {
    query := `
        UPDATE users
        SET is_active = false, updated_at = NOW()
        WHERE id = $1
    `   
    result, err := r.db.ExecContext(ctx, query, id)
    if err != nil {
        return fmt.Errorf("刪除使用者失敗: %w", err)
    }
    
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return domain.ErrUserNotFound
    }
    
    return nil
}

// 列出所有使用者 (分頁)
func (r *userRepository) ListAll(ctx context.Context, offset, limit int) ([]*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        ORDER BY id
        OFFSET $1 LIMIT $2
    `
    
    rows, err := r.db.QueryContext(ctx, query, offset, limit)
    if err != nil {
        return nil, fmt.Errorf("查詢使用者列表失敗: %w", err)
    }
    defer rows.Close()
    
    var users []*domain.User
    for rows.Next() {
        var user domain.User
        var siteID sql.NullInt64
        var companyName, companyTaxID, companyAddress sql.NullString
        
        err := rows.Scan(
            &user.ID,
            &user.Email,
            &user.Phone,
            &user.Name,
            &user.Password,
            &user.Role,
            &user.IsActive,
            &siteID,
            &user.UserType,
            &companyName,
            &companyTaxID,
            &companyAddress,
            &user.CreatedAt,
            &user.UpdatedAt,
        )
        if err != nil {
            return nil, fmt.Errorf("掃描使用者資料失敗: %w", err)
        }
        
        if siteID.Valid {
            val := siteID.Int64
            user.SiteID = &val
        }
        if companyName.Valid {
            user.CompanyName = &companyName.String
        }
        if companyTaxID.Valid {
            user.CompanyTaxID = &companyTaxID.String
        }
        if companyAddress.Valid {
            user.CompanyAddress = &companyAddress.String
        }
        
        users = append(users, &user)
    }   

    if err = rows.Err(); err != nil {
        return nil, fmt.Errorf("讀取使用者列表失敗: %w", err)
    }
    
    return users, nil
}

// 計算使用者總數
func (r *userRepository) Count(ctx context.Context) (int64, error) {
    query := `SELECT COUNT(*) FROM users`
    
    var count int64
    err := r.db.QueryRowContext(ctx, query).Scan(&count)
    if err != nil {
        return 0, fmt.Errorf("計算使用者總數失敗: %w", err)
    }
    
    return count, nil
}

// 根據角色列出使用者 (分頁)
func (r *userRepository) ListAllByRole(ctx context.Context, role string, offset, limit int) ([]*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        WHERE role = $1
        ORDER BY id
        OFFSET $2 LIMIT $3
    `
    
    rows, err := r.db.QueryContext(ctx, query, role, offset, limit)
    if err != nil {
        return nil, fmt.Errorf("查詢使用者列表失敗: %w", err)
    }
    defer rows.Close()
    
    var users []*domain.User
    for rows.Next() {
        var user domain.User
        var siteID sql.NullInt64
        var companyName, companyTaxID, companyAddress sql.NullString
        
        err := rows.Scan(
            &user.ID,
            &user.Email,
            &user.Phone,
            &user.Name,
            &user.Password,
            &user.Role,
            &user.IsActive,
            &siteID,
            &user.UserType,
            &companyName,
            &companyTaxID,
            &companyAddress,
            &user.CreatedAt,
            &user.UpdatedAt,
        )
        if err != nil {
            return nil, fmt.Errorf("掃描使用者資料失敗: %w", err)
        }
        
        if siteID.Valid {
            val := siteID.Int64
            user.SiteID = &val
        }
        if companyName.Valid {
            user.CompanyName = &companyName.String
        }
        if companyTaxID.Valid {
            user.CompanyTaxID = &companyTaxID.String
        }
        if companyAddress.Valid {
            user.CompanyAddress = &companyAddress.String
        }
        
        users = append(users, &user)
    }   

    if err = rows.Err(); err != nil {
        return nil, fmt.Errorf("讀取使用者列表失敗: %w", err)
    }
    
    return users, nil
}

// 根據角色計算使用者總數
func (r *userRepository) CountByRole(ctx context.Context, role string) (int64, error) {
    query := `SELECT COUNT(*) FROM users WHERE role = $1`
    
    var count int64
    err := r.db.QueryRowContext(ctx, query, role).Scan(&count)
    if err != nil {
        return 0, fmt.Errorf("計算使用者總數失敗: %w", err)
    }
    
    return count, nil
}

// 根據名稱或手機號碼搜尋使用者 (分頁)
func (r *userRepository) SearchByNameOrPhone(ctx context.Context, keyword string, offset, limit int) ([]*domain.User, error) {
    query := `
        SELECT id, email, phone, name, password, role, is_active, site_id,
               user_type, company_name, company_tax_id, company_address,
               created_at, updated_at
        FROM users
        WHERE name ILIKE '%' || $1 || '%' OR phone ILIKE '%' || $1 || '%'
        ORDER BY id
        OFFSET $2 LIMIT $3
    `
    
    rows, err := r.db.QueryContext(ctx, query, keyword, offset, limit)
    if err != nil {
        return nil, fmt.Errorf("搜尋使用者失敗: %w", err)
    }
    defer rows.Close()
    
    var users []*domain.User
    for rows.Next() {
        var user domain.User
        var siteID sql.NullInt64
        var companyName, companyTaxID, companyAddress sql.NullString
        
        err := rows.Scan(
            &user.ID,
            &user.Email,
            &user.Phone,
            &user.Name,
            &user.Password,
            &user.Role,
            &user.IsActive,
            &siteID,
            &user.UserType,
            &companyName,
            &companyTaxID,
            &companyAddress,
            &user.CreatedAt,
            &user.UpdatedAt,
        )
        if err != nil {
            return nil, fmt.Errorf("掃描使用者資料失敗: %w", err)
        }
        
        if siteID.Valid {
            val := siteID.Int64
            user.SiteID = &val
        }
        if companyName.Valid {
            user.CompanyName = &companyName.String
        }
        if companyTaxID.Valid {
            user.CompanyTaxID = &companyTaxID.String
        }
        if companyAddress.Valid {
            user.CompanyAddress = &companyAddress.String
        }
        
        users = append(users, &user)
    }   

    if err = rows.Err(); err != nil {
        return nil, fmt.Errorf("讀取使用者列表失敗: %w", err)
    }
    
    return users, nil
}

// 更新使用者最後登入時間
func (r *userRepository) UpdateLastLoginAt(ctx context.Context, userID int64) error {
    query := `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
    `
    
    result, err := r.db.ExecContext(ctx, query, userID)
    if err != nil {
        return fmt.Errorf("更新使用者最後登入時間失敗: %w", err)
    }   
        
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return domain.ErrUserNotFound
    }
    
    return nil
}

//更新使用者密碼
func (r *userRepository) UpdatePassword(ctx context.Context, userID int64, newPassword string) error {
    query := `
        UPDATE users
        SET password = $1, updated_at = NOW()
        WHERE id = $2
    `
    
    result, err := r.db.ExecContext(ctx, query, newPassword, userID)
    if err != nil {
        return fmt.Errorf("更新使用者密碼失敗: %w", err)
    }
        
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        return domain.ErrUserNotFound
    }
    
    return nil
}