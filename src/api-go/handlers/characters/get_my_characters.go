package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetMyCharacters(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User email not found in token"})
		return
	}
	var chars []models.Character
	
	// Filtramos por OwnerID y que estén activos (Soft Delete)
	// IS NOT FALSE para cubrir registros antiguos que podrían ser NULL
	if err := handlers.DB.Where("owner_id = ? AND is_active IS NOT FALSE", userID).Preload("PersonalItems.Template").Find(&chars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"characters": chars})
}
