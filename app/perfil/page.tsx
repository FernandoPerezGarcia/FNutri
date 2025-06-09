"use client"

import { useState, useEffect } from "react"
import { Calendar, Package, Utensils, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import type { Order, UserMeal } from "@/lib/types"
import { isUsingMySQL } from "@/lib/config"

export default function ProfilePage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [meals, setMeals] = useState<UserMeal[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      if (isUsingMySQL()) {
        try {
          const resOrders = await fetch(`/api/orders?userId=${user.id}`)
          if (resOrders.ok) {
            const { orders } = await resOrders.json()
            setOrders(orders)
          } else {
            console.error("Error fetching orders:", resOrders.statusText)
          }
        } catch (err) {
          console.error("Error fetching orders:", err)
        }
        try {
          const resMeals = await fetch(`/api/user-meals?userId=${user.id}`)
          if (resMeals.ok) {
            const { meals } = await resMeals.json()
            setMeals(meals)
          } else {
            console.error("Error fetching meals:", resMeals.statusText)
          }
        } catch (err) {
          console.error("Error fetching meals:", err)
        }
      } else {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || "[]")
        setOrders(userOrders)
        const userMeals = JSON.parse(localStorage.getItem(`meals_${user.id}`) || "[]")
        setMeals(userMeals)
      }
    }
    loadData()
  }, [user])

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acceso restringido</h1>
          <p className="text-muted-foreground mt-2">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getMealTimeText = (mealTime: string) => {
    switch (mealTime) {
      case "breakfast":
        return "Desayuno"
      case "lunch":
        return "Almuerzo"
      case "dinner":
        return "Cena"
      case "snack":
        return "Snack"
      default:
        return mealTime
    }
  }

  // Agrupar comidas por fecha
  const mealsByDate = meals.reduce(
    (acc, meal) => {
      const date = meal.mealDate
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(meal)
      return acc
    },
    {} as Record<string, UserMeal[]>,
  )

  // Calcular totales diarios
  const dailyTotals = Object.entries(mealsByDate)
    .map(([date, dayMeals]) => {
      const totals = dayMeals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.totalCalories,
          protein: acc.protein + meal.totalProtein,
          carbs: acc.carbs + meal.totalCarbs,
          fat: acc.fat + meal.totalFat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      )

      return { date, meals: dayMeals, ...totals }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-green-100 rounded-full">
          <User className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Bienvenido, {user.name}</p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center">
            <Utensils className="mr-2 h-4 w-4" />
            Mis Comidas
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Seguimiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes pedidos</h3>
                  <p className="text-muted-foreground">Cuando realices tu primera compra, aparecerá aquí</p>
                  <Button
                    onClick={() => (window.location.href = "/tienda")}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Ir a la tienda
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">Pedido #{order.id.slice(-6)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>

                        <div className="space-y-2">
                          {order.items!.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.product!.name} x{item.quantity}
                              </span>
                              <span>€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>€{order.totalPrice.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Comidas Guardadas</CardTitle>
            </CardHeader>
            <CardContent>
              {meals.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes comidas guardadas</h3>
                  <p className="text-muted-foreground">Crea tu primera comida personalizada</p>
                  <Button
                    onClick={() => (window.location.href = "/crear-menu")}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Crear comida
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {meals.map((meal) => (
                    <Card key={meal.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">{meal.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{getMealTimeText(meal.mealTime)}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(meal.mealDate!).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{meal.totalCalories} kcal</p>
                            <p className="text-sm text-muted-foreground">{meal.totalProtein}g prot</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {meal.foods!.map((foodItem, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {foodItem.food!.name} ({foodItem.grams}g)
                              </span>
                              <span>{Math.round((foodItem.food!.calories * foodItem.grams) / 100)} kcal</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento Nutricional</CardTitle>
            </CardHeader>
            <CardContent>
              {dailyTotals.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay datos de seguimiento</h3>
                  <p className="text-muted-foreground">Empieza a registrar tus comidas para ver tu progreso</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {dailyTotals.map((day) => (
                    <Card key={day.date}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">
                            {new Date(day.date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h4>
                          <Badge variant="secondary">
                            {day.meals.length} comida{day.meals.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-center mb-4">
                          <div>
                            <p className="text-2xl font-bold text-green-600">{day.calories}</p>
                            <p className="text-sm text-muted-foreground">Calorías</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{day.protein}g</p>
                            <p className="text-sm text-muted-foreground">Proteína</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-orange-600">{day.carbs}g</p>
                            <p className="text-sm text-muted-foreground">Carbohidratos</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">{day.fat}g</p>
                            <p className="text-sm text-muted-foreground">Grasas</p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                          {day.meals.map((meal) => (
                            <div key={meal.id} className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{meal.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {getMealTimeText(meal.mealTime)}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">{meal.totalCalories} kcal</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
