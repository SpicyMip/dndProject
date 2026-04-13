"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useDragControls, type PanInfo } from "framer-motion"
import { Pin, Scroll, Coins, Megaphone, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ArcaneText } from "@/components/arcane-text"
import { apiFetch } from "@/lib/api"

export interface Notice {
  id: string
  type: "mission" | "ad" | "news"
  title: string
  content: string
  position: { x: number; y: number }
  rotation: number
}

const typeConfig = {
  mission: {
    icon: Scroll,
    sealColor: "bg-red-700",
    label: "Mission",
  },
  ad: {
    icon: Coins,
    sealColor: "bg-amber-600",
    label: "Advertisement",
  },
  news: {
    icon: Megaphone,
    sealColor: "bg-blue-600",
    label: "News",
  },
}

interface DraggableNoteProps {
  notice: Notice
  onOpen: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
  bringToFront: () => void
  onDragEnd: (id: string, x: number, y: number) => void
  zIndex: number
}

function DraggableNote({
  notice,
  onOpen,
  containerRef,
  bringToFront,
  onDragEnd,
  zIndex,
}: DraggableNoteProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const config = typeConfig[notice.type]
  const Icon = config.icon

  function handleDragStart() {
    setIsDragging(true)
    bringToFront()
  }

  function handleDragEndInternal(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setIsDragging(false)
    onDragEnd(notice.id, notice.position.x + info.offset.x, notice.position.y + info.offset.y)
  }

  function handleClick(e: React.MouseEvent) {
    if (!isDragging) {
      onOpen()
    }
  }

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragConstraints={containerRef}
      dragElastic={0.05}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndInternal}
      initial={{ x: notice.position.x, y: notice.position.y, rotate: notice.rotation }}
      whileDrag={{ scale: 1.05, rotate: 0 }}
      style={{ zIndex }}
      className={cn(
        "absolute w-44 cursor-grab select-none touch-none",
        isDragging && "cursor-grabbing"
      )}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <Pin
            className="h-5 w-5 text-zinc-400 drop-shadow-md"
            style={{ transform: "rotate(45deg)" }}
          />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-zinc-500 shadow-inner" />
        </div>
      </div>

      <NoteCard
        notice={notice}
        config={config}
        Icon={Icon}
        onClick={handleClick}
        onOpen={onOpen}
        isDragging={isDragging}
      />
    </motion.div>
  )
}

interface MobileNoteProps {
  notice: Notice
  onOpen: () => void
}

function MobileNote({ notice, onOpen }: MobileNoteProps) {
  const config = typeConfig[notice.type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ rotate: notice.rotation }}
      className="relative"
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
        <div className="relative">
          <Pin
            className="h-5 w-5 text-zinc-400 drop-shadow-md"
            style={{ transform: "rotate(45deg)" }}
          />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-zinc-500 shadow-inner" />
        </div>
      </div>

      <NoteCard
        notice={notice}
        config={config}
        Icon={Icon}
        onClick={onOpen}
        onOpen={onOpen}
        isDragging={false}
      />
    </motion.div>
  )
}

interface NoteCardProps {
  notice: Notice
  config: typeof typeConfig.mission
  Icon: typeof Scroll
  onClick: (e: React.MouseEvent) => void
  onOpen: () => void
  isDragging: boolean
}

function NoteCard({ notice, config, Icon, onClick, onOpen, isDragging }: NoteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full rounded-sm p-3 pt-4 text-left transition-shadow duration-200",
        "bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50",
        "border border-amber-200/50",
        isDragging
          ? "shadow-2xl shadow-black/30"
          : "shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25"
      )}
      style={{
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
          linear-gradient(135deg, rgb(255 251 235) 0%, rgb(254 243 199) 50%, rgb(255 237 213) 100%)
        `,
      }}
    >
      <div
        className={cn(
          "absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center shadow-md",
          config.sealColor
        )}
      >
        <Icon className="h-3 w-3 text-white/90" />
      </div>

      <h3 className="font-serif text-sm font-semibold text-amber-950 mb-1.5 pr-4 leading-tight">
        {notice.title}
      </h3>
      <div className="font-serif text-xs text-amber-900/70 leading-relaxed line-clamp-3">
        <ArcaneText lightMode>{notice.content}</ArcaneText>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent, transparent 4px, rgb(180 130 80) 4px, rgb(180 130 80) 5px)",
        }}
      />
    </button>
  )
}

export function NoticeBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [notices, setNotices] = useState<Notice[]>([])
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [zIndices, setZIndices] = useState<Record<string, number>>({})
  const [topZ, setTopZ] = useState(0)

  useEffect(() => {
    apiFetch<{ notices: Notice[] }>("/notices")
      .then((data) => {
        setNotices(data.notices)
        setZIndices(Object.fromEntries(data.notices.map((n, i) => [n.id, i])))
        setTopZ(data.notices.length)
      })
      .catch((err) => console.error("Failed to fetch notices:", err))
  }, [])

  function bringToFront(id: string) {
    setTopZ((prev) => prev + 1)
    setZIndices((prev) => ({ ...prev, [id]: topZ + 1 }))
  }

  const handleDragEnd = (id: string, x: number, y: number) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, position: { x, y } } : n)))
    apiFetch(`/notices/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ position: { x, y } }),
    }).catch((err) => console.error("Failed to update notice position:", err))
  }

  const config = selectedNotice ? typeConfig[selectedNotice.type] : null

  return (
    <section aria-labelledby="notice-board-heading">
      <header className="mb-4 sm:mb-6">
        <h2
          id="notice-board-heading"
          className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-wide"
        >
          The Notice Board
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">Drag the notices to rearrange. </span>
          Click to read the full posting.
        </p>
      </header>

      <div
        className="sm:hidden grid grid-cols-2 gap-4 p-4 rounded-lg border border-border"
        style={{
          background: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
            linear-gradient(145deg, hsl(30 25% 22%) 0%, hsl(25 20% 18%) 50%, hsl(30 22% 20%) 100%)
          `,
        }}
      >
        {notices.map((notice) => (
          <MobileNote
            key={notice.id}
            notice={notice}
            onOpen={() => setSelectedNotice(notice)}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative h-[540px] w-full rounded-lg border border-border/50 overflow-hidden shadow-2xl hidden sm:block"
        style={{
          background: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
            linear-gradient(145deg, hsl(30 25% 22%) 0%, hsl(25 20% 18%) 50%, hsl(30 22% 20%) 100%)
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {notices.map((notice) => (
          <DraggableNote
            key={notice.id}
            notice={notice}
            onOpen={() => setSelectedNotice(notice)}
            containerRef={containerRef}
            bringToFront={() => bringToFront(notice.id)}
            onDragEnd={handleDragEnd}
            zIndex={zIndices[notice.id] || 0}
          />
        ))}
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-md bg-amber-50 border-amber-200">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {config && (
                <div className={cn("p-1.5 rounded-full", config.sealColor)}>
                  <config.icon className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-bold">
                {config?.label}
              </span>
            </div>
            <DialogTitle className="font-serif text-2xl text-amber-950">
              {selectedNotice?.title}
            </DialogTitle>
            <DialogDescription className="font-serif text-amber-900/80 leading-relaxed pt-4 text-base italic border-t border-amber-200/50">
              <ArcaneText lightMode>{selectedNotice?.content || ""}</ArcaneText>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
