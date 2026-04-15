"use client"

import React from "react"
import {
  Shield,
  Heart,
  Package,
  Plus,
  Trash2,
  Coins,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { classIcons } from "./constants"

export function PlayerCharacterSheet({ character }: { character: Character }) {
  const { updateCharacter, updatePersonalItem, addPersonalItem, deletePersonalItem } = useParty()
  const ClassIcon = classIcons[character.class] || Shield
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-serif font-bold text-foreground py-1">
              {character.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <ClassIcon className="h-4 w-4" />
            <span>{character.class}</span>
            <span className="opacity-50">//</span>
            <div className="flex items-center gap-1">
              <span>Lvl</span>
              <Input
                type="number"
                value={character.level}
                onChange={(e) => updateCharacter(character.id, { level: parseInt(e.target.value) || 1 })}
                className="h-6 w-12 font-mono text-xs text-center border-dashed p-0 bg-transparent"
                min={1}
                max={20}
              />
            </div>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-mono font-medium",
            character.status === "Active"
              ? "bg-primary/10 text-primary"
              : character.status === "Wounded"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {character.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 font-mono text-xs">
            <Heart className="h-3.5 w-3.5 text-destructive" />
            Hit Points
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
              className="h-6 w-12 text-center border-dashed"
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
              className="h-6 w-12 text-center border-dashed"
              min={1}
            />
          </div>
        </div>
        <Progress
          value={(character.hp.current / character.hp.max) * 100}
          className={cn(
            "h-3",
            character.hp.current / character.hp.max <= 0.25 && "bg-destructive/20"
          )}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">Ability Scores</Label>
        <StatBlock stats={character.stats} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            Personal Gold
          </Label>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={character.gold}
              onChange={(e) =>
                updateCharacter(character.id, { gold: parseInt(e.target.value) || 0 })
              }
              className={cn(
                "h-6 w-20 text-right font-mono text-sm border-dashed",
                character.gold < 0 && "text-destructive"
              )}
            />
            <span className="font-mono text-xs text-muted-foreground">gp</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Personal Inventory
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addPersonalItem(character.id, { name: "New Item", quantity: 1, type: "misc" })}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="rounded-md border border-border divide-y divide-border">
          {character.personalItems.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No items yet
            </div>
          ) : (
            character.personalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 text-sm gap-2"
              >
                <Input
                  value={item.name}
                  onChange={(e) => updatePersonalItem(character.id, item.id, { name: e.target.value })}
                  className="flex-1 h-8 font-serif text-foreground border-dashed bg-transparent"
                />
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-muted-foreground">x</span>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updatePersonalItem(character.id, item.id, { quantity: parseInt(e.target.value) || 0 })}
                    className="h-8 w-14 font-mono text-xs text-center border-dashed"
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
  )
}
