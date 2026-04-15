"use client"

import React, { useState, useEffect } from "react"
import { 
  Trash2, 
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { useTranslation } from "@/lib/language-context"

export function AdminLexicon() {
  const { t } = useTranslation()
  const [words, setWords] = useState<any[]>([])
  const [formData, setFormData] = useState({ symbolSequence: "", dmNotes: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchWords() }, [])

  const fetchWords = () => {
    setLoading(true)
    apiFetch<{ words: any[] }>("/lexicon/words").then(data => setWords(data.words)).finally(() => setLoading(false))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiFetch("/lexicon/words", { method: "POST", body: JSON.stringify(formData) })
      .then(() => { toast.success(t("admin.symbols_added")); setFormData({ symbolSequence: "", dmNotes: "" }); fetchWords() })
  }

  const deleteWord = (id: string) => {
    if (!confirm(t("admin.delete_symbols_confirm"))) return
    apiFetch(`/lexicon/words/${id}`, { method: "DELETE" }).then(() => fetchWords())
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="md:col-span-1 h-fit">
        <CardHeader><CardTitle className="font-serif">{t("admin.discover_symbols")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("lexicon.symbol_label")}</Label>
              <Input value={formData.symbolSequence} onChange={e => setFormData({...formData, symbolSequence: e.target.value})} placeholder="ELDER-GATE-7" required />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.secret_dm_notes")}</Label>
              <Textarea value={formData.dmNotes} onChange={e => setFormData({...formData, dmNotes: e.target.value})} placeholder={t("admin.dm_notes")} />
            </div>
            <Button type="submit" className="w-full">{t("admin.reveal_to_players")}</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="font-serif">{t("admin.revealed_lexicon")}</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-2">
              {words.map(w => (
                <div key={w.id} className="p-3 rounded-lg border bg-secondary/20 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-primary tracking-tighter">{w.symbolSequence}</p>
                    {w.dmNotes && <p className="text-[10px] text-muted-foreground italic mt-1">{w.dmNotes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteWord(w.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
