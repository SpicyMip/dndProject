"use client"

import React, { useState, useEffect } from "react"
import { 
  BookText, 
  Trash2, 
  Loader2,
  Clock,
  Code
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch } from "@/lib/api"
import { useTranslation } from "@/lib/language-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AdminNotices() {
  const { t } = useTranslation()
  const [notices, setNotices] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const initialForm = { title: "", content: "", type: "news", active: true }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => { 
    fetchNotices(); 
    const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") + "/ws"; 
    const socket = new WebSocket(wsUrl); 
    socket.onmessage = (e) => { if (e.data === "notices_updated") fetchNotices() }; 
    return () => socket.close() 
  }, [])

  const fetchNotices = () => { 
    setLoading(true); 
    apiFetch<{ notices: any[] }>("/notices")
      .then(data => setNotices(data.notices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .finally(() => setLoading(false)) 
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    apiFetch(editingId ? `/notices/${editingId}` : "/notices", { 
      method: editingId ? "PATCH" : "POST", 
      body: JSON.stringify(formData) 
    }).then(() => { 
      toast.success(t("admin.notice_processed")); 
      setEditingId(null); 
      setFormData(initialForm); 
      fetchNotices() 
    })
  }

  const deleteNotice = (id: string) => { if (confirm(t("admin.delete_notice_confirm"))) apiFetch(`/notices/${id}`, { method: "DELETE" }).then(() => fetchNotices()) }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="font-serif">{editingId ? t("admin.edit_notice") : t("admin.new_notice")}</CardTitle>
          <CardDescription>{t("admin.use_tags_help")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("admin.item_name")}</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>{t("admin.item_category")}</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="mission">{t("admin.notice_types.mission")}</option><option value="ad">{t("admin.notice_types.ad")}</option><option value="news">{t("admin.notice_types.news")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("admin.initial_state")}</Label>
                <Button type="button" variant={formData.active ? "default" : "outline"} className="w-full text-xs h-9" onClick={() => setFormData({...formData, active: !formData.active})}>
                  {formData.active ? t("admin.visible") : t("admin.hidden")}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{t("common.description")}</Label>
              <Textarea 
                className="h-48 font-serif leading-relaxed" 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Example: Search for the <lexicon>ELDER-DRAGON</lexicon/> in the north."
                required 
              />
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Code className="h-3 w-3" /> {t("admin.use_tags_hint")}
              </p>
            </div>
            <Button type="submit" className="w-full">{editingId ? t("admin.update_notice") : t("admin.post_notice")}</Button>
            {editingId && <Button type="button" variant="ghost" className="w-full" onClick={() => {setEditingId(null); setFormData(initialForm)}}>{t("common.cancel")}</Button>}
          </form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle className="font-serif">{t("admin.manage_board")}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : notices.map(n => (
              <div key={n.id} className={cn("p-4 flex items-center justify-between rounded-lg border", n.active ? "bg-secondary/20" : "opacity-50 grayscale")}>
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{t(`admin.notice_types.${n.type}`)}</span>
                    <p className="font-serif font-bold leading-none">{n.title}</p>
                  </div>
                  <p className="text-xs opacity-70 line-clamp-1 mb-2">{n.content}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => {setEditingId(n.id); setFormData(n)}}><BookText className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNotice(n.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
