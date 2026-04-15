import { Shield, Crosshair, Wand2, Flame, Gem } from "lucide-react"

export const classIcons: Record<string, React.ElementType> = {
  Paladin: Shield,
  Ranger: Crosshair,
  Sorcerer: Wand2,
  Fighter: Flame,
  Warlock: Wand2,
  Cleric: Shield,
  Rogue: Crosshair,
  Wizard: Wand2,
  Barbarian: Flame,
  Bard: Wand2,
  Druid: Gem,
  Monk: Crosshair,
}

export const statLabels = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const
export const statKeys = ["str", "dex", "con", "int", "wis", "cha"] as const
