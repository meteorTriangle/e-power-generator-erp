package redis

import (
    "context"
    "fmt"
    "time"
    "github.com/redis/go-redis/v9"
	"new-e-power/backend-v2/internal/domain"
)

type sessionStore struct {
    client *redis.Client
}

func NewSessionStore(client *redis.Client) domain.SessionRepository {
    return &sessionStore{client: client}
}

// 儲存 Session (1 天)
func (s *sessionStore) Set(ctx context.Context, token string, status string, expiration time.Duration) error {
    key := fmt.Sprintf("session:%s", token)
    return s.client.Set(ctx, key, status, expiration).Err()
}

// 驗證 Session
func (s *sessionStore) Get(ctx context.Context, token string) (int64, error) {
    key := fmt.Sprintf("session:%s", token)
    return s.client.Get(ctx, key).Int64()
}

// 登出 (刪除 Session)
func (s *sessionStore) Delete(ctx context.Context, token string) error {
    key := fmt.Sprintf("session:%s", token)
    return s.client.Del(ctx, key).Err()
}

// 檢查 Session 是否存在
func (s *sessionStore) Exists(ctx context.Context, token string) (bool, error) {
	key := fmt.Sprintf("session:%s", token)
	exists, err := s.client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return exists == 1, nil
}