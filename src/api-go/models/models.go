package models

import (
	"time"

	"gorm.io/gorm"
)

// Character
type Character struct {
	ID            string         `json:"id" gorm:"primaryKey"`
	OwnerID       string         `json:"ownerId"`
	Name          string         `json:"name"`
	Class         string         `json:"class"`
	Level         int            `json:"level"`
	CurrentHP     int            `json:"currentHp"`
	MaxHP         int            `json:"maxHp"`
	Str           int            `json:"str"`
	Dex           int            `json:"dex"`
	Con           int            `json:"con"`
	Int           int            `json:"int"`
	Wis           int            `json:"wis"`
	Cha           int            `json:"cha"`
	Influence     int            `json:"influence"`
	Gold          int            `json:"gold"`
	Status        string         `json:"status"` // "Active" | "Wounded" | "Unconscious"
	PersonalItems []InventoryItem `json:"personalItems" gorm:"foreignKey:CharacterID"`
}

type InventoryItem struct {
	ID          string `json:"id" gorm:"primaryKey"`
	CharacterID string `json:"-"`
	Name        string `json:"name"`
	Quantity    int    `json:"quantity"`
	Type        string `json:"type"` // "weapon" | "armor" | "consumable" | "quest" | "misc"
}

// Shared Inventory
type SharedItem struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Type     string `json:"type"` // "Currency" | "Magic Item" | "Consumable" | "Quest Item" | "Resource"
	Icon     string `json:"icon"`
	Fixed    bool   `json:"fixed"`
}

// Lexicon
type Interpretation struct {
	ID             string    `json:"id" gorm:"primaryKey"`
	SymbolSequence string    `json:"symbolSequence"`
	UserDefinition string    `json:"userDefinition"`
	Notes          string    `json:"notes"`
	DiscoveryDate  time.Time `json:"discoveryDate"`
}

// Notice Board
type Notice struct {
	ID       string `json:"id" gorm:"primaryKey"`
	Type     string `json:"type"` // "mission" | "ad" | "news"
	Title    string `json:"title"`
	Content  string `json:"content"`
	X        int    `json:"x"`
	Y        int    `json:"y"`
	Rotation int    `json:"rotation"`
}

// Bestiary
type Creature struct {
	ID              string `json:"id" gorm:"primaryKey"`
	Name            string `json:"name"`
	Type            string `json:"type"`
	CR              string `json:"cr"`
	HP              string `json:"hp"`
	AC              string `json:"ac"`
	Vulnerabilities string `json:"vulnerabilities"`
	Description     string `json:"description"`
}

// Pantheon
type Deity struct {
	gorm.Model
	Type        string `json:"-"` // "greater" | "lesser"
	Name        string `json:"name"`
	Domain      string `json:"domain"`
	Description string `json:"description"`
	Symbol      string `json:"symbol"`
}

// Chronicles
type StoryArc struct {
	ID       string    `json:"id" gorm:"primaryKey"`
	Title    string    `json:"title"`
	Sessions []Session `json:"sessions" gorm:"foreignKey:StoryArcID"`
}

type Session struct {
	ID         string `json:"id" gorm:"primaryKey"`
	StoryArcID string `json:"-"`
	Title      string `json:"title"`
	Summary    string `json:"summary"`
	Secret     string `json:"secret"`
}
