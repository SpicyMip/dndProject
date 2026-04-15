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
import { AdminSection } from "@/app/admin/page"
import { MyCharactersSection } from "@/components/profile/my-characters"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Skull, Eye, Flame, Shield } from "lucide-react"
import { useTranslation } from "@/lib/language-context"

const sectionVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
}

function CodexContent() {
  const { t } = useTranslation()
  const chapters = [
    {
      title: t("codex.chapters.0.title"),
      icon: Flame,
      content: t("codex.chapters.0.content"),
    },
    {
      title: t("codex.chapters.1.title"),
      icon: Eye,
      content: t("codex.chapters.1.content"),
    },
    {
      title: t("codex.chapters.2.title"),
      icon: Shield,
      content: t("codex.chapters.2.content"),
    },
    {
      title: t("codex.chapters.3.title"),
      icon: Skull,
      content: t("codex.chapters.3.content"),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-foreground">
          {t("codex.title")}
        </h1>
      </div>
      <p className="font-mono text-xs text-primary/70 mb-8 tracking-wider uppercase">
        {t("codex.subtitle")}
      </p>

      <div className="flex flex-col gap-8">
        {chapters.map((chapter) => (
          <article key={chapter.title} className="parchment-card rounded-lg border border-border p-6 bg-secondary/10">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">{chapter.title}</h2>
            <p className="text-sm text-secondary-foreground leading-relaxed font-serif">{chapter.content}</p>
          </article>
        ))}
      </div>
    </motion.div>
  )
}

export default function CodexPage() {
  const [activeSection, setActiveSection] = useState("chronicle")

  function renderSection() {
    switch (activeSection) {
      case "chronicle": return <ChronicleSection />
      case "pantheon": return <PantheonSection />
      case "bestiary": return <BestiarySection />
      case "party": return <PartySection />
      case "notices": return <NoticeBoard />
      case "lexicon": return <LexiconSection />
      case "terminal": return <ArcaneTerminal onUnlock={() => {}} />
      case "admin": return <AdminSection />
      case "profile": return <MyCharactersSection />
      case "codex_lore": return <CodexContent />
      default: return <ChronicleSection />
    }
  }

  return (
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
        </div>
      </main>
    </div>
  )
}
