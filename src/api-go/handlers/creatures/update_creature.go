package creatures

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func UpdateCreature(c *gin.Context) {
	id := c.Param("id")
	var creature models.Creature
	if err := c.ShouldBindJSON(&creature); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := handlers.DB.Model(&models.Creature{}).Where("id = ?", id).Select("*").Updates(&creature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	handlers.BroadcastBestiaryUpdate()
	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": id})
}
