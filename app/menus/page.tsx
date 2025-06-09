"use client"

import { useState } from "react"
import { Shuffle, Clock, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { generateRandomMenu } from "@/lib/data"
import type { Menu } from "@/lib/types"

export default function MenusPage() {
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateMenu = async () => {
    setIsGenerating(true)

    // Simular tiempo de generación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newMenu = await generateRandomMenu()
    setCurrentMenu(newMenu)
    setIsGenerating(false)
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Generador de Menús</h1>
        <p className="text-muted-foreground mb-6">
          Genera menús personalizados con 3 comidas balanceadas de 500-600 calorías cada una
        </p>

        <Button
          onClick={handleGenerateMenu}
          disabled={isGenerating}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Shuffle className="mr-2 h-5 w-5" />
          {isGenerating ? "Generando..." : "Generar Menú Aleatorio"}
        </Button>
      </div>

      {currentMenu && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentMenu.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    {currentMenu.totalCalories} kcal
                  </Badge>
                  <Badge variant="secondary">{currentMenu.totalProtein}g proteína</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{currentMenu.totalCalories}</p>
                  <p className="text-sm text-muted-foreground">Calorías totales</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{currentMenu.totalProtein}g</p>
                  <p className="text-sm text-muted-foreground">Proteína</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{currentMenu.totalCarbs}g</p>
                  <p className="text-sm text-muted-foreground">Carbohidratos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{currentMenu.totalFat}g</p>
                  <p className="text-sm text-muted-foreground">Grasas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentMenu.meals.map((meal, index) => (
              <Card key={meal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    {meal.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{meal.calories} kcal</Badge>
                    <Badge variant="outline">{meal.protein}g prot</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {meal.foods.map((foodItem, foodIndex) => (
                      <div key={foodIndex} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{foodItem.food.name}</p>
                          <p className="text-sm text-muted-foreground">{foodItem.grams}g</p>
                        </div>
                        <div className="text-right text-sm">
                          <p>{Math.round((foodItem.food.calories * foodItem.grams) / 100)} kcal</p>
                          <p className="text-muted-foreground">
                            {Math.round((foodItem.food.protein * foodItem.grams) / 100)}g prot
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <p className="font-medium">{meal.calories}</p>
                      <p className="text-muted-foreground">kcal</p>
                    </div>
                    <div>
                      <p className="font-medium">{meal.protein}g</p>
                      <p className="text-muted-foreground">prot</p>
                    </div>
                    <div>
                      <p className="font-medium">{meal.carbs}g</p>
                      <p className="text-muted-foreground">carb</p>
                    </div>
                    <div>
                      <p className="font-medium">{meal.fat}g</p>
                      <p className="text-muted-foreground">grasa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!currentMenu && (
        <div className="text-center py-12">
          <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay menús generados</h3>
          <p className="text-muted-foreground">
            Haz clic en "Generar Menú Aleatorio" para crear tu primer menú personalizado
          </p>
        </div>
      )}
    </div>
  )
}
