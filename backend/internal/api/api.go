package api

import (
	// "fmt"
	// "fmt"
	"log"
	"net/http"
	"new-e-power-generator-sys/inventory/internal/auth"
	"new-e-power-generator-sys/inventory/internal/img"
	"new-e-power-generator-sys/inventory/internal/model"
	"new-e-power-generator-sys/inventory/internal/shared/middleware"
	"os"
	"path/filepath"
	"strings"
	"time"
)



func StartApiGateway() {
	AuthConfig := auth.AuthConfig{
		AccessSecret:  "access_secret",
		RefreshSecret: "refresh_secret",
		AccessExpiry:  15 * time.Minute,
		RefreshExpiry: 7 * 24 * time.Hour,
	}
	AuthService := auth.NewAuthService(AuthConfig)
	AuthHandler := auth.NewAuthHandler(AuthService, 7 * 24 * time.Hour)
	authMux := http.NewServeMux()
	AuthHandler.RegisterRoutes(authMux)
	http.Handle("/api/v1/auth/", http.StripPrefix("/api/v1/auth", authMux))
	http.HandleFunc("/api/v1/upload/tmp", img.UploadImgHandler)
	protectedMux := http.NewServeMux()
	authMiddleware := middleware.AuthMiddleware(AuthConfig.AccessSecret)
	

	
	protectedMux.HandleFunc("/site/listall", getAllSiteApiHandler)
	protectedMux.HandleFunc("/site/add", addSiteApiHandler)
	protectedMux.HandleFunc("/site/edit", editSiteApiHandler)
	protectedMux.HandleFunc("/site/delete", deleteSiteApiHandler)
	
	protectedMux.HandleFunc("/generatorModel/upload", model.AddGeneratorModelHandler)
	protectedMux.HandleFunc("/generatorModel/listall", model.ListallGeneratorModelHandler)


	http.Handle("/api/v1/", http.StripPrefix("/api/v1", authMiddleware(protectedMux)))
	http.Handle("/img/", http.StripPrefix("/img" , http.FileServer(http.Dir("./img/"))))
	http.HandleFunc("/", spaHandler)
	err := http.ListenAndServe(":9098", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func spaHandler(w http.ResponseWriter, r *http.Request) {
	staticDir := "static"
	// 獲取請求的路徑
	path := r.URL.Path
	// fmt.Println("path:", path)
	// 1. 安全性檢查：防止路徑遍歷 (Directory Traversal)
	// 將請求的路徑附加到靜態目錄
	filePath := filepath.Join(staticDir, path)
	// fmt.Println("filePath", filePath)
	// 檢查 'filePath' 是否仍然在 'staticDir' 的範圍內
	if !strings.HasPrefix(filepath.Clean(filePath), staticDir) {
		// fmt.Println("strings.HasPrefix(filepath.Clean(filePath), staticDir)", strings.HasPrefix(filepath.Clean(filePath), staticDir))
		http.NotFound(w, r)
		return
	}

	// 2. 檢查檔案是否存在
	// 我們嘗試 'stat' 這個檔案
	// 例如：
	// / -> ./static/ (會是
	// /dashboard -> ./static/dashboard (不存在)
	// /favicon.ico -> ./static/favicon.ico (存在)
	// /static/js/main.js -> ./static/static/js/main.js (存在)
	info, err := os.Stat(filePath)
	
	// 3. 判斷並提供檔案
	if err == nil && !info.IsDir() {
		// 檔案存在，且不是一個目錄 -> 直接提供該檔案
		// http.FileServer 會自動處理快取、MIME 類型等
		http.FileServer(http.Dir(staticDir)).ServeHTTP(w, r)
		return
	}

	// 4. 如果檔案不存在 (os.IsNotExist(err)) 或是請求一個目錄 (info.IsDir())
	// 這代表它是一個 SPA 路由 (例如 / 或 /dashboard)
	// 我們回傳 React App 的入口
	http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
}