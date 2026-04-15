package lexicon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetLexiconWords(c *gin.Context) {
	var words []models.LexiconWord
	if err := handlers.DB.Order("discovery_date desc").Find(&words).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"words": words})
}
