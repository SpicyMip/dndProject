export const UNLOCK_KEY = "ELDERGATE-SIGMA-7"

export interface TerminalCommand {
  response: string
  type: "command" | "response" | "success" | "error" | "info" | "lore" | "system"
}

export const terminalCommands: Record<string, TerminalCommand> = {
  help: {
    response: 'Available commands: help, clear, status, about, scan, unlock [key], inspect [target], decode [string]',
    type: "info",
  },
  about: {
    response: "The Arcane Terminal v2.7.1. Built by The Scribe to archive the history of the Eldergate.",
    type: "lore",
  },
  status: {
    response: "Eldergate Seal: SECURE // Archive Integrity: 98.4% // Chronicler: AUTHORIZED",
    type: "system",
  },
  scan: {
    response: "Scanning for nearby arcane fluctuations... Found: 1 active breach (Eldergate-Sigma).",
    type: "info",
  },
  clear: {
    response: "", // Handled by terminal component
    type: "system",
  }
}
