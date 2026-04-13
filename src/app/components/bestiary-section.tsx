"use client"

import { useState, useEffect } from "react"
import { Skull, Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"

interface Creature {
  id: string
  name: string
  type: string
  cr: string
  hp: string
  ac: string
  vulnerabilities: string
  description: string
}

const typeColors: Record<string, string> = {
  Plant: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Undead: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Humanoid: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Elemental: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Construct: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  Beast: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Fiend: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function BestiarySection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null)
  const [creatures, setCreatures] = useState<Creature[]>([])

  useEffect(() => {
    apiFetch<{ creatures: Creature[] }>('/bestiary')
      .then(data => setCreatures(data.creatures))
      .catch(err => console.error("Failed to fetch bestiary:", err))
  }, [])

  const filteredCreatures = creatures.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skull className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Bestiary
          </h2>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creatures..."
            className="pl-9 bg-secondary/50 border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreatures.map((creature) => (
          <button
            key={creature.id}
            onClick={() => setSelectedCreature(creature)}
            className="group relative flex flex-col p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {creature.name}
              </h3>
              <Badge className={cn("text-[10px] uppercase font-mono", typeColors[creature.type] || "bg-zinc-500/10")}>
                {creature.type}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">CR</p>
                <p className="font-serif font-bold text-foreground">{creature.cr}</p>
              </div>
              <div className="text-center border-x border-border/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">HP</p>
                <p className="font-serif font-bold text-foreground">{creature.hp}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">AC</p>
                <p className="font-serif font-bold text-foreground">{creature.ac}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedCreature} onOpenChange={() => setSelectedCreature(null)}>
        <DialogContent className="max-w-lg bg-background border-border">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={cn("uppercase font-mono", typeColors[selectedCreature?.type || ""])}>
                {selectedCreature?.type}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Challenge Rating {selectedCreature?.cr}
              </span>
            </div>
            <DialogTitle className="font-serif text-3xl text-foreground">
              {selectedCreature?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Armor Class</p>
                <p className="text-xl font-serif font-bold text-foreground">{selectedCreature?.ac}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Hit Points</p>
                <p className="text-xl font-serif font-bold text-foreground">{selectedCreature?.hp}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-primary uppercase flex items-center gap-2">
                <Info className="h-3 w-3" />
                Vulnerabilities
              </h4>
              <p className="text-sm text-foreground">
                {selectedCreature?.vulnerabilities}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-primary uppercase">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{selectedCreature?.description}"
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
