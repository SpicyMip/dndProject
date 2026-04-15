package models

// Deity representa una deidad o ídolo en el mundo
type Deity struct {
	ID          int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Type        string `json:"-"` // "greater" | "lesser"
	Name        string `json:"name"`
	Domain      string `json:"domain"`
	Description string `json:"description"`
	Symbol      string `json:"symbol"`
}
