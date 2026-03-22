package config

import (
	"fmt"
	"time"
	"os"
	"github.com/joho/godotenv"	
)

func init() {
	err := LoadConfig()
	if err != nil {
		fmt.Printf("無法載入環境變數: %v\n", err)
		// os.Exit(1)
	}
}

func LoadConfig() error {
	// 載入 .env 檔案 如果沒有找到會回傳錯誤，但我們不強制要求 .env 存在（可以直接從環境變數讀取）
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("無法載入 .env 檔案: %w", err)
	}
	fmt.Println("✅ 環境變數載入成功")
	return nil
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

func GetEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func GetEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	var value int
	_, err := fmt.Sscanf(valueStr, "%d", &value)
	if err != nil {
		return defaultValue
	}
	return value
}

func GetEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	value, err := time.ParseDuration(valueStr)
	if err != nil {
		return defaultValue
	}
	return value
}

func GetEnvAsBool(key string, defaultValue bool) bool {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}
	var value bool
	_, err := fmt.Sscanf(valueStr, "%t", &value)
	if err != nil {
		return defaultValue
	}
	return value
}