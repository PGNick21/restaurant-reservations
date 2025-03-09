"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import MainNav from "@/components/main-nav"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { useParams } from "next/navigation"

export default function CancelReservationPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [reservation, setReservation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true)
        const id = params?.id

        if (!id) {
          router.push("/not-found")
          return
        }

        const response = await fetch(`/api/reservations/${id}`)

        if (!response.ok) {
          throw new Error("No se pudo encontrar la reserva")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Error al obtener la reserva")
        }

        setReservation(data.data)
      } catch (err) {
        setError("No se pudo encontrar la reserva")
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [params, router])

  const handleCancelReservation = async () => {
    try {
      setCancelling(true)
      const id = params?.id

      if (!id) {
        throw new Error("ID de reserva no válido")
      }

      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      // Mostrar información de depuración
      console.log("Enviando solicitud de cancelación para la reserva:", id)
      console.log("Usuario actual:", currentUser)

      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(currentUser)}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      const data = await response.json()
      console.log("Respuesta de la API:", data)

      if (!response.ok) {
        throw new Error(data.error || "Error al cancelar la reserva")
      }

      setConfirmed(true)
      toast({
        variant: "success",
        title: "Reserva cancelada",
        description: "Tu reserva ha sido cancelada correctamente.",
      })
    } catch (err) {
      console.error("Error al cancelar la reserva:", err)
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva. Inténtalo de nuevo.")
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo cancelar la reserva. Inténtalo de nuevo.",
      })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Cargando...</p>
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
            <div className="max-w-lg p-6 mx-auto text-center border border-white/10 rounded-lg shadow-sm bg-black/30">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
              <h2 className="mt-4 text-xl font-bold">Error</h2>
              <p className="mt-2 text-white/70">{error}</p>
              <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
                <Link href="/">Regresar al inicio</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <MainNav />
        <main className="flex-1">
          <div className="container px-4 py-12 mx-auto">
            <div className="max-w-lg p-6 mx-auto text-center border border-white/10 rounded-lg shadow-sm bg-black/30">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <h2 className="mt-4 text-xl font-bold">Reserva cancelada</h2>
              <p className="mt-2 text-white/70">
                Tu reserva ha sido cancelada correctamente. Esperamos verte pronto en otra ocasión.
              </p>
              <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
                <Link href="/">Regresar al inicio</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-lg p-6 mx-auto border border-white/10 rounded-lg shadow-sm bg-black/30">
            <h2 className="text-xl font-bold text-center">Cancelar Reserva</h2>
            <p className="mt-2 text-center text-white/70">¿Estás seguro de que deseas cancelar tu reserva?</p>

            {reservation && (
              <div className="p-4 mt-6 rounded-lg bg-black/20 border border-white/10">
                <p className="font-medium text-white">Detalles de la reserva:</p>
                <ul className="mt-2 space-y-1 text-sm text-white/70">
                  <li>
                    <span className="font-medium">Fecha:</span>{" "}
                    {format(parseISO(reservation.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </li>
                  <li>
                    <span className="font-medium">Hora:</span> {reservation.time}
                  </li>
                  <li>
                    <span className="font-medium">Personas:</span> {reservation.guests}
                  </li>
                  <li>
                    <span className="font-medium">Nombre:</span> {reservation.user?.name || reservation.name}
                  </li>
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 mt-8">
              <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                <Link href={`/reservations/confirmation/${params.id}`}>Regresar</Link>
              </Button>
              <Button variant="destructive" onClick={handleCancelReservation} disabled={cancelling}>
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  "Confirmar cancelación"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

