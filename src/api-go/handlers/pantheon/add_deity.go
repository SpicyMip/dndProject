package pantheon

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddDeity(c *gin.Context) {
	deityType := c.Param("type")
	var deity models.Deity
	if err := c.ShouldBindJSON(&deity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	deity.Type = deityType
	if err := handlers.DB.Create(&deity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, deity)
}
