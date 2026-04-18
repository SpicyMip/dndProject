package characters

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

type ActionEffect struct {
	Name      string `json:"name"`
	Type      string `json:"type"` // "healing", "damage", "buff"
	DiceNum   int    `json:"diceNum"`
	DiceSides int    `json:"diceSides"`
	Bonus     int    `json:"bonus"`
}

func UseItem(c *gin.Context) {
	itemId := c.Param("itemId")
	manual := c.Query("manual") == "true"
	resultStr := c.Query("result")

	var item models.InventoryItem
	// Preload the Template because that's where the effects are
	if err := handlers.DB.Preload("Template").First(&item, itemId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.CharacterID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This is a template, cannot be used directly"})
		return
	}

	var char models.Character
	if err := handlers.DB.First(&char, *item.CharacterID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Character not found"})
		return
	}

	// Parse effects from the TEMPLATE
	var effects []ActionEffect
	var healingEffect *ActionEffect
	if item.Template.SpecialActions != "" && item.Template.SpecialActions != "[]" {
		json.Unmarshal([]byte(item.Template.SpecialActions), &effects)
		for _, e := range effects {
			if e.Type == "healing" {
				healingEffect = &e
				break
			}
		}
	}

	appliedAmount := 0

	// Logic for application/validation
	if manual {
		if healingEffect != nil {
			result, err := strconv.Atoi(resultStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid manual result"})
				return
			}
			// Validate range
			minVal := healingEffect.DiceNum + healingEffect.Bonus
			maxVal := (healingEffect.DiceNum * healingEffect.DiceSides) + healingEffect.Bonus
			if result < minVal || result > maxVal {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": fmt.Sprintf("Result out of range (%d - %d)", minVal, maxVal),
					"min":   minVal,
					"max":   maxVal,
				})
				return
			}
			appliedAmount = result
		}
	} else {
		// Automatic roll
		if healingEffect != nil {
			appliedAmount = rollDice(healingEffect.DiceNum, healingEffect.DiceSides, healingEffect.Bonus)
		}
	}

	// Logic for consumption (ONLY if everything is valid)
	if item.Charges > 0 {
		handlers.DB.Model(&item).Update("charges", item.Charges-1)
	} else if item.Template.Category == "Consumable" {
		if item.Quantity <= 1 {
			handlers.DB.Delete(&item)
		} else {
			handlers.DB.Model(&item).Update("quantity", item.Quantity-1)
		}
	} else if !item.Template.IsUsable {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item is not usable"})
		return
	}

	// Apply HP update
	if appliedAmount > 0 {
		newHP := char.CurrentHP + appliedAmount
		if newHP > char.MaxHP {
			newHP = char.MaxHP
		}
		handlers.DB.Model(&char).Update("current_hp", newHP)
		char.CurrentHP = newHP
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Item used successfully",
		"character": char,
		"item":      item,
		"rolled":    appliedAmount,
		"manual":    manual,
	})
}

func rollDice(num, sides, bonus int) int {
	rand.Seed(time.Now().UnixNano())
	total := bonus
	for i := 0; i < num; i++ {
		total += rand.Intn(sides) + 1
	}
	return total
}
