// Configuración de la aplicación
export const config = {
  // CONFIGURACIÓN DE BASE DE DATOS - CAMBIAR AQUÍ
  // Cambiar a true para usar MySQL, false para client-side
  USE_MYSQL: true,

  // Configuración MySQL (solo si USE_MYSQL es true)
  mysql: {
    host: process.env.NEXT_PUBLIC_DB_HOST || "localhost",
    port: Number.parseInt(process.env.NEXT_PUBLIC_DB_PORT || "3306"),
    database: process.env.NEXT_PUBLIC_DB_NAME || "fitnutri",
    user: process.env.NEXT_PUBLIC_DB_USER || "root",
    password: process.env.NEXT_PUBLIC_DB_PASSWORD || "",
  },

  // Configuración de la aplicación
  app: {
    name: "FitNutri",
    version: "1.0.0",
    description: "Tu tienda de fitness y nutrición",
  },
}

// Función para verificar si estamos usando MySQL
export const isUsingMySQL = () => config.USE_MYSQL

// Función para obtener la configuración de MySQL
export const getMySQLConfig = () => config.mysql
