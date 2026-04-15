package lexicon

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddLexiconWord(c *gin.Context) {
	var word models.LexiconWord
	if err := c.ShouldBindJSON(&word); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	word.SymbolSequence = strings.ToUpper(strings.TrimSpace(word.SymbolSequence))
	word.DiscoveryDate = time.Now()
	if err := handlers.DB.Create(&word).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, word)
}
