"use client"

import { Book, Users, Skull, Terminal, Sparkles, Menu, ClipboardList, BookText, LogOut, ShieldCheck, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/language-context"

const navItems = [
  { id: "chronicle", labelKey: "sidebar.chronicles", icon: Book },
  { id: "profile", labelKey: "sidebar.archive", icon: UserIcon },
  { id: "pantheon", labelKey: "sidebar.pantheon", icon: Sparkles },
  { id: "bestiary", labelKey: "sidebar.bestiary", icon: Skull },
  { id: "party", labelKey: "sidebar.party", icon: Users },
  { id: "notices", labelKey: "sidebar.notices", icon: ClipboardList },
  { id: "lexicon", labelKey: "sidebar.lexicon", icon: BookText },
  { id: "terminal", labelKey: "sidebar.terminal", icon: Terminal },
]

const adminItems = [
  { id: "admin", labelKey: "sidebar.admin", icon: ShieldCheck },
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
  const { isAdmin } = useAuth()
  const { t } = useTranslation()

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
            <span>{t(item.labelKey)}</span>
            </button>
            )
            })}

            {isAdmin && (
            <>
            <div className="my-2 border-t border-border/50 mx-3" />
            {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                onItemClick?.()
              }}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-serif transition-all duration-200",
                activeSection === item.id
                  ? "bg-primary/10 text-primary arcane-glow"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </button>
            ))}
            </>
            )}
            </nav>

  )
}

export function AppSidebar({ activeSection, onNavigate }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const { t, language, setLanguage } = useTranslation()

  function handleLogout() {
    if (confirm(t("sidebar.logout_confirm"))) {
      logout()
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-base font-serif font-semibold text-foreground tracking-wide">
            {t("sidebar.title")}
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto arcane-scrollbar">
          <SidebarNav activeSection={activeSection} onNavigate={onNavigate} />
        </div>
        
        <div className="p-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between px-3 py-1 bg-secondary/20 rounded-md border border-white/5">
            <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-widest">{t("sidebar.language")}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setLanguage("es")} 
                className={cn("text-[10px] font-mono transition-colors", language === "es" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground")}
              >
                ES
              </button>
              <span className="text-[10px] text-muted-foreground">/</span>
              <button 
                onClick={() => setLanguage("en")} 
                className={cn("text-[10px] font-mono transition-colors", language === "en" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground")}
              >
                EN
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-serif text-muted-foreground hover:bg-red-900/10 hover:text-red-500 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{t("sidebar.logout")}</span>
          </button>
          
          <div className="px-3 py-1">
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              {t("sidebar.version")}
              <br />
              {t("sidebar.status_active")}
            </p>
          </div>
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
          <SheetContent side="left" className="w-64 bg-sidebar border-border p-0 flex flex-col h-full">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center gap-2 border-b border-border px-4 py-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-serif font-semibold text-foreground tracking-wide">
                {t("sidebar.title")}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                activeSection={activeSection}
                onNavigate={onNavigate}
                onItemClick={() => setMobileOpen(false)}
              />
            </div>
            
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-serif text-muted-foreground hover:bg-red-900/10 hover:text-red-500 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>{t("sidebar.logout")}</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-serif text-sm font-semibold text-foreground">
          {t("sidebar.title")}
        </span>
      </header>
    </>
  )
}
