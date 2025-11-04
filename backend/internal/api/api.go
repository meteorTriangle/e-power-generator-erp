package api

import (
	// "fmt"
	"log"
	"net/http"
	// "os"
	"time"
	"new-e-power-generator-sys/inventory/internal/auth"
	"new-e-power-generator-sys/inventory/internal/shared/middleware"

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

	protectedMux := http.NewServeMux()
	authMiddleware := middleware.AuthMiddleware(AuthConfig.AccessSecret)
	protectedMux.HandleFunc("/site/listall", getAllSiteApiHandler)
	http.Handle("/api/v1/", http.StripPrefix("/api/v1", authMiddleware(protectedMux)))
	// apiSite := http.NewServeMux()
	// apiSite.HandleFunc("/listall", getAllSiteApiHandler)
	// http.Handle("/api/v1/site/", http.StripPrefix("/api/v1/site", apiSite))
	// http.HandleFunc("/api/v1/site/listall", getAllSiteApiHandler)
	err := http.ListenAndServe(":9098", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}