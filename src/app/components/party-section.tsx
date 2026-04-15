"use client"

import React, { useState, useEffect } from "react"
import { Users, ArrowLeftRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParty } from "@/lib/party-context"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/language-context"

// Modular Components
import { PlayerCharacterSheet } from "./party/player-character-sheet"
import { DMCharacterCard } from "./party/dm-character-card"
import { DMCharacterSheet } from "./party/dm-character-sheet"
import { ConsolidatedInventoryPanel, PlayerInventoryPanel } from "./party/inventory-panels"

export function PartySection() {
  const { userRole, currentUserId, party, loading, toggleRole, refresh } = useParty()
  const { isAdmin } = useAuth()
  const { t } = useTranslation()
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  useEffect(() => {
    refresh()
  }, [])

  if (loading && party.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50 animate-pulse">
        <Users className="h-12 w-12 text-primary/40" />
        <p className="font-mono text-sm uppercase tracking-widest text-primary/60">
          {t("common.loading")}
        </p>
      </section>
    )
  }

  const myCharacter = party.find((c) => c.ownerId === currentUserId)

  return (
    <section aria-label="Party Sanctum" className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground text-balance">
            {t("party.title")}
          </h2>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRole}
            className="font-mono text-xs gap-1.5"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Switch to</span> {userRole === "DM" ? "Player" : "DM"}
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {userRole === "DM"
          ? "As Dungeon Master, you have full visibility and control over all party members."
          : "View and manage your character sheet. Your influence reflects your impact on the campaign world."}
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-4">
          {userRole === "PLAYER" ? (
            myCharacter ? (
              <Card className="parchment-card border-border p-4 sm:p-6">
                <PlayerCharacterSheet character={myCharacter} />
              </Card>
            ) : (
              <Card className="parchment-card border-border p-6">
                <p className="text-center text-muted-foreground font-mono text-sm">
                  No character assigned to your account.
                </p>
              </Card>
            )
          ) : (
            <>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Adventurers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {party.map((character) => (
                  <DMCharacterCard
                    key={character.id}
                    character={character}
                    onClick={() => setSelectedCharacterId(character.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Inventory Sidebar */}
        <div className="xl:col-span-1">
          {userRole === "DM" ? (
            <ConsolidatedInventoryPanel />
          ) : (
            myCharacter && <PlayerInventoryPanel character={myCharacter} />
          )}
        </div>
      </div>

      {/* DM Character Edit Sheet */}
      {selectedCharacterId && (
        <DMCharacterSheet
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}
    </section>
  )
}
