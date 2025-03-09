"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, MapPin, Phone, User, UtensilsCrossed, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import { useParams } from "next/navigation"

export default function ConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true)
        setError(null)

        // Asegurémonos de que el ID sea válido
        const id = params?.id
        if (!id) {
          router.push("/not-found")
          return
        }

        const response = await fetch(`/api/reservations/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/not-found")
            return
          }
          throw new Error("Error al obtener la reserva")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Error al obtener la reserva")
        }

        setReservation(data.data)
      } catch (error) {
        console.error("Error fetching reservation:", error)
        setError(error instanceof Error ? error.message : "Error al cargar la reserva")
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [params, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Cargando detalles de la reserva...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <MainNav />
        <main className="flex-1">
          <div className="container px-4 py-12 mx-auto">
            <div className="max-w-md p-6 mx-auto text-center border border-white/10 rounded-lg shadow-sm bg-black/30">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold">Error</h2>
              <p className="mt-2 text-white/70">{error}</p>
              <Button asChild className="mt-6">
                <Link href="/">Regresar al inicio</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!reservation) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-2xl p-8 mx-auto border border-white/10 rounded-lg shadow-sm bg-black/30">
            <div className="flex items-center justify-center mb-6">
              <UtensilsCrossed className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-center">¡Reserva Confirmada!</h1>
            <p className="mt-2 text-center text-white/70">
              Gracias por reservar en ReservaSabores. A continuación los detalles de tu reserva.
            </p>

            <div className="p-6 mt-6 space-y-4 rounded-lg bg-black/20 border border-white/10">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Fecha</p>
                  <p className="text-white/70">
                    {format(new Date(reservation.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Hora</p>
                  <p className="text-white/70">{reservation.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Información del cliente</p>
                  <p className="text-white/70">
                    {reservation.user?.name || reservation.name || ""}
                    <br />
                    {reservation.user?.email || reservation.email || ""}
                    <br />
                    {reservation.phone || ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Detalles de la reserva</p>
                  <p className="text-white/70">
                    {reservation.guests} {reservation.guests === 1 ? "persona" : "personas"}
                    {reservation.occasion && reservation.occasion !== "Ninguna" && (
                      <span> - Ocasión: {reservation.occasion}</span>
                    )}
                    {reservation.special && <span> - Nota: {reservation.special}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Ubicación</p>
                  <p className="text-white/70">
                    ReservaSabores
                    <br />
                    Calle Principal 123
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">¿Necesitas hacer cambios?</p>
                  <p className="text-white/70">
                    Llámanos al (123) 456-7890 o envía un correo a info@reservasabores.com
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Link href="/">Regresar al inicio</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                <Link href={`/reservations/cancel/${params.id}`}>Cancelar reserva</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

