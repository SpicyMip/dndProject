package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/tu-usuario/dnd-api/handlers"
	"github.com/tu-usuario/dnd-api/models"
	"github.com/tu-usuario/dnd-api/routes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Database connection details from environment variables
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPass, dbName, dbPort)

	var db *gorm.DB
	var err error

	// Retry connection until DB is ready
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Failed to connect to database (attempt %d): %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		log.Fatal("Could not connect to database after retries")
	}

	// Migrations are now handled via CLI (goose/golang-migrate)
	// seedDatabase(db) // Seed can stay here or be moved to a migration/seed CLI

	handlers.DB = db
	...
	func seedDatabase(db *gorm.DB) {
	// Seed Creatures (Bestiary)
	var count int64
	db.Model(&models.Creature{}).Count(&count)
	if count == 0 {
		creatures := []models.Creature{
			{
				ID:              "1",
				Name:            "Beholder",
				Type:            "Aberration",
				CR:              "13",
				HP:              "180",
				AC:              "18",
				Vulnerabilities: "None",
				Description:     "A floating orb of flesh with a large mouth, a single central eye, and many smaller eyestalks.",
			},
			{
				ID:              "2",
				Name:            "Red Dragon (Ancient)",
				Type:            "Dragon",
				CR:              "24",
				HP:              "546",
				AC:              "22",
				Vulnerabilities: "Cold",
				Description:     "The most covetous of the true dragons, red dragons tirelessly seek to increase their treasure hoards.",
			},
		}
		db.Create(&creatures)
		log.Println("Seeded initial creatures")
	}

	// Seed Deities (Pantheon)
	db.Model(&models.Deity{}).Count(&count)
	if count == 0 {
		deities := []models.Deity{
			{
				Type:        "greater",
				Name:        "Moradin",
				Domain:      "Knowledge, Life, War",
				Description: "The Soul Forger, primary deity of the dwarves.",
				Symbol:      "Hammer and Anvil",
			},
			{
				Type:        "lesser",
				Name:        "Lliira",
				Domain:      "Life",
				Description: "Our Lady of Joy, goddess of happiness and dance.",
				Symbol:      "Six-pointed star",
			},
		}
		db.Create(&deities)
		log.Println("Seeded initial deities")
	}
	}

	r := routes.SetupRouter()

	log.Println("Codex Arcanum API running on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server: ", err)
	}
}
