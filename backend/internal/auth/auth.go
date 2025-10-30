package auth

import (
	"fmt"
	"net/http"
)

var AuthApi *http.ServeMux

func init() {
	AuthApi = http.NewServeMux()
	AuthApi.HandleFunc("/login", loginApiHandler)
	AuthApi.HandleFunc("/register", registerApiHandler)
	fmt.Printf("package[auth] is initialized\n")
}