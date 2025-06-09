"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateMealMacros, getFoods } from "@/lib/data"
import type { Food, UserMeal, FoodCategory } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { isUsingMySQL } from '@/lib/config'

export default function CreateMenuPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedFoods, setSelectedFoods] = useState<{ food: Food; grams: number }[]>([])
  const [mealName, setMealName] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [mealTime, setMealTime] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [allFoods, setAllFoods] = useState<Food[]>([])
  const [isLoadingFoods, setIsLoadingFoods] = useState(true)
  const [categoriesList, setCategoriesList] = useState<FoodCategory[]>([])

  // Load foods on client
  useEffect(() => {
    async function loadFoods() {
      try {
        const f = await getFoods()
        setAllFoods(f)
      } catch (err) {
        console.error('Error loading foods:', err)
      } finally {
        setIsLoadingFoods(false)
      }
    }
    loadFoods()
  }, [])

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/food-categories')
        if (res.ok) {
          const data = await res.json()
          setCategoriesList(data.categories)
        } else {
          console.error('Error fetching categories:', res.statusText)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Filtered foods based on search and selected category
  const filteredFoods = allFoods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? food.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Handlers
  const addFood = (food: Food) => {
    const existing = selectedFoods.find((item) => item.food.id === food.id)
    if (existing) {
      setSelectedFoods((prev) =>
        prev.map((item) =>
          item.food.id === food.id ? { ...item, grams: item.grams + 100 } : item
        )
      )
    } else {
      setSelectedFoods((prev) => [...prev, { food, grams: 100 }])
    }
  }

  const updateFoodGrams = (foodId: string, grams: number) => {
    if (grams <= 0) {
      setSelectedFoods((prev) => prev.filter((item) => item.food.id !== foodId))
    } else {
      setSelectedFoods((prev) =>
        prev.map((item) =>
          item.food.id === foodId ? { ...item, grams } : item
        )
      )
    }
  }

  const macros = calculateMealMacros(selectedFoods)

  const saveMeal = async () => {
    if (!mealName.trim()) {
      toast({ title: 'Error', description: 'Introduce un nombre', variant: 'destructive' })
      return
    }
    if (selectedFoods.length === 0) {
      toast({ title: 'Error', description: 'Añade alimentos', variant: 'destructive' })
      return
    }
    const meal: any = {
      id: `meal_${Date.now()}`,
      userId: user!.id,
      name: mealName,
      foods: selectedFoods,
      mealDate: selectedDate,
      mealTime,
      totalCalories: macros.calories,
      totalProtein: macros.protein,
      totalCarbs: macros.carbs,
      totalFat: macros.fat,
      createdAt: new Date().toISOString(),
    }
    if (isUsingMySQL()) {
      try {
        const res = await fetch(`/api/user-meals?userId=${user!.id}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meal)
        })
        if (!res.ok) console.error('Error saving via API:', res.statusText)
      } catch (err) {
        console.error('API save error:', err)
      }
    } else {
      const um = JSON.parse(localStorage.getItem(`meals_${user!.id}`) || '[]')
      um.push(meal)
      localStorage.setItem(`meals_${user!.id}`, JSON.stringify(um))
    }
    toast({ title: 'Comida guardada', description: `${mealName} guardada` })
    setMealName('')
    setSelectedFoods([])
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Menú Personalizado</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selector de alimentos */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Alimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todos
                </Button>
                {categoriesList.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => addFood(food)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{food.name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {food.category}
                        </Badge>
                      </div>
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-muted-foreground">
                      <div>{food.calories} kcal</div>
                      <div>{food.protein}g prot</div>
                      <div>{food.carbs}g carb</div>
                      <div>{food.fat}g grasa</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de creación de comida */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Comida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meal-name">Nombre de la comida</Label>
                <Input
                  id="meal-name"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="Ej: Desayuno proteico"
                />
              </div>

              <div>
                <Label htmlFor="meal-date">Fecha</Label>
                <Input
                  id="meal-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="meal-time">Momento del día</Label>
                <Select value={mealTime} onValueChange={(value: any) => setMealTime(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Desayuno</SelectItem>
                    <SelectItem value="lunch">Almuerzo</SelectItem>
                    <SelectItem value="dinner">Cena</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alimentos seleccionados */}
          <Card>
            <CardHeader>
              <CardTitle>Alimentos Seleccionados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedFoods.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No has añadido ningún alimento</p>
              ) : (
                <div className="space-y-3">
                  {selectedFoods.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.food.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateFoodGrams(item.food.id, item.grams - 25)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-12 text-center">{item.grams}g</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateFoodGrams(item.food.id, item.grams + 25)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p>{Math.round((item.food.calories * item.grams) / 100)} kcal</p>
                        <p className="text-muted-foreground">
                          {Math.round((item.food.protein * item.grams) / 100)}g prot
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen nutricional */}
          {selectedFoods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{macros.calories}</p>
                    <p className="text-sm text-muted-foreground">Calorías</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{macros.protein}g</p>
                    <p className="text-sm text-muted-foreground">Proteína</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{macros.carbs}g</p>
                    <p className="text-sm text-muted-foreground">Carbohidratos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{macros.fat}g</p>
                    <p className="text-sm text-muted-foreground">Grasas</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  onClick={saveMeal}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={selectedFoods.length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Comida
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
