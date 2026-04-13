"use client"

import React, { useState } from "react"
import {
  Users,
  Shield,
  Wand2,
  Crosshair,
  Flame,
  Gem,
  ArrowLeftRight,
  Heart,
  Pencil,
  Package,
  Backpack,
  Plus,
  Trash2,
  Coins,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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

const classIcons: Record<string, React.ElementType> = {
  Paladin: Shield,
  Ranger: Crosshair,
  Sorcerer: Wand2,
  Fighter: Flame,
  Warlock: Wand2,
  Cleric: Shield,
  Rogue: Crosshair,
  Wizard: Wand2,
  Barbarian: Flame,
  Bard: Wand2,
  Druid: Gem,
  Monk: Crosshair,
}

const statLabels = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const
const statKeys = ["str", "dex", "con", "int", "wis", "cha"] as const

function StatBlock({ stats, editable, onChange }: { 
  stats: Character["stats"]
  editable?: boolean
  onChange?: (key: string, value: number) => void 
}) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {statKeys.map((key, i) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-md border border-border bg-secondary/50 px-2 py-1.5"
        >
          <span className="font-mono text-[10px] text-muted-foreground">
            {statLabels[i]}
          </span>
          {editable ? (
            <Input
              type="number"
              value={stats[key]}
              onChange={(e) => onChange?.(key, parseInt(e.target.value) || 0)}
              className="h-6 w-10 text-center font-mono text-sm p-0 border-0 bg-transparent"
            />
          ) : (
            <span className="font-mono text-sm font-semibold text-foreground">
              {stats[key]}
            </span>
          )}
          <span className="font-mono text-[9px] text-muted-foreground">
            {Math.floor((stats[key] - 10) / 2) >= 0 ? "+" : ""}
            {Math.floor((stats[key] - 10) / 2)}
          </span>
        </div>
      ))}
    </div>
  )
}

function PlayerCharacterSheet({ character }: { character: Character }) {
  const { updateCharacter, updatePersonalItem, addPersonalItem, deletePersonalItem } = useParty()
  const ClassIcon = classIcons[character.class] || Shield
  
  const handleStatChange = (key: string, value: number) => {
    updateCharacter(character.id, {
      stats: { ...character.stats, [key]: value },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              value={character.name}
              onChange={(e) => updateCharacter(character.id, { name: e.target.value })}
              className="text-xl font-serif font-bold h-auto py-1 px-2 w-auto max-w-[200px] bg-transparent border-dashed border-border focus:border-primary"
            />
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <ClassIcon className="h-4 w-4 text-muted-foreground" />
            <Select
              value={character.class}
              onValueChange={(value) => updateCharacter(character.id, { class: value })}
            >
              <SelectTrigger className="h-7 w-auto font-mono text-xs border-dashed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(classIcons).map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground font-mono text-xs">//</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs text-muted-foreground">Lvl</span>
              <Input
                type="number"
                value={character.level}
                onChange={(e) => updateCharacter(character.id, { level: parseInt(e.target.value) || 1 })}
                className="h-6 w-12 font-mono text-xs text-center border-dashed"
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

      {/* HP Bar */}
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
                  hp: { ...character.hp, current: parseInt(e.target.value) || 0 },
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
                  hp: { ...character.hp, max: parseInt(e.target.value) || 1 },
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

      {/* Stats */}
      <div className="space-y-2">
        <Label className="font-mono text-xs text-muted-foreground">Ability Scores</Label>
        <StatBlock stats={character.stats} editable onChange={handleStatChange} />
      </div>

      {/* Gold */}
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

      {/* Influence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-mono text-xs text-muted-foreground">
            Campaign Influence
          </Label>
          <span className="font-mono text-sm text-primary">{character.influence}%</span>
        </div>
        <Slider
          value={[character.influence]}
          onValueChange={([value]) => updateCharacter(character.id, { influence: value })}
          max={100}
          step={1}
          className="py-2"
        />
      </div>

      {/* Personal Inventory */}
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

function DMCharacterCard({ character, onClick }: { character: Character; onClick: () => void }) {
  const ClassIcon = classIcons[character.class] || Shield
  const hpPercent = (character.hp.current / character.hp.max) * 100

  return (
    <Card
      className="parchment-card border-border overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-serif text-foreground">
              {character.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <ClassIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                {character.class} // Lvl {character.level}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-medium",
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
      </CardHeader>
      <CardContent className="space-y-3">
        {/* HP Mini Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3 text-destructive" />
              HP
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {character.hp.current}/{character.hp.max}
            </span>
          </div>
          <Progress
            value={hpPercent}
            className={cn("h-1.5", hpPercent <= 25 && "bg-destructive/20")}
          />
        </div>

        {/* Gold */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
            <Coins className="h-3 w-3 text-amber-500" />
            Gold
          </span>
          <span className={cn(
            "font-mono text-[10px]",
            character.gold >= 0 ? "text-amber-500" : "text-destructive"
          )}>
            {character.gold >= 0 ? character.gold : character.gold} gp
          </span>
        </div>

        {/* Influence */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">
              Influence
            </span>
            <span className="font-mono text-[10px] text-primary">
              {character.influence}%
            </span>
          </div>
          <Progress value={character.influence} className="h-1.5 bg-secondary" />
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-6 gap-1">
          {statKeys.map((key, i) => (
            <div
              key={key}
              className="text-center rounded bg-secondary/50 py-0.5"
            >
              <span className="font-mono text-[8px] text-muted-foreground block">
                {statLabels[i]}
              </span>
              <span className="font-mono text-[10px] font-semibold text-foreground">
                {character.stats[key]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DMCharacterSheet({ characterId, onClose }: { characterId: string; onClose: () => void }) {
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
          {/* Status & HP */}
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

          {/* HP */}
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
                    hp: { ...character.hp, current: parseInt(e.target.value) || 0 },
                  })
                }
                className="text-center"
                min={0}
              />
              <span className="text-muted-foreground">/</span>
              <Input
                type="number"
                value={character.hp.max}
                onChange={(e) =>
                  updateCharacter(character.id, {
                    hp: { ...character.hp, max: parseInt(e.target.value) || 1 },
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

          {/* Stats */}
          <div className="space-y-2">
            <Label className="font-mono text-xs">Ability Scores</Label>
            <StatBlock stats={character.stats} editable onChange={handleStatChange} />
          </div>

          {/* Gold */}
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

          {/* Influence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-xs">Campaign Influence</Label>
              <span className="font-mono text-sm text-primary">{character.influence}%</span>
            </div>
            <Slider
              value={[character.influence]}
              onValueChange={([value]) => updateCharacter(character.id, { influence: value })}
              max={100}
              step={1}
            />
          </div>

          {/* Personal Inventory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-mono text-xs flex items-center gap-1.5">
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

function ConsolidatedInventoryPanel() {
  const { party, sharedInventory } = useParty()

  // Calculate total party gold
  const totalPartyGold = party.reduce((sum, char) => sum + char.gold, 0)

  // Consolidate all personal items from all characters
  const allPersonalItems = party.flatMap((char) =>
    char.personalItems.map((item) => ({
      ...item,
      ownerName: char.name,
      ownerId: char.id,
    }))
  )

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
      {/* Party Gold Summary */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          Party Wealth
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

      {/* Shared Inventory (Read-only) */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Backpack className="h-4 w-4 text-primary" />
          Shared Party Loot
        </h4>
        <p className="text-[10px] text-muted-foreground mb-2 font-mono">
          Click a character to edit inventory
        </p>
        <div className="rounded-md border border-border divide-y divide-border">
          {sharedInventory.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No shared items yet
            </div>
          ) : (
            sharedInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="font-serif text-foreground">{item.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  x{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* All Personal Items (Read-only) */}
      <div>
        <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          All Personal Items
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

function PlayerInventoryPanel({ character }: { character: Character }) {
  const { updatePersonalItem, addPersonalItem, deletePersonalItem } = useParty()

  const handleAddItem = () => {
    addPersonalItem(character.id, {
      name: "New Item",
      quantity: 1,
      type: "misc",
    })
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          My Inventory
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddItem}
          className="h-7 px-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
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
  )
}

export function PartySection() {
  const { userRole, currentUserId, party, toggleRole } = useParty()
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)

  const myCharacter = party.find((c) => c.ownerId === currentUserId)

  return (
    <section aria-label="Party Sanctum">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground text-balance">
            Party Sanctum
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRole}
          className="font-mono text-xs gap-1.5"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Switch to</span> {userRole === "DM" ? "Player" : "DM"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {userRole === "DM"
          ? "As Dungeon Master, you have full visibility and control over all party members."
          : "View and manage your character sheet. Your influence reflects your impact on the campaign world."}
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-4">
          {userRole === "PLAYER" ? (
            // Player View: Their own character sheet
            myCharacter ? (
              <Card className="parchment-card border-border p-4 sm:p-6">
                <PlayerCharacterSheet character={myCharacter} />
              </Card>
            ) : (
              <Card className="parchment-card border-border p-6">
                <p className="text-center text-muted-foreground font-mono text-sm">
                  No character assigned to your account.
                </p>
              </Card>
            )
          ) : (
            // DM View: Grid of all characters
            <>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Adventurers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {party.map((character) => (
                  <DMCharacterCard
                    key={character.id}
                    character={character}
                    onClick={() => setSelectedCharacterId(character.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Inventory Sidebar */}
        <div className="xl:col-span-1">
          {userRole === "DM" ? (
            <ConsolidatedInventoryPanel />
          ) : (
            myCharacter && <PlayerInventoryPanel character={myCharacter} />
          )}
        </div>
      </div>

      {/* DM Character Edit Sheet */}
      {selectedCharacterId && (
        <DMCharacterSheet
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}
    </section>
  )
}
