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

type Operation struct {
	OperationName string                 `json:"operation_name"` 
	/* 	"UPDATE", 
		"CREATE",
		"DELETE",
		"READ",
		"DELETE",
		"EXPORT",
		"IMPORT" 
	*/
	TargetName    string                 `json:"name"`
	/* 	"ORDER",
		"USER",
		"SITE",
		"PRODUCT",
		"MAINTENANCE",
		"MODEL",
		"CATEGORY",	
	*/
	Order         map[string]interface{} `json:"order"`
	User          map[string]interface{} `json:"user"`
	Site          map[string]interface{} `json:"site"`
	Product       map[string]interface{} `json:"product"`
	Maintenance   map[string]interface{} `json:"maintenance"`
	Model         map[string]interface{} `json:"model"`
	Category      map[string]interface{} `json:"category"`
}

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
	fmt.Println("Permission configuration loaded successfully.")
	parseAllUserGroups()
}

func (u User) filterPermissions() []string {
	// filter user group list which is use for permission check
	permissionGroup := []string{}
	GroupNameList := parseAllUserGroups()
	for _, groupName := range GroupNameList {
		for _, userGroupName := range u.Group {
			if groupName == userGroupName {
				permissionGroup = append(permissionGroup, groupName)
			}
		}
	}
	return permissionGroup
}

func (u User) HasPermission(permission Operation) bool {
	// check if user has the specific permission
	permissionGroup := u.filterPermissions()

	keys := make([]string, 0, len(Permission_JSON_Root))
	for i := range keys {
		if u.Role == keys[i] {
			fmt.Println(Permission_JSON_Root[u.Role])
		}
	}
	return false
}

func parseAllUserGroups() (GroupNameList []string) {
	for key, value := range Permission_JSON_Root {
		valueMap := value.(map[string]interface{})
		fmt.Printf("Role: %s, Description: %s\n", key, valueMap["description"])
		GroupNameList = append(GroupNameList, key)
	}
	return GroupNameList
}

func Nop() {}
