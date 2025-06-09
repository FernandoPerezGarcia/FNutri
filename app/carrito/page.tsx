"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { CheckoutForm } from "@/components/checkout-form"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acceso restringido</h1>
          <p className="text-muted-foreground mt-2">Debes iniciar sesión para ver tu carrito</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mt-2">Añade algunos productos para comenzar</p>
          <Button onClick={() => (window.location.href = "/tienda")} className="mt-4 bg-green-600 hover:bg-green-700">
            Ir a la tienda
          </Button>
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return <CheckoutForm onBack={() => setShowCheckout(false)} />
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
                    <p className="text-lg font-semibold text-green-600 mt-1">€{item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">€{(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{totalPrice >= 50 ? "Gratis" : "€4.99"}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}</span>
              </div>

              {totalPrice < 50 && (
                <p className="text-sm text-muted-foreground">
                  Añade €{(50 - totalPrice).toFixed(2)} más para envío gratuito
                </p>
              )}

              <Button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Proceder al Pago
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
