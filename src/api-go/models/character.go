package models

// Character representa a un jugador en la campaña siguiendo reglas de 5e
type Character struct {
	ID            int            `json:"id" gorm:"primaryKey;autoIncrement"`
	OwnerID       string         `json:"ownerId" gorm:"index"`
	Name          string         `json:"name"`
	Race          string         `json:"race"`       // Ej: "Human", "Elf"
	Class         string         `json:"class"`      // Ej: "Fighter", "Wizard"
	Background    string         `json:"background"` // Ej: "Soldier"
	Alignment     string         `json:"alignment"`  // Ej: "Neutral Good"
	Level         int            `json:"level" gorm:"default:1"`
	Experience    int            `json:"xp" gorm:"default:0"`
	
	// Combat Stats
	CurrentHP     int            `json:"currentHp"`
	MaxHP         int            `json:"maxHp"`
	TempHP        int            `json:"tempHp"`
	Initiative    int            `json:"initiative"`
	
	// Ability Scores
	Str           int            `json:"str" gorm:"default:10"`
	Dex           int            `json:"dex" gorm:"default:10"`
	Con           int            `json:"con" gorm:"default:10"`
	Int           int            `json:"int" gorm:"default:10"`
	Wis           int            `json:"wis" gorm:"default:10"`
	Cha           int            `json:"cha" gorm:"default:10"`
	
	// Proficiencies & Misc
	Proficiency   int            `json:"proficiencyBonus" gorm:"column:proficiency_bonus;default:2"`
	Gold          int            `json:"gold"`
	Status        string         `json:"status"` // "Active" | "Wounded" | "Unconscious"
	
	// Logic
	IsActive      bool           `json:"isActive" gorm:"column:is_active;default:true"`
	
	// Relationships
	PersonalItems []InventoryItem `json:"personalItems" gorm:"foreignKey:CharacterID"`
}

// InventoryItem representa un objeto en el inventario de un personaje
type InventoryItem struct {
	ID           int     `json:"id" gorm:"primaryKey;autoIncrement"`
	CharacterID  *int    `json:"characterId"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	Quantity     int     `json:"quantity"`
	Category     string  `json:"category"` // "Weapon", "Armor", "Consumable", "Tool", "Magic Item", "Misc"
	Rarity       string  `json:"rarity"`   // "Common", "Uncommon", "Rare", "Very Rare", "Legendary"
	IsEquippable bool    `json:"isEquippable"`
	IsEquipped   bool    `json:"isEquipped"`
	IsUsable     bool    `json:"isUsable"`
	Weight       float64 `json:"weight"`
	Properties   string  `json:"properties"` // Ej: "Versatile", "Finesse"
	
	// Technical Stats
	Damage         string `json:"damage"`         // Ej: "1d8"
	DamageType     string `json:"damageType"`     // Ej: "Slashing"
	ACBonus        int    `json:"acBonus"`        // Ej: 2 para escudos o armaduras
	Requirements   string `json:"requirements"`   // Ej: "Str 13"
	Charges        int    `json:"charges"`        // Para objetos con usos limitados
	SpecialActions string `json:"specialActions"` // JSON string con array de acciones [{name, desc, type}]
}
