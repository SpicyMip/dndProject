package chronicles

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func AddSession(c *gin.Context) {
	arcIDStr := c.Param("arcId")
	arcID, err := strconv.Atoi(arcIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid story arc ID"})
		return
	}

	var session models.Session
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	session.StoryArcID = arcID
	if err := handlers.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, session)
}
