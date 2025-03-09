// Buscar y reemplazar la URL de la imagen del tiramisú
// Cambiar:
// src="https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=2574&auto=format&fit=crop"
// Por:
// ```typescriptreact file="app/page.tsx"
// [v0-no-op-code-block-prefix]
"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ReservationButton from "@/components/reservation-button"
import { getCurrentUser } from "@/lib/auth"
import Image from "next/image"
import MainNav from "@/components/main-nav"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <MainNav />

      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop"
              alt="Restaurant background"
              fill
              className="object-cover brightness-[0.2]"
              priority
            />
          </div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Donde cada reserva es el inicio de una experiencia inolvidable
              </h1>
              <p className="max-w-xl mt-4 text-lg text-white/70 md:text-xl">
                Descubre una experiencia gastronómica única en ReservaSabores, donde la tradición se encuentra con la
                innovación.
              </p>
              <div className="flex flex-col items-start gap-4 mt-8 sm:flex-row">
                <ReservationButton className="bg-secondary hover:bg-secondary/90" />
                {!user && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/20 text-white hover:bg-secondary/20 hover:text-secondary hover:border-secondary/50 transition-colors"
                  >
                    <Link href="/register">Crear cuenta</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center">Nuestra Experiencia</h2>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white/5">
                <CalendarDays className="w-12 h-12 text-secondary" />
                <h3 className="mt-4 text-xl font-semibold">Reserva fácil</h3>
                <p className="mt-2 text-white/70">
                  Elige la fecha y hora que prefieras a través de nuestro sistema de reservas en línea.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white/5">
                <Clock className="w-12 h-12 text-secondary" />
                <h3 className="mt-4 text-xl font-semibold">Confirmación inmediata</h3>
                <p className="mt-2 text-white/70">
                  Recibe confirmación al instante y gestiona tus reservas de forma sencilla.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white/5">
                <User className="w-12 h-12 text-secondary" />
                <h3 className="mt-4 text-xl font-semibold">Servicio personalizado</h3>
                <p className="mt-2 text-white/70">
                  Incluye preferencias específicas para que podamos adaptarnos a tus necesidades.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark">
          <div className="container px-4 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold">Nuestra Cocina</h2>
                <p className="mt-4 text-white/70">
                  En ReservaSabores, cada plato es una obra maestra creada con los ingredientes más frescos y las
                  técnicas culinarias más refinadas. Nuestro chef ejecutivo y su equipo se enorgullecen de ofrecer una
                  experiencia gastronómica que combina sabores tradicionales con toques contemporáneos.
                </p>
                <div className="mt-8">
                  <Button asChild className="bg-secondary hover:bg-secondary/90">
                    <Link href="/menu">Ver Menú</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2570&auto=format&fit=crop"
                  alt="Plato gourmet"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestros Platos Destacados</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg overflow-hidden bg-white/5">
                <div className="relative h-64">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2669&auto=format&fit=crop"
                    alt="Plato 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Risotto de Setas Silvestres</h3>
                  <p className="mt-2 text-white/70">
                    Cremoso risotto con variedad de setas silvestres, queso parmesano y aceite de trufa.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden bg-white/5">
                <div className="relative h-64">
                  <Image
                    src="https://images.unsplash.com/photo-1560717845-968823efbee1?q=80&w=2670&auto=format&fit=crop"
                    alt="Plato 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Salmón a la Parrilla</h3>
                  <p className="mt-2 text-white/70">
                    Filete de salmón a la parrilla con salsa de cítricos, acompañado de vegetales de temporada.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden bg-white/5">
                <div className="relative h-64">
                  <Image
                    src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2574&auto=format&fit=crop"
                    alt="Plato 3"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Tiramisú Artesanal</h3>
                  <p className="mt-2 text-white/70">
                    Clásico postre italiano elaborado con café, mascarpone y cacao de la mejor calidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-black/30">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">ReservaSabores</h3>
              <p className="mt-2 text-sm text-white/70">La mejor experiencia gastronómica de la ciudad.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Horario</h3>
              <p className="mt-2 text-sm text-white/70">
                Lunes a Viernes: 12:00 - 23:00
                <br />
                Sábados y Domingos: 11:00 - 00:00
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contacto</h3>
              <p className="mt-2 text-sm text-white/70">
                Calle Principal 123
                <br />
                Tel: (123) 456-7890
                <br />
                info@reservasabores.com
              </p>
            </div>
          </div>
          <div className="mt-8 text-sm text-center text-white/50">
            © {new Date().getFullYear()} ReservaSabores. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

