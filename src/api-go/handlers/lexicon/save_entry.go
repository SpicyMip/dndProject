package lexicon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func SaveLexiconEntry(c *gin.Context) {
	userID := c.GetString("user_id")
	var entry models.LexiconEntry
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.LexiconEntry
	result := handlers.DB.Where("word_id = ? AND user_id = ?", entry.WordID, userID).First(&existing)

	if result.Error == nil {
		existing.Interpretation = entry.Interpretation
		existing.Notes = entry.Notes
		handlers.DB.Save(&existing)
		c.JSON(http.StatusOK, existing)
	} else {
		entry.UserID = userID
		handlers.DB.Create(&entry)
		c.JSON(http.StatusCreated, entry)
	}
}
