"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña")
      return
    }

    try {
      setLoading(true)
      setError("")

      const result = await login(email, password)

      if (result.success) {
        router.push("/profile")
      } else {
        setError(result.error || "Correo o contraseña incorrectos")
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión")
    } finally {
      setLoading(false)
    }
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
        <Label htmlFor="email" className="text-white">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Contraseña
          </Label>
          <Button variant="link" className="h-auto p-0 text-xs text-secondary" type="button">
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary/70 focus:ring-secondary/30"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  )
}

