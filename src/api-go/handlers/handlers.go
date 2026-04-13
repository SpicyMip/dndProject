package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tu-usuario/dnd-api/models"
	"gorm.io/gorm"
)

var DB *gorm.DB

// --- Characters ---
func GetCharacters(c *gin.Context) {
	var chars []models.Character
	if err := DB.Preload("PersonalItems").Find(&chars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"characters": chars})
}

func UpdateCharacter(c *gin.Context) {
	id := c.Param("id")
	var updatedData map[string]interface{}
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := DB.Model(&models.Character{}).Where("id = ?", id).Updates(updatedData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": id})
}

func AddCharacterItem(c *gin.Context) {
	charID := c.Param("id")
	var item models.InventoryItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.ID = uuid.New().String()
	item.CharacterID = charID
	if err := DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func DeleteCharacterItem(c *gin.Context) {
	itemID := c.Param("itemId")
	if err := DB.Delete(&models.InventoryItem{}, "id = ?", itemID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "itemId": itemID})
}

// --- Shared Inventory ---
func GetSharedInventory(c *gin.Context) {
	var items []models.SharedItem
	if err := DB.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func AddSharedItem(c *gin.Context) {
	var item models.SharedItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	item.ID = uuid.New().String()
	if err := DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

// --- Lexicon ---
func GetLexicon(c *gin.Context) {
	var interpretations []models.Interpretation
	if err := DB.Find(&interpretations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"interpretations": interpretations})
}

func AddInterpretation(c *gin.Context) {
	var inter models.Interpretation
	if err := c.ShouldBindJSON(&inter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	inter.ID = uuid.New().String()
	inter.SymbolSequence = strings.ToUpper(inter.SymbolSequence)
	inter.DiscoveryDate = time.Now()
	if err := DB.Create(&inter).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, inter)
}

func UpdateInterpretation(c *gin.Context) {
	id := c.Param("id")
	var updatedData map[string]interface{}
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := DB.Model(&models.Interpretation{}).Where("id = ?", id).Updates(updatedData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": id})
}

func DeleteInterpretation(c *gin.Context) {
	id := c.Param("id")
	if err := DB.Delete(&models.Interpretation{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "id": id})
}

// --- Notices ---
func GetNotices(c *gin.Context) {
	var notices []models.Notice
	if err := DB.Find(&notices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"notices": notices})
}

func AddNotice(c *gin.Context) {
	var notice models.Notice
	if err := c.ShouldBindJSON(&notice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	notice.ID = uuid.New().String()
	if err := DB.Create(&notice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, notice)
}

func UpdateNotice(c *gin.Context) {
	id := c.Param("id")
	var updatedData map[string]interface{}
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := DB.Model(&models.Notice{}).Where("id = ?", id).Updates(updatedData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "updated", "id": id})
}

func DeleteNotice(c *gin.Context) {
	id := c.Param("id")
	if err := DB.Delete(&models.Notice{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted", "id": id})
}

// --- Bestiary ---
func GetBestiary(c *gin.Context) {
	var creatures []models.Creature
	if err := DB.Find(&creatures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"creatures": creatures})
}

func AddCreature(c *gin.Context) {
	var creature models.Creature
	if err := c.ShouldBindJSON(&creature); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	creature.ID = uuid.New().String()
	if err := DB.Create(&creature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, creature)
}

// --- Pantheon ---
func GetPantheon(c *gin.Context) {
	var greater []models.Deity
	var lesser []models.Deity
	DB.Where("type = ?", "greater").Find(&greater)
	DB.Where("type = ?", "lesser").Find(&lesser)
	c.JSON(http.StatusOK, gin.H{
		"greaterDeities": greater,
		"lesserIdols":    lesser,
	})
}

func AddDeity(c *gin.Context) {
	deityType := c.Param("type")
	var deity models.Deity
	if err := c.ShouldBindJSON(&deity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	deity.Type = deityType
	if err := DB.Create(&deity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, deity)
}

// --- Chronicles ---
func GetChronicles(c *gin.Context) {
	var arcs []models.StoryArc
	if err := DB.Preload("Sessions").Find(&arcs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"storyArcs": arcs})
}

func AddStoryArc(c *gin.Context) {
	var arc models.StoryArc
	if err := c.ShouldBindJSON(&arc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	arc.ID = uuid.New().String()
	if err := DB.Create(&arc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, arc)
}

func AddSession(c *gin.Context) {
	arcID := c.Param("arcId")
	var session models.Session
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	session.ID = uuid.New().String()
	session.StoryArcID = arcID
	if err := DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, session)
}
