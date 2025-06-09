// Tipos para productos
export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

// Tipos para alimentos
export type Food = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  portion: number // en gramos
  category: string
  image: string
}

// Tipos para menús
export type Meal = {
  id: string
  name: string
  foods: {
    food: Food
    grams: number
  }[]
}

export type Menu = {
  id: string
  name: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

// Tipos para usuario
export type UserMeal = {
  id: string
  name: string
  foods: {
    food: Food
    grams: number
  }[]
  date: string
  mealTime: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Tipos para pedidos
export type Order = {
  id: string
  userId: string
  items: {
    product: Product
    quantity: number
    price: number
  }[]
  totalPrice: number
  shippingAddress: Address
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export type Address = {
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
}
