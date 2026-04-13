"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChronicleSection } from "@/components/chronicle-section"
import { PantheonSection } from "@/components/pantheon-section"
import { BestiarySection } from "@/components/bestiary-section"
import { PartySection } from "@/components/party-section"
import { ArcaneTerminal } from "@/components/arcane-terminal"
import { NoticeBoard } from "@/components/notice-board"
import { LexiconSection } from "@/components/lexicon-section"
import { InterpretationProvider } from "@/lib/interpretation-context"
import { PartyProvider } from "@/lib/party-context"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

const sectionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
}

export default function Page() {
  const [activeSection, setActiveSection] = useState("chronicle")
  const [codexUnlocked, setCodexUnlocked] = useState(false)

  function handleUnlock() {
    setCodexUnlocked(true)
  }

  function renderSection() {
    switch (activeSection) {
      case "chronicle":
        return <ChronicleSection />
      case "pantheon":
        return <PantheonSection />
      case "bestiary":
        return <BestiarySection />
      case "party":
        return <PartySection />
      case "notices":
        return <NoticeBoard />
      case "lexicon":
        return <LexiconSection />
      case "terminal":
        return <ArcaneTerminal onUnlock={handleUnlock} />
      default:
        return <ChronicleSection />
    }
  }

  return (
    <PartyProvider>
      <InterpretationProvider>
        <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <AppSidebar activeSection={activeSection} onNavigate={setActiveSection} />

        <main className="flex-1 min-w-0">
          <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={sectionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>

            {/* Codex unlocked banner */}
            <AnimatePresence>
              {codexUnlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-10 rounded-lg border border-primary/30 bg-primary/5 px-6 py-5 arcane-glow"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-serif text-base font-semibold text-primary mb-1">
                        The Codex of Unmaking has been revealed
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        You have broken the Eldergate seal. A hidden section of the Archive is now accessible.
                      </p>
                      <Link
                        href="/codex"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-mono font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Enter the Codex
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        </div>
      </InterpretationProvider>
    </PartyProvider>
  )
}
