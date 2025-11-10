package model

import (
	"encoding/json"
	// "fmt"
	"net/http"
	"new-e-power-generator-sys/inventory/internal/img"
	"new-e-power-generator-sys/inventory/internal/shared/database"
	"path/filepath"
	"strings"
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
		http.Error(w, "Failed to decode JSON"+err.Error(), http.StatusBadRequest)
		return
	}
	// second: read the img path and from tmp folder to final folder

	// handle SpecImgPath
	genModel.SpecImg, err = img.CopyTmpImg(genModel.SpecImg, "generator-spec")
	if err != nil {
		http.Error(w, "Failed to read SpecImg"+err.Error(), http.StatusBadRequest)
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
		http.Error(w, "Failed to add generator model"+err.Error(), http.StatusInternalServerError)
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
		http.Error(w, "Failed to list all generator model"+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(generatorModels)
	if err != nil {
		http.Error(w, "Failed to encode JSON"+err.Error(), http.StatusInternalServerError)
		return
	}
}

func processUpdateImg(imgPath string, imgType string) (string, error) {
	// check if the imgPath is already in the final folder
	CutedPath, _ := strings.CutPrefix(imgPath, "/")
	if strings.HasPrefix(CutedPath, filepath.Join("img", imgType)) {
		return CutedPath, nil
	} else {
		// handle imgPath
		newImgPath, err := img.CopyTmpImg(imgPath, imgType)
		if err != nil {
			return "", err
		}
		return newImgPath, nil
	}
}

func EditGeneratorModelHandler(w http.ResponseWriter, r *http.Request) {
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

	var genModel database.GeneratorModel
	err := json.NewDecoder(r.Body).Decode(&genModel)
	if err != nil {
		http.Error(w, "Failed to decode JSON"+err.Error(), http.StatusBadRequest)
		return
	}

	// if the img isn't edit src is still in the final folder

	// handle SpecImgPath
	genModel.SpecImg, err = processUpdateImg(genModel.SpecImg, "generator-spec")
	if err != nil {
		http.Error(w, "Failed to read SpecImg"+err.Error(), http.StatusBadRequest)
		return
	}
	// handle MachineImg
	genModel.MachineImg, err = processUpdateImg(genModel.MachineImg, "generator-machine")
	if err != nil {
		http.Error(w, "Failed to read MachineImg", http.StatusBadRequest)
		return
	}
	// handle OtherImg
	oetherImg := genModel.OtherImg
	genModel.OtherImg = []string{}
	for _, otherImg := range oetherImg {
		otherImg, err = processUpdateImg(otherImg, "generator-other")
		if err != nil {
			http.Error(w, "Failed to read OtherImg", http.StatusBadRequest)
			return
		}
		genModel.OtherImg = append(genModel.OtherImg, otherImg)
	}

	// finally: update to database
	err = database.GeneratorModelUpdateSelect(genModel)
	if err != nil {
		http.Error(w, "Failed to update generator model"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
