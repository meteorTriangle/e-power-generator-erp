package database

import (
	"fmt"
	"log"

	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)


var pool *pgxpool.Pool


var TableInit []func() error


func init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or error loading .env file")
	}
	fmt.Println("Environment variables loaded from .env file")
}

func Connect() {
	// Database connection string
	databaseUrl := os.Getenv("DATABASE_URL")
	databasePort := os.Getenv("DATABASE_PORT")
	databaseUser := os.Getenv("DATABASE_USER")
	databasePassword := os.Getenv("DATABASE_PASSWORD")
	databaseName := os.Getenv("DATABASE_NAME")
	if databaseUrl == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
		fmt.Println("DATABASE_URL environment variable is not set")
	}
	if databasePort == "" {
		log.Fatal("DATABASE_PORT environment variable is not set")
		fmt.Println("DATABASE_PORT environment variable is not set")
	}
	if databaseUser == "" {
		log.Fatal("DATABASE_USER environment variable is not set")
		fmt.Println("DATABASE_USER environment variable is not set")
	}
	if databasePassword == "" {
		log.Fatal("DATABASE_PASSWORD environment variable is not set")
		fmt.Println("DATABASE_PASSWORD environment variable is not set")
	}
	if databaseName == "" {
		log.Fatal("DATABASE_NAME environment variable is not set")
		fmt.Println("DATABASE_NAME environment variable is not set")
	}
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", databaseUser, databasePassword, databaseUrl, databasePort, databaseName)
	var err error
	pool, err = pgxpool.New(context.Background(), connStr)

	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		fmt.Println("Unable to connect to database:", err)
	}
	fmt.Println("Connected to database")
	for _, initFunc := range TableInit {
		err := initFunc()
		if err != nil {
			log.Fatalf("Table initialization failed: %v\n", err)
			fmt.Println("Table initialization failed:", err)
		}
	}
	fmt.Println("Tables initialized")

}

func Close(){
	pool.Close()
}