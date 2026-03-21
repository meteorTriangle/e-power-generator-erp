package main

import (
	"fmt"
	"net/http"
	"time"

	"new-e-power/backend-v2/config"
	api "new-e-power/backend-v2/internal/delivery/http"
	"new-e-power/backend-v2/internal/delivery/http/middleware"
	api_v1 "new-e-power/backend-v2/internal/delivery/http/v1"
	"new-e-power/backend-v2/internal/repository"
	"new-e-power/backend-v2/internal/repository/redis"
	"new-e-power/backend-v2/internal/usecase"
	"new-e-power/backend-v2/pkg/jwt"
	"new-e-power/backend-v2/pkg/logger"

	"go.uber.org/zap"
)

func main() {
	fmt.Println("start e power generator !")

	// 初始化 Logger
	logConfig := &logger.Config{
		Level:      "info", // 可從環境變數讀取
		FilePath:   "./logs/server.log",
		MaxSize:    100,    // 100MB
		MaxBackups: 5,      // 保留 5 個舊檔案
		MaxAge:     30,     // 保留 30 天
		Compress:   true,   // 壓縮舊檔案
		Console:    true,   // 開發環境輸出到控制台
	}
	log, err := logger.NewLogger(logConfig)
	if err != nil {
		fmt.Printf("初始化 Logger 失敗: %v\n", err)
		return
	}
	defer log.Sync()

	log.Info("Starting E-Power Backend Service")

	// 資料庫連線
	cfg := config.GetDBConfig()
	db, err := config.NewPostgresDB(cfg)
	if err != nil {
		log.Error("資料庫連線失敗", zap.Error(err))
		return
	}
	defer db.Close()
	
	// 資料庫遷移
	err = config.RunMigrations(db, "./migrations")
	if err != nil {
		log.Error("資料庫遷移失敗", zap.Error(err))
		return
	}
	log.Info("資料庫連線成功，遷移完成")
	
	// 初始化 Repository
	repos := repository.NewRepositories(db)
	
	// 初始化 Usecase
	JWTConfig := config.NewJWTConfig()
	redisClient := config.NewRedisClient()
	sessionRepository := redis.NewSessionStore(redisClient)
	jwtService := jwt.NewJWTService(JWTConfig, sessionRepository)
	userUsecase := usecase.NewUserUsecase(repos.User, jwtService)
	
	// 初始化 Middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtService)
	
	// 初始化 HTTP Server
	server := api.SetupRouter(log.Logger, api_v1.NewUserHandler(userUsecase), authMiddleware)
	
	// 啟動 HTTP Server
	srv := &http.Server{
		Addr:         ":8192",
		Handler:      server,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Info("HTTP Server 啟動",
		zap.String("address", ":8192"),
		zap.Duration("read_timeout", 10*time.Second),
		zap.Duration("write_timeout", 10*time.Second),
	)

	if err := srv.ListenAndServe(); err != nil {
		log.Error("HTTP Server 發生錯誤", zap.Error(err))
	}
}