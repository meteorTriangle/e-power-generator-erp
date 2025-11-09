package model

import (
	"encoding/json"
	// "fmt"
	"net/http"
	"new-e-power-generator-sys/inventory/internal/shared/database"
	"new-e-power-generator-sys/inventory/internal/img"
)

func AddGeneratorModelHandler(w http.ResponseWriter, r *http.Request) {
	/**
	 * GeneratorModel JSON Structure
	 * 	ID         int         
	 * Name       string          
	 * Power      int             
	 * Spec       GeneratorSpec  [{"SpecName":string, "SpecValue":string}]
	 * SpecImg    file          
	 * MachineImg file          
	 * OtherImg   []file        
	 */
	// ** important ** 
	// This handler handles JSON data and img file
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	// first: read the json part

	var genModel database.GeneratorModel
	err := json.NewDecoder(r.Body).Decode(&genModel)
	if err != nil {
		http.Error(w, "Failed to decode JSON" + err.Error(), http.StatusBadRequest)
		return
	}
	// second: read the img path and from tmp folder to final folder

	// handle SpecImgPath
	genModel.SpecImg, err = img.CopyTmpImg(genModel.SpecImg, "generator-spec")
	if err != nil {
		http.Error(w, "Failed to read SpecImg" + err.Error(), http.StatusBadRequest)
		return
	}
	// handle MachineImg
	genModel.MachineImg, err = img.CopyTmpImg(genModel.MachineImg, "generator-machine")
	if err != nil {
		http.Error(w, "Failed to read MachineImg", http.StatusBadRequest)
		return
	}
	// handle OtherImg
	oetherImg := genModel.OtherImg
	genModel.OtherImg = []string{}
	for _, otherImg := range oetherImg {
		otherImg, err = img.CopyTmpImg(otherImg, "generator-other")
		if err != nil {
			http.Error(w, "Failed to read OtherImg", http.StatusBadRequest)
			return
		}
		genModel.OtherImg = append(genModel.OtherImg, otherImg)
	}
	// finally: add to database
	err = database.GeneratorModelAdd(genModel)
	if err != nil {
		http.Error(w, "Failed to add generator model" + err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func ListallGeneratorModelHandler(w http.ResponseWriter, r *http.Request) {
	// This handler handles list all generator model
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	generatorModels, err := database.GeneratorModelListAll()
	if err != nil {
		http.Error(w, "Failed to list all generator model" + err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(generatorModels)
	if err != nil {
		http.Error(w, "Failed to encode JSON" + err.Error(), http.StatusInternalServerError)
		return
	}
}