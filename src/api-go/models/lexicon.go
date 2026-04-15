package models

import "time"

// LexiconWord representa un símbolo arcano descubierto globalmente
type LexiconWord struct {
	ID             int       `json:"id" gorm:"primaryKey;autoIncrement"`
	SymbolSequence string    `json:"symbolSequence" gorm:"uniqueIndex"`
	DMNotes        string    `json:"dmNotes"` // Notas secretas del DM
	DiscoveryDate  time.Time `json:"discoveryDate"`
}

// LexiconEntry representa la interpretación personal de un jugador sobre un símbolo
type LexiconEntry struct {
	ID             int    `json:"id" gorm:"primaryKey;autoIncrement"`
	WordID         int    `json:"wordId" gorm:"column:word_id;index"`
	UserID         string `json:"userId" gorm:"column:user_id;index"`
	Interpretation string `json:"interpretation"`
	Notes          string `json:"notes"`
}
