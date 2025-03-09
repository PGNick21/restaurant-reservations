"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/lib/auth"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setLoading(true)
      setError("")

      console.log("Enviando datos de registro:", {
        name: formData.name,
        email: formData.email,
        passwordLength: formData.password.length,
      })

      const result = await register(formData.name, formData.email, formData.password)

      console.log("Resultado del registro:", result)

      if (result.success) {
        setSuccess(true)
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || "Error al registrar usuario")
      }
    } catch (err) {
      console.error("Error en el cliente durante el registro:", err)
      setError("Ocurrió un error al crear la cuenta: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-4 text-center space-y-4">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
        <h3 className="text-xl font-medium">¡Registro exitoso!</h3>
        <p className="text-white/70">Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center p-3 text-sm text-red-400 border border-red-800/50 rounded-md bg-red-900/20">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

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
        <Label htmlFor="password" className="text-white">
          Contraseña
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirmar contraseña
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-colors" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  )
}

