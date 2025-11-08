package api

import (
	// "fmt"
	"log"
	"net/http"

	// "os"
	"new-e-power-generator-sys/inventory/internal/auth"
	"new-e-power-generator-sys/inventory/internal/img"
	"new-e-power-generator-sys/inventory/internal/model"
	"new-e-power-generator-sys/inventory/internal/shared/middleware"
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
	http.Handle("/", http.FileServer(http.Dir("./static/")))
	err := http.ListenAndServe(":9098", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}