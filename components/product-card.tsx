"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?redirect=/tienda`)
      return
    }
    addToCart(product)
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/tienda/${product.id}`}>
        <div className="aspect-square relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/tienda/${product.id}`}>
          <h3 className="font-medium line-clamp-1 hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}
