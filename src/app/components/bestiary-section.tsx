"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Skull, Search, Info, Shield, Heart, Zap, MessageSquare, Save, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface Creature {
  id: string
  name: string
  imageUrl: string
  type: string
  alignment: string
  ac: number
  hp: string
  speed: string
  str: number; dex: number; con: number; int: number; wis: number; cha: number
  saves: string
  skills: string
  resistances: string
  immunities: string
  conditionImmunities: string
  senses: string
  languages: string
  cr: string
  xp: number
  description: string
  abilities: string
  actions: string
  legendaryActions: string
  isEncountered: boolean
  visibilitySettings: string
}

export function BestiarySection() {
  const { t } = useTranslation()
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCreature, setSelectedNotice] = useState<Creature | null>(null)
  const [playerNote, setPlayerNote] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ creatures: Creature[] }>("/bestiary")
      .then((data) => {
        setCreatures(data.creatures.filter(c => c.isEncountered))
        setLoading(false)
      })
  }, [])

  const fetchNote = (creatureId: string) => {
    apiFetch<{ notes: any[] }>(`/bestiary/${creatureId}/notes`)
      .then(data => {
        if (data.notes && data.notes.length > 0) setPlayerNote(data.notes[0].content)
        else setPlayerNote("")
      })
  }

  const saveNote = () => {
    if (!selectedCreature) return
    apiFetch(`/bestiary/${selectedCreature.id}/notes`, {
      method: "POST",
      body: JSON.stringify({ content: playerNote })
    }).then(() => toast.success(t("bestiary.note_saved")))
  }

  const filteredCreatures = creatures.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getVisible = (creature: Creature, field: string) => {
    try {
      const settings = JSON.parse(creature.visibilitySettings)
      return settings[field] === true
    } catch { return false }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
            <Skull className="h-6 w-6 text-primary" />
            {t("bestiary.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("bestiary.subtitle")}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("bestiary.search")}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreatures.map((creature) => (
          <Card 
            key={creature.id} 
            className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
            onClick={() => {
              setSelectedNotice(creature)
              fetchNote(creature.id)
            }}
          >
            <div className="aspect-video relative overflow-hidden bg-secondary">
              {creature.imageUrl ? (
                <img src={creature.imageUrl} alt={creature.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full opacity-20"><Skull className="h-12 w-12" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="font-serif text-lg font-bold text-white">{creature.name}</h3>
                <p className="text-[10px] font-mono text-white/60 uppercase">{creature.type}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {selectedCreature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left Side: Image & Meta */}
              <div className="w-full md:w-1/3 bg-secondary/30 p-6 flex flex-col border-b md:border-b-0 md:border-r">
                <div className="aspect-square rounded-lg overflow-hidden border border-border mb-4 bg-black">
                  {selectedCreature.imageUrl ? <img src={selectedCreature.imageUrl} className="object-cover w-full h-full" /> : <Skull className="m-auto h-12 w-12 opacity-10" />}
                </div>
                <h2 className="font-serif text-2xl font-bold">{selectedCreature.name}</h2>
                <p className="text-xs text-muted-foreground italic mb-4">{selectedCreature.type}, {selectedCreature.alignment}</p>
                
                <div className="space-y-4 mt-auto">
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                    <Label className="text-[10px] uppercase font-bold text-primary flex items-center gap-1 mb-2">
                      <MessageSquare className="h-3 w-3" /> {t("bestiary.notes_label")}
                    </Label>
                    <Textarea 
                      placeholder={t("bestiary.notes_placeholder")} 
                      className="text-xs bg-transparent border-none resize-none p-0 focus-visible:ring-0"
                      value={playerNote}
                      onChange={(e) => setPlayerNote(e.target.value)}
                    />
                    <Button size="sm" variant="ghost" className="w-full h-7 mt-2 text-[10px]" onClick={saveNote}>
                      <Save className="mr-1 h-3 w-3" /> {t("bestiary.notes_save")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Side: Stats (Conditional) */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {getVisible(selectedCreature, 'stats') ? (
                      <>
                        <div className="text-center"><p className="text-[10px] uppercase text-muted-foreground">AC</p><p className="font-serif font-bold text-xl">{selectedCreature.ac}</p></div>
                        <div className="text-center"><p className="text-[10px] uppercase text-muted-foreground">HP</p><p className="font-serif font-bold text-xl text-red-500">{selectedCreature.hp}</p></div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground opacity-30"><EyeOff className="h-4 w-4" /><span className="text-xs italic uppercase">{t("bestiary.stats_hidden")}</span></div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedNotice(null)}>{t("common.close")}</Button>
                </div>

                {getVisible(selectedCreature, 'stats') && (
                  <div className="grid grid-cols-6 gap-2 py-4 border-y">
                    {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => (
                      <div key={s} className="text-center">
                        <p className="text-[10px] uppercase font-bold text-primary">{(selectedCreature as any)[s]}</p>
                        <p className="text-[8px] uppercase text-muted-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                )}

                {getVisible(selectedCreature, 'description') && (
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold border-b border-primary/20 pb-1">{t("bestiary.description")}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">{selectedCreature.description}</p>
                  </div>
                )}

                {getVisible(selectedCreature, 'actions') && selectedCreature.actions !== "[]" && (
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold border-b border-red-900/20 pb-1 text-red-500 uppercase text-xs tracking-widest">{t("bestiary.actions")}</h4>
                    {JSON.parse(selectedCreature.actions).map((a: any, i: number) => (
                      <div key={i} className="text-sm"><span className="font-bold italic">{a.name}.</span> {a.desc}</div>
                    ))}
                  </div>
                )}

                {!getVisible(selectedCreature, 'description') && !getVisible(selectedCreature, 'actions') && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-20">
                    <Info className="h-12 w-12 mb-2" />
                    <p className="text-sm font-serif">{t("bestiary.unknown_info")}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
