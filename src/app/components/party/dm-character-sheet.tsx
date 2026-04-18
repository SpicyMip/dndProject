"use client"

import React from "react"
import { Heart, Package, Plus, Trash2, Coins, Shield, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useParty, type Character } from "@/lib/party-context"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { StatBlock } from "./stat-block"
import { classIcons } from "./constants"

interface DMCharacterSheetProps {
  characterId: number
  onClose: () => void
}

export function DMCharacterSheet({ characterId, onClose }: DMCharacterSheetProps) {
  const { party, updateCharacter, deletePersonalItem } = useParty()
  const { t } = useTranslation()
  const character = party.find((c) => c.id === characterId)
  
  if (!character) return null

  const ClassIcon = classIcons[character.class] || Shield

  const handleStatChange = (key: string, value: number) => {
    updateCharacter(character.id, {
      stats: { ...character.stats, [key]: value },
    })
  }

  const rarityTextColors: Record<string, string> = {
    Common: "text-muted-foreground",
    Uncommon: "text-emerald-400",
    Rare: "text-blue-400",
    "Very Rare": "text-purple-400",
    Legendary: "text-amber-400",
  }

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto arcane-scrollbar bg-background border-primary/20">
        <SheetHeader className="mb-6 border-b border-primary/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClassIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="font-serif text-2xl text-foreground">{character.name}</SheetTitle>
              <SheetDescription className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
                <span className="text-primary">{character.race} {character.class}</span>
                <span className="opacity-30">|</span>
                <span>{t("party.level")} {character.level}</span>
                <span className="opacity-30">|</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {character.ownerId}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground">{t("party.status")}</Label>
              <Select
                value={character.status}
                onValueChange={(value: Character["status"]) =>
                  updateCharacter(character.id, { status: value })
                }
              >
                <SelectTrigger className="bg-black/20 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-primary/20">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Wounded">Wounded</SelectItem>
                  <SelectItem value="Unconscious">Unconscious</SelectItem>
                  <SelectItem value="Dead">Dead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground">{t("party.level")}</Label>
              <Input
                type="number"
                value={character.level}
                onChange={(e) =>
                  updateCharacter(character.id, { level: parseInt(e.target.value) || 1 })
                }
                className="bg-black/20 border-primary/20 font-mono"
                min={1}
                max={20}
              />
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-secondary/10 border border-primary/10">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-destructive" />
                {t("party.hit_points")}
              </Label>
              <div className="flex items-center gap-1 font-mono text-sm">
                <Input
                  type="number"
                  value={character.hp.current}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      hp: { current: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-16 h-8 text-center bg-black/40 border-primary/20"
                  min={0}
                />
                <span className="opacity-30">/</span>
                <Input
                  type="number"
                  value={character.hp.max}
                  onChange={(e) =>
                    updateCharacter(character.id, {
                      hp: { max: parseInt(e.target.value) || 1 },
                    })
                  }
                  className="w-16 h-8 text-center bg-black/40 border-primary/20"
                  min={1}
                />
              </div>
            </div>
            <Progress
              value={((character.hp.current || 0) / (character.hp.max || 1)) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground">{t("party.ability_scores")}</Label>
            <StatBlock stats={character.stats} editable onChange={handleStatChange} />
          </div>

          <div className="space-y-2 flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
            <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              {t("party.gold")}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={character.gold}
                onChange={(e) =>
                  updateCharacter(character.id, { gold: parseInt(e.target.value) || 0 })
                }
                className={cn(
                  "w-24 h-8 text-right bg-transparent border-dashed border-primary/20 font-mono text-sm",
                  character.gold < 0 && "text-destructive"
                )}
              />
              <span className="font-mono text-xs text-muted-foreground uppercase opacity-50">gp</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-mono text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              {t("party.inventory")}
            </Label>
            <div className="rounded-xl border border-primary/10 bg-black/20 overflow-hidden divide-y divide-white/5">
              {(!character.personalItems || character.personalItems.length === 0) ? (
                <div className="px-3 py-8 text-center text-xs text-muted-foreground italic opacity-40">
                  {t("party.empty_inventory")}
                </div>
              ) : (
                character.personalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 gap-3 group hover:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={cn("font-serif text-sm font-bold truncate", rarityTextColors[item.template?.rarity] || "text-foreground")}>
                        {item.template?.name || "Unknown Item"}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-60">
                        {t(`admin.categories.${item.template?.category || "Misc"}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-black/40 rounded px-2 py-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground mr-1">x</span>
                        <span className="text-xs font-mono font-bold">{item.quantity}</span>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (confirm(t("admin.unassign_confirm"))) {
                            deletePersonalItem(character.id, item.id)
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
