"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { DatabaseProvider } from "@/lib/database-context"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/registro"

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="fitnutri-theme"
        >
          <DatabaseProvider>
            <AuthProvider>
              <CartProvider>
                {!isAuthPage && <Header />}
                {children}
                {!isAuthPage && <Footer />}
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </DatabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
