package notices

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("", GetNotices)
	r.POST("", AddNotice)
	r.PATCH("/:id", UpdateNotice)
	r.DELETE("/:id", DeleteNotice)
}
