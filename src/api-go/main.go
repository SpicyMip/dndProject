package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
	"github.com/spicymip/codex-arcanum/routes"
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

	handlers.DB = db
	seedDatabase(db)

	go handlers.MainHub.Run()

	r := routes.SetupRouter()

	log.Println("Codex Arcanum API running on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to run server: ", err)
	}
}

func seedDatabase(db *gorm.DB) {
	// Seed Creatures (Bestiary)
	var count int64
	db.Model(&models.Creature{}).Count(&count)
	if count == 0 {
		creatures := []models.Creature{
			{
				ID:                 1,
				Name:               "Beholder",
				Type:               "Aberration",
				Challenge:          "13",
				HitPoints:          "180",
				ArmorClass:         18,
				Description:        "A floating orb of flesh with a large mouth, a single central eye, and many smaller eyestalks.",
				IsEncountered:      true,
				VisibilitySettings: `{"stats":true,"description":true}`,
			},
			{
				ID:                 2,
				Name:               "Red Dragon (Ancient)",
				Type:               "Dragon",
				Challenge:          "24",
				HitPoints:          "546",
				ArmorClass:         22,
				Description:        "The most covetous of the true dragons, red dragons tirelessly seek to increase their treasure hoards.",
				IsEncountered:      false,
				VisibilitySettings: `{"stats":false,"description":false}`,
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

	// Seed Characters
	db.Model(&models.Character{}).Count(&count)
	if count == 0 {
		chars := []models.Character{
			{
				ID:        1,
				OwnerID:   "system@archive.org",
				Name:      "Valerius",
				Class:     "Paladin",
				Race:      "Human",
				Level:     5,
				MaxHP:     45,
				CurrentHP: 45,
				Str:       16,
				Dex:       10,
				Con:       14,
				Int:       8,
				Wis:       12,
				Cha:       16,
				Status:    "Active",
				IsActive:  true,
			},
		}
		db.Create(&chars)
		log.Println("Seeded initial characters")
	}
}
