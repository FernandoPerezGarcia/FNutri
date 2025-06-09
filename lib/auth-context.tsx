"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useDatabase } from "@/lib/database-context"
import { mysqlService } from "@/lib/mysql-service"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { isMySQL } = useDatabase()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Comprobar rutas protegidas
  useEffect(() => {
    const protectedRoutes = ["/menus", "/crear-menu", "/carrito", "/perfil"]

    if (!isLoading && !user && protectedRoutes.some((route) => pathname?.startsWith(route))) {
      router.push(`/login?redirect=${pathname}`)
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder a esta página",
        variant: "destructive",
      })
    }
  }, [pathname, user, isLoading, router, toast])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      let foundUser: User | null = null

      if (isMySQL) {
        // Usar MySQL
        foundUser = await mysqlService.getUser(email, password)
      } else {
        // Usar localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userRecord = users.find((u: any) => u.email === email && u.password === password)
        if (userRecord) {
          const { password: _, ...userWithoutPassword } = userRecord
          foundUser = userWithoutPassword
        }
      }

      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("user", JSON.stringify(foundUser))
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido de nuevo, ${foundUser.name}!`,
        })
        setIsLoading(false)
        return true
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con la base de datos",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      let newUser: User | null = null

      if (isMySQL) {
        // Usar MySQL
        newUser = await mysqlService.createUser(name, email, password)
      } else {
        // Usar localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        if (users.some((u: any) => u.email === email)) {
          toast({
            title: "Error de registro",
            description: "Este email ya está registrado",
            variant: "destructive",
          })
          setIsLoading(false)
          return false
        }

        const userRecord = {
          id: `user_${Date.now()}`,
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        }

        users.push(userRecord)
        localStorage.setItem("users", JSON.stringify(users))

        const { password: _, ...userWithoutPassword } = userRecord
        newUser = userWithoutPassword
      }

      if (newUser) {
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))

        toast({
          title: "Registro exitoso",
          description: `Bienvenido, ${name}!`,
        })

        setIsLoading(false)
        return true
      } else {
        throw new Error("Failed to create user")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error de registro",
        description: "No se pudo crear la cuenta",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
