package chronicles

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetChronicles(c *gin.Context) {
	var arcs []models.StoryArc
	if err := handlers.DB.Preload("Sessions").Find(&arcs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"storyArcs": arcs})
}
