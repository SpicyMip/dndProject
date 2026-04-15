package characters

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	// Management (Player Profile)
	r.GET("/me", GetMyCharacters)
	r.POST("", CreateCharacter)
	r.DELETE("/:id", DeleteCharacter)
	
	// Game State (Campaign View)
	r.GET("", GetCharacters)
	r.PATCH("/:id", UpdateCharacter)
	r.POST("/:id/items", AddCharacterItem)
	r.PATCH("/items/:itemId", UpdateCharacterItem)
	r.DELETE("/items/:itemId", DeleteCharacterItem)

	// Global Item Library
	r.GET("/library", GetGlobalItems)
	r.POST("/global", CreateGlobalItem)
	r.POST("/items/:itemId/bestow", BestowItem)
	r.POST("/items/:itemId/unassign", UnassignItem)
	r.POST("/items/:itemId/transfer", TransferItem)
}
