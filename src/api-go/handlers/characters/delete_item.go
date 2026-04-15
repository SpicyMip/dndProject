package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func DeleteCharacterItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only archives high council can destroy items"})
		return
	}

	itemID := c.Param("itemId")
	if err := handlers.DB.Delete(&models.InventoryItem{}, "id = ?", itemID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "itemId": itemID})
}
