package creatures

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("", GetBestiary)
	r.POST("", AddCreature)
	r.PATCH("/:id", UpdateCreature)
	r.DELETE("/:id", DeleteCreature)
	r.GET("/:id/notes", GetCreatureNotes)
	r.POST("/:id/notes", AddOrUpdateCreatureNote)
}
