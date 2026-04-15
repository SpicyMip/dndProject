package characters

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddCharacterItem(c *gin.Context) {
	charIDStr := c.Param("id")
	charID, err := strconv.Atoi(charIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid character ID"})
		return
	}

	var item models.InventoryItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	item.CharacterID = &charID
	if err := handlers.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}
