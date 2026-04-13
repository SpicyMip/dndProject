package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func main() {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser, dbPass, dbHost, dbPort, dbName)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("db-cli: failed to open DB: %v\n", err)
	}
	defer db.Close()

	arguments := []string{"status"}
	if len(os.Args) > 1 {
		arguments = os.Args[1:]
	}

	command := arguments[0]
	cmdArgs := arguments[1:]

	// Carpeta donde se encuentran las migraciones (dentro de este contenedor/proyecto)
	migrationDir := "migrations"

	fmt.Printf("🛡️  Codex Arcanum - Database CLI\n")
	fmt.Printf("Running command: %s\n", command)

	if err := goose.Run(command, db, migrationDir, cmdArgs...); err != nil {
		log.Fatalf("db-cli: %v", err)
	}
}
