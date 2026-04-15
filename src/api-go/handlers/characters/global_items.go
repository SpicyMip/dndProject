package characters

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

// GetGlobalItems returns items where character_id is NULL (The Library)
func GetGlobalItems(c *gin.Context) {
	var items []models.InventoryItem
	if err := handlers.DB.Where("character_id IS NULL").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

// CreateGlobalItem creates an item without an owner
func CreateGlobalItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only archives high council can forge items"})
		return
	}

	var item models.InventoryItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	item.CharacterID = nil // Explicitly ensure no owner
	if err := handlers.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// BestowItem clones a library item to a character OR moves it. 
func BestowItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can bestow items"})
		return
	}

	itemId := c.Param("itemId")
	
	var input struct {
		CharacterID int `json:"characterId"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Update the owner
	item.CharacterID = &input.CharacterID
	if err := handlers.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "bestowed", "itemId": itemId, "characterId": input.CharacterID})
}

// UnassignItem returns an item to the global vault
func UnassignItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can unassign items"})
		return
	}

	itemId := c.Param("itemId")
	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	item.CharacterID = nil
	item.IsEquipped = false
	if err := handlers.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "unassigned", "id": itemId})
}

// TransferItem moves an item from one character to another
func TransferItem(c *gin.Context) {
	role, _ := c.Get("user_role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can transfer items"})
		return
	}

	itemId := c.Param("itemId")
	var input struct {
		TargetCharacterID int `json:"characterId"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.InventoryItem
	if err := handlers.DB.Where("id = ?", itemId).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	item.CharacterID = &input.TargetCharacterID
	item.IsEquipped = false
	if err := handlers.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "transferred", "id": itemId, "to": input.TargetCharacterID})
}
