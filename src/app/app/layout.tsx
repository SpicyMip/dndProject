import React from "react"
import type { Metadata, Viewport } from "next"
import { Lora, Fira_Code } from "next/font/google"
import { PartyProvider } from "@/lib/party-context"
import { InterpretationProvider } from "@/lib/interpretation-context"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const _lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const _firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  title: "The Arcane Archivist | D&D Campaign Hub",
  description:
    "A mystical campaign hub for tracking your Dungeons & Dragons adventures. Chronicles, bestiary, pantheon, and arcane secrets await.",
}

export const viewport: Viewport = {
  themeColor: "#1a2332",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_lora.variable} ${_firaCode.variable}`}>
      {/* <!-- The Arcane Archivist v2.7.1 - "In the convergence of worlds, seek the key that binds: ELDERGATE-SIGMA-7" --> */}
      <body className="font-serif antialiased">
        <AuthProvider>
          <LanguageProvider>
            <PartyProvider>
              <InterpretationProvider>
                {children}
                <Toaster />
              </InterpretationProvider>
            </PartyProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
