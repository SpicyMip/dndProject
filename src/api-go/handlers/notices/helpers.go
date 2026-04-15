package notices

import (
	"regexp"
	"strings"
	"time"

	"github.com/spicymip/codex-arcanum/handlers"
	"github.com/spicymip/codex-arcanum/models"
)

func EnsureLexiconWords(content string) {
	re := regexp.MustCompile(`(?i)<lexicon>(.*?)</lexicon/?>`)
	matches := re.FindAllStringSubmatch(content, -1)
	
	for _, match := range matches {
		if len(match) > 1 {
			symbol := strings.ToUpper(strings.TrimSpace(match[1]))
			var word models.LexiconWord
			result := handlers.DB.Where("symbol_sequence = ?", symbol).First(&word)
			if result.Error != nil {
				// No existe, la creamos
				newWord := models.LexiconWord{
					SymbolSequence: symbol,
					DMNotes:        "Auto-discovered from Notice Board",
					DiscoveryDate:  time.Now(),
				}
				handlers.DB.Create(&newWord)
			}
		}
	}
}
