"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { api } from "./api"
import { useAuth } from "./auth-context"

export interface Interpretation {
  id: number
  wordId: number
  interpretation: string
  notes?: string
}

// We also need the original words to know the symbols
export interface LexiconWord {
  id: number
  symbolSequence: string
}

interface InterpretationContextType {
  interpretations: Interpretation[]
  words: LexiconWord[]
  loading: boolean
  refresh: () => Promise<void>
}

const InterpretationContext = createContext<InterpretationContextType | undefined>(undefined)

export function InterpretationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [interpretations, setInterpretations] = useState<Interpretation[]>([])
  const [words, setWords] = useState<LexiconWord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!user) return
    try {
      const [wordsData, entriesData] = await Promise.all([
        api.get<{ words: LexiconWord[] }>("/lexicon/words"),
        api.get<{ entries: Interpretation[] }>("/lexicon/my-entries")
      ])
      setWords(wordsData.words || [])
      setInterpretations(entriesData.entries || [])
    } catch (error) {
      console.error("Failed to fetch lexicon data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  return (
    <InterpretationContext.Provider value={{
      interpretations,
      words,
      loading,
      refresh: fetchData
    }}>
      {children}
    </InterpretationContext.Provider>
  )
}

export function useInterpretations() {
  const context = useContext(InterpretationContext)
  if (context === undefined) {
    throw new Error("useInterpretations must be used within an InterpretationProvider")
  }
  return context
}
