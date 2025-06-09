"use client"

import type { Product, Food, User, Order, UserMeal } from "./types"

// Simulación de conexión MySQL para el frontend
// En una aplicación real, estas serían llamadas a tu API backend

export class MySQLService {
  private static instance: MySQLService
  private isConnected = false

  static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService()
    }
    return MySQLService.instance
  }

  async connect(): Promise<boolean> {
    try {
      // Simular conexión a MySQL
      await new Promise((resolve) => setTimeout(resolve, 500))
      this.isConnected = true
      console.log("Connected to MySQL database")
      return true
    } catch (error) {
      console.error("Failed to connect to MySQL:", error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
    console.log("Disconnected from MySQL database")
  }

  // Métodos para usuarios
  async getUser(email: string, password: string): Promise<User | null> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM users WHERE email = ? AND password = ?
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Usuario demo para pruebas
    if (email === "demo@fitnutri.com" && password === "demo123") {
      return {
        id: "user_demo",
        name: "Usuario Demo",
        email: "demo@fitnutri.com",
      }
    }

    return null
  }

  async createUser(name: string, email: string, password: string): Promise<User | null> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
    }

    return newUser
  }

  // Métodos para productos
  async getProducts(): Promise<Product[]> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM products
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Retornar productos de ejemplo (en una app real vendría de la BD)
    return [
      {
        id: "prod_001",
        name: "Proteína Whey Premium",
        description: "Proteína de suero de alta calidad con 24g de proteína por porción. Sabor chocolate.",
        price: 29.99,
        image: "/placeholder.svg?height=300&width=300",
        category: "suplementos",
        stock: 50,
      },
      {
        id: "prod_002",
        name: "Creatina Monohidrato",
        description: "Creatina pura para aumentar la fuerza y el rendimiento muscular. 500g.",
        price: 19.99,
        image: "/placeholder.svg?height=300&width=300",
        category: "suplementos",
        stock: 35,
      },
      // ... más productos
    ]
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM products WHERE id = ?
    await new Promise((resolve) => setTimeout(resolve, 150))

    const products = await this.getProducts()
    return products.find((p) => p.id === id) || null
  }

  // Métodos para alimentos
  async getFoods(): Promise<Food[]> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM foods
    await new Promise((resolve) => setTimeout(resolve, 200))

    return [
      {
        id: "food_001",
        name: "Pechuga de pollo",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        portion: 100,
        category: "proteínas",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "food_002",
        name: "Arroz blanco",
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        portion: 100,
        category: "carbohidratos",
        image: "/placeholder.svg?height=100&width=100",
      },
      // ... más alimentos
    ]
  }

  // Métodos para carrito
  async getCartItems(userId: string): Promise<any[]> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM shopping_carts WHERE user_id = ?
    await new Promise((resolve) => setTimeout(resolve, 150))

    return []
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: INSERT INTO shopping_carts (user_id, product_id, quantity) VALUES (?, ?, ?)
    await new Promise((resolve) => setTimeout(resolve, 200))

    return true
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: UPDATE shopping_carts SET quantity = ? WHERE user_id = ? AND product_id = ?
    await new Promise((resolve) => setTimeout(resolve, 150))

    return true
  }

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: DELETE FROM shopping_carts WHERE user_id = ? AND product_id = ?
    await new Promise((resolve) => setTimeout(resolve, 150))

    return true
  }

  // Métodos para pedidos
  async createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: INSERT INTO orders (...) VALUES (...)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    return newOrder
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM orders WHERE user_id = ?
    await new Promise((resolve) => setTimeout(resolve, 200))

    return []
  }

  // Métodos para comidas
  async saveUserMeal(meal: UserMeal): Promise<boolean> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: INSERT INTO user_meals (...) VALUES (...)
    await new Promise((resolve) => setTimeout(resolve, 250))

    return true
  }

  async getUserMeals(userId: string): Promise<UserMeal[]> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: SELECT * FROM user_meals WHERE user_id = ?
    await new Promise((resolve) => setTimeout(resolve, 200))

    return []
  }

  // Métodos para consultas
  async saveConsultation(consultation: any): Promise<boolean> {
    if (!this.isConnected) await this.connect()

    // Simular consulta SQL: INSERT INTO consultations (...) VALUES (...)
    await new Promise((resolve) => setTimeout(resolve, 200))

    return true
  }
}

export const mysqlService = MySQLService.getInstance()
