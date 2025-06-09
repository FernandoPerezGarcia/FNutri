"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Product } from "@/lib/types"
import { isUsingMySQL } from './config'

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  // Load cart from API or localStorage when user logs in
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([])
        return
      }
      if (isUsingMySQL()) {
        try {
          const res = await fetch(`/api/cart?userId=${user.id}`)
          if (res.ok) {
            const data = await res.json()
            setCartItems(data.items)
          } else {
            console.error('Error fetching cart from API:', res.statusText)
          }
        } catch (err) {
          console.error('Error loading cart from API:', err)
        }
      } else {
        const saved = localStorage.getItem(`cart_${user.id}`)
        if (saved) {
          try {
            setCartItems(JSON.parse(saved))
          } catch (e) {
            console.error('Error parsing cart from localStorage:', e)
          }
        }
      }
    }
    loadCart()
  }, [user])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (!user) return
    const save = async () => {
      if (isUsingMySQL()) {
        for (const item of cartItems) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, productId: item.product.id, quantity: item.quantity })
          })
        }
      } else {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems))
      }
    }
    save()
  }, [cartItems, user])

  const addToCart = (product: Product, quantity = 1) => {
    if (!user) {
      toast({
        title: "Inicia sesión primero",
        description: "Debes iniciar sesión para añadir productos al carrito",
        variant: "destructive",
      })
      return
    }

    setCartItems((prev) => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { product, quantity }]
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} se ha añadido a tu carrito`,
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
    if (isUsingMySQL() && user) {
      fetch(`/api/cart?userId=${user.id}&productId=${productId}`, { method: 'DELETE' })
    }
    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado del carrito",
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item))
    if (isUsingMySQL() && user) {
      fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId, quantity })
      })
    }
  }

  const clearCart = () => {
    setCartItems([])
    if (user) {
      if (isUsingMySQL()) {
        fetch(`/api/cart?userId=${user.id}`, { method: 'DELETE' })
      } else {
        localStorage.removeItem(`cart_${user.id}`)
      }
    }
  }

  const totalItems = cartItems.reduce((t, i) => t + i.quantity, 0)
  const totalPrice = cartItems.reduce((t, i) => t + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
