package api

import (
	"encoding/json"
	// "fmt"
	"log"
	"net/http"
	// "os"

	"new-e-power-generator-sys/inventory/internal/shared/database"
)

func GetAllSiteApiHandler(w http.ResponseWriter, r *http.Request) {
	Site, err := database.SiteListAll()
	if err != nil {
		http.Error(w, "Failed to Query From database", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(Site); err != nil {
		http.Error(w, "Failed to Encode JSON", http.StatusInternalServerError)
	}
}

func StartApiGateway() {
	http.HandleFunc("/api/v1/site/listall", GetAllSiteApiHandler)
	err := http.ListenAndServe(":9098", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}