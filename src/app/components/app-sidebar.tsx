"use client"

import { Book, Users, Skull, Terminal, Sparkles, Menu, ClipboardList, BookText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { id: "chronicle", label: "Chronicle", icon: Book },
  { id: "pantheon", label: "Pantheon", icon: Sparkles },
  { id: "bestiary", label: "Bestiary", icon: Skull },
  { id: "party", label: "Party Status", icon: Users },
  { id: "notices", label: "Notice Board", icon: ClipboardList },
  { id: "lexicon", label: "Lexicon", icon: BookText },
  { id: "terminal", label: "Arcane Terminal", icon: Terminal },
]

interface AppSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

function SidebarNav({
  activeSection,
  onNavigate,
  onItemClick,
}: AppSidebarProps & { onItemClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3" role="navigation" aria-label="Campaign sections">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id)
              onItemClick?.()
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-serif transition-all duration-200",
              isActive
                ? "bg-secondary text-primary arcane-glow"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
            )}
            <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function AppSidebar({ activeSection, onNavigate }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-base font-serif font-semibold text-foreground tracking-wide">
            The Arcane Archivist
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto arcane-scrollbar">
          <SidebarNav activeSection={activeSection} onNavigate={onNavigate} />
        </div>
        <div className="border-t border-border px-4 py-3">
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            {"// Chronicle v2.7.1"}
            <br />
            {"// Status: ACTIVE"}
          </p>
        </div>
      </aside>

      {/* Mobile Header + Drawer */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar border-border p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-2 border-b border-border px-4 py-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-serif font-semibold text-foreground tracking-wide">
                The Arcane Archivist
              </span>
            </div>
            <SidebarNav
              activeSection={activeSection}
              onNavigate={onNavigate}
              onItemClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-serif text-sm font-semibold text-foreground">
          The Arcane Archivist
        </span>
      </header>
    </>
  )
}
