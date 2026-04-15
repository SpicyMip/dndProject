"use client"

import { useMemo, Fragment } from "react"
import { useInterpretations } from "@/lib/interpretation-context"
import { cn } from "@/lib/utils"

interface ArcaneTextProps {
  children: string
  className?: string
  /** Use light mode colors for light backgrounds like parchment */
  lightMode?: boolean
}

type TextSegment =
  | { type: "plain"; text: string }
  | { type: "symbol"; symbol: string; translation: string | null }

/**
 * ArcaneText component that scans text for symbol sequences matching the campaign's Lexicon.
 * - Symbols are rendered in a magic/mono font style
 * - If the user has deciphered it, shows the translation below
 */
export function ArcaneText({ children, className, lightMode = false }: ArcaneTextProps) {
  const { interpretations, words } = useInterpretations()

  const segments = useMemo(() => {
    if (!children || words.length === 0) {
      return [{ type: "plain" as const, text: children }]
    }

    // Sort words by length descending to match longer sequences first
    const sortedSymbols = [...words]
      .sort((a, b) => b.symbolSequence.length - a.symbolSequence.length)
      .map((w) => w.symbolSequence)

    // Escape special regex characters and create pattern
    const escapedPatterns = sortedSymbols.map((s) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    
    if (escapedPatterns.length === 0) {
      return [{ type: "plain" as const, text: children }]
    }

    const pattern = new RegExp(`(${escapedPatterns.join("|")})`, "gi")
    const parts = children.split(pattern)

    const result: TextSegment[] = []

    for (const part of parts) {
      if (!part) continue

      // Check if this part matches any symbol (case-insensitive)
      const matchingWord = words.find(
        (w) => w.symbolSequence.toUpperCase() === part.toUpperCase()
      )

      if (matchingWord) {
        // Look for user interpretation
        const interpretation = interpretations.find(i => i.wordId === matchingWord.id)
        
        result.push({
          type: "symbol",
          symbol: part,
          translation: interpretation ? interpretation.interpretation : null,
        })
      } else {
        result.push({ type: "plain", text: part })
      }
    }

    return result
  }, [children, interpretations, words])

  // If no symbols found, just render as plain text
  const hasSymbols = segments.some((s) => s.type === "symbol")
  if (!hasSymbols) {
    return <span className={className}>{children}</span>
  }

  return (
    <span className={cn("inline", className)}>
      {segments.map((segment, index) => {
        if (segment.type === "plain") {
          return <Fragment key={index}>{segment.text}</Fragment>
        }

        // Symbol segment
        const { symbol, translation } = segment
        const hasTranslation = translation !== null

        return (
          <span
            key={index}
            className="inline-flex flex-col items-center mx-0.5 align-baseline"
          >
            <span
              className={cn(
                "font-mono font-bold tracking-tighter leading-none",
                lightMode ? "text-emerald-700" : "text-primary",
                !hasTranslation && (lightMode ? "border-b border-dashed border-amber-700/50" : "border-b border-dashed border-muted-foreground")
              )}
              title={hasTranslation ? translation : "Unknown symbol"}
            >
              {symbol}
              {!hasTranslation && (
                <span className={cn("text-[0.6em] ml-0.5 opacity-60", lightMode ? "text-amber-800" : "text-muted-foreground")}>?</span>
              )}
            </span>
            {hasTranslation && (
              <span className={cn("font-mono text-[0.65em] leading-none mt-0.5 opacity-80", lightMode ? "text-amber-800" : "text-muted-foreground")}>
                {translation}
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export function ArcaneSymbol({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "font-mono text-primary font-bold tracking-tighter border-b border-dashed border-muted-foreground",
        className
      )}
    >
      {children}
      <span className="text-[0.6em] text-muted-foreground ml-0.5 opacity-60">?</span>
    </span>
  )
}
