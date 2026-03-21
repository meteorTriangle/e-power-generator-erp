package config

import (
    "database/sql"
    "fmt"
    "time"
    
    _ "github.com/lib/pq" // PostgreSQL 驅動
)

type DBConfig struct {
    Host     string
    Port     int
    User     string
    Password string
    DBName   string
    SSLMode  string
}

func GetDBConfig() DBConfig {
    return DBConfig{
        Host:     GetEnv("DB_HOST"),
        Port:     GetEnvAsInt("DB_PORT", 5432),
        User:     GetEnv("DB_USER"),
		Password: GetEnv("DB_PASSWORD"),
        DBName:   GetEnv("DB_NAME"),
        SSLMode:  GetEnv("DB_SSLMODE"),
    }
}

func NewPostgresDB(cfg DBConfig) (*sql.DB, error) {
    dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.DBName,
		cfg.SSLMode,
	)
    
    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, fmt.Errorf("無法開啟資料庫連線: %w", err)
    }
    
    // 設定連線池
    db.SetMaxOpenConns(25)                 // 最大開啟連線數
    db.SetMaxIdleConns(5)                  // 最大閒置連線數
    db.SetConnMaxLifetime(5 * time.Minute) // 連線最大生命週期
    
    // 測試連線
    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("資料庫連線測試失敗: %w", err)
    }
    
    return db, nil
}