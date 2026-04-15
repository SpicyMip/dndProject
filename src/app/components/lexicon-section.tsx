"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, BookText, HelpCircle, Save, Info, History } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { toast } from "sonner"
import { ArcaneText } from "@/components/arcane-text"

interface LexiconWord {
  id: string
  symbolSequence: string
  discoveryDate: string
}

interface LexiconEntry {
  wordId: string
  interpretation: string
  notes: string
}

export function LexiconSection() {
  const { t } = useTranslation()
  const [words, setWords] = useState<LexiconWord[]>([])
  const [entries, setEntries] = useState<Record<string, LexiconEntry>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWord, setSelectedWord] = useState<LexiconWord | null>(null)
  const [loading, setLoading] = useState(true)

  // Local form state
  const [currentInterpretation, setCurrentInterpretation] = useState("")
  const [currentNotes, setCurrentNotes] = useState("")

  useEffect(() => {
    Promise.all([
      apiFetch<{ words: LexiconWord[] }>("/lexicon/words"),
      apiFetch<{ entries: LexiconEntry[] }>("/lexicon/my-entries")
    ]).then(([wordsData, entriesData]) => {
      setWords(wordsData.words)
      const entryMap: Record<string, LexiconEntry> = {}
      entriesData.entries.forEach(e => { entryMap[e.wordId] = e })
      setEntries(entryMap)
      setLoading(false)
    })
  }, [])

  const handleSelectWord = (word: LexiconWord) => {
    setSelectedWord(word)
    setCurrentInterpretation(entries[word.id]?.interpretation || "")
    setCurrentNotes(entries[word.id]?.notes || "")
  }

  const saveEntry = () => {
    if (!selectedWord) return
    apiFetch("/lexicon/my-entries", {
      method: "POST",
      body: JSON.stringify({
        wordId: selectedWord.id,
        interpretation: currentInterpretation,
        notes: currentNotes
      })
    }).then(() => {
      setEntries({
        ...entries,
        [selectedWord.id]: { wordId: selectedWord.id, interpretation: currentInterpretation, notes: currentNotes }
      })
      toast.success("Interpretation archived")
    })
  }

  const filteredWords = words.filter(w => 
    w.symbolSequence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entries[w.id]?.interpretation?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            {t("lexicon.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("lexicon.subtitle")}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t("lexicon.search")} 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => (
          <Card 
            key={word.id} 
            className="cursor-pointer hover:border-primary/50 transition-all bg-secondary/10 group overflow-hidden relative"
            onClick={() => handleSelectWord(word)}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded bg-primary/10 border border-primary/20">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {new Date(word.discoveryDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-mono text-lg font-bold tracking-tighter text-primary mb-2">
                {word.symbolSequence}
              </h3>
              <p className="text-sm font-serif italic text-muted-foreground line-clamp-1 border-t border-border/50 pt-2">
                {entries[word.id]?.interpretation || t("lexicon.unknown")}
              </p>
            </CardContent>
            {entries[word.id]?.interpretation && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10px] right-[-35px] w-24 h-6 bg-primary/20 rotate-45 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary uppercase tracking-tighter">{t("lexicon.deciphered")}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selectedWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-background border border-primary/20 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">{t("lexicon.symbol_label")}</p>
                    <h2 className="text-4xl font-mono font-bold tracking-tighter text-primary">
                      <ArcaneText>{selectedWord.symbolSequence}</ArcaneText>
                    </h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedWord(null)}>{t("common.close")}</Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-primary" /> {t("lexicon.meaning_label")}
                    </Label>
                    <Input 
                      placeholder={t("lexicon.meaning_placeholder")} 
                      className="bg-primary/5 border-primary/20 text-lg font-serif italic"
                      value={currentInterpretation}
                      onChange={(e) => setCurrentInterpretation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold flex items-center gap-2">
                      <History className="h-3.5 w-3.5 text-primary" /> {t("lexicon.notes_label")}
                    </Label>
                    <Textarea 
                      placeholder={t("lexicon.notes_placeholder")} 
                      className="h-32 bg-primary/5 border-primary/20 resize-none font-serif"
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 font-serif text-base py-6" onClick={saveEntry}>
                    <Save className="mr-2 h-4 w-4" /> {t("lexicon.save")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
