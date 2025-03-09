"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Send } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulamos el envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">¡Mensaje enviado!</h3>
        <p className="text-white/70">Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.</p>
        <Button
          className="mt-6 bg-secondary hover:bg-secondary/90"
          onClick={() => {
            setFormData({ name: "", email: "", subject: "general", message: "" })
            setSubmitted(false)
          }}
        >
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          Nombre completo
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Correo electrónico
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-white">
          Asunto
        </Label>
        <Select value={formData.subject} onValueChange={handleSelectChange}>
          <SelectTrigger id="subject" className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Selecciona un asunto" />
          </SelectTrigger>
          <SelectContent className="bg-dark border border-white/20">
            <SelectItem value="general">Consulta general</SelectItem>
            <SelectItem value="reservation">Reservaciones</SelectItem>
            <SelectItem value="feedback">Comentarios y sugerencias</SelectItem>
            <SelectItem value="business">Colaboraciones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Mensaje
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Escribe tu mensaje aquí..."
          value={formData.message}
          onChange={handleChange}
          required
          className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-colors" disabled={loading}>
        {loading ? (
          <>
            <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  )
}

