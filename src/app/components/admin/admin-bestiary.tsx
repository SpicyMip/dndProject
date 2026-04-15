"use client"

import React, { useState, useEffect } from "react"
import { 
  Skull, 
  BookText, 
  Trash2, 
  Loader2,
  Eye,
  EyeOff,
  Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/language-context"

export function AdminBestiary() {
  const { t } = useTranslation()
  const [creatures, setCreatures] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const initialForm = { 
    name: "", imageUrl: "", type: "", alignment: "", ac: 10, hp: "", speed: "", 
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, 
    saves: "", skills: "", resistances: "", immunities: "", conditionImmunities: "", 
    senses: "", languages: "", cr: "1", xp: 200, description: "", 
    abilities: "[]", actions: "[]", legendaryActions: "[]", 
    isEncountered: false, 
    visibilitySettings: JSON.stringify({ stats: false, proficiencies: false, description: false, abilities: false, actions: false }) 
  }
  
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => { fetchCreatures() }, [])

  const fetchCreatures = () => {
    setLoading(true)
    apiFetch<{ creatures: any[] }>("/bestiary").then(data => setCreatures(data.creatures)).finally(() => setLoading(false))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiFetch(editingId ? `/bestiary/${editingId}` : "/bestiary", { method: editingId ? "PATCH" : "POST", body: JSON.stringify(formData) })
      .then(() => { toast.success(t("admin.done")); setEditingId(null); setFormData(initialForm); fetchCreatures() })
  }

  const deleteCreature = (id: string) => { if (confirm(t("admin.delete_confirm"))) apiFetch(`/bestiary/${id}`, { method: "DELETE" }).then(() => fetchCreatures()) }

  const toggleVisibility = (field: string) => {
    const settings = JSON.parse(formData.visibilitySettings)
    settings[field] = !settings[field]
    setFormData({ ...formData, visibilitySettings: JSON.stringify(settings) })
  }

  const getVisibility = (field: string) => { try { return JSON.parse(formData.visibilitySettings)[field] } catch { return false } }

  return (
    <div className="grid xl:grid-cols-5 gap-8">
      <Card className="xl:col-span-3 h-fit">
        <CardHeader><CardTitle className="font-serif">{editingId ? t("admin.edit") : t("admin.new")} {t("sidebar.bestiary")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 space-y-2"><Label>{t("admin.item_name")}</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="col-span-2 space-y-2"><Label>{t("admin.image_url")}</Label><Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
              <div className="space-y-2"><Label>{t("admin.type")}</Label><Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} /></div>
              <div className="space-y-2"><Label>{t("admin.alignment")}</Label><Input value={formData.alignment} onChange={e => setFormData({...formData, alignment: e.target.value})} /></div>
              <div className="space-y-2"><Label>{t("admin.ac")}</Label><Input type="number" value={formData.ac} onChange={e => setFormData({...formData, ac: parseInt(e.target.value)})} /></div>
              <div className="space-y-2"><Label>{t("admin.hp")}</Label><Input value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} /></div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-border">
              <div className="grid grid-cols-6 gap-2">
                {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => (
                  <div key={s} className="space-y-1">
                    <Label className="text-[10px] uppercase text-center block">{s}</Label>
                    <Input type="number" className="h-8 px-1 text-center" value={(formData as any)[s]} onChange={e => setFormData({...formData, [s]: parseInt(e.target.value)})} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant={formData.isEncountered ? "default" : "outline"} size="sm" onClick={() => setFormData({...formData, isEncountered: !formData.isEncountered})}>
                  {formData.isEncountered ? t("admin.encountered") : t("admin.hidden")}
                </Button>
                {['stats', 'proficiencies', 'description', 'abilities', 'actions'].map(f => (
                  <Button key={f} type="button" variant={getVisibility(f) ? "secondary" : "ghost"} size="sm" className="h-7 text-[10px] uppercase" onClick={() => toggleVisibility(f)}>
                    {getVisibility(f) ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />} {t(`admin.${f}`)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1"><Save className="mr-2 h-4 w-4" /> {t("common.save")}</Button>
              {editingId && <Button type="button" variant="ghost" onClick={() => {setEditingId(null); setFormData(initialForm)}}>{t("common.cancel")}</Button>}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="xl:col-span-2 overflow-hidden">
        <CardHeader><CardTitle className="font-serif">{t("admin.archive")}</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {creatures.map(c => (
                <div key={c.id} className={cn("p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors", !c.isEncountered && "opacity-50")}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center border border-border">
                      {c.imageUrl ? <img src={c.imageUrl} className="object-cover h-full w-full" /> : <Skull className="h-5 w-5 opacity-20" />}
                    </div>
                    <div><p className="font-serif font-bold text-sm leading-none">{c.name}</p><p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">{c.type}</p></div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {setEditingId(c.id); setFormData({...c, abilities: c.abilities || "[]", actions: c.actions || "[]", visibilitySettings: c.visibilitySettings || "{}"})}}><BookText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCreature(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
