"use client"

import { Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"

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
  const { t } = useTranslation()
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
          {t("pantheon.symbol")}:
        </span>
        <span className="text-xs font-serif italic text-muted-foreground">
          {symbol}
        </span>
      </div>
    </div>
  )
}

export function PantheonSection() {
  const { t } = useTranslation()
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
          {t("pantheon.title")}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-2xl">
        {t("pantheon.subtitle")}
      </p>

      <Tabs defaultValue="greater" className="w-full">
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger
            value="greater"
            className="font-serif text-sm data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            {t("pantheon.greater")}
          </TabsTrigger>
          <TabsTrigger
            value="lesser"
            className="font-serif text-sm data-[state=active]:bg-background data-[state=active]:text-primary"
          >
            {t("pantheon.lesser")}
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
