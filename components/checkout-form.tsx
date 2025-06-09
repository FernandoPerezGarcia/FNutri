"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { isUsingMySQL } from '@/lib/config'
import type { Address, Order } from "@/lib/types"

interface CheckoutFormProps {
  onBack: () => void
}

type CheckoutAddress = Omit<Address, 'id' | 'userId' | 'isDefault'>;

export function CheckoutForm({ onBack }: CheckoutFormProps) {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>({
    fullName: user?.name || "",
    street: "",
    city: "",
    postalCode: "",
    country: "España",
    phone: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular procesamiento del pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const order: any = {
      id: `order_${Date.now()}`,
      userId: user!.id,
      items: cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: totalPrice + (totalPrice >= 50 ? 0 : 4.99),
      shippingAddress,
      status: "processing",
      createdAt: new Date().toISOString(),
    }

    if (isUsingMySQL()) {
      try {
        const res = await fetch('/api/orders?userId=' + user!.id, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        if (!res.ok) console.error('Error saving order:', res.statusText);
      } catch (err) {
        console.error('API order save error:', err);
      }
    } else {
      const orders = JSON.parse(localStorage.getItem(`orders_${user!.id}`) || "[]")
      orders.push(order)
      localStorage.setItem(`orders_${user!.id}`, JSON.stringify(orders))
    }

    // Limpiar carrito
    clearCart()

    toast({
      title: "¡Pedido realizado con éxito!",
      description: `Tu pedido #${order.id.slice(-6)} está siendo procesado.`,
    })

    setIsProcessing(false)

    // Redirigir a página de confirmación o perfil
    window.location.href = "/perfil"
  }

  const shippingCost = totalPrice >= 50 ? 0 : 4.99
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al carrito
      </Button>

      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="street">Dirección</Label>
                  <Input
                    id="street"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, street: e.target.value }))}
                    placeholder="Calle, número, piso, puerta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <CreditCard className="h-5 w-5" />
                  <span>Tarjeta de Crédito/Débito</span>
                </div>

                <div>
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Fecha de vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={isProcessing}>
              {isProcessing ? "Procesando..." : `Pagar €${finalTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        <div>
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
                  <span>{shippingCost === 0 ? "Gratis" : `€${shippingCost.toFixed(2)}`}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{finalTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
