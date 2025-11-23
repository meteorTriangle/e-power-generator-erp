package main

import (
	"fmt"
	// "os"

	"new-e-power-generator-sys/inventory/internal/shared/database"
	// "new-e-power-generator-sys/inventory/internal/shared/email"
	"new-e-power-generator-sys/inventory/internal/api"
	// "new-e-power-generator-sys/inventory/internal/shared/permission"
)

func main(){
	fmt.Println("Starting server...")
	database.Connect()
	fmt.Println("Database connected.")
	// permission.Nop()
	defer database.Close()

	// site, err := database.SiteListAll()
	// if err != nil {
	// 	fmt.Fprint(os.Stderr, "Failed to Query Site; %v\n", err)
	// }
	// fmt.Print(site)
	api.StartApiGateway()

}