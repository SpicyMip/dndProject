package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func DeleteCharacter(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("user_id")
	
	// Soft delete: solo marcamos como isActive = false
	// Y nos aseguramos de que el usuario sea el dueño
	result := handlers.DB.Model(&models.Character{}).
		Where("id = ? AND owner_id = ?", id, userID).
		Update("is_active", false)
		
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Character not found or unauthorized"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"status": "deactivated", "id": id})
}
