"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, ShoppingCart, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Tu Camino hacia una Vida Saludable
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Productos de calidad para tu entrenamiento y nutrición personalizada para alcanzar tus objetivos.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/tienda">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Explorar Tienda
                    <ShoppingCart className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={user ? "/menus" : "/login?redirect=/menus"}>
                  <Button size="lg" variant="outline">
                    Ver Menús
                    <Utensils className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Productos de Calidad</h3>
                <p className="text-gray-500">Encuentra los mejores suplementos y equipamiento para tu entrenamiento.</p>
                <Link href="/tienda" className="text-green-600 hover:underline inline-flex items-center">
                  Ver productos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <Utensils className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Menús Personalizados</h3>
                <p className="text-gray-500">
                  Genera menús adaptados a tus necesidades calóricas y de macronutrientes.
                </p>
                <Link
                  href={user ? "/menus" : "/login?redirect=/menus"}
                  className="text-green-600 hover:underline inline-flex items-center"
                >
                  Crear menú
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Asesoría Personalizada</h3>
                <p className="text-gray-500">
                  Contacta con nuestros expertos para recibir asesoramiento en nutrición y entrenamiento.
                </p>
                <Link href="/contacto" className="text-green-600 hover:underline inline-flex items-center">
                  Contactar
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Comienza tu transformación hoy</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Regístrate para acceder a todas nuestras funcionalidades y comenzar tu camino hacia una vida más
                  saludable.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Button onClick={() => router.push("/registro")} className="bg-green-600 hover:bg-green-700">
                    Registrarse
                  </Button>
                  <Button onClick={() => router.push("/login")} variant="outline">
                    Iniciar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
