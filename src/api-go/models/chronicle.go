package models

// StoryArc representa un arco argumental compuesto por varias sesiones
type StoryArc struct {
	ID       int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Title    string    `json:"title"`
	Sessions []Session `json:"sessions" gorm:"foreignKey:StoryArcID"`
}

// Session representa una sesión individual de juego dentro de un arco
type Session struct {
	ID         int    `json:"id" gorm:"primaryKey;autoIncrement"`
	StoryArcID int    `json:"-"`
	Title      string `json:"title"`
	Summary    string `json:"summary"`
	Secret     string `json:"secret"`
}
