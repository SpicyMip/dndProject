"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Lock, Mail, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/language-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { t } = useTranslation()

  // Si ya hay usuario, el AuthProvider se encargará de redirigir, 
  // pero podemos añadir un loader aquí por si acaso.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/codex")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(t("login.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0c10] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 arcane-glow">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            {t("login.title")}
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-xs uppercase tracking-[0.2em]">
            {t("login.subtitle")}
          </p>
        </div>

        <Card className="border-primary/20 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-serif text-center">{t("login.card_title")}</CardTitle>
            <CardDescription className="text-center text-xs">
              {t("login.card_description")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("login.email_placeholder")}
                    className="pl-10 bg-white/5 border-primary/10 focus:border-primary/30 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder={t("login.password_placeholder")}
                    className="pl-10 bg-white/5 border-primary/10 focus:border-primary/30 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs text-center font-medium"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif text-base py-6 shadow-[0_0_15px_rgba(var(--primary),0.3)] group overflow-hidden relative"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                    {t("login.submit")}
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center">
            <p className="text-[10px] text-muted-foreground font-mono uppercase leading-relaxed max-w-[240px]">
              {t("login.footer")}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
