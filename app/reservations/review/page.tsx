"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, MapPin, User, UtensilsCrossed, AlertCircle, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function ReviewReservationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener los datos de la reserva de los parámetros de búsqueda
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const guests = searchParams.get("guests")
  const occasion = searchParams.get("occasion")
  const special = searchParams.get("special")
  const name = searchParams.get("name")
  const email = searchParams.get("email")
  const phone = searchParams.get("phone")

  useEffect(() => {
    // Verificar que tenemos todos los datos necesarios
    if (!date || !time || !guests || !name || !email || !phone) {
      router.push("/reservations")
    }

    // Verificar que el usuario está autenticado
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login?redirect=reservations")
    }
  }, [date, time, guests, name, email, phone, router])

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)

      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/login?redirect=reservations")
        return
      }

      // Crear la reserva
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(currentUser)}`,
        },
        body: JSON.stringify({
          date,
          time,
          guests: Number(guests),
          occasion: occasion || "Ninguna",
          special: special || "",
          name,
          email,
          phone,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al crear la reserva")
      }

      // Mostrar toast de éxito
      toast({
        variant: "success",
        title: "¡Reserva confirmada!",
        description: `Tu reserva para el ${format(parseISO(date!), "d 'de' MMMM", { locale: es })} a las ${time} ha sido confirmada.`,
      })

      // Redirigir a la página de confirmación
      router.push(`/reservations/confirmation/${data.data.id}`)
    } catch (err) {
      console.error("Error al crear la reserva:", err)
      const errorMessage = err instanceof Error ? err.message : "No se pudo procesar la reserva"
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!date || !time || !guests) {
    return null // Esto evita renderizar la página si faltan datos esenciales
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
            <h1 className="text-2xl font-bold text-center">Revisar Reserva</h1>
            <p className="mt-2 text-center text-white/70">
              Por favor revisa los detalles de tu reserva antes de confirmarla.
            </p>

            {error && (
              <div className="p-4 mt-4 text-red-400 border border-red-800/50 rounded-md bg-red-900/20">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="p-6 mt-6 space-y-4 rounded-lg bg-black/20 border border-white/10">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Fecha</p>
                  <p className="text-white/70">
                    {format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Hora</p>
                  <p className="text-white/70">{time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Información del cliente</p>
                  <p className="text-white/70">
                    {name}
                    <br />
                    {email}
                    <br />
                    {phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-white">Detalles de la reserva</p>
                  <p className="text-white/70">
                    {guests} {Number(guests) === 1 ? "persona" : "personas"}
                    {occasion && occasion !== "Ninguna" && <span> - Ocasión: {occasion}</span>}
                    {special && <span> - Nota: {special}</span>}
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
            </div>

            <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Reserva
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full sm:w-auto"
              >
                <Link href="/reservations">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

