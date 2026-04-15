"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  Plus, 
  Trash2, 
  Save, 
  Shield, 
  Heart, 
  Zap, 
  User as UserIcon,
  Loader2,
  Pencil,
  X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const RACES = {
  "Human": { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
  "Elf": { dex: 2, wis: 1 },
  "Dwarf": { con: 2, str: 1 },
  "Halfling": { dex: 2, cha: 1 },
  "Dragonborn": { str: 2, cha: 1 },
  "Gnome": { int: 2, con: 1 },
  "Half-Elf": { cha: 2, dex: 1, int: 1 },
  "Half-Orc": { str: 2, con: 1 },
  "Tiefling": { cha: 2, int: 1 }
}

const CLASSES = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"]
const ALIGNMENTS = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"]

const calculateModifier = (score: number) => Math.floor((score - 10) / 2)

export function MyCharactersSection() {
  const { t } = useTranslation()
  const [characters, setChars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Guardamos las estadísticas BASE (sin bonos) en el estado del formulario
  const initialForm = {
    name: "", race: "Human", class: "Fighter", background: "", alignment: "True Neutral",
    level: 1, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
    maxHp: 10
  }
  const [formData, setFormData] = useState(initialForm)

  const racialBonus = useMemo(() => (RACES as any)[formData.race] || {}, [formData.race])

  // Estadísticas totales (Base + Bonus) para mostrar y guardar
  const totalStats = useMemo(() => {
    return {
      str: formData.str + (racialBonus.str || 0),
      dex: formData.dex + (racialBonus.dex || 0),
      con: formData.con + (racialBonus.con || 0),
      int: formData.int + (racialBonus.int || 0),
      wis: formData.wis + (racialBonus.wis || 0),
      cha: formData.cha + (racialBonus.cha || 0),
    }
  }, [formData, racialBonus])

  useEffect(() => { fetchMyChars() }, [])

  const fetchMyChars = () => {
    setLoading(true)
    apiFetch<{ characters: any[] }>("/characters/me")
      .then(data => setChars(data.characters))
      .finally(() => setLoading(false))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? "PATCH" : "POST"
    const url = editingId ? `/characters/${editingId}` : "/characters"
    
    // Enviamos las estadísticas TOTALES al servidor
    const payload = {
      ...formData,
      ...totalStats,
      isActive: true // Asegurar que se mantenga activo al editar
    }

    try {
      await apiFetch(url, { method, body: JSON.stringify(payload) })
      toast.success(editingId ? t("profile.updated") : t("profile.enshrined"))
      cancelEdit()
      fetchMyChars()
    } catch (err: any) { 
      toast.error(err.message || t("profile.save_failed")) 
    }
  }

  const startEdit = (char: any) => {
    const raceBonuses = (RACES as any)[char.race] || {}
    // Para editar, restamos los bonos de la raza actual para obtener la BASE
    setFormData({
      name: char.name, race: char.race, class: char.class, background: char.background, alignment: char.alignment,
      level: char.level, 
      str: char.str - (raceBonuses.str || 0), 
      dex: char.dex - (raceBonuses.dex || 0), 
      con: char.con - (raceBonuses.con || 0), 
      int: char.int - (raceBonuses.int || 0), 
      wis: char.wis - (raceBonuses.wis || 0), 
      cha: char.cha - (raceBonuses.cha || 0),
      maxHp: char.maxHp
    })
    setEditingId(char.id)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData(initialForm)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("profile.delete_confirm"))) return
    try {
      await apiFetch(`/characters/${id}`, { method: "DELETE" })
      toast.success(t("profile.archived"))
      fetchMyChars()
    } catch { toast.error(t("profile.archive_failed")) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <UserIcon className="h-8 w-8 text-primary" /> {t("profile.title")}
          </h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">{t("profile.subtitle")}</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="h-4 w-4" /> {t("profile.new_character")}
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="max-w-4xl mx-auto border-primary/20 bg-black/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">{editingId ? t("profile.edit_title") : t("profile.create_title")}</CardTitle>
              <CardDescription>{t("profile.ruleset")}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("profile.full_name")}</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-white/5 border-primary/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("profile.race")}</Label>
                      <select className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-sm text-foreground" value={formData.race} onChange={e => setFormData({...formData, race: e.target.value})}>
                        {Object.keys(RACES).map(r => <option key={r} value={r}>{t(`profile.races.${r}`)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("profile.class")}</Label>
                      <select className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-sm text-foreground" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                        {CLASSES.map(c => <option key={c} value={c}>{t(`profile.classes.${c}`)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("profile.level")}</Label>
                      <Input 
                        type="number" 
                        value={formData.level} 
                        onChange={e => setFormData({...formData, level: Math.max(1, Math.min(20, parseInt(e.target.value) || 1))})} 
                        className="bg-white/5 border-primary/10" 
                        min={1} 
                        max={20} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("profile.alignment")}</Label>
                      <select className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-sm text-foreground" value={formData.alignment} onChange={e => setFormData({...formData, alignment: e.target.value})}>
                        {ALIGNMENTS.map(a => <option key={a} value={a}>{t(`profile.alignments.${a}`)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>{t("profile.background")}</Label><Input value={formData.background} onChange={e => setFormData({...formData, background: e.target.value})} className="bg-white/5 border-primary/10" /></div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none"><Zap className="h-20 w-20" /></div>
                <h4 className="text-xs font-mono uppercase mb-4 text-primary tracking-widest font-bold flex items-center gap-2">
                  {t("profile.ability_scores")} 
                  <span className="text-[10px] font-normal text-muted-foreground">{t("profile.ability_help")}</span>
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => {
                    const bonus = racialBonus[stat] || 0
                    const total = (totalStats as any)[stat]
                    return (
                      <div key={stat} className="flex flex-col items-center gap-2 p-3 bg-black/40 rounded-lg border border-white/5">
                        <Label className="uppercase text-[10px] font-bold">{stat}</Label>
                        <Input 
                          type="number" 
                          value={(formData as any)[stat]} 
                          onChange={e => setFormData({...formData, [stat]: Math.max(3, parseInt(e.target.value) || 0)})}
                          className="h-8 w-full text-center text-lg font-bold bg-transparent border-none p-0 focus-visible:ring-0"
                        />
                        <div className="flex flex-col items-center border-t border-white/10 w-full pt-1">
                          <span className="text-xl font-serif text-primary font-bold">{total}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono opacity-60">{t("profile.modifier")} {calculateModifier(total) >= 0 ? "+" : ""}{calculateModifier(total)}</span>
                            {bonus > 0 && <span className="text-[9px] text-green-400"> (+{bonus})</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-2 text-xs"><Heart className="h-3 w-3 text-red-500" /> {t("profile.max_hp")}</Label><Input type="number" value={formData.maxHp} onChange={e => setFormData({...formData, maxHp: parseInt(e.target.value)})} /></div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 h-12 font-serif text-lg gap-2">
                  <Save className="h-5 w-5" /> {editingId ? t("profile.save_update") : t("profile.save_create")}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit} className="h-12 px-6">{t("common.cancel")}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" /></div>
          ) : characters.length === 0 ? (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-white/5 rounded-2xl opacity-30">
              <p className="font-serif italic">{t("profile.empty")}</p>
            </div>
          ) : characters.map(c => (
            <Card key={c.id} className="group overflow-hidden border-white/5 bg-secondary/5 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif text-xl">{c.name}</CardTitle>
                    <CardDescription className="font-mono text-[10px] uppercase text-primary/60">{c.race} // {c.class}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={() => startEdit(c)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 py-4 border-y border-white/5 my-2">
                  <div className="flex-1 text-center border-r border-white/5">
                    <p className="text-[8px] uppercase text-muted-foreground">HP</p>
                    <p className="font-bold text-lg text-red-500">{c.maxHp}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[8px] uppercase text-muted-foreground">LVL</p>
                    <p className="font-bold text-lg text-primary">{c.level}</p>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1 mt-4">
                  {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => {
                    const val = (c as any)[s] || 10
                    const mod = calculateModifier(val)
                    return (
                      <div key={s} className="text-center">
                        <p className="text-[7px] uppercase opacity-40">{s}</p>
                        <p className="text-[10px] font-mono font-bold">{mod >= 0 ? "+" : ""}{mod}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
