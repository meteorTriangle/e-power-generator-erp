package permission

import (
	"encoding/json"
	"fmt"
	"new-e-power-generator-sys/inventory/internal/shared"
	"os"
)


type Permission_JSON map[string]interface{}

type User shared.User

var Permission_JSON_Root Permission_JSON

const PERMISSION_CONFIG_PATH = "./permission.config"

func LoadPermissionConfig() (Permission_JSON, error) {
	file, err := os.Open(PERMISSION_CONFIG_PATH)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Permission_JSON
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, err
	}

	return config, nil
}

func init() {
	var err error
	Permission_JSON_Root, err = LoadPermissionConfig()
	if err != nil {
		panic(err)
	}
}

func (u User) HasPermission(permission string) bool {
	keys := make([]string, 0, len(Permission_JSON_Root))
	for i := range keys {
		if (u.Role == keys[i]) {
			fmt.Println(Permission_JSON_Root[u.Role])
		}
	}
	return false
}