package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func UpdateCharacterItem(c *gin.Context) {
	itemId := c.Param("itemId")
	role, _ := c.Get("user_role")
	userID, _ := c.Get("user_id")
	
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Security logic
	if role != "admin" {
		// Non-admins can only update SPECIFIC fields of THEIR OWN items
		if item.CharacterID == nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can modify vault items"})
			return
		}

		var char models.Character
		if err := handlers.DB.Where("id = ?", *item.CharacterID).First(&char).Error; err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "Ownership could not be verified"})
			return
		}

		if char.OwnerID != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "This item is not in your possession"})
			return
		}

		// Restricted updates for players
		allowedForPlayers := map[string]bool{"isEquipped": true, "quantity": true}
		for key := range updates {
			if !allowedForPlayers[key] {
				c.JSON(http.StatusForbidden, gin.H{"error": "Only archives high council can modify item technical stats"})
				return
			}
		}
	}

	// Do not allow updating ID or CharacterID via this endpoint
	delete(updates, "id")
	delete(updates, "characterId")
	delete(updates, "character_id")

	if err := handlers.DB.Model(&item).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": itemId})
}
