"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { Product } from "@/lib/types"

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

  // Cargar carrito desde localStorage cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
        }
      }
    } else {
      // Limpiar carrito cuando el usuario cierra sesión
      setCartItems([])
    }
  }, [user])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems))
    }
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

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Actualizar cantidad si el producto ya está en el carrito
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Añadir nuevo producto al carrito
        return [...prevItems, { product, quantity }]
      }
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} se ha añadido a tu carrito`,
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))

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

    setCartItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    if (user) {
      localStorage.removeItem(`cart_${user.id}`)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
