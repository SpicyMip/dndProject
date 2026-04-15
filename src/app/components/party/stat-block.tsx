"use client"

import { Input } from "@/components/ui/input"
import { type Character } from "@/lib/party-context"
import { statKeys, statLabels } from "./constants"

interface StatBlockProps {
  stats: Character["stats"]
  editable?: boolean
  onChange?: (key: string, value: number) => void
}

export function StatBlock({ stats, editable, onChange }: StatBlockProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {statKeys.map((key, i) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-md border border-border bg-secondary/50 px-2 py-1.5"
        >
          <span className="font-mono text-[10px] text-muted-foreground">
            {statLabels[i]}
          </span>
          {editable ? (
            <Input
              type="number"
              value={stats[key]}
              onChange={(e) => onChange?.(key, parseInt(e.target.value) || 0)}
              className="h-6 w-10 text-center font-mono text-sm p-0 border-0 bg-transparent"
            />
          ) : (
            <span className="font-mono text-sm font-semibold text-foreground">
              {stats[key]}
            </span>
          )}
          <span className="font-mono text-[9px] text-muted-foreground">
            {Math.floor((stats[key] - 10) / 2) >= 0 ? "+" : ""}
            {Math.floor((stats[key] - 10) / 2)}
          </span>
        </div>
      ))}
    </div>
  )
}
