package api

import (
	"encoding/json"
	// "fmt"
	// "log"
	"net/http"
	// "os"

	"new-e-power-generator-sys/inventory/internal/shared/database"
)


func getAllSiteApiHandler(w http.ResponseWriter, r *http.Request) {
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

func addSiteApiHandler(w http.ResponseWriter, r *http.Request) {
	var site database.Site
	if err := json.NewDecoder(r.Body).Decode(&site);  err != nil {
		http.Error(w, "Failed to Decode JSON", http.StatusBadRequest)
		return
	}
	err := database.SiteAdd(site)
	if err != nil {
		http.Error(w, "Failed to Add Site", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Site Added"))

}

func editSiteApiHandler(w http.ResponseWriter, r *http.Request) {
	var site database.Site
	if err := json.NewDecoder(r.Body).Decode(&site);  err != nil {
		http.Error(w, "Failed to Decode JSON", http.StatusBadRequest)
		return
	}
	if site.ID == 0 {
		// add new site
		err := database.SiteAdd(site)
		if err != nil {
			http.Error(w, "Failed to Add Site", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("Site Added"))
	} else {
		// update site
		err := database.SiteUpdateSelect(site)
		if err != nil {
			http.Error(w, "Failed to Update Site", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Site Updated"))
	}
}

func deleteSiteApiHandler(w http.ResponseWriter, r *http.Request) {
	var site database.Site
	if err := json.NewDecoder(r.Body).Decode(&site);  err != nil {
		http.Error(w, "Failed to Decode JSON", http.StatusBadRequest)
		return
	}
	err := database.SiteDel(site)
	if err != nil {
		http.Error(w, "Failed to Delete Site", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Site Deleted"))

}