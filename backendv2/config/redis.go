package config

import (
    "context"
    "github.com/redis/go-redis/v9"
    "time"
)

func NewRedisClient() *redis.Client {
	Addr := GetEnvWithDefault("REDIS_ADDR", "localhost:6379")
	Password := GetEnvWithDefault("REDIS_PASSWORD", "")
	DB := GetEnvAsInt("REDIS_DB", 0)
	PoolSize := GetEnvAsInt("REDIS_POOL_SIZE", 10)

    client := redis.NewClient(&redis.Options{
        Addr:     Addr,
        Password: Password,
        DB:       DB,
        PoolSize: PoolSize,
    })

    // 測試連線
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := client.Ping(ctx).Err(); err != nil {
        panic("Redis 連線失敗: " + err.Error())
    }

    return client
}