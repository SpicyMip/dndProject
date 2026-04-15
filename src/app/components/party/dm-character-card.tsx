"use client"

import React from "react"
import { Shield, Heart, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type Character } from "@/lib/party-context"
import { cn } from "@/lib/utils"
import { classIcons, statKeys, statLabels } from "./constants"

interface DMCharacterCardProps {
  character: Character
  onClick: () => void
}

export function DMCharacterCard({ character, onClick }: DMCharacterCardProps) {
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

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
            <Coins className="h-3 w-3 text-amber-500" />
            Gold
          </span>
          <span className={cn(
            "font-mono text-[10px]",
            character.gold >= 0 ? "text-amber-500" : "text-destructive"
          )}>
            {character.gold} gp
          </span>
        </div>

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
