package lexicon

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/words", GetLexiconWords)
	r.POST("/words", AddLexiconWord)
	r.DELETE("/words/:id", DeleteLexiconWord)
	r.GET("/my-entries", GetMyLexiconEntries)
	r.POST("/my-entries", SaveLexiconEntry)
}
