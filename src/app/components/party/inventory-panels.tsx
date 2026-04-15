"use client"

import React from "react"
import { Coins, Package, Plus, Trash2, Sword, Shield as ShieldIcon, FlaskConical, Wrench, Sparkles, Box, Check, Pencil, HardHat, Gem } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParty, type Character, type InventoryItem } from "@/lib/party-context"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export function ConsolidatedInventoryPanel() {
  const { party } = useParty()
  const { t } = useTranslation()

  const totalPartyGold = party.reduce((sum, char) => sum + char.gold, 0)

  const allPersonalItems = party.flatMap((char) =>
    char.personalItems.map((item) => ({
      ...item,
      ownerName: char.name,
      ownerId: char.id,
    }))
  )

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          {t("party.wealth")}
        </h4>
        <div className="rounded-md border border-border divide-y divide-border">
          {party.map((char) => (
            <div
              key={char.id}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <span className="font-serif text-foreground">{char.name}</span>
              <span className={cn(
                "font-mono text-xs",
                char.gold >= 0 ? "text-amber-500" : "text-destructive"
              )}>
                {char.gold} gp
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2 text-sm bg-secondary/50">
            <span className="font-serif font-semibold text-foreground">Total</span>
            <span className={cn(
              "font-mono text-sm font-bold",
              totalPartyGold >= 0 ? "text-amber-500" : "text-destructive"
            )}>
              {totalPartyGold} gp
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          {t("party.possession")}
        </h4>
        <div className="rounded-md border border-border divide-y divide-border max-h-64 overflow-y-auto">
          {allPersonalItems.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No personal items across party
            </div>
          ) : (
            allPersonalItems.map((item) => (
              <div
                key={`${item.ownerId}-${item.id}`}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-serif text-foreground">{item.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {item.ownerName}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  x{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const categoryIcons: Record<string, any> = {
  Weapon: Sword,
  Shield: ShieldIcon,
  Armor: ShieldIcon,
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

export function PlayerInventoryPanel({ character }: { character: Character }) {
  const { updatePersonalItem, addPersonalItem, deletePersonalItem, userRole } = useParty()
  const { t } = useTranslation()
  const isDM = userRole === "DM"

  const parseSpecialActions = (actionsStr?: string) => {
    try {
      return actionsStr ? JSON.parse(actionsStr) : []
    } catch { return [] }
  }

  const toggleEquip = (item: any) => {
    if (item.isEquipped) {
      updatePersonalItem(character.id, item.id, { isEquipped: false })
      return
    }

    // Check limits for equipping
    const equipped = character.personalItems.filter(i => i.isEquipped)
    
    if (item.category === "Weapon" || item.category === "Shield") {
      const hands = equipped.filter(i => i.category === "Weapon" || i.category === "Shield").length
      if (hands >= 2) {
        toast.error("Your hands are full! (Max 2)")
        return
      }
    } else if (item.category === "Armor") {
      const armor = equipped.filter(i => i.category === "Armor").length
      if (armor >= 1) {
        toast.error("Already wearing armor! (Max 1)")
        return
      }
    } else if (item.category === "Headwear") {
      const head = equipped.filter(i => i.category === "Headwear").length
      if (head >= 1) {
        toast.error("Head slot occupied! (Max 1)")
        return
      }
    } else if (item.category === "Trinket") {
      const trinkets = equipped.filter(i => i.category === "Trinket").length
      if (trinkets >= 5) {
        toast.error("Too many trinkets! (Max 5)")
        return
      }
    }

    updatePersonalItem(character.id, item.id, { isEquipped: true })
  }

  const useItem = (item: any) => {
    if (item.quantity > 1) {
      updatePersonalItem(character.id, item.id, { quantity: item.quantity - 1 })
    } else {
      deletePersonalItem(character.id, item.id)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          {t("party.inventory")}
        </h4>
      </div>
      <div className="space-y-2">
        {character.personalItems.length === 0 ? (
          <div className="px-3 py-8 text-center border border-dashed rounded-md opacity-40">
            <p className="text-xs font-mono">Empty pockets...</p>
          </div>
        ) : (
          character.personalItems.map((item) => {
            const Icon = categoryIcons[item.category] || Box

            return (
              <div
                key={item.id}
                className={cn(
                  "group relative rounded-md border border-border bg-black/20 p-2 transition-all hover:border-primary/30",
                  item.isEquipped && "border-primary/50 bg-primary/5 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "p-1.5 rounded bg-secondary/50",
                      item.isEquipped && "bg-primary/20 text-primary"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-serif text-sm font-medium truncate", rarityColors[item.rarity])}>
                          {item.name}
                        </span>
                        {item.isEquipped && (
                          <span className="text-[8px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">
                            {t("party.equipped")}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          {item.properties || t(`admin.categories.${item.category}`)}
                        </p>
                        {item.damage && (
                          <span className="text-[10px] font-bold text-red-400/80 font-mono">
                            🗡️ {item.damage} {item.damageType}
                          </span>
                        )}
                        {item.acBonus && (
                          <span className="text-[10px] font-bold text-blue-400/80 font-mono">
                            🛡️ +{item.acBonus} AC
                          </span>
                        )}
                        {item.charges !== undefined && item.charges > 0 && (
                          <span className="text-[10px] font-bold text-amber-400/80 font-mono">
                            ✨ {item.charges} {t("party.charges")}
                          </span>
                        )}
                      </div>
                      
                      {/* Special Actions */}
                      {parseSpecialActions(item.specialActions).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {parseSpecialActions(item.specialActions).map((action: any, idx: number) => (
                            <div key={idx} className="p-1.5 rounded bg-primary/5 border border-primary/10">
                              <p className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tighter">
                                <Sparkles className="h-2.5 w-2.5" /> {action.name}
                              </p>
                              <p className="text-[9px] text-muted-foreground leading-tight italic">
                                {action.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center bg-secondary/30 rounded px-1.5 py-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">x</span>
                      <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                    </div>
                    
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.isEquippable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleEquip(item)}
                          className={cn("h-7 w-7", item.isEquipped ? "text-primary" : "text-muted-foreground")}
                          title={item.isEquipped ? "Unequip" : "Equip"}
                        >
                          <ShieldIcon className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {item.isUsable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => useItem(item)}
                          className="h-7 w-7 text-green-500"
                          title={t("party.use")}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
