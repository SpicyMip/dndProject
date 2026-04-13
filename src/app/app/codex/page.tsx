"use client"

import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Skull, Eye, Flame, Shield } from "lucide-react"
import Link from "next/link"

const chapters = [
  {
    title: "Chapter I: The Primordial Fracture",
    icon: Flame,
    content:
      "Before the gods shaped the world, there existed only the Primordial Fracture -- a wound in reality itself. From this wound poured raw creation and raw destruction in equal measure. The first beings to emerge were neither divine nor mortal, but something in between: the Architects. They wove the fabric of existence with their thoughts, but their greatest creation was also their greatest mistake.",
  },
  {
    title: "Chapter II: The Architects' Folly",
    icon: Eye,
    content:
      "The Architects sought to create a perfect world, one without entropy or decay. They forged the Obsidian Crown as a tool of absolute order -- a device that could rewrite the fundamental laws of reality. But perfection, they learned, requires the elimination of free will. The Crown corrupted its wielders, turning benevolent creators into tyrannical overlords. A civil war among the Architects shattered the Crown into seven fragments.",
  },
  {
    title: "Chapter III: The Eldergate Compact",
    icon: Shield,
    content:
      "The surviving Architects, horrified by the devastation they had wrought, created the Eldergate -- a dimensional seal powered by seven keys, each bound to a fragment of the Crown. The Compact stated that no single being could ever reassemble the Crown. The keys were hidden across planes, their locations encoded in riddles and guarded by beings of immense power. The Architects then sacrificed themselves to become the foundation of the new world, their bodies forming the continents and their dreams becoming the first gods.",
  },
  {
    title: "Chapter IV: The Codex of Unmaking",
    icon: Skull,
    content:
      "This tome -- the very text you are reading -- was written by the last Architect, known only as The Scribe. It contains the true names of the seven keys and the ritual to either restore or permanently destroy the Obsidian Crown. The Scribe's final warning reads: 'He who seeks to unmake the Crown must first unmake himself. The ritual demands not power, but sacrifice. The Crown does not break -- it transforms. And what it transforms into depends entirely on the heart of the one who holds it.' The seventh key has never been found. Some believe it does not exist in physical form, but is rather a choice -- the choice to let go of power itself.",
  },
]

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function CodexPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-sidebar">
        <div className="mx-auto max-w-3xl flex items-center gap-4 px-4 py-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Archive
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-foreground text-balance">
              The Codex of Unmaking
            </h1>
          </div>
          <p className="font-mono text-xs text-primary/70 mb-2 tracking-wider uppercase">
            Sealed Archive // Clearance: ELDERGATE
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            You have breached the seal. The following texts were inscribed by The Scribe,
            the last of the Architects, as a warning to those who would seek the
            Obsidian Crown. Read carefully -- for knowledge, once gained, cannot be
            unlearned.
          </p>

          {/* Chapters */}
          <div className="flex flex-col gap-8">
            {chapters.map((chapter, i) => {
              const Icon = chapter.icon
              return (
                <motion.article
                  key={chapter.title}
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.5, delay: 0.15 * (i + 1), ease: "easeOut" }}
                  className="parchment-card rounded-lg border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="font-serif text-lg font-semibold text-foreground">
                      {chapter.title}
                    </h2>
                  </div>
                  <p className="text-sm text-secondary-foreground leading-relaxed font-serif">
                    {chapter.content}
                  </p>
                </motion.article>
              )
            })}
          </div>

          {/* Final warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-5"
          >
            <p className="text-center font-mono text-xs text-destructive leading-relaxed">
              {"// WARNING: This document is classified ELDERGATE-LEVEL-7."}
              <br />
              {"// Unauthorized access will be reported to the Archive Wardens."}
              <br />
              {"// The Scribe's final coordinates: 47.3769N, 8.5417E"}
            </p>
          </motion.div>

          {/* Footer */}
          <div className="mt-12 border-t border-border pt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Seal the Codex and return
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
