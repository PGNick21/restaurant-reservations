"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ReservationForm from "@/components/reservation-form"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, UtensilsCrossed } from "lucide-react"
import Image from "next/image"

export default function ClientReservationsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    setIsLoggedIn(!!user)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="w-6 h-6 border-t-2 border-secondary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <main className="flex-1 relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop"
              alt="Restaurant background"
              fill
              className="object-cover brightness-[0.15]"
            />
          </div>
          <div className="container px-4 py-12 mx-auto relative z-10">
            <div className="max-w-md p-6 mx-auto text-center border border-white/10 rounded-lg shadow-lg bg-black/60 backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <h1 className="mt-4 text-2xl font-bold">Inicio de sesión requerido</h1>
              <p className="mt-2 text-white/70">
                Debes iniciar sesión para poder realizar una reserva en nuestro restaurante.
              </p>
              <div className="flex flex-col gap-2 mt-6 sm:flex-row sm:justify-center">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <Link href="/register">Crear cuenta</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <header className="sticky top-0 z-10 bg-dark/80 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-secondary" />
            <span className="text-xl font-bold">ReservaSabores</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=2670&auto=format&fit=crop"
            alt="Restaurant background"
            fill
            className="object-cover brightness-[0.15]"
          />
        </div>
        <div className="container px-4 py-12 mx-auto relative z-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-center">Reserva tu mesa</h1>
            <p className="mt-2 text-center text-white/70">
              Completa el formulario para reservar tu mesa en ReservaSabores
            </p>
            <div className="mt-8 p-6 border border-white/10 rounded-lg shadow-lg bg-black/60 backdrop-blur-sm">
              <ReservationForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

