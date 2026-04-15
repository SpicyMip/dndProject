package lexicon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func DeleteLexiconWord(c *gin.Context) {
	id := c.Param("id")
	handlers.DB.Delete(&models.LexiconWord{}, "id = ?", id)
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
