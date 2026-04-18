"use client"

import React, { useState } from "react"
import {
  Shield,
  Heart,
  Package,
  Plus,
  Minus,
  Coins,
  Zap,
  Swords,
  ShieldAlert,
  FlaskConical,
  Wrench,
  Sparkles,
  HardHat,
  Gem,
  Info,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useParty, type Character, type InventoryItem } from "@/lib/party-context"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { StatBlock } from "./stat-block"
import { classIcons } from "./constants"
import { toast } from "sonner"
import { api } from "@/lib/api"

const categoryIcons: Record<string, any> = {
  Weapon: Swords,
  Shield: Shield,
  Armor: Shield,
  Headwear: HardHat,
  Trinket: Gem,
  Consumable: FlaskConical,
  Tool: Wrench,
  "Magic Item": Sparkles,
  Misc: Package,
}

const rarityColors: Record<string, string> = {
  Common: "border-border",
  Uncommon: "border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.05)]",
  Rare: "border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.05)]",
  "Very Rare": "border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.05)]",
  Legendary: "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
}

const rarityTextColors: Record<string, string> = {
  Common: "text-muted-foreground",
  Uncommon: "text-emerald-400",
  Rare: "text-blue-400",
  "Very Rare": "text-purple-400",
  Legendary: "text-amber-400",
}

export function PlayerCharacterSheet({ character }: { character: Character }) {
  const { t } = useTranslation()
  const { updateCharacter, updatePersonalItem, refresh } = useParty()
  const [showManualModal, setShowManualModal] = useState(false)
  const [manualRollValue, setManualRollValue] = useState("")
  const [pendingItem, setPendingItem] = useState<InventoryItem | null>(null)
  const [pendingEffect, setPendingEffect] = useState<any>(null)

  const ClassIcon = classIcons[character.class] || Shield
  
  const dexMod = Math.floor((character.stats.dex - 10) / 2)
  const armorBonus = (character.personalItems || [])
    .filter(i => i.isEquipped && (i.template?.category === "Armor" || i.template?.category === "Shield"))
    .reduce((acc, item) => acc + (item.template?.acBonus || 0), 0)
  
  const ac = 10 + dexMod + armorBonus

  const adjustHp = (amount: number) => {
    const current = character.hp.current || 0
    const max = character.hp.max || 1
    const next = Math.min(Math.max(current + amount, 0), max)
    updateCharacter(character.id, { hp: { current: next } })
  }

  const handleUseChoice = (item: InventoryItem, manual: boolean) => {
    const effects = JSON.parse(item.template?.specialActions || "[]")
    const healingEffect = effects.find((e: any) => e.type === "healing")

    if (manual && healingEffect) {
      setPendingItem(item)
      setPendingEffect(healingEffect)
      setShowManualModal(true)
    } else {
      executeUseItem(item.id, false)
    }
  }

  const executeUseItem = async (itemId: number, manual: boolean, result?: number) => {
    try {
      const url = `/characters/items/${itemId}/use?manual=${manual}${result !== undefined ? `&result=${result}` : ""}`
      const res = await api.post<any>(url, {})
      
      if (res.rolled > 0) {
        toast.success(t("party.item_used_auto", { name: res.item.template?.name || "Item" }), {
          description: t("party.hp_restored", { amount: res.rolled })
        })
      } else {
        toast.success(res.message || t("common.success"))
      }

      setShowManualModal(false)
      setManualRollValue("")
      setPendingItem(null)
      setPendingEffect(null)
      refresh()
    } catch (error: any) {
      const msg = error.response?.data?.error || "Magic failed"
      toast.error(msg)
    }
  }

  const submitManualRoll = () => {
    const val = parseInt(manualRollValue)
    if (isNaN(val) || !pendingItem || !pendingEffect) return
    
    const min = pendingEffect.diceNum + pendingEffect.bonus
    const max = (pendingEffect.diceNum * pendingEffect.diceSides) + pendingEffect.bonus
    
    if (val < min || val > max) {
      toast.error(t("party.invalid_range", { min, max }))
      return
    }

    executeUseItem(pendingItem.id, true, val)
  }

  const toggleEquip = (item: InventoryItem) => {
    updatePersonalItem(character.id, item.id, { isEquipped: !item.isEquipped })
  }

  // Lógica de agrupación robusta
  const categoriesOrder = ["Weapon", "Armor", "Shield", "Consumable", "Magic Item", "Tool", "Misc"]
  const inventoryByCategory = (character.personalItems || []).reduce((acc, item) => {
    const rawCat = item.template?.category || "Misc"
    // Asegurar que la categoría existe en nuestro orden, si no, a Misc
    const cat = categoriesOrder.includes(rawCat) ? rawCat : "Misc"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, InventoryItem[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between bg-secondary/20 p-4 rounded-lg border border-border/50">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif font-bold text-foreground">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <ClassIcon className="h-4 w-4 text-primary" />
            <span>{character.race} {character.class}</span>
            <span className="opacity-50">//</span>
            <span className="flex items-center gap-1">
              {t("party.level")} {character.level}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider",
              character.status === "Active"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : character.status === "Wounded"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            )}
          >
            {character.status}
          </span>
        </div>
      </div>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-2 rounded-md border border-border bg-secondary/30">
          <Shield className="h-4 w-4 text-primary mb-1" />
          <span className="text-xs font-mono text-muted-foreground uppercase">{t("party.ac")}</span>
          <span className="text-lg font-serif font-bold">{ac}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-md border border-border bg-secondary/30">
          <Zap className="h-4 w-4 text-amber-500 mb-1" />
          <span className="text-xs font-mono text-muted-foreground uppercase">{t("party.initiative")}</span>
          <span className="text-lg font-serif font-bold">
            {dexMod >= 0 ? "+" : ""}{dexMod}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-md border border-border bg-secondary/30">
          <Heart className="h-4 w-4 text-destructive mb-1" />
          <span className="text-xs font-mono text-muted-foreground uppercase">{t("party.speed")}</span>
          <span className="text-lg font-serif font-bold">30ft</span>
        </div>
      </div>

      {/* HP Tracker */}
      <div className="space-y-3 p-4 rounded-lg border border-border bg-background shadow-inner">
        <div className="flex items-center justify-between mb-1">
          <Label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-tighter">
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive/20" />
            {t("party.hit_points")}
          </Label>
          <div className="flex items-center gap-1.5 font-mono text-sm">
            <span className="font-bold text-lg">{character.hp.current}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{character.hp.max}</span>
          </div>
        </div>
        
        <Progress
          value={((character.hp.current || 0) / (character.hp.max || 1)) * 100}
          className={cn(
            "h-4",
            (character.hp.current || 0) / (character.hp.max || 1) <= 0.25 && "[&>div]:bg-destructive"
          )}
        />

        <div className="flex flex-wrap gap-2">
          <div className="flex-1 grid grid-cols-2 gap-1">
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px]" onClick={() => adjustHp(-15)}>-15</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px]" onClick={() => adjustHp(-10)}>-10</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px]" onClick={() => adjustHp(-5)}>-5</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px]" onClick={() => adjustHp(-1)}>-1</Button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1">
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px] text-primary" onClick={() => adjustHp(1)}>+1</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px] text-primary" onClick={() => adjustHp(5)}>+5</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px] text-primary" onClick={() => adjustHp(10)}>+10</Button>
            <Button variant="outline" size="sm" className="h-8 font-mono text-[10px] text-primary" onClick={() => adjustHp(15)}>+15</Button>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="space-y-3">
        <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t("party.ability_scores")}</Label>
        <StatBlock stats={character.stats} />
      </div>

      {/* Inventory & Actions */}
      <div className="space-y-3">
        <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
          <Package className="h-3.5 w-3.5" />
          {t("party.inventory_actions")}
        </Label>
        
        <Accordion type="multiple" defaultValue={["Weapon", "Consumable"]} className="w-full space-y-2 border-none">
          {categoriesOrder.map(cat => {
            const items = inventoryByCategory[cat] || []
            if (items.length === 0) return null

            return (
              <AccordionItem key={cat} value={cat} className="border border-border/40 rounded-lg bg-secondary/10 px-2 overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">
                      {t(`admin.categories.${cat}`)}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-full font-mono">{items.length}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 space-y-2">
                  {items.map((item) => {
                    const template = item.template || { 
                      name: "Unknown Item", 
                      category: "Misc", 
                      rarity: "Common", 
                      description: "Blueprint lost in the archive..." 
                    }
                    
                    const Icon = categoryIcons[template.category] || Package
                    const isMagic = template.category === "Magic Item" || template.rarity !== "Common"
                    
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "group relative overflow-hidden flex flex-col p-3 rounded-md border transition-all duration-300",
                          rarityColors[template.rarity] || "border-border",
                          item.isEquipped ? "bg-primary/5 ring-1 ring-primary/20" : "bg-background/50 hover:bg-background"
                        )}
                      >
                        {isMagic && <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}

                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex gap-3 min-w-0">
                            <div className={cn(
                              "p-2 rounded bg-black/20 flex-shrink-0",
                              item.isEquipped ? "text-primary" : "text-muted-foreground"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-serif font-bold text-sm truncate",
                                  rarityTextColors[template.rarity]
                                )}>{template.name}</span>
                                {item.isEquipped && (
                                  <span className="text-[8px] bg-primary/20 text-primary px-1 rounded font-mono uppercase tracking-tighter animate-pulse">E</span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-0.5">
                                <span className="text-[9px] font-mono text-muted-foreground uppercase">{template.rarity}</span>
                                {template.weight > 0 && <span className="text-[9px] font-mono text-muted-foreground opacity-50">{template.weight} lbs</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {template.isEquippable && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className={cn("h-7 w-7 rounded-full", item.isEquipped ? "text-primary bg-primary/10" : "text-muted-foreground")}
                                onClick={() => toggleEquip(item)}
                              >
                                <Shield className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            {(template.isUsable || template.category === "Consumable") && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 font-mono text-[10px] gap-1.5 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500"
                                  >
                                    <Zap className="h-3 w-3" />
                                    <span>{item.charges !== undefined && item.charges > 0 ? item.charges : t("party.use")}</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background border-primary/20">
                                  <DropdownMenuItem 
                                    className="text-[10px] font-mono gap-2 cursor-pointer"
                                    onClick={() => handleUseChoice(item, false)}
                                  >
                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                    {t("party.use_auto")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-[10px] font-mono gap-2 cursor-pointer"
                                    onClick={() => handleUseChoice(item, true)}
                                  >
                                    <Swords className="h-3.5 w-3.5 text-muted-foreground" />
                                    {t("party.use_manual")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            <Popover>
                              <PopoverTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-primary"><Info className="h-3.5 w-3.5" /></Button>
                              </PopoverTrigger>
                              <PopoverContent side="left" className="w-64 bg-background border-primary/20 p-4 shadow-2xl z-[100]">
                                <h4 className="font-serif font-bold text-primary mb-1">{template.name}</h4>
                                <p className="text-xs text-muted-foreground italic mb-3">{template.description || "No description provided."}</p>
                                
                                <div className="space-y-2 border-t border-border pt-2">
                                  {template.damage && <div className="flex justify-between text-[10px] font-mono"><span className="opacity-60">Damage:</span><span>{template.damage} {template.damageType}</span></div>}
                                  {template.acBonus > 0 && <div className="flex justify-between text-[10px] font-mono"><span className="opacity-60">AC Bonus:</span><span>+{template.acBonus}</span></div>}
                                  {template.properties && <div className="text-[9px] font-mono bg-secondary/50 p-1 rounded mt-2 opacity-80">{template.properties}</div>}
                                </div>
                              </PopoverContent>
                            </Popover>

                            <div className="ml-1 px-2 py-0.5 rounded bg-black/30 font-mono text-[10px] text-muted-foreground border border-white/5">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {/* Manual Roll Modal */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="sm:max-w-[300px] bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-center flex items-center justify-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              {t("party.use_manual")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">{t("party.roll_dice")}</p>
              <p className="text-2xl font-serif font-bold text-primary tracking-tighter">
                {pendingEffect?.diceNum}d{pendingEffect?.diceSides}{pendingEffect?.bonus !== 0 ? (pendingEffect?.bonus > 0 ? `+${pendingEffect?.bonus}` : pendingEffect?.bonus) : ""}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-mono opacity-60">{t("party.result")}</Label>
              <Input 
                autoFocus
                type="number" 
                className="text-center text-xl font-mono h-12 bg-black/40 border-primary/30 focus-visible:ring-primary" 
                value={manualRollValue}
                onChange={e => setManualRollValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitManualRoll()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full font-serif" onClick={submitManualRoll} disabled={!manualRollValue}>
              {t("party.confirm_roll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
