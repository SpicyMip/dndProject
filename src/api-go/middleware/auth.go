package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

func AuthMiddleware() gin.HandlerFunc {
	// Initialize Firebase App
	configPath := os.Getenv("FIREBASE_CONFIG_PATH")
	if configPath == "" {
		configPath = "serviceAccountKey.json"
	}
	
	// Check if file exists
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Printf("⚠️  Firebase config not found at %s. Running with MOCK AUTH.", configPath)
		return func(c *gin.Context) {
			c.Set("user_id", "mock@example.com")
			c.Set("user_role", "admin")
			c.Next()
		}
	}

	opt := option.WithCredentialsFile(configPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic("error initializing firebase app: " + err.Error())
	}

	auth, err := app.Auth(context.Background())
	if err != nil {
		panic("error getting firebase auth client: " + err.Error())
	}

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		idToken := strings.TrimSpace(strings.Replace(authHeader, "Bearer", "", 1))
		token, err := auth.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store user email and role in context for handlers to use
		email, _ := token.Claims["email"].(string)
		role, _ := token.Claims["role"].(string)
		c.Set("user_id", email)
		c.Set("user_role", role)
		c.Next()
	}
}
