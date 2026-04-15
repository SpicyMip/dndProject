"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useDragControls, type PanInfo, AnimatePresence } from "framer-motion"
import { Pin, Scroll, Coins, Megaphone, X, BookText, Info, Save, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArcaneText } from "./arcane-text"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export interface Notice {
  id: string
  type: "mission" | "ad" | "news"
  title: string
  content: string
  active: boolean
  createdAt: string
  position: { x: number; y: number }
  rotation: number
}

const typeConfig = {
  mission: { icon: Scroll, color: "bg-red-900/40", borderColor: "border-red-500/30", textColor: "text-red-200", shadow: "shadow-red-900/20" },
  ad: { icon: Coins, color: "bg-amber-900/40", borderColor: "border-amber-500/30", textColor: "text-amber-200", shadow: "shadow-amber-900/20" },
  news: { icon: Megaphone, color: "bg-blue-900/40", borderColor: "border-blue-500/30", textColor: "text-blue-200", shadow: "shadow-blue-900/20" },
}

// --- Algoritmo de posicionamiento sin solapamiento ---
function getNonOverlappingPosition(placedPositions: {x: number, y: number}[], containerWidth: number, containerHeight: number) {
  const cardWidth = 200;
  const cardHeight = 220;
  const maxAttempts = 50;
  
  for (let i = 0; i < maxAttempts; i++) {
    const x = Math.floor(Math.random() * (containerWidth - cardWidth));
    const y = Math.floor(Math.random() * (containerHeight - cardHeight));
    
    // Verificar si colisiona con alguna ya puesta
    const collides = placedPositions.some(p => {
      return x < p.x + cardWidth &&
             x + cardWidth > p.x &&
             y < p.y + cardHeight &&
             y + cardHeight > p.y;
    });
    
    if (!collides) return { x, y };
  }
  
  // Si no encuentra hueco, aleatorio total como fallback
  return { 
    x: Math.floor(Math.random() * (containerWidth - cardWidth)), 
    y: Math.floor(Math.random() * (containerHeight - cardHeight)) 
  };
}

function ArcaneFragment({ symbol, lexiconData, onUpdate }: { symbol: string, lexiconData: any[], onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [val, setVal] = useState("")
  const entry = lexiconData.find(e => e.symbolSequence === symbol)

  useEffect(() => { if (entry) setVal(entry.interpretation || "") }, [entry])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry) return
    try {
      await apiFetch("/lexicon/my-entries", {
        method: "POST",
        body: JSON.stringify({ wordId: entry.id, interpretation: val })
      })
      toast.success(t("notices.interpretation_updated", { symbol }))
      setIsEditing(false)
      onUpdate()
    } catch { toast.error(t("notices.save_failed")) }
  }

  return (
    <span className="inline-flex flex-col items-center align-middle mx-1 relative group">
      <button onClick={() => setIsEditing(!isEditing)} className={cn("px-2 py-0.5 rounded border font-mono font-bold tracking-tighter transition-all duration-500", "bg-primary/10 border-primary/30 text-primary arcane-flicker shadow-[0_0_15px_rgba(var(--primary),0.2)]", "hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]")}><ArcaneText>{symbol}</ArcaneText></button>
      <span className="text-[10px] font-serif italic text-primary/60 h-4 mt-0.5 leading-none transition-all group-hover:text-primary">{entry?.interpretation || "???"}</span>
      <AnimatePresence>{isEditing && (<motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onSubmit={handleSave} className="absolute bottom-full mb-2 z-50 bg-[#1a140f] border border-primary/40 p-2 rounded-lg shadow-2xl flex gap-2 items-center min-w-[200px]"><Input autoFocus className="h-7 text-[10px] bg-black/40 border-primary/20 text-primary font-serif italic" value={val} onChange={e => setVal(e.target.value)} placeholder={t("notices.translate_placeholder")} /><button type="submit" className="p-1 hover:text-primary transition-colors"><Save className="h-4 w-4" /></button></motion.form>)}</AnimatePresence>
    </span>
  )
}

function LexiconParser({ content, lexiconData, onUpdate }: { content: string, lexiconData: any[], onUpdate: () => void }) {
  const parts = useMemo(() => content.split(/(<lexicon>.*?<\/lexicon\/?>)/g), [content])
  return (
    <div className="leading-[2.2] whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("<lexicon>")) {
          const symbol = part.replace(/<\/?lexicon\/?>/g, "")
          return <ArcaneFragment key={i} symbol={symbol} lexiconData={lexiconData} onUpdate={onUpdate} />
        }
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}

export function NoticeBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [notices, setNotices] = useState<Notice[]>([])
  const [lexiconData, setLexiconData] = useState<any[]>([])
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [zIndices, setZIndices] = useState<Record<string, number>>({})
  const [topZ, setTopZ] = useState(0)

  const fetchData = async () => {
    try {
      const [noticesData, wordsData, myEntriesData] = await Promise.all([
        apiFetch<{ notices: Notice[] }>("/notices"),
        apiFetch<{ words: any[] }>("/lexicon/words"),
        apiFetch<{ entries: any[] }>("/lexicon/my-entries")
      ])
      
      const combinedLexicon = wordsData.words.map(w => {
        const entry = myEntriesData.entries.find(e => e.wordId === w.id)
        return { ...w, interpretation: entry?.interpretation }
      })
      setLexiconData(combinedLexicon)
      
      // Obtener dimensiones reales del contenedor o usar defaults
      const boardW = containerRef.current?.offsetWidth || 800;
      const boardH = containerRef.current?.offsetHeight || 600;
      const placed: {x: number, y: number}[] = [];

      const activeNotices = noticesData.notices
        .filter((n) => n.active)
        .map((n) => {
          const pos = getNonOverlappingPosition(placed, boardW, boardH);
          placed.push(pos);
          return {
            ...n,
            position: pos,
            rotation: Math.floor(Math.random() * 16) - 8, // Rotación más suave (-8 a 8)
          };
        })
      setNotices(activeNotices)
      setZIndices(Object.fromEntries(activeNotices.map((n, i) => [n.id, i])))
      setTopZ(activeNotices.length)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchData()
    const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") + "/ws"
    const socket = new WebSocket(wsUrl)
    socket.onmessage = (e) => { if (e.data === "notices_updated") fetchData() }
    return () => socket.close()
  }, [])

  return (
    <section className="relative h-[calc(100vh-12rem)] w-full overflow-hidden rounded-xl border border-amber-900/20 bg-[#1a140f] p-4 shadow-inner md:p-8">
      <style jsx global>{`
        @keyframes arcane-flicker {
          0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(var(--primary), 0.5); }
          50% { opacity: 0.8; text-shadow: 0 0 20px rgba(var(--primary), 0.8); }
          25%, 75% { opacity: 0.9; }
        }
        .arcane-flicker { animation: arcane-flicker 3s infinite ease-in-out; }
      `}</style>

      <div ref={containerRef} className="relative h-full w-full">
        {notices.map((n) => (
          <DraggableNote key={n.id} notice={n} zIndex={zIndices[n.id] || 0} containerRef={containerRef} onBringToFront={() => { setTopZ(prev => prev + 1); setZIndices(prev => ({ ...prev, [n.id]: topZ + 1 })) }} onOpen={() => setSelectedNotice(n)} onDragEnd={(x, y) => setNotices(prev => prev.map(item => item.id === n.id ? { ...item, position: { x, y } } : item))} />
        ))}
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl border-amber-200/20 bg-[#2a1f18] text-amber-50 shadow-2xl overflow-hidden parchment-texture">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", selectedNotice && typeConfig[selectedNotice.type].textColor, selectedNotice && typeConfig[selectedNotice.type].color)}>{selectedNotice?.type}</span>
              <span className="text-[10px] font-mono opacity-50 uppercase">{selectedNotice && new Date(selectedNotice.createdAt).toLocaleDateString()}</span>
            </div>
            <DialogTitle className="font-serif text-4xl font-bold text-amber-100">{selectedNotice?.title}</DialogTitle>
            <div className="mt-8 font-serif text-xl leading-relaxed text-amber-50/95">
              {selectedNotice && <LexiconParser content={selectedNotice.content} lexiconData={lexiconData} onUpdate={fetchData} />}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function DraggableNote({ notice, zIndex, containerRef, onBringToFront, onOpen, onDragEnd }: any) {
  const { t } = useTranslation()
  const controls = useDragControls()
  const config = typeConfig[notice.type as keyof typeof typeConfig]
  return (
    <motion.div drag dragControls={controls} dragMomentum={false} dragConstraints={containerRef} onDragStart={onBringToFront} onDragEnd={(_, info) => onDragEnd(notice.position.x + info.offset.x, notice.position.y + info.offset.y)} initial={notice.position} animate={{ x: notice.position.x, y: notice.position.y, rotate: notice.rotation }} style={{ zIndex }} className="absolute cursor-grab active:cursor-grabbing">
      <div onClick={(e) => { e.stopPropagation(); onBringToFront() }} className={cn("relative w-48 p-4 rounded-sm border-t-2 shadow-xl bg-[#f4e4bc] text-amber-950 parchment-texture hover:scale-105 transition-transform", config.borderColor, config.shadow)}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-900/40"><Pin className="h-6 w-6 rotate-12" fill="currentColor" /></div>
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between items-center"><config.icon className={cn("h-4 w-4", config.textColor)} /><span className="text-[8px] opacity-40 font-mono">{new Date(notice.createdAt).toLocaleDateString()}</span></div>
          <h3 className="font-serif text-sm font-bold line-clamp-2">{notice.title}</h3>
          <button onClick={(e) => { e.stopPropagation(); onOpen() }} className="mt-2 text-[9px] font-bold uppercase tracking-widest text-amber-900/60 border-t border-amber-900/10 pt-2">{t("notices.read_more")}</button>
        </div>
      </div>
    </motion.div>
  )
}
