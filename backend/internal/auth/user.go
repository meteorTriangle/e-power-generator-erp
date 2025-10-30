package auth
import (
	"encoding/json"
	"net/http"
	"new-e-power-generator-sys/inventory/internal/shared/database"

	"time"
)


type UserToken struct {
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}


func loginApiHandler(w http.ResponseWriter, r *http.Request) {
	type LoginRequest struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}
	var loginReq LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginReq)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	user, emailChecked, err := database.UserLoginCheck(loginReq.Email, loginReq.Password)
	if err != nil {
		http.Error(w, "Login failed", http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"user": user.Username,
		"role": user.Role,
		"group": user.Group,
		"sales_site": user.Sales_site,
		"phone_number": user.Phone_number,
		"email": user.Email,
		"email_checked": emailChecked,
	}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to Encode JSON", http.StatusInternalServerError)
	}
}

func genToken(){

}