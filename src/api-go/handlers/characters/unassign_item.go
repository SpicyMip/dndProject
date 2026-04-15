package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// UnassignItem returns an item to the global vault
func UnassignItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can unassign items"})
		return
	}

	itemId := c.Param("itemId")
	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	item.CharacterID = nil
	item.IsEquipped = false
	if err := handlers.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "unassigned", "id": itemId})
}
