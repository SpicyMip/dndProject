package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// TransferItem moves an item from one character to another
func TransferItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can transfer items"})
		return
	}

	itemId := c.Param("itemId")
	var input struct {
		TargetCharacterID int `json:"characterId"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	item.CharacterID = &input.TargetCharacterID
	item.IsEquipped = false
	if err := handlers.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "transferred", "id": itemId, "to": input.TargetCharacterID})
}
