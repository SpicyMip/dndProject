"use client"

import React from "react"
import { Heart, Package, Plus, Trash2, Coins } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { StatBlock } from "./stat-block"

interface DMCharacterSheetProps {
  characterId: number
  onClose: () => void
}

export function DMCharacterSheet({ characterId, onClose }: DMCharacterSheetProps) {
  const { party, updateCharacter, updatePersonalItem, addPersonalItem, deletePersonalItem } = useParty()
  const character = party.find((c) => c.id === characterId)
  
  if (!character) return null

  const handleStatChange = (key: string, value: number) => {
    updateCharacter(character.id, {
      stats: { ...character.stats, [key]: value },
    })
  }

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl">{character.name}</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {character.class} // Level {character.level} // Owner: {character.ownerId}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs">Status</Label>
              <Select
                value={character.status}
                onValueChange={(value: Character["status"]) =>
                  updateCharacter(character.id, { status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Wounded">Wounded</SelectItem>
                  <SelectItem value="Unconscious">Unconscious</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs">Level</Label>
              <Input
                type="number"
                value={character.level}
                onChange={(e) =>
                  updateCharacter(character.id, { level: parseInt(e.target.value) || 1 })
                }
                min={1}
                max={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-destructive" />
              Hit Points
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={character.hp.current}
                onChange={(e) =>
                  updateCharacter(character.id, {
                    hp: { current: parseInt(e.target.value) || 0 },
                  })
                }
                className="text-center"
                min={0}
                max={character.hp.max}
              />
              <span className="text-muted-foreground">/</span>
              <Input
                type="number"
                value={character.hp.max}
                onChange={(e) =>
                  updateCharacter(character.id, {
                    hp: { max: parseInt(e.target.value) || 1 },
                  })
                }
                className="text-center"
                min={1}
              />
            </div>
            <Progress
              value={(character.hp.current / character.hp.max) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs">Ability Scores</Label>
            <StatBlock stats={character.stats} editable onChange={handleStatChange} />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              Personal Gold
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={character.gold}
                onChange={(e) =>
                  updateCharacter(character.id, { gold: parseInt(e.target.value) || 0 })
                }
                className={cn(
                  "text-right",
                  character.gold < 0 && "text-destructive"
                )}
              />
              <span className="font-mono text-sm text-muted-foreground">gp</span>
            </div>
          </div>

      <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-xs flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Personal Inventory
              </Label>
            </div>
            <div className="rounded-md border divide-y">
              {character.personalItems.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No items yet
                </div>
              ) : (
                character.personalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2 gap-2"
                  >
                    <Input
                      value={item.name}
                      onChange={(e) => updatePersonalItem(character.id, item.id, { name: e.target.value })}
                      className="flex-1 h-8 text-sm border-dashed"
                    />
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-muted-foreground">x</span>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePersonalItem(character.id, item.id, { quantity: parseInt(e.target.value) || 0 })}
                        className="h-8 w-16 font-mono text-xs text-center border-dashed"
                        min={0}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePersonalItem(character.id, item.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
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
