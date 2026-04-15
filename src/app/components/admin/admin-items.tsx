"use client"

import React, { useState, useEffect } from "react"
import { 
  Package, 
  Plus, 
  Trash2, 
  Loader2,
  Save,
  Sword,
  Shield,
  FlaskConical,
  Wrench,
  Sparkles,
  Box,
  User as UserIcon,
  Check,
  HardHat,
  Gem,
  Pencil,
  X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, any> = {
  Weapon: Sword,
  Shield: Shield,
  Armor: Shield,
  Headwear: HardHat,
  Trinket: Gem,
  Consumable: FlaskConical,
  Tool: Wrench,
  "Magic Item": Sparkles,
  Misc: Box,
}

const rarityColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  "Very Rare": "text-purple-400",
  Legendary: "text-amber-400",
}

export function AdminItems() {
  const { t } = useTranslation()
  const [characters, setCharacters] = useState<any[]>([])
  const [library, setLibrary] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [bestowCharId, setBestowCharId] = useState<number | "">("")
  const [transferCharId, setTransferCharId] = useState<number | "">("")
  const [transferringItemId, setTransferringItemId] = useState<number | null>(null)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  
  const initialForm = { 
    name: "", 
    description: "", 
    quantity: 1, 
    category: "Misc", 
    rarity: "Common", 
    isEquippable: false, 
    isUsable: false, 
    weight: 0, 
    properties: "",
    damage: "",
    damageType: "",
    acBonus: 0,
    requirements: "",
    charges: 0,
    specialActions: "[]"
  }
  
  const [formData, setFormData] = useState(initialForm)
  const [specialActionsArr, setSpecialActionsArr] = useState<{name: string, desc: string}[]>([])

  useEffect(() => { 
    fetchCharacters()
    fetchLibrary()
  }, [])

  const fetchCharacters = () => {
    setLoading(true)
    apiFetch<{ characters: any[] }>("/characters")
      .then(data => setCharacters(data.characters))
      .finally(() => setLoading(false))
  }

  const fetchLibrary = () => {
    apiFetch<{ items: any[] }>("/characters/library")
      .then(data => setLibrary(data.items || []))
  }

  const addSpecialAction = () => {
    setSpecialActionsArr([...specialActionsArr, { name: "", desc: "" }])
  }

  const updateSpecialAction = (index: number, field: string, value: string) => {
    const newArr = [...specialActionsArr]
    newArr[index] = { ...newArr[index], [field]: value }
    setSpecialActionsArr(newArr)
  }

  const removeSpecialAction = (index: number) => {
    setSpecialActionsArr(specialActionsArr.filter((_, i) => i !== index))
  }

  const startEdit = (item: any) => {
    setEditingItemId(item.id)
    setFormData({
      name: item.name || "",
      description: item.description || "",
      quantity: item.quantity || 1,
      category: item.category || "Misc",
      rarity: item.rarity || "Common",
      isEquippable: item.isEquippable || false,
      isUsable: item.isUsable || false,
      weight: item.weight || 0,
      properties: item.properties || "",
      damage: item.damage || "",
      damageType: item.damageType || "",
      acBonus: item.acBonus || 0,
      requirements: item.requirements || "",
      charges: item.charges || 0,
      specialActions: item.specialActions || "[]"
    })
    try {
      setSpecialActionsArr(JSON.parse(item.specialActions || "[]"))
    } catch {
      setSpecialActionsArr([])
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingItemId(null)
    setFormData(initialForm)
    setSpecialActionsArr([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      specialActions: JSON.stringify(specialActionsArr)
    }

    const url = editingItemId ? `/characters/items/${editingItemId}` : "/characters/global"
    const method = editingItemId ? "PATCH" : "POST"

    apiFetch(url, { 
      method, 
      body: JSON.stringify(payload) 
    })
      .then(() => { 
        toast.success(editingItemId ? t("profile.updated") : t("admin.item_forged"))
        cancelEdit()
        fetchLibrary()
        fetchCharacters()
      })
  }

  const bestowItem = (itemId: number) => {
    if (!bestowCharId) {
      toast.error(t("admin.select_legend_error"))
      return
    }

    apiFetch(`/characters/items/${itemId}/bestow`, {
      method: "POST",
      body: JSON.stringify({ characterId: bestowCharId })
    }).then(() => {
      toast.success(t("admin.item_bestowed"))
      fetchLibrary()
      fetchCharacters()
    })
  }

  const unassignItem = (itemId: number) => {
    if (!confirm(t("admin.unassign_confirm"))) return
    apiFetch(`/characters/items/${itemId}/unassign`, { method: "POST" })
      .then(() => {
        toast.success(t("admin.item_unassigned"))
        fetchLibrary()
        fetchCharacters()
      })
  }

  const transferItem = (itemId: number) => {
    if (!transferCharId) return
    apiFetch(`/characters/items/${itemId}/transfer`, { 
      method: "POST", 
      body: JSON.stringify({ characterId: transferCharId }) 
    }).then(() => {
      const charName = characters.find(c => c.id === transferCharId)?.name || "Legend"
      toast.success(t("admin.item_transferred", { name: charName }))
      setTransferringItemId(null)
      setTransferCharId("")
      fetchLibrary()
      fetchCharacters()
    })
  }

  const deleteItem = (itemId: number) => {
    if (!confirm(t("admin.destroy_item_confirm"))) return
    apiFetch(`/characters/items/${itemId}`, { method: "DELETE" })
      .then(() => {
        toast.success(t("admin.item_erased"))
        fetchLibrary()
        fetchCharacters()
      })
  }

  return (
    <div className="grid xl:grid-cols-6 gap-8">
      {/* 1. Forging Area */}
      <Card className="xl:col-span-2 h-fit">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> {editingItemId ? t("admin.edit") : t("admin.item_forge")}
          </CardTitle>
          <CardDescription>{t("admin.forge_subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("admin.item_name")}</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("admin.item_category")}</Label>
                <select className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-sm text-foreground" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{t(`admin.categories.${cat}`)}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.item_rarity")}</Label>
                <select className="w-full bg-black/60 border border-primary/10 rounded-md p-2 text-sm text-foreground" value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}>
                  {Object.keys(rarityColors).map(r => <option key={r} value={r}>{t(`admin.rarities.${r}`)}</option>)}
                </select>
              </div>
            </div>

            {/* Dynamic Technical Fields */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-secondary/10 rounded-lg border border-border">
              {formData.category === "Weapon" && (
                <>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase opacity-70">{t("party.damage")}</Label>
                    <Input value={formData.damage} onChange={e => setFormData({...formData, damage: e.target.value})} placeholder={t("admin.damage_placeholder")} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase opacity-70">{t("party.damage_type")}</Label>
                    <Input value={formData.damageType} onChange={e => setFormData({...formData, damageType: e.target.value})} placeholder={t("admin.damage_type_placeholder")} className="h-8 text-xs" />
                  </div>
                </>
              )}
              {formData.category === "Armor" && (
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase opacity-70">{t("party.ac_bonus")}</Label>
                  <Input type="number" value={formData.acBonus} onChange={e => setFormData({...formData, acBonus: parseInt(e.target.value) || 0})} className="h-8 text-xs" />
                </div>
              )}
              {(formData.category === "Consumable" || formData.category === "Magic Item") && (
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase opacity-70">{t("party.charges")}</Label>
                  <Input type="number" value={formData.charges} onChange={e => setFormData({...formData, charges: parseInt(e.target.value) || 0})} className="h-8 text-xs" />
                </div>
              )}
              <div className="space-y-1 col-span-2">
                <Label className="text-[10px] uppercase opacity-70">{t("party.requirements")}</Label>
                <Input value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder={t("admin.requirements_placeholder")} className="h-8 text-xs" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("admin.item_properties")}</Label>
              <Input value={formData.properties} onChange={e => setFormData({...formData, properties: e.target.value})} placeholder={t("admin.properties_placeholder")} />
            </div>

            {/* Special Actions Constructor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-serif">{t("party.special_actions")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpecialAction} className="h-6 text-[10px]">
                  <Plus className="mr-1 h-3 w-3" /> {t("admin.add_action")}
                </Button>
              </div>
              <div className="space-y-2">
                {specialActionsArr.map((action, idx) => (
                  <div key={idx} className="p-2 border rounded bg-black/20 relative group">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecialAction(idx)} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <X className="h-3 w-3" />
                    </Button>
                    <Input 
                      value={action.name} 
                      onChange={e => updateSpecialAction(idx, "name", e.target.value)} 
                      placeholder={t("admin.action_name")}
                      className="h-7 text-xs mb-1 bg-transparent border-none focus-visible:ring-0 font-bold"
                    />
                    <Textarea 
                      value={action.desc} 
                      onChange={e => updateSpecialAction(idx, "desc", e.target.value)} 
                      placeholder={t("admin.action_desc")}
                      className="h-16 text-[10px] bg-transparent border-none focus-visible:ring-0 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isEquippable} onChange={e => setFormData({...formData, isEquippable: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-[10px] uppercase font-bold opacity-70">{t("admin.item_equippable")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isUsable} onChange={e => setFormData({...formData, isUsable: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-[10px] uppercase font-bold opacity-70">{t("admin.item_usable")}</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-12 gap-2 font-serif text-lg">
                <Save className="h-5 w-5" /> {editingItemId ? t("common.save") : t("admin.item_forge")}
              </Button>
              {editingItemId && (
                <Button type="button" variant="ghost" onClick={cancelEdit} className="h-12 uppercase text-xs">
                  {t("common.cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Global Library / Bestowing */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2 text-amber-500">
            <Sparkles className="h-5 w-5" /> {t("admin.vault_title")}
          </CardTitle>
          <CardDescription>{t("admin.vault_subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
            <Label className="text-[10px] uppercase font-bold text-primary/70">{t("admin.recipient_label")}</Label>
            <select className="w-full bg-black/60 border border-primary/20 rounded-md p-2 text-xs text-foreground" value={bestowCharId} onChange={e => setBestowCharId(e.target.value ? parseInt(e.target.value) : "")}>
              <option value="">{t("admin.select_recipient")}</option>
              {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 arcane-scrollbar">
            {library.length === 0 ? (
              <p className="text-center py-12 text-xs text-muted-foreground italic opacity-30">The vault is silent.</p>
            ) : library.map(item => {
              const Icon = categoryIcons[item.category] || Box
              return (
                <div key={item.id} className="p-2 bg-secondary/10 rounded-md border border-white/5 flex items-center justify-between group hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-black/40 text-primary/60"><Icon className="h-3.5 w-3.5" /></div>
                    <div>
                      <p className={cn("text-xs font-medium", rarityColors[item.rarity])}>{item.name}</p>
                      <p className="text-[9px] text-muted-foreground opacity-50">{t(`admin.categories.${item.category}`)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary hover:bg-primary/20" onClick={() => bestowItem(item.id)} title="Bestow">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => startEdit(item)} title={t("common.edit")}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Current Possession */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="font-serif text-sm">{t("admin.possession_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 arcane-scrollbar">
            {characters.map(char => (
              <div key={char.id} className="space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                  <UserIcon className="h-3.5 w-3.5 text-primary/40" />
                  <h5 className="font-serif font-bold text-[11px] uppercase tracking-wider">{char.name}</h5>
                </div>
                <div className="grid gap-1">
                  {char.personalItems?.length === 0 ? (
                    <p className="text-[9px] text-muted-foreground italic pl-5 opacity-30">{t("admin.possession_empty")}</p>
                  ) : char.personalItems.map((item: any) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between p-1.5 hover:bg-secondary/10 rounded transition-colors group">
                        <span className={cn("text-[10px] truncate max-w-[120px]", rarityColors[item.rarity])}>{item.name}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-primary" onClick={() => setTransferringItemId(transferringItemId === item.id ? null : item.id)} title={t("admin.transfer")}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-amber-500" onClick={() => unassignItem(item.id)} title={t("admin.unassign")}>
                            <Box className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => deleteItem(item.id)} title={t("common.delete")}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {transferringItemId === item.id && (
                        <div className="p-2 bg-secondary/20 rounded border border-primary/20 flex gap-1 animate-in slide-in-from-top-1">
                          <select className="flex-1 bg-black/40 border border-primary/10 rounded px-1 text-[10px]" value={transferCharId} onChange={e => setTransferCharId(e.target.value ? parseInt(e.target.value) : "")}>
                            <option value="">{t("admin.select_recipient")}</option>
                            {characters.filter(c => c.id !== char.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <Button size="sm" className="h-6 px-2 text-[10px]" onClick={() => transferItem(item.id)} disabled={!transferCharId}>
                            {t("common.confirm")}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
