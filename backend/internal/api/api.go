package api

import (
	// "fmt"
	"log"
	"net/http"
	// "os"
	"new-e-power-generator-sys/inventory/internal/auth"

)



func StartApiGateway() {
	http.Handle("/api/v1/auth/", http.StripPrefix("/api/v1/auth", auth.AuthApi))
	apiSite := http.NewServeMux()
	apiSite.HandleFunc("/listall", getAllSiteApiHandler)
	http.Handle("/api/v1/site/", http.StripPrefix("/api/v1/site", apiSite))
	// http.HandleFunc("/api/v1/site/listall", getAllSiteApiHandler)
	err := http.ListenAndServe(":9098", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}