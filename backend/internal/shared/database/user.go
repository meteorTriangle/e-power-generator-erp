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


const userTableInit string = `
CREATE TABLE IF NOT EXISTS public.user_info
(
    username text COLLATE pg_catalog."C.utf8" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL DEFAULT 'customer'::text,
    permis_group text[] COLLATE pg_catalog."default",
    sales_site integer,
    phone_number text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    email_check boolean NOT NULL DEFAULT false,
    CONSTRAINT email UNIQUE (email),
    CONSTRAINT phone_number UNIQUE (phone_number)
)`

const addUserBySuperAdminSql string = `
INSERT INTO user_info (username, password_hash, role, sales_site, phone_number, email, email_check, permis_group)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

const getUserByLoginCheck string = `
SELECT password_hash, email_check
FROM user_info
WHERE email = $1`

const getUserByEmail string = `
SELECT username, role, sales_site, phone_number, email_check, permis_group
FROM user_info
WHERE email = $1`

func init() {
	AddInitTableFunc(UserTableInit)
}


func UserTableInit() error {
	_, err := pool.Exec(context.Background(), userTableInit)
	if err != nil {
		return fmt.Errorf("user table create failed: %w", err)
	}
	return nil
}



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
		return User{}, false, fmt.Errorf("query user failed1: %w", err)
	}
	inputHash := fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
	if inputHash != storedHash {
		return User{}, false, nil // Password does not match
	}
	if !emailChecked {
		return User{}, false, nil // Email not verified
	}
	var user User
	_ = pool.QueryRow(
		context.Background(), getUserByEmail,
		email,
	).Scan(&user.Username, &user.Role, &user.Sales_site, &user.Phone_number, &user.Email_check, &user.Group)
		user.Email = email
	return user, emailChecked, nil // Successful login
}

func UserRegister(newUser User, password string) error {
	hashedPassword := fmt.Sprintf("%x", sha256.Sum256([]byte(password)))
	_, err := pool.Exec(
		context.Background(), addUserBySuperAdminSql,
		newUser.Username,
		hashedPassword,
		newUser.Role,
		newUser.Sales_site,
		newUser.Phone_number,
		newUser.Email,
		false, // Email not verified
		newUser.Group,
	)

	if err != nil {
		return fmt.Errorf("register new user failed: %w", err)
	}
	return nil
}

func UserGetByEmail(email string) (User, error) {
	var user User
	err := pool.QueryRow(
		context.Background(), getUserByEmail,
		email,
		).Scan(&user.Username, &user.Role, &user.Sales_site, &user.Phone_number, &user.Email_check, &user.Group)
	user.Email = email
	if err != nil {
		return User{}, fmt.Errorf("query user failed: %w", err)
	}
	return user, nil
}