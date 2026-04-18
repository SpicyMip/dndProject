package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func UpdateCharacterItem(c *gin.Context) {
	itemId := c.Param("itemId")
	
	// Try instance first
	var instance models.InventoryItem
	if err := handlers.DB.First(&instance, itemId).Error; err == nil {
		if err := c.ShouldBindJSON(&instance); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		handlers.DB.Save(&instance)
		c.JSON(http.StatusOK, instance)
		return
	}

	// Try template
	var template models.ItemTemplate
	if err := handlers.DB.First(&template, itemId).Error; err == nil {
		if err := c.ShouldBindJSON(&template); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		handlers.DB.Save(&template)
		c.JSON(http.StatusOK, template)
		return
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
}
