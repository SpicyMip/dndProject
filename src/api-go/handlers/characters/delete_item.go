package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func DeleteCharacterItem(c *gin.Context) {
	itemId := c.Param("itemId")
	
	// Try to find if it's an instance
	var instance models.InventoryItem
	if err := handlers.DB.First(&instance, itemId).Error; err == nil {
		handlers.DB.Delete(&instance)
		c.JSON(http.StatusOK, gin.H{"status": "instance deleted"})
		return
	}

	// Try to find if it's a template
	var template models.ItemTemplate
	if err := handlers.DB.First(&template, itemId).Error; err == nil {
		handlers.DB.Delete(&template)
		c.JSON(http.StatusOK, gin.H{"status": "template deleted"})
		return
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Item or Template not found"})
}
