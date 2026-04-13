"use client"

import { Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"

interface Deity {
  name: string
  domain: string
  description: string
  symbol: string
}

interface DeityCardProps {
  name: string
  domain: string
  description: string
  symbol: string
}

function DeityCard({ name, domain, description, symbol }: DeityCardProps) {
  return (
    <div className="parchment-card rounded-lg border border-border p-5">
      <h4 className="font-serif text-base font-semibold text-foreground mb-1">
        {name}
      </h4>
      <p className="font-mono text-[10px] text-primary mb-3 uppercase tracking-wider">
        {domain}
      </p>
      <p className="text-sm text-secondary-foreground leading-relaxed mb-3">
        {description}
      </p>
      <div className="flex items-center gap-2 border-t border-border pt-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          SYMBOL:
        </span>
        <span className="text-xs font-serif italic text-muted-foreground">
          {symbol}
        </span>
      </div>
    </div>
  )
}

export function PantheonSection() {
  const [greaterDeities, setGreaterDeities] = useState<Deity[]>([])
  const [lesserIdols, setLesserIdols] = useState<Deity[]>([])

  useEffect(() => {
    apiFetch<{ greaterDeities: Deity[], lesserIdols: Deity[] }>('/pantheon')
      .then(data => {
        setGreaterDeities(data.greaterDeities)
        setLesserIdols(data.lesserIdols)
      })
      .catch(err => console.error("Failed to fetch pantheon:", err))
  }, [])
  return (
    <section aria-label="Pantheon">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-serif font-bold text-foreground text-balance">
          The Pantheon
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-2xl">
        The divine forces that shape the world. From the mighty Greater Deities
        who forged the cosmos to the Lesser Idols who walk among mortals, each
        holds sway over the fate of all.
      </p>

      <Tabs defaultValue="greater" className="w-full">
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger
            value="greater"
            className="font-serif text-sm data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            Greater Deities
          </TabsTrigger>
          <TabsTrigger
            value="lesser"
            className="font-serif text-sm data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            Lesser Idols
          </TabsTrigger>
        </TabsList>

        <TabsContent value="greater">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {greaterDeities.map((deity) => (
              <DeityCard key={deity.name} {...deity} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lesser">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {lesserIdols.map((idol) => (
              <DeityCard key={idol.name} {...idol} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
