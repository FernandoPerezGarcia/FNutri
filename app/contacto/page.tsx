"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { isUsingMySQL } from "@/lib/config"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const consultation = {
      id: `consultation_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    if (isUsingMySQL()) {
      try {
        const res = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultation),
        })
        if (!res.ok) console.error("Error saving consultation:", res.statusText)
      } catch (err) {
        console.error("API consultation save error:", err)
      }
    } else {
      const consultations = JSON.parse(localStorage.getItem("consultations") || "[]")
      consultations.push(consultation)
      localStorage.setItem("consultations", JSON.stringify(consultations))
    }

    toast({
      title: "Mensaje enviado",
      description: "Hemos recibido tu consulta. Te contactaremos pronto.",
    })

    // Limpiar formulario
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    })

    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Contacto</h1>
        <p className="text-muted-foreground">¿Necesitas asesoramiento personalizado? Estamos aquí para ayudarte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Asesoría</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tu@ejemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <Label htmlFor="service">Tipo de asesoría</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de asesoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutrition">Asesoría Nutricional</SelectItem>
                    <SelectItem value="training">Asesoría de Entrenamiento</SelectItem>
                    <SelectItem value="both">Nutrición + Entrenamiento</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Cuéntanos sobre tus objetivos y necesidades..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Enviando..." : "Enviar Consulta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@fitnutri.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-muted-foreground">+34 912 345 678</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-muted-foreground">
                    Calle Ejemplo, 123
                    <br />
                    28001 Madrid, España
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuestros Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600">Asesoría Nutricional</h4>
                <p className="text-sm text-muted-foreground">
                  Planes de alimentación personalizados según tus objetivos y necesidades específicas.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-green-600">Asesoría de Entrenamiento</h4>
                <p className="text-sm text-muted-foreground">
                  Rutinas de ejercicio adaptadas a tu nivel y objetivos de fitness.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-green-600">Seguimiento Personalizado</h4>
                <p className="text-sm text-muted-foreground">
                  Acompañamiento continuo para asegurar que alcances tus metas de salud.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horarios de Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lunes - Viernes</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
