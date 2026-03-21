package logger

import (
	"context"
	"runtime"

	"go.uber.org/zap"
)

// LogError 記錄錯誤並包含堆疊追蹤
func LogError(ctx context.Context, logger *zap.Logger, err error, message string) {
    // 取得調用堆疊
    pc, file, line, _ := runtime.Caller(1)
    funcName := runtime.FuncForPC(pc).Name()

    fields := []zap.Field{
        zap.Error(err),
        zap.String("function", funcName),
        zap.String("file", file),
        zap.Int("line", line),
    }

    // 從 context 取得額外資訊
    if requestID, ok := ctx.Value("request_id").(string); ok {
        fields = append(fields, zap.String("request_id", requestID))
    }
    if userID, ok := ctx.Value("userID").(int64); ok {
        fields = append(fields, zap.Int64("user_id", userID))
    }

    logger.Error(message, fields...)
}