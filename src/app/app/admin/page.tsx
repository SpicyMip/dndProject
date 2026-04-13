"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Skull, 
  Sparkles, 
  Book, 
  Pin, 
  BookText, 
  Plus, 
  Trash2, 
  ShieldAlert,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"

export default function AdminPanel() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("characters")

  // Check access
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) return null

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-primary" />
              Admin Codex Arcanum
            </h1>
            <p className="text-muted-foreground font-mono text-xs">
              Gestion de entidades y contenido de la campana
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Codex
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto gap-2 bg-transparent">
            <TabsTrigger value="characters" className="data-[state=active]:bg-primary/20">
              <Users className="h-4 w-4 mr-2" /> Characters
            </TabsTrigger>
            <TabsTrigger value="bestiary" className="data-[state=active]:bg-primary/20">
              <Skull className="h-4 w-4 mr-2" /> Bestiary
            </TabsTrigger>
            <TabsTrigger value="notices" className="data-[state=active]:bg-primary/20">
              <Pin className="h-4 w-4 mr-2" /> Notices
            </TabsTrigger>
            <TabsTrigger value="pantheon" className="data-[state=active]:bg-primary/20">
              <Sparkles className="h-4 w-4 mr-2" /> Pantheon
            </TabsTrigger>
            <TabsTrigger value="chronicles" className="data-[state=active]:bg-primary/20">
              <Book className="h-4 w-4 mr-2" /> Chronicles
            </TabsTrigger>
            <TabsTrigger value="lexicon" className="data-[state=active]:bg-primary/20">
              <BookText className="h-4 w-4 mr-2" /> Lexicon
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="bestiary">
              <AdminBestiary />
            </TabsContent>
            {/* Add other admin components here */}
            <TabsContent value="characters">
               <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                 <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                 <p className="text-muted-foreground">Character management interface coming soon...</p>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function AdminBestiary() {
  const [creatures, setCreatures] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    type: "Beast",
    cr: "1",
    hp: "10",
    ac: "10",
    vulnerabilities: "None",
    description: ""
  })

  useEffect(() => {
    fetchCreatures()
  }, [])

  const fetchCreatures = () => {
    apiFetch<{ creatures: any[] }>("/bestiary")
      .then(data => setCreatures(data.creatures))
      .catch(err => toast.error("Error loading creatures"))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiFetch("/bestiary", {
      method: "POST",
      body: JSON.stringify(formData)
    }).then(() => {
      toast.success("Creature added successfully")
      setFormData({
        name: "",
        type: "Beast",
        cr: "1",
        hp: "10",
        ac: "10",
        vulnerabilities: "None",
        description: ""
      })
      fetchCreatures()
    }).catch(() => toast.error("Failed to add creature"))
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Creature</CardTitle>
          <CardDescription>Create a new entry for the Bestiary</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cr">CR</Label>
                <Input id="cr" value={formData.cr} onChange={e => setFormData({...formData, cr: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hp">HP</Label>
                <Input id="hp" value={formData.hp} onChange={e => setFormData({...formData, hp: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ac">AC</Label>
                <Input id="ac" value={formData.ac} onChange={e => setFormData({...formData, ac: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add to Bestiary
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Creatures</CardTitle>
          <CardDescription>Manage your current bestiary entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {creatures.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                <div>
                  <p className="font-serif font-bold">{c.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">CR {c.cr} - {c.type}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
