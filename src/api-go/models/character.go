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

// ItemTemplate representa la definición base de un objeto (Catálogo maestro)
type ItemTemplate struct {
	ID             int     `json:"id" gorm:"primaryKey;autoIncrement"`
	Name           string  `json:"name" gorm:"not null"`
	Description    string  `json:"description"`
	Category       string  `json:"category" gorm:"default:'Misc'"`
	Rarity         string  `json:"rarity" gorm:"default:'Common'"`
	IsEquippable   bool    `json:"isEquippable" gorm:"default:false"`
	IsUsable       bool    `json:"isUsable" gorm:"default:false"`
	Weight         float64 `json:"weight" gorm:"default:0"`
	Properties     string  `json:"properties"`
	Damage         string  `json:"damage"`
	DamageType     string  `json:"damageType"`
	ACBonus        int     `json:"acBonus" gorm:"default:0"`
	Requirements   string  `json:"requirements"`
	Charges        int     `json:"charges" gorm:"default:0"`
	SpecialActions string  `json:"specialActions" gorm:"type:jsonb;default:'[]'"`
}

// InventoryItem representa la instancia de un objeto que posee un personaje
type InventoryItem struct {
	ID          int          `json:"id" gorm:"primaryKey;autoIncrement"`
	CharacterID *int         `json:"characterId" gorm:"column:character_id"`
	TemplateID  int          `json:"templateId" gorm:"column:template_id;not null"`
	Template    ItemTemplate `json:"template" gorm:"foreignKey:template_id;references:id"`
	Quantity    int          `json:"quantity" gorm:"column:quantity;default:1"`
	IsEquipped  bool         `json:"isEquipped" gorm:"column:is_equipped;default:false"`
	Charges     int          `json:"charges" gorm:"column:charges"`
}
