"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut
} from "firebase/auth"
import { auth } from "./firebase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  role: string | null
  isAdmin: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await currentUser.getIdToken()
        const tokenResult = await currentUser.getIdTokenResult()
        const userRole = (tokenResult.claims.role as string) || "player"
        
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", idToken)
        }
        
        setRole(userRole)
        setUser(currentUser)
      } else {
        setRole(null)
        setUser(null)
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Lógica de protección de rutas
  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/") {
        router.push("/")
      } else if (user && pathname === "/") {
        router.push("/codex")
      }
    }
  }, [user, loading, pathname, router])

  const logout = async () => {
    await firebaseSignOut(auth)
  }

  const isAdmin = role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
