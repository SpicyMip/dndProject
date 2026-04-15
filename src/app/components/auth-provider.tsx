"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: any
  role: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkRole() {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        setRole((idTokenResult.claims.role as string) || "player")
      } else {
        setRole(null)
      }
    }
    checkRole()
  }, [user])

  useEffect(() => {
    // Si no está cargando y no hay usuario, y no estamos en la página de login (/)
    if (!loading && !user && pathname !== "/") {
      router.push("/")
    }
    // Si ya hay usuario y estamos en la página de login, redirigir al codex por defecto
    if (!loading && user && pathname === "/") {
      router.push("/codex")
    }
  }, [user, loading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
