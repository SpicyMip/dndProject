package pantheon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func GetPantheon(c *gin.Context) {
	var greater []models.Deity
	var lesser []models.Deity
	handlers.DB.Where("type = ?", "greater").Find(&greater)
	handlers.DB.Where("type = ?", "lesser").Find(&lesser)
	c.JSON(http.StatusOK, gin.H{
		"greaterDeities": greater,
		"lesserIdols":    lesser,
	})
}
