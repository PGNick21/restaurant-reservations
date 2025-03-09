"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"

const occasions = [
  "Ninguna",
  "Cumpleaños",
  "Aniversario",
  "Reunión de negocios",
  "Cena romántica",
  "Celebración especial",
]

export default function ReservationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date(),
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    occasion: "Ninguna",
    special: "",
  })

  // Check if user is logged in and pre-fill form
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }))
    } else {
      // Redirect to login if not logged in
      router.push("/login?redirect=reservations")
    }
  }, [router])

  // Fetch available time slots when date or guests change
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoadingTimeSlots(true)
        setError("")

        const currentUser = getCurrentUser()
        if (!currentUser) {
          throw new Error("Debes iniciar sesión para ver horarios disponibles")
        }

        const response = await fetch(
          `/api/reservations/available-slots?date=${format(formData.date, "yyyy-MM-dd")}&guests=${formData.guests}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.stringify(currentUser)}`,
            },
          },
        )

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Error al obtener horarios disponibles")
        }

        setAvailableTimeSlots(data.availableSlots)

        if (!data.availableSlots.includes(formData.time)) {
          setFormData((prev) => ({ ...prev, time: "" }))
        }
      } catch (error) {
        console.error("Error fetching time slots:", error)
        setError(error instanceof Error ? error.message : "Error al obtener horarios disponibles")
        setAvailableTimeSlots([])
      } finally {
        setLoadingTimeSlots(false)
      }
    }

    if (formData.date && formData.guests) {
      fetchTimeSlots()
    }
  }, [formData.date, formData.guests])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.date || !formData.time || !formData.name || !formData.email || !formData.phone) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    try {
      // Construir la URL con los parámetros de la reserva
      const searchParams = new URLSearchParams({
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,
        guests: formData.guests.toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })

      if (formData.occasion && formData.occasion !== "Ninguna") {
        searchParams.append("occasion", formData.occasion)
      }

      if (formData.special) {
        searchParams.append("special", formData.special)
      }

      // Redirigir a la página de revisión
      router.push(`/reservations/review?${searchParams.toString()}`)
    } catch (err) {
      console.error("Error al procesar el formulario:", err)
      const errorMessage = err instanceof Error ? err.message : "No se pudo procesar la reserva"
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center p-3 text-sm text-red-400 border border-red-800/50 rounded-md bg-red-900/20">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-white">
            Fecha
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.date && "text-white/50")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formData.date ? (
                  format(formData.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-dark border border-white/20">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => setFormData({ ...formData, date: date || new Date(), time: "" })}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                locale={es}
                className="text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-white">
            Hora
          </Label>
          <Select
            value={formData.time}
            onValueChange={(value) => setFormData({ ...formData, time: value })}
            disabled={loadingTimeSlots || availableTimeSlots.length === 0}
          >
            <SelectTrigger id="time">
              <SelectValue
                placeholder={
                  loadingTimeSlots
                    ? "Cargando horarios..."
                    : availableTimeSlots.length === 0
                      ? "No hay horarios disponibles"
                      : "Selecciona la hora"
                }
              >
                {formData.time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formData.time}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {loadingTimeSlots ? (
                <div className="p-2 text-sm text-center text-white/70">Cargando horarios...</div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="p-2 text-sm text-center text-white/70">No hay horarios disponibles para esta fecha</div>
              ) : (
                availableTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests" className="text-white">
          Número de personas
        </Label>
        <Select
          value={formData.guests.toString()}
          onValueChange={(value) => setFormData({ ...formData, guests: Number.parseInt(value) })}
        >
          <SelectTrigger id="guests">
            <SelectValue placeholder="Selecciona el número de personas" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "persona" : "personas"}
              </SelectItem>
            ))}
            <SelectItem value="11">Más de 10 personas (llamar)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nombre completo
          </Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white">
          Teléfono
        </Label>
        <Input
          id="phone"
          placeholder="Tu número de teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occasion" className="text-white">
            Ocasión (opcional)
          </Label>
          <Select value={formData.occasion} onValueChange={(value) => setFormData({ ...formData, occasion: value })}>
            <SelectTrigger id="occasion">
              <SelectValue placeholder="Selecciona la ocasión" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map((occasion) => (
                <SelectItem key={occasion} value={occasion}>
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special" className="text-white">
          Peticiones especiales (opcional)
        </Label>
        <Textarea
          id="special"
          placeholder="Indica cualquier requerimiento especial o alergias alimentarias"
          value={formData.special}
          onChange={(e) => setFormData({ ...formData, special: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading || loadingTimeSlots || availableTimeSlots.length === 0}
      >
        {loading ? "Procesando..." : "Confirmar reserva"}
      </Button>

      <p className="text-xs text-center text-white/50">
        Al hacer clic en confirmar reserva, aceptas nuestros términos y condiciones y nuestra política de privacidad.
      </p>
    </form>
  )
}

