package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// BestowItem clones an item template to a character inventory. 
func BestowItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can bestow items"})
		return
	}

	templateId := c.Param("itemId")
	
	var input struct {
		CharacterID int `json:"characterId"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var template models.ItemTemplate
	if err := handlers.DB.First(&template, templateId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Template not found"})
		return
	}

	// Check for stacking (same character and same template)
	var existing models.InventoryItem
	err := handlers.DB.Where("character_id = ? AND template_id = ?", input.CharacterID, template.ID).First(&existing).Error

	if err == nil {
		// Stack!
		handlers.DB.Model(&existing).Update("quantity", existing.Quantity+1)
		handlers.DB.Preload("Template").First(&existing, existing.ID)
		c.JSON(http.StatusOK, gin.H{"status": "stacked", "id": existing.ID, "item": existing})
	} else {
		// Create new instance
		newItem := models.InventoryItem{
			CharacterID: &input.CharacterID,
			TemplateID:  template.ID,
			Quantity:    1,
			Charges:     template.Charges,
		}
		if err := handlers.DB.Create(&newItem).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		handlers.DB.Preload("Template").First(&newItem, newItem.ID)
		c.JSON(http.StatusCreated, gin.H{"status": "bestowed", "id": newItem.ID, "item": newItem})
	}
}
