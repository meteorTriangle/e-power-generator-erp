package main

import (
	"fmt"
	
	"new-e-power-generator-sys/inventory/internal/shared/database"
)

func main(){
	fmt.Println("Starting server...")
	database.Connect()
	fmt.Println("Database connected.")
}