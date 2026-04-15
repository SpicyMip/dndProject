package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetCharacters(c *gin.Context) {
	var chars []models.Character
	// Using IS NOT FALSE handles both TRUE and NULL as active (fallback for old records)
	if err := handlers.DB.Where("is_active IS NOT FALSE").Preload("PersonalItems").Find(&chars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"characters": chars})
}
