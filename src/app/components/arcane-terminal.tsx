"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Terminal } from "lucide-react"
import { terminalCommands, UNLOCK_KEY } from "@/lib/campaign-data"

interface TerminalLine {
  id: number
  text: string
  type: "command" | "response" | "success" | "error" | "info" | "lore" | "system"
}

function Confetti() {
  const colors = [
    "hsl(155 60% 45%)",
    "hsl(270 50% 55%)",
    "hsl(35 80% 55%)",
    "hsl(200 70% 50%)",
    "hsl(340 65% 55%)",
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece absolute w-2.5 h-2.5 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

interface ArcaneTerminalProps {
  onUnlock: () => void
}

export function ArcaneTerminal({ onUnlock }: ArcaneTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 0,
      text: "=== ARCANE TERMINAL v2.7.1 ===",
      type: "system",
    },
    {
      id: 1,
      text: 'Welcome, Chronicler. Type "help" for available commands.',
      type: "system",
    },
  ])
  const [input, setInput] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [lineCounter, setLineCounter] = useState(2) // Declare setLineCounter variable
  const nextId = useRef(2)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const addLine = useCallback(
    (text: string, type: TerminalLine["type"]) => {
      const id = nextId.current++
      setLines((prevLines) => [...prevLines, { id, text, type }])
    },
    []
  )

  function handleCommand(raw: string) {
    const cmd = raw.trim().toLowerCase()
    addLine(`> ${raw}`, "command")

    if (!cmd) return

    if (cmd === "clear") {
      setLines([])
      nextId.current = 0
      return
    }

    // Check built-in commands
    if (terminalCommands[cmd]) {
      addLine(terminalCommands[cmd].response, terminalCommands[cmd].type)
      return
    }

    // Unlock command
    if (cmd.startsWith("unlock ")) {
      const key = raw.trim().slice(7).trim()
      if (key.toUpperCase() === UNLOCK_KEY) {
        addLine(
          "ACCESS GRANTED. The Eldergate seal has been broken.",
          "success"
        )
        addLine(
          "Unlocking hidden lore: The Codex of Unmaking...",
          "success"
        )
        addLine(
          "A new section has appeared in the Archive. Navigate to discover its secrets.",
          "lore"
        )
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
        onUnlock()
      } else {
        addLine(
          `Invalid key: "${key}". The arcane wards hold firm.`,
          "error"
        )
      }
      return
    }

    // Inspect command
    if (cmd.startsWith("inspect ")) {
      const target = cmd.slice(8).trim()
      const inspections: Record<string, string> = {
        "obsidian key":
          "A jagged key carved from pure obsidian. Faint runes pulse with a dim violet light. It feels warm to the touch, as if something slumbers within.",
        key: "A jagged key carved from pure obsidian. Faint runes pulse with a dim violet light. It feels warm to the touch, as if something slumbers within.",
        "arcane focus":
          "A crystalline orb that refracts light into impossible colors. When held, you can faintly hear whispers in a language you don't understand.",
        crystal:
          "A crystalline orb that refracts light into impossible colors. When held, you can faintly hear whispers in a language you don't understand.",
        terminal:
          "The Arcane Terminal hums with residual magic. Its surface is etched with sigils that seem to shift when you're not looking directly at them. A maker's mark reads: 'Crafted in the forges of the Eldergate.'",
        archive:
          "The Archive stretches beyond what the eye can see. Shelves of crystallized memories line the walls, each one containing the echo of a forgotten story. The air smells of old parchment and ozone.",
        self: "You see a weathered adventurer staring back at you. Scars of many battles, but eyes still burning with curiosity. The Archive recognizes you.",
      }

      if (inspections[target]) {
        addLine(inspections[target], "lore")
      } else {
        addLine(
          `You inspect "${target}" but find nothing of note. Perhaps try something else.`,
          "info"
        )
      }
      return
    }

    // Decode command
    if (cmd.startsWith("decode ")) {
      const encoded = raw.trim().slice(7).trim()
      try {
        const decoded = atob(encoded)
        addLine(`Decoded: ${decoded}`, "success")
      } catch {
        addLine(
          "Decoding failed. The string appears to be corrupted or invalid.",
          "error"
        )
      }
      return
    }

    addLine(
      `Unknown command: "${cmd}". Type "help" for available commands.`,
      "error"
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleCommand(input)
    setInput("")
  }

  const typeColorMap: Record<string, string> = {
    command: "text-foreground",
    response: "text-foreground",
    success: "text-primary arcane-glow-text",
    error: "text-destructive",
    info: "text-muted-foreground",
    lore: "text-primary italic",
    system: "text-primary/70",
  }

  return (
    <section aria-label="Arcane Terminal">
      {showConfetti && <Confetti />}

      <div className="flex items-center gap-3 mb-6">
        <Terminal className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-serif font-bold text-foreground text-balance">
          The Arcane Terminal
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
        A mystical interface for interacting with the Archive directly. Use
        commands to inspect objects, unlock sealed content, and decode hidden
        messages. Some keys can only be found at the table.
      </p>

      <div className="terminal-bg rounded-lg border border-border overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 bg-secondary/30">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-chart-3/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground ml-2">
            arcane-terminal@archivist ~ %
          </span>
        </div>

        {/* Terminal Body */}
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto arcane-scrollbar p-4"
          onClick={() => inputRef.current?.focus()}
          role="log"
          aria-live="polite"
        >
          {lines.map((line) => (
            <pre
              key={line.id}
              className={`font-mono text-xs leading-relaxed whitespace-pre-wrap ${
                typeColorMap[line.type] || "text-foreground"
              }`}
            >
              {line.text}
            </pre>
          ))}
        </div>

        {/* Terminal Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border px-4 py-2.5"
        >
          <span className="font-mono text-xs text-primary shrink-0">
            {">"}{" "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Enter command..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command input"
          />
        </form>
      </div>
    </section>
  )
}
