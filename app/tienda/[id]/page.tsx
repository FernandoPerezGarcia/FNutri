"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { products } from "@/lib/data"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Button onClick={() => router.push("/tienda")} className="mt-4">
            Volver a la tienda
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?redirect=/tienda/${product.id}`)
      return
    }
    addToCart(product, quantity)
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold text-green-600 mt-2">€{product.price.toFixed(2)}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Descripción</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Categoría</h3>
            <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>

          <div>
            <h3 className="font-medium mb-2">Stock disponible</h3>
            <p className="text-muted-foreground">{product.stock} unidades</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Cantidad</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">€{(product.price * quantity).toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={product.stock === 0}
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
