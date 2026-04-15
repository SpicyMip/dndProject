"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import es from "./translations/es.json"
import en from "./translations/en.json"

type Language = "es" | "en"
type Translations = typeof es

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string, variables?: Record<string, string>) => string
}

const translations: Record<Language, any> = { es, en }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language
    if (saved && (saved === "es" || saved === "en")) {
      setLanguageState(saved)
    } else {
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "en") setLanguageState("en")
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("app_lang", lang)
  }

  const t = (path: string, variables?: Record<string, string>): string => {
    const keys = path.split(".")
    let current = translations[language]
    for (const key of keys) {
      if (current[key] === undefined) return path
      current = current[key]
    }
    
    let result = current as unknown as string
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value)
      })
    }
    return result
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
