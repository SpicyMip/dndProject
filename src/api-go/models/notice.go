package models

import "time"

// Notice representa un anuncio en el tablón
type Notice struct {
	ID            int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Type          string    `json:"type"` // "mission" | "ad" | "news"
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	Active        bool      `json:"active" gorm:"default:true"`
	CreatedAt     time.Time `json:"createdAt" gorm:"autoCreateTime"`
}
