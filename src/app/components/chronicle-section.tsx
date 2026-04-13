"use client"

import { useState, useEffect } from "react"
import { Book, ChevronRight, Lock, Key } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ArcaneText } from "@/components/arcane-text"
import { apiFetch } from "@/lib/api"

interface Session {
  id: string
  title: string
  summary: string
  secret: string
}

interface StoryArc {
  id: string
  title: string
  sessions: Session[]
}

export function ChronicleSection() {
  const [storyArcs, setStoryArcs] = useState<StoryArc[]>([])

  useEffect(() => {
    apiFetch<{ storyArcs: StoryArc[] }>('/chronicles')
      .then(data => setStoryArcs(data.storyArcs))
      .catch(err => console.error("Failed to fetch chronicles:", err))
  }, [])

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Book className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-serif font-bold text-foreground">
          The Chronicles
        </h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {storyArcs.map((arc) => (
          <AccordionItem
            key={arc.id}
            value={arc.id}
            className="border border-border bg-card rounded-lg overflow-hidden px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg font-bold text-primary">
                    {arc.title[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {arc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    {arc.sessions.length} Sessions Record
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-6 pl-14 relative">
                {/* Timeline line */}
                <div className="absolute left-[1.15rem] top-0 bottom-0 w-px bg-border/50" />

                {arc.sessions.map((session, idx) => (
                  <div key={session.id} className="relative space-y-3">
                    {/* Timeline dot */}
                    <div className="absolute -left-[2.1rem] top-1.5 h-3 w-3 rounded-full bg-primary border-4 border-background" />

                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-serif text-base font-bold text-foreground">
                        {session.title}
                      </h4>
                      <Badge variant="outline" className="font-mono text-[10px] uppercase">
                        Part {idx + 1}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <ArcaneText>{session.summary}</ArcaneText>
                    </div>

                    {session.secret && (
                      <div className="group relative mt-4">
                        <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 border-dashed transition-all group-hover:bg-secondary/50">
                          <div className="flex items-center gap-2 mb-2 text-primary">
                            <Lock className="h-3 w-3" />
                            <span className="text-[10px] font-mono uppercase font-bold tracking-widest">
                              Classified Information
                            </span>
                          </div>
                          <p className="text-xs text-secondary-foreground/60 select-none blur-sm group-hover:blur-none transition-all duration-500">
                            {session.secret}
                          </p>
                          <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 border border-border shadow-sm">
                              <Key className="h-3 w-3 text-primary" />
                              <span className="text-[10px] font-mono font-bold uppercase">
                                Hover to reveal secret
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
