package database

import (
	"context"
	"crypto/sha256"
	"fmt"
)

type User struct {
	Username 		string
	Role     		string
	Group 			[]string
	Sales_site		int
	Phone_number 	string
	Email			string
	Email_check		bool
}

const addUserBySuperAdminSql string = `
INSERT INTO user_info (username, password_hash, role, sales_site, phone_number, email, email_check, permis_group)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

const getUserByLoginCheck string = `
SELECT password_hash, email_check
FROM user_info
WHERE email = $1`

const getUserByEmail string = `
SELECT username, role, sales_site, phone_number, email, email_check, permis_group
FROM user_info
WHERE email = $1`

func UserAddBySuperAdmin(newUser User, password string) error{
	hashedPassword := fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
	_, err := pool.Exec(
		context.Background(), addUserBySuperAdminSql,
		newUser.Username,
		hashedPassword,
		newUser.Role,
		newUser.Sales_site,
		newUser.Phone_number,
		newUser.Email,
		true,
		newUser.Group,
	)

	if err != nil {
		return fmt.Errorf("add new user failed: %w", err)
	}
	return nil
}

func UserLoginCheck(email string, password string) (User, bool, error) {
	var storedHash string
	var emailChecked bool
	err := pool.QueryRow(
		context.Background(), getUserByLoginCheck,
		email,
	).Scan(&storedHash, &emailChecked)
	if err != nil {
		return User{}, false, fmt.Errorf("query user failed: %w", err)
	}
	inputHash := fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
	if inputHash != storedHash {
		return User{}, false, nil // Password does not match
	}
	if !emailChecked {
		return User{}, false, nil // Email not verified
	}
	var user User
	err = pool.QueryRow(
		context.Background(), getUserByEmail,
		email,
	).Scan(&user.Username, &user.Role, &user.Sales_site, &user.Phone_number, &user.Email, &user.Email_check, &user.Group)
	return user, emailChecked, nil // Successful login
}