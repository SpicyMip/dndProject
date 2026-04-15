package pantheon

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("", GetPantheon)
	r.POST("/:type", AddDeity)
}
