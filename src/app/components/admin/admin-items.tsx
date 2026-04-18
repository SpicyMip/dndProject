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

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"

export function AdminItems() {
  const { t } = useTranslation()
  const [characters, setCharacters] = useState<any[]>([])
  const [library, setLibrary] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [bestowCharId, setBestowCharId] = useState<number | "">("")
  const [transferCharId, setTransferCharId] = useState<number | "">("")
  const [transferringItemId, setTransferringItemId] = useState<number | null>(null)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [filterCategory, setFilterCategory] = useState("All")
  
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
  const [specialActionsArr, setSpecialActionsArr] = useState<{name: string, desc: string, type: string, diceNum: number, diceSides: number, bonus: number}[]>([])

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
    setSpecialActionsArr([...specialActionsArr, { name: "", desc: "", type: "none", diceNum: 1, diceSides: 4, bonus: 0 }])
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
      const parsed = JSON.parse(item.specialActions || "[]")
      setSpecialActionsArr(parsed.map((a: any) => ({
        name: a.name || "",
        desc: a.desc || "",
        type: a.type || "none",
        diceNum: a.diceNum || 1,
        diceSides: a.diceSides || 4,
        bonus: a.bonus || 0
      })))
    } catch {
      setSpecialActionsArr([])
    }
    setActiveTab("general")
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

  const filteredLibrary = filterCategory === "All" 
    ? library 
    : library.filter(item => item.category === filterCategory)

  return (
    <div className="grid xl:grid-cols-12 gap-8">
      {/* 1. Item Creator (Left Side) */}
      <div className="xl:col-span-4 space-y-6">
        <Card className="border-primary/20 bg-secondary/10 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="font-serif flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> 
              {editingItemId ? t("admin.edit") : t("admin.item_forge")}
            </CardTitle>
            <CardDescription>{t("admin.forge_subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-black/40">
                  <TabsTrigger value="general" className="text-[10px] uppercase font-bold">{t("admin.categories.Misc")}</TabsTrigger>
                  <TabsTrigger value="combat" className="text-[10px] uppercase font-bold">{t("admin.stats")}</TabsTrigger>
                  <TabsTrigger value="effects" className="text-[10px] uppercase font-bold">{t("party.special_actions")}</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">{t("admin.item_name")}</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/20" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("admin.item_category")}</Label>
                      <select className="w-full bg-black/40 border border-primary/20 rounded-md p-2 text-xs text-foreground" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{t(`admin.categories.${cat}`)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("admin.item_rarity")}</Label>
                      <select className="w-full bg-black/40 border border-primary/20 rounded-md p-2 text-xs text-foreground" value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}>
                        {Object.keys(rarityColors).map(r => <option key={r} value={r}>{t(`admin.rarities.${r}`)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">{t("common.description")}</Label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black/20 h-24 text-xs" />
                  </div>
                </TabsContent>

                <TabsContent value="combat" className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("party.damage")}</Label>
                      <Input value={formData.damage} onChange={e => setFormData({...formData, damage: e.target.value})} placeholder="1d8" className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("party.damage_type")}</Label>
                      <Input value={formData.damageType} onChange={e => setFormData({...formData, damageType: e.target.value})} placeholder="Slashing" className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("party.ac_bonus")}</Label>
                      <Input type="number" value={formData.acBonus} onChange={e => setFormData({...formData, acBonus: parseInt(e.target.value) || 0})} className="bg-black/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-muted-foreground">{t("party.charges")}</Label>
                      <Input type="number" value={formData.charges} onChange={e => setFormData({...formData, charges: parseInt(e.target.value) || 0})} className="bg-black/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground">{t("admin.item_properties")}</Label>
                    <Input value={formData.properties} onChange={e => setFormData({...formData, properties: e.target.value})} placeholder="Finesse, Light..." className="bg-black/20" />
                  </div>
                  <div className="flex gap-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isEquippable} onChange={e => setFormData({...formData, isEquippable: e.target.checked})} className="h-4 w-4 rounded border-primary/20 bg-black/40 text-primary" />
                      <span className="text-[10px] uppercase font-bold text-primary/70">{t("admin.item_equippable")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isUsable} onChange={e => setFormData({...formData, isUsable: e.target.checked})} className="h-4 w-4 rounded border-primary/20 bg-black/40 text-primary" />
                      <span className="text-[10px] uppercase font-bold text-primary/70">{t("admin.item_usable")}</span>
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase text-muted-foreground">{t("party.special_actions")}</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSpecialAction} className="h-6 text-[9px] uppercase tracking-widest">
                      <Plus className="mr-1 h-3 w-3" /> {t("admin.add_action")}
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 arcane-scrollbar">
                    {specialActionsArr.map((action, idx) => (
                      <div key={idx} className="p-3 border border-white/5 rounded-md bg-black/40 relative group space-y-2">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecialAction(idx)} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <X className="h-3 w-3" />
                        </Button>
                        <Input value={action.name} onChange={e => updateSpecialAction(idx, "name", e.target.value)} placeholder={t("admin.action_name")} className="h-7 text-xs bg-transparent border-b border-white/10 rounded-none focus-visible:ring-0 font-bold" />
                        <div className="grid grid-cols-2 gap-2">
                          <select className="bg-secondary/40 border border-white/5 rounded text-[10px] p-1 text-foreground" value={action.type} onChange={e => updateSpecialAction(idx, "type", e.target.value)}>
                            <option value="none">No Effect</option>
                            <option value="healing">Heal (HP)</option>
                            <option value="damage">Damage</option>
                            <option value="buff">Buff/Status</option>
                          </select>
                          {action.type !== "none" && (
                            <div className="flex gap-1 items-center">
                              <input type="number" className="w-8 bg-black/20 text-[10px] p-1 rounded border border-white/10" value={action.diceNum} onChange={e => updateSpecialAction(idx, "diceNum", parseInt(e.target.value) || 0)} />
                              <span className="text-[9px] opacity-40 font-mono">d</span>
                              <select className="bg-black/20 text-[10px] p-1 rounded border border-white/10" value={action.diceSides} onChange={e => updateSpecialAction(idx, "diceSides", parseInt(e.target.value) || 0)}>
                                {[4, 6, 8, 10, 12, 20, 100].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <span className="text-[9px] opacity-40 font-mono">+</span>
                              <input type="number" className="w-8 bg-black/20 text-[10px] p-1 rounded border border-white/10" value={action.bonus} onChange={e => updateSpecialAction(idx, "bonus", parseInt(e.target.value) || 0)} />
                            </div>
                          )}
                        </div>                        <Textarea value={action.desc} onChange={e => updateSpecialAction(idx, "desc", e.target.value)} placeholder={t("admin.action_desc")} className="h-16 text-[10px] bg-transparent border-none focus-visible:ring-0 resize-none p-0 opacity-70" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-8">
                <Button type="submit" className="flex-1 h-12 gap-2 font-serif text-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary">
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
      </div>

      {/* 2. Vault & Possession (Right Side) */}
      <div className="xl:col-span-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <Box className="h-6 w-6 text-amber-500" />
              {t("admin.vault_title")}
            </h2>
            <p className="text-xs text-muted-foreground italic">{t("admin.vault_subtitle")}</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["All", ...Object.keys(categoryIcons)].map(cat => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                size="sm"
                className="h-7 text-[9px] uppercase tracking-tighter"
                onClick={() => setFilterCategory(cat)}
              >
                {cat === "All" ? t("notices.filter_all") : t(`admin.categories.${cat}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Global Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLibrary.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl opacity-20">
              <Box className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm font-serif italic">{t("admin.vault_empty")}</p>
            </div>
          ) : filteredLibrary.map(item => {
            const Icon = categoryIcons[item.category] || Box
            const rarityColor = rarityColors[item.rarity] || "text-white"
            return (
              <Card key={item.id} className={cn("group relative bg-black/40 border-white/5 hover:border-primary/40 transition-all duration-300 overflow-hidden", item.rarity === "Legendary" && "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]")}>
                <div className={cn("absolute top-0 left-0 w-1 h-full opacity-50", rarityColor.replace("text", "bg"))} />
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div className="p-1.5 rounded bg-secondary/50 text-primary/60"><Icon className="h-4 w-4" /></div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-primary" onClick={() => startEdit(item)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                  <CardTitle className={cn("text-sm font-serif truncate mt-2", rarityColor)}>{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-[10px] text-muted-foreground line-clamp-2 italic h-8 mb-4">{item.description || t("admin.possession_empty")}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <select className="flex-1 bg-secondary/50 border-none rounded px-2 py-1 text-[9px] uppercase font-bold" value={bestowCharId} onChange={e => setBestowCharId(e.target.value ? parseInt(e.target.value) : "")}>
                      <option value="">{t("admin.select_recipient")}</option>
                      {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <Button size="sm" variant="secondary" className="h-6 px-3 text-[9px] uppercase font-bold" onClick={() => bestowItem(item.id)} disabled={!bestowCharId}>
                      {t("admin.item_bestow")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Possession Section */}
        <div className="pt-8">
          <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary/50" />
            {t("admin.possession_title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(char => (
              <div key={char.id} className="space-y-3 p-4 bg-secondary/10 rounded-xl border border-white/5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-primary/80">{char.name}</h5>
                  <span className="text-[9px] font-mono text-muted-foreground">LVL {char.level}</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 arcane-scrollbar">
                  {char.personalItems?.length === 0 ? (
                    <p className="text-[9px] text-muted-foreground italic opacity-30 py-4 text-center">{t("admin.possession_empty")}</p>
                  ) : char.personalItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-black/20 rounded-md group hover:bg-black/40 transition-colors">
                      <span className={cn("text-[10px] font-medium truncate", rarityColors[item.template?.rarity] || "text-white")}>
                        {item.template?.name} <span className="opacity-40 ml-1">x{item.quantity}</span>
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-primary" onClick={() => setTransferringItemId(transferringItemId === item.id ? null : item.id)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-amber-500" onClick={() => unassignItem(item.id)}><Box className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
