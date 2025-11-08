package config

// import (
// 	"os"
// 	"encoding/json"
// )


// type Permission_JSON map[string][]Permission_JSON 


// const PERMISSION_CONFIG_PATH = "./permission.config"

// func LoadPermissionConfig() (Permission_JSON, error) {
// 	file, err := os.Open(PERMISSION_CONFIG_PATH)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer file.Close()

// 	var config Permission_JSON
// 	decoder := json.NewDecoder(file)
// 	if err := decoder.Decode(&config); err != nil {
// 		return nil, err
// 	}

// 	return config, nil
// }

// func init() {
// 	_, err := LoadPermissionConfig()
// 	if err != nil {
// 		panic(err)
// 	}
// }