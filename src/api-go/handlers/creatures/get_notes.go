package creatures

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetCreatureNotes(c *gin.Context) {
	creatureID := c.Param("id")
	userID := c.GetString("user_id")
	var notes []models.CreatureNote
	handlers.DB.Where("creature_id = ? AND user_id = ?", creatureID, userID).Find(&notes)
	c.JSON(http.StatusOK, gin.H{"notes": notes})
}
