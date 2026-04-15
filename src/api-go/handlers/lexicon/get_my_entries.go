package lexicon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetMyLexiconEntries(c *gin.Context) {
	userID := c.GetString("user_id")
	var entries []models.LexiconEntry
	handlers.DB.Where("user_id = ?", userID).Find(&entries)
	c.JSON(http.StatusOK, gin.H{"entries": entries})
}
