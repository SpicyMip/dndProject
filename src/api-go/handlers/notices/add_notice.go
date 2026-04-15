package notices

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddNotice(c *gin.Context) {
	var n models.Notice
	if err := c.ShouldBindJSON(&n); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	if err := handlers.DB.Create(&n).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	EnsureLexiconWords(n.Content)
	handlers.BroadcastNoticeUpdate()
	c.JSON(http.StatusCreated, n)
}
