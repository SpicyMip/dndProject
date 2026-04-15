package chronicles

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("", GetChronicles)
	r.POST("", AddStoryArc)
	r.POST("/:arcId/sessions", AddSession)
}
