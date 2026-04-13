package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tu-usuario/dnd-api/handlers"
	"github.com/tu-usuario/dnd-api/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS basic configuration
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware()) // 🛡️ Todas las rutas requieren Auth de Firebase
	{
		// Characters
...

		api.PATCH("/characters/:id", handlers.UpdateCharacter)
		api.POST("/characters/:id/items", handlers.AddCharacterItem)
		api.DELETE("/characters/:characterId/items/:itemId", handlers.DeleteCharacterItem)

		// Shared Inventory
		api.GET("/shared-inventory", handlers.GetSharedInventory)
		api.POST("/shared-inventory", handlers.AddSharedItem)

		// Lexicon
		api.GET("/lexicon", handlers.GetLexicon)
		api.POST("/lexicon", handlers.AddInterpretation)
		api.PATCH("/lexicon/:id", handlers.UpdateInterpretation)
		api.DELETE("/lexicon/:id", handlers.DeleteInterpretation)

		// Notice Board
		api.GET("/notices", handlers.GetNotices)
		api.POST("/notices", handlers.AddNotice)
		api.PATCH("/notices/:id", handlers.UpdateNotice)
		api.DELETE("/notices/:id", handlers.DeleteNotice)

		// Bestiary
		api.GET("/bestiary", handlers.GetBestiary)
		api.POST("/bestiary", handlers.AddCreature)

		// Pantheon
		api.GET("/pantheon", handlers.GetPantheon)
		api.POST("/pantheon/:type", handlers.AddDeity)

		// Chronicles
		api.GET("/chronicles", handlers.GetChronicles)
		api.POST("/chronicles", handlers.AddStoryArc)
		api.POST("/chronicles/:arcId/sessions", handlers.AddSession)
	}

	return r
}
