"use client"

import { useState } from "react"
import { BookText, Plus, Pencil, Trash2, X, Check, Calendar } from "lucide-react"
import { useInterpretations, type Interpretation } from "@/lib/interpretation-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function LexiconSection() {
  const { interpretations, addInterpretation, updateInterpretation, deleteInterpretation } =
    useInterpretations()

  const [newSymbol, setNewSymbol] = useState("")
  const [newDefinition, setNewDefinition] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editSymbol, setEditSymbol] = useState("")
  const [editDefinition, setEditDefinition] = useState("")
  const [editNotes, setEditNotes] = useState("")

  function handleAdd() {
    if (!newSymbol.trim() || !newDefinition.trim()) return
    addInterpretation(newSymbol.trim(), newDefinition.trim(), newNotes.trim() || undefined)
    setNewSymbol("")
    setNewDefinition("")
    setNewNotes("")
    setDialogOpen(false)
  }

  function startEdit(interp: Interpretation) {
    setEditingId(interp.id)
    setEditSymbol(interp.symbolSequence)
    setEditDefinition(interp.userDefinition)
    setEditNotes(interp.notes || "")
  }

  function cancelEdit() {
    setEditingId(null)
    setEditSymbol("")
    setEditDefinition("")
    setEditNotes("")
  }

  function saveEdit(id: string) {
    if (!editSymbol.trim() || !editDefinition.trim()) return
    updateInterpretation(id, {
      symbolSequence: editSymbol.trim(),
      userDefinition: editDefinition.trim(),
      notes: editNotes.trim() || undefined,
    })
    cancelEdit()
  }

  return (
    <section aria-label="Lexicon of the Unseen">
      <div className="flex items-center gap-3 mb-6">
        <BookText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-serif font-bold text-foreground text-balance">
          The Lexicon of the Unseen
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
        Your personal dictionary of arcane symbols and their interpretations. As you decipher
        ancient texts, record your translations here. They will automatically appear throughout the
        Archive&apos;s documents.
      </p>

      {/* Add new interpretation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-6 font-mono text-xs gap-2">
            <Plus className="h-3.5 w-3.5" />
            Add Interpretation
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-foreground">New Interpretation</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-muted-foreground">Symbol Sequence</label>
              <Input
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. KHM, VRX, ZTHAAL"
                className="font-arcane text-lg tracking-[0.2em] bg-secondary border-border uppercase"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-muted-foreground">Your Interpretation</label>
              <Input
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                placeholder="What do you believe it means?"
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-muted-foreground">
                Notes (optional)
              </label>
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Where did you find it? Any context?"
                className="bg-secondary border-border resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <DialogClose asChild>
                <Button variant="ghost" className="font-mono text-xs">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleAdd}
                disabled={!newSymbol.trim() || !newDefinition.trim()}
                className="font-mono text-xs"
              >
                Add to Lexicon
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interpretations list */}
      {interpretations.length === 0 ? (
        <div className="parchment-card rounded-lg border border-border px-6 py-12 text-center">
          <BookText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-serif text-sm text-muted-foreground">
            Your lexicon is empty. Begin deciphering the ancient texts.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {interpretations.map((interp) => {
            const isEditing = editingId === interp.id
            return (
              <div
                key={interp.id}
                className={cn(
                  "parchment-card rounded-lg border border-border overflow-hidden transition-all duration-200",
                  isEditing && "border-primary/30 arcane-glow"
                )}
              >
                {isEditing ? (
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-muted-foreground">Symbol</label>
                      <Input
                        value={editSymbol}
                        onChange={(e) => setEditSymbol(e.target.value.toUpperCase())}
                        className="font-arcane text-lg tracking-[0.2em] bg-secondary border-border uppercase"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-muted-foreground">
                        Interpretation
                      </label>
                      <Input
                        value={editDefinition}
                        onChange={(e) => setEditDefinition(e.target.value)}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-muted-foreground">Notes</label>
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="bg-secondary border-border resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        className="font-mono text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(interp.id)}
                        disabled={!editSymbol.trim() || !editDefinition.trim()}
                        className="font-mono text-xs gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="font-arcane text-xl text-primary tracking-[0.15em]">
                            {interp.symbolSequence}
                          </span>
                          <span className="text-muted-foreground">=</span>
                          <span className="font-serif text-sm text-foreground">
                            {interp.userDefinition}
                          </span>
                        </div>
                        {interp.notes && (
                          <p className="text-xs text-muted-foreground leading-relaxed mt-2 italic">
                            &quot;{interp.notes}&quot;
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {interp.discoveryDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(interp)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit interpretation</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInterpretation(interp.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete interpretation</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
