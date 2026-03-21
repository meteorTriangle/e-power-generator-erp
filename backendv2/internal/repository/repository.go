package repository

import (
	"database/sql"
	"new-e-power/backend-v2/internal/contract"
	"new-e-power/backend-v2/internal/repository/postgres"
)

// Repositories 包含所有資料存取層的介面實例
type Repositories struct {
    User      contract.UserRepository      // ✅ 使用 contract 介面
    // Generator contract.GeneratorRepository
    // Site      contract.SiteRepository
    // Order     contract.OrderRepository
}

// NewRepositories 建立所有 repository 實例
func NewRepositories(db *sql.DB) *Repositories {
    return &Repositories{
        User:      postgres.NewUserRepository(db),
        // Generator: postgres.NewGeneratorRepository(db),
        // Site:      postgres.NewSiteRepository(db),
        // Order:     postgres.NewOrderRepository(db),
    }
}