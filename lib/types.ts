// Tipos para usuarios
export type User = {
  id: string
  name: string
  email: string
  password?: string // Optional to avoid sending to client
  createdAt?: string
  updatedAt?: string
}

// Tipos para categorías de productos
export type ProductCategory = {
  id: string
  name: string
  description?: string
  createdAt?: string
}

// Tipos para productos
export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  createdAt?: string
  updatedAt?: string
}

// Tipos para categorías de alimentos
export type FoodCategory = {
  id: string
  name: string
  description?: string
  createdAt?: string
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
  createdAt?: string
  updatedAt?: string
}

// Tipos para carritos de compra
export type ShoppingCartItem = {
  id: string
  userId: string
  productId: string
  product?: Product
  quantity: number
  createdAt?: string
  updatedAt?: string
}

// Tipos para direcciones
export type Address = {
  id: string
  userId: string
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt?: string
}

// Tipos para pedidos
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  userId: string
  totalPrice: number
  shippingAddressId: string
  shippingAddress?: Address
  status: OrderStatus
  createdAt?: string
  updatedAt?: string
  items?: OrderItem[]
}

// Tipos para items de pedidos
export type OrderItem = {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
  createdAt?: string
}

// Tipos para comidas de usuario
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type UserMeal = {
  id: string
  userId: string
  name: string
  mealDate: string
  mealTime: MealTime
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  createdAt?: string
  foods?: UserMealFood[]
}

// Tipos para alimentos en comidas de usuario
export type UserMealFood = {
  id: string
  mealId: string
  foodId: string
  food?: Food
  grams: number
  createdAt?: string
}

// Tipos para menús generados
export type GeneratedMenu = {
  id: string
  userId: string
  name: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  createdAt?: string
  meals?: MenuMeal[]
}

// Tipos para comidas en menús generados
export type MenuMeal = {
  id: string
  menuId: string
  name: string
  mealOrder: number
  calories: number
  protein: number
  carbs: number
  fat: number
  createdAt?: string
  foods?: MenuMealFood[]
}

// Tipos para alimentos en comidas de menús
export type MenuMealFood = {
  id: string
  mealId: string
  foodId: string
  food?: Food
  grams: number
  createdAt?: string
}

// Tipos para consultas/contactos
export type ConsultationService = 'nutrition' | 'training' | 'both' | 'other'
export type ConsultationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type Consultation = {
  id: string
  name: string
  email: string
  phone?: string
  service: ConsultationService
  message: string
  status: ConsultationStatus
  createdAt?: string
  updatedAt?: string
}

// Legacy types for compatibility
export type Meal = MenuMeal

export type Menu = GeneratedMenu
