"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(products.map((product) => product.category)))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Tienda</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:w-auto w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Filtra los productos por categoría</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <h3 className="mb-2 text-sm font-medium">Categorías</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {selectedCategory && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Filtrado por:</span>
          <Button variant="secondary" size="sm" className="h-7 rounded-full" onClick={() => setSelectedCategory(null)}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            <X className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      <Separator className="my-6" />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No se encontraron productos</h3>
          <p className="text-muted-foreground mt-2">Intenta con otra búsqueda o elimina los filtros</p>
        </div>
      )}
    </div>
  )
}

// Importar X para el botón de eliminar filtro
import { X } from "lucide-react"
