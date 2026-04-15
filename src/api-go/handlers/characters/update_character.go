package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func UpdateCharacter(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("user_id")
	userRole := c.GetString("user_role") // Assuming we have role in context, or check claims

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Security: Do not allow updating ID or OwnerID via this endpoint
	delete(updates, "id")
	delete(updates, "ownerId")
	delete(updates, "owner_id")

	// Verify ownership unless admin
	var char models.Character
	if err := handlers.DB.Where("id = ?", id).First(&char).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Character not found"})
		return
	}

	if char.OwnerID != userID && userRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to modify this character"})
		return
	}

	// Enforce HP constraints: currentHp <= maxHp
	newCurrentHP, hasCurrent := updates["currentHp"].(float64)
	newMaxHP, hasMax := updates["maxHp"].(float64)

	// If maxHp is being updated, ensure existing current doesn't exceed it
	if hasMax {
		if hasCurrent {
			if newCurrentHP > newMaxHP {
				updates["currentHp"] = int(newMaxHP)
			}
		} else {
			if float64(char.CurrentHP) > newMaxHP {
				updates["currentHp"] = int(newMaxHP)
			}
		}
	} else if hasCurrent {
		// Only current is being updated, check against existing max
		if newCurrentHP > float64(char.MaxHP) {
			updates["currentHp"] = char.MaxHP
		}
	}

	if err := handlers.DB.Model(&char).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": id})
}
