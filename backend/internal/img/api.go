package img

import (
	"net/http"
	// "path/filepath"
	"strings"

	"github.com/google/uuid"
)

func UploadImgHandler(w http.ResponseWriter, r *http.Request) {
	// This handler handles img file upload to tmp folder
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	err := r.ParseMultipartForm(32 << 20) // limit your max input length!
	if err != nil {
		http.Error(w, "Failed to parse multipart form", http.StatusBadRequest)
		return
	}
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read img" + err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()
	// rename the file to avoid conflict
	// generate a random filename or use a timestamp
	filename := uuid.New().String()
	// get the file submited name
	submitedName := strings.Split(fileHeader.Filename, ".")[len(strings.Split(fileHeader.Filename, "."))-1]
	filename = filename + "." + submitedName
	// save the file to tmp folder
	filePath, err := TmpImg(file, filename)
	if err != nil {
		http.Error(w, "Failed to save img", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(filePath))
}