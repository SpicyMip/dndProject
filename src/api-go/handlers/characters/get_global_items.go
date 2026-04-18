package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// GetGlobalItems returns all item templates (The Library)
func GetGlobalItems(c *gin.Context) {
	var templates []models.ItemTemplate
	if err := handlers.DB.Order("name ASC").Find(&templates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": templates})
}
