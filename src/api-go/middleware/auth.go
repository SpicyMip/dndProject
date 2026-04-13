package middleware

import (
	"context"
	"net/http"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

func AuthMiddleware() gin.HandlerFunc {
	// Initialize Firebase App
	// In production, use FIREBASE_AUTH_KEY env var pointing to your JSON service account file
	opt := option.WithCredentialsFile("serviceAccountKey.json")
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

		// Store user ID (UID) in context for handlers to use
		c.Set("user_id", token.UID)
		c.Next()
	}
}
