"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { 
  Users, 
  Skull, 
  Sparkles, 
  Book, 
  Pin, 
  BookText, 
  ShieldAlert,
  Loader2,
  Package
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/language-context"
import { AdminNotices } from "@/components/admin/admin-notices"
import { AdminLexicon } from "@/components/admin/admin-lexicon"
import { AdminBestiary } from "@/components/admin/admin-bestiary"
import { AdminItems } from "@/components/admin/admin-items"

export function AdminSection() {
  const { t } = useTranslation()
  const { user, loading, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("notices")

  if (loading) return (
    <div className="flex h-48 items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  )
  
  if (!user || !isAdmin) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" /> 
            {t("admin.title")}
          </h1>
          <p className="text-muted-foreground font-mono text-xs">{t("admin.subtitle")}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto gap-2 bg-transparent">
          <TabsTrigger value="notices" className="data-[state=active]:bg-primary/20">
            <Pin className="h-4 w-4 mr-2" /> {t("admin.notices")}
          </TabsTrigger>
          <TabsTrigger value="bestiary" className="data-[state=active]:bg-primary/20">
            <Skull className="h-4 w-4 mr-2" /> {t("admin.bestiary")}
          </TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-primary/20">
            <Package className="h-4 w-4 mr-2" /> {t("admin.items")}
          </TabsTrigger>
          <TabsTrigger value="lexicon" className="data-[state=active]:bg-primary/20">
            <BookText className="h-4 w-4 mr-2" /> {t("admin.lexicon")}
          </TabsTrigger>
          <TabsTrigger value="characters" className="data-[state=active]:bg-primary/20">
            <Users className="h-4 w-4 mr-2" /> {t("admin.characters")}
          </TabsTrigger>
          <TabsTrigger value="pantheon" className="data-[state=active]:bg-primary/20">
            <Sparkles className="h-4 w-4 mr-2" /> {t("admin.pantheon")}
          </TabsTrigger>
          <TabsTrigger value="chronicles" className="data-[state=active]:bg-primary/20">
            <Book className="h-4 w-4 mr-2" /> {t("admin.chronicles")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="notices">
            <AdminNotices />
          </TabsContent>
          
          <TabsContent value="bestiary">
            <AdminBestiary />
          </TabsContent>

          <TabsContent value="items">
            <AdminItems />
          </TabsContent>
          
          <TabsContent value="lexicon">
            <AdminLexicon />
          </TabsContent>
          
          <TabsContent value="characters">
            <div className="p-12 text-center border-2 border-dashed border-border rounded-xl opacity-20">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <p className="text-muted-foreground">Character management interface coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="pantheon">
            <div className="p-12 text-center border-2 border-dashed border-border rounded-xl opacity-20">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <p className="text-muted-foreground">Pantheon management interface coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="chronicles">
            <div className="p-12 text-center border-2 border-dashed border-border rounded-xl opacity-20">
              <Book className="h-12 w-12 mx-auto mb-4" />
              <p className="text-muted-foreground">Chronicles management interface coming soon</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default AdminSection
