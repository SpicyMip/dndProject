"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { api } from "./api"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

export interface InventoryItem {
  id: number
  name: string
  description: string
  quantity: number
  category: "Weapon" | "Armor" | "Consumable" | "Tool" | "Magic Item" | "Misc"
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary"
  isEquippable: boolean
  isEquipped: boolean
  isUsable: boolean
  weight: number
  properties: string
}

export interface Character {
  id: number
  ownerId: string
  name: string
  class: string
  race: string
  level: number
  hp: {
    current?: number
    max?: number
  }
  stats: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
    [key: string]: number
  }
  gold: number
  status: "Active" | "Wounded" | "Unconscious" | "Dead"
  personalItems: InventoryItem[]
}

interface PartyContextType {
  party: Character[]
  characters: Character[]
  loading: boolean
  userRole: "PLAYER" | "DM"
  currentUserId: string | null
  toggleRole: () => void
  refresh: () => Promise<void>
  updateCharacter: (id: number, updates: Partial<Character>) => Promise<void>
  addPersonalItem: (characterId: number, item: Partial<InventoryItem>) => Promise<void>
  updatePersonalItem: (characterId: number, itemId: number, updates: Partial<InventoryItem>) => Promise<void>
  deletePersonalItem: (characterId: number, itemId: number) => Promise<void>
}

const PartyContext = createContext<PartyContextType | undefined>(undefined)

export function PartyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"PLAYER" | "DM">("PLAYER")

  const currentUserId = user?.email || null

  const fetchData = async () => {
    try {
      const charData = await api.get<{ characters: any[] }>("/characters")
      
      const mappedCharacters: Character[] = (charData.characters || []).map(c => ({
        id: c.id,
        ownerId: c.ownerId || "",
        name: c.name,
        class: c.class,
        race: c.race || "Human",
        level: c.level,
        hp: {
          current: c.currentHp,
          max: c.maxHp
        },
        stats: {
          str: c.str || 10,
          dex: c.dex || 10,
          con: c.con || 10,
          int: c.int || 10,
          wis: c.wis || 10,
          cha: c.cha || 10
        },
        gold: c.gold || 0,
        status: (c.status as any) || "Active",
        personalItems: c.personalItems || []
      }))

      setCharacters(mappedCharacters)
    } catch (error) {
      console.error("Failed to fetch party data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const toggleRole = () => {
    setUserRole(prev => prev === "PLAYER" ? "DM" : "PLAYER")
  }

  const refresh = async () => {
    await fetchData()
  }

  const updateCharacter = async (id: number, updates: Partial<Character>) => {
    try {
      const char = characters.find(c => c.id === id)
      if (!char) return

      const backendUpdates: any = { ...updates }
      
      // Map frontend nested objects back to flat backend fields
      if (updates.hp) {
        let newCurrent = updates.hp.current !== undefined ? updates.hp.current : char.hp.current
        let newMax = updates.hp.max !== undefined ? updates.hp.max : char.hp.max

        // Enforce current <= max
        if (newCurrent !== undefined && newMax !== undefined && newCurrent > newMax) {
          newCurrent = newMax
        }

        if (updates.hp.current !== undefined) backendUpdates.currentHp = newCurrent
        if (updates.hp.max !== undefined) backendUpdates.maxHp = newMax
        delete backendUpdates.hp
      }
      if (updates.stats) {
        Object.assign(backendUpdates, updates.stats)
        delete backendUpdates.stats
      }

      // Also ensure we don't send frontend-only fields or influence
      delete backendUpdates.influence

      await api.patch(`/characters/${id}`, backendUpdates)
      
      // Update local state - here we merge the new fields into the character
      // but we need to handle nested objects carefully or just refresh
      await fetchData()
      toast.success("Character updated")
    } catch (error) {
      console.error("Failed to update character:", error)
      toast.error("The weave resisted your intervention")
    }
  }

  const addPersonalItem = async (characterId: number, item: Partial<InventoryItem>) => {
    try {
      const newItem = await api.post<InventoryItem>(`/characters/${characterId}/items`, item)
      fetchData()
      toast.success("Item added")
    } catch (error) {
      toast.error("Failed to add item")
    }
  }

  const updatePersonalItem = async (characterId: number, itemId: number, updates: Partial<InventoryItem>) => {
    try {
      await api.patch(`/characters/items/${itemId}`, updates)
      fetchData()
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const deletePersonalItem = async (characterId: number, itemId: number) => {
    try {
      await api.delete(`/characters/items/${itemId}`)
      fetchData()
      toast.success("Item removed")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  return (
    <PartyContext.Provider value={{
      party: characters,
      characters,
      loading,
      userRole,
      currentUserId,
      toggleRole,
      refresh,
      updateCharacter,
      addPersonalItem,
      updatePersonalItem,
      deletePersonalItem
    }}>
      {children}
    </PartyContext.Provider>
  )
}

export function useParty() {
  const context = useContext(PartyContext)
  if (context === undefined) {
    throw new Error("useParty must be used within a PartyProvider")
  }
  return context
}
