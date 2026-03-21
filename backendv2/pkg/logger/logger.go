package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type Logger struct {
    *zap.Logger
}

type Config struct {
    Level      string // debug, info, warn, error
    FilePath   string
    MaxSize    int  // MB
    MaxBackups int  // 保留的舊日誌檔案數量
    MaxAge     int  // 保留天數
    Compress   bool // 是否壓縮
    Console    bool // 是否同時輸出到控制台
}

func NewLogger(cfg *Config) (*Logger, error) {
    // 設定日誌級別
    var level zapcore.Level
    switch cfg.Level {
    case "debug":
        level = zapcore.DebugLevel
    case "info":
        level = zapcore.InfoLevel
    case "warn":
        level = zapcore.WarnLevel
    case "error":
        level = zapcore.ErrorLevel
    default:
        level = zapcore.InfoLevel
    }

    // 設定 Encoder（JSON 格式）
    encoderConfig := zapcore.EncoderConfig{
        TimeKey:        "timestamp",
        LevelKey:       "level",
        NameKey:        "logger",
        CallerKey:      "caller",
        FunctionKey:    zapcore.OmitKey,
        MessageKey:     "message",
        StacktraceKey:  "stacktrace",
        LineEnding:     zapcore.DefaultLineEnding,
        EncodeLevel:    zapcore.LowercaseLevelEncoder,
        EncodeTime:     zapcore.ISO8601TimeEncoder,
        EncodeDuration: zapcore.SecondsDurationEncoder,
        EncodeCaller:   zapcore.ShortCallerEncoder,
    }

    // 日誌輪替設定
    writer := &lumberjack.Logger{
        Filename:   cfg.FilePath,
        MaxSize:    cfg.MaxSize,
        MaxBackups: cfg.MaxBackups,
        MaxAge:     cfg.MaxAge,
        Compress:   cfg.Compress,
    }

    // 建立 Core
    var cores []zapcore.Core

    // 檔案輸出
    fileCore := zapcore.NewCore(
        zapcore.NewJSONEncoder(encoderConfig),
        zapcore.AddSync(writer),
        level,
    )
    cores = append(cores, fileCore)

    // 控制台輸出（開發環境）
    if cfg.Console {
        consoleCore := zapcore.NewCore(
            zapcore.NewConsoleEncoder(encoderConfig),
            zapcore.AddSync(os.Stdout),
            level,
        )
        cores = append(cores, consoleCore)
    }

    // 組合 Core
    core := zapcore.NewTee(cores...)

    // 建立 Logger
    zapLogger := zap.New(core,
        zap.AddCaller(),
        zap.AddCallerSkip(1),
        zap.AddStacktrace(zapcore.ErrorLevel),
    )

    return &Logger{zapLogger}, nil
}

// 便捷方法
func (l *Logger) With(fields ...zap.Field) *Logger {
    return &Logger{l.Logger.With(fields...)}
}

func (l *Logger) WithContext(ctx interface{}) *Logger {
    // 可以從 context 中提取 request_id, user_id 等資訊
    return l
}