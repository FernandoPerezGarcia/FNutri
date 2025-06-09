"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { isUsingMySQL } from "@/lib/config"

type DatabaseContextType = {
  isMySQL: boolean
  executeQuery: (query: string, params?: any[]) => Promise<any>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const isMySQL = isUsingMySQL()

  const executeQuery = async (query: string, params?: any[]) => {
    if (!isMySQL) {
      throw new Error("MySQL mode is not enabled")
    }

    try {
      // En una aplicación real, esto sería una llamada a tu API
      console.log("Executing MySQL query:", query, params)

      // Simular respuesta de base de datos
      await new Promise((resolve) => setTimeout(resolve, 100))

      return { success: true, data: [] }
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  }

  return <DatabaseContext.Provider value={{ isMySQL, executeQuery }}>{children}</DatabaseContext.Provider>
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}
