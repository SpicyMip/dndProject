package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/handlers/characters"
	"github.com/spicymip/codex-arcanum/handlers/chronicles"
	"github.com/spicymip/codex-arcanum/handlers/creatures"
	"github.com/spicymip/codex-arcanum/handlers/lexicon"
	"github.com/spicymip/codex-arcanum/handlers/notices"
	"github.com/spicymip/codex-arcanum/handlers/pantheon"
	"github.com/spicymip/codex-arcanum/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS basic configuration
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	api.GET("/ws", handlers.WebSocketHandler) // Real-time updates
	
	api.Use(middleware.AuthMiddleware()) // 🛡️ Todas las rutas requieren Auth de Firebase
	{
		characters.RegisterRoutes(api.Group("/characters"))
		creatures.RegisterRoutes(api.Group("/bestiary"))
		lexicon.RegisterRoutes(api.Group("/lexicon"))
		notices.RegisterRoutes(api.Group("/notices"))
		pantheon.RegisterRoutes(api.Group("/pantheon"))
		chronicles.RegisterRoutes(api.Group("/chronicles"))
	}

	return r
}
