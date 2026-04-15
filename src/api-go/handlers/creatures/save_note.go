package creatures

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddOrUpdateCreatureNote(c *gin.Context) {
	creatureIDStr := c.Param("id")
	creatureID, err := strconv.Atoi(creatureIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid creature ID"})
		return
	}
	userID := c.GetString("user_id")
	var note models.CreatureNote
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	var existing models.CreatureNote
	result := handlers.DB.Where("creature_id = ? AND user_id = ?", creatureID, userID).First(&existing)
	
	if result.Error == nil {
		existing.Content = note.Content
		handlers.DB.Save(&existing)
		c.JSON(http.StatusOK, existing)
	} else {
		note.CreatureID = creatureID
		note.UserID = userID
		handlers.DB.Create(&note)
		c.JSON(http.StatusCreated, note)
	}
}
