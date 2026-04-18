package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// UnassignItem removes an item instance from a character.
func UnassignItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can remove items from characters"})
		return
	}

	itemId := c.Param("itemId")
	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// If it's a character instance, we just delete it.
	// If it were a global item (character_id == null), we wouldn't delete it via this endpoint,
	// but this endpoint is intended for items currently held by characters.
	if err := handlers.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "removed", "id": itemId})
}
