package config

import (
    "database/sql"
    "fmt"
    
    "github.com/golang-migrate/migrate/v4"
    "github.com/golang-migrate/migrate/v4/database/postgres"
    _ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations(db *sql.DB, migrationsDir string) error {
    driver, err := postgres.WithInstance(db, &postgres.Config{})
    if err != nil {
        return fmt.Errorf("無法建立 migration driver: %w", err)
    }
    
    m, err := migrate.NewWithDatabaseInstance(
        "file://" + migrationsDir, // Migration 檔案路徑
        "postgres",          // 資料庫類型
        driver,
    )
    if err != nil {
        return fmt.Errorf("無法建立 migration 實例: %w", err)
    }
    
    // 執行 Migration
    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        return fmt.Errorf("執行 migration 失敗: %w", err)
    }
    
    fmt.Println("✅ Migration 執行成功")
    return nil
}