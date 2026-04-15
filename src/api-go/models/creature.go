package models

// Creature representa un monstruo o entidad en el bestiario
type Creature struct {
	ID                 int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name               string `json:"name"`
	ImageURL           string `json:"imageUrl" gorm:"column:image_url"`
	Type               string `json:"type"`
	Alignment          string `json:"alignment"`
	ArmorClass         int    `json:"ac" gorm:"column:armor_class"`
	HitPoints          string `json:"hp" gorm:"column:hp"`
	Speed              string `json:"speed"`
	// Stats
	Str int `json:"str"`
	Dex int `json:"dex"`
	Con int `json:"con"`
	Int int `json:"int"`
	Wis int `json:"wis"`
	Cha int `json:"cha"`
	// Proficiencies & Resistance
	Saves              string `json:"saves"`
	Skills             string `json:"skills"`
	Resistances        string `json:"resistances"`
	Immunities         string `json:"immunities"`
	ConditionImmunities string `json:"conditionImmunities" gorm:"column:condition_immunities"`
	Senses             string `json:"senses"`
	Languages          string `json:"languages"`
	Challenge          string `json:"cr" gorm:"column:challenge"`
	XP                 int    `json:"xp"`
	// Narrative
	Description        string `json:"description"`
	Abilities          string `json:"abilities"`
	Actions            string `json:"actions"`
	LegendaryActions   string `json:"legendaryActions" gorm:"column:legendary_actions"`
	// Logic
	IsEncountered      bool   `json:"isEncountered" gorm:"column:is_encountered;default:false"`
	VisibilitySettings string `json:"visibilitySettings" gorm:"column:visibility_settings;default:'{}'"`
}

// CreatureNote representa las observaciones personales de un jugador sobre una criatura
type CreatureNote struct {
	ID         int    `json:"id" gorm:"primaryKey;autoIncrement"`
	CreatureID int    `json:"creatureId" gorm:"column:creature_id;index"`
	UserID     string `json:"userId" gorm:"column:user_id;index"`
	Content    string `json:"content"`
}
