"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const pathname = usePathname()

  const routes = [
    { name: "Inicio", path: "/" },
    { name: "Tienda", path: "/tienda" },
    { name: "Menús", path: "/menus", protected: true },
    { name: "Crear Menú", path: "/crear-menu", protected: true },
    { name: "Contacto", path: "/contacto" },
  ]

  const filteredRoutes = routes.filter((route) => !route.protected || user)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">FitNutri</span>
          </Link>
          <nav className="hidden md:flex ml-6 space-x-4">
            {filteredRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              <Link href="/carrito" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/perfil">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">FitNutri</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-6">
            {filteredRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </Link>
            ))}
            <div className="flex items-center justify-center space-x-4 py-4">
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <Link href="/perfil" onClick={() => setIsMenuOpen(false)}>
                  Perfil
                </Link>
                <Link href="/carrito" onClick={() => setIsMenuOpen(false)}>
                  Carrito ({cartItems.length})
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Registrarse</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
