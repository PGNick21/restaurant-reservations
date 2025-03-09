"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, logout } from "@/lib/auth"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AlertCircle, CalendarDays, Home, Menu, UtensilsCrossed, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Fetch user reservations from API
    const fetchReservations = async () => {
      try {
        setError(null)
        const response = await fetch("/api/reservations/user", {
          headers: {
            Authorization: `Bearer ${JSON.stringify(currentUser)}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error en la respuesta del servidor")
        }

        const { success, data, error } = await response.json()

        if (!success) {
          throw new Error(error || "Error al obtener reservaciones")
        }

        setReservations(data)
      } catch (error) {
        console.error("Error fetching reservations:", error)
        setError(error instanceof Error ? error.message : "Error al cargar reservaciones")
        setReservations([])

        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Error al cargar reservaciones",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [router, toast])

  const handleLogout = () => {
    logout()
    // Hacer un refresh completo de la página para asegurar que todo se actualice
    window.location.href = "/login"
  }

  if (loading) {
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
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-t-2 border-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Cargando tu perfil...</p>
          </div>
        </main>
      </div>
    )
  }

  const upcomingReservations = reservations.filter(
    (res) => res.status === "confirmed" && new Date(res.date) >= new Date(),
  )

  const pastReservations = reservations.filter((res) => res.status === "completed" || new Date(res.date) < new Date())

  const cancelledReservations = reservations.filter((res) => res.status === "cancelled")

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <header className="sticky top-0 z-10 bg-dark/80 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-secondary" />
            <span className="text-xl font-bold">ReservaSabores</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/menu" className="text-white/70 hover:text-white transition-colors">
              Menú
            </Link>
            <Link href="/reservations" className="text-white/70 hover:text-white transition-colors">
              Reservas
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleLogout} className="border-white/20 text-white hover:bg-white/10">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 bg-gradient-to-b from-dark/90 to-dark">
        <div className="container px-4 mx-auto">
          <div className="flex items-center mb-8 gap-4">
            <div className="flex items-center justify-center w-14 h-14 text-2xl font-bold text-white rounded-full bg-primary">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hola, {user.name.split(" ")[0]}</h1>
              <p className="text-white/70">Administra tus reservas y datos personales</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/3 lg:w-1/4">
              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Tu cuenta</CardTitle>
                  <CardDescription className="text-white/50">Gestiona tu información</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-white/50">Nombre</span>
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-white/50">Email</span>
                    <span className="font-medium text-white">{user.email}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-white/50">Miembro desde</span>
                    <span className="font-medium text-white">
                      {format(new Date(user.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
                      >
                        <Link href="/">
                          <Home className="mr-2 h-4 w-4" />
                          Volver al inicio
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
                      >
                        <Link href="/reservations">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Hacer nueva reserva
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start border-white/20 hover:bg-white/10 text-white"
                      >
                        <Link href="/menu">
                          <Menu className="mr-2 h-4 w-4" />
                          Ver menú
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3 lg:w-3/4">
              {error && (
                <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-4 mb-6 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error al cargar tus reservas</p>
                    <p className="text-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-red-800/50 hover:bg-red-800/20 text-red-400"
                      onClick={() => window.location.reload()}
                    >
                      Reintentar
                    </Button>
                  </div>
                </div>
              )}

              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full bg-black/30 mb-6 p-1 grid grid-cols-3">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-secondary data-[state=active]:text-white text-white"
                  >
                    Próximas
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-secondary data-[state=active]:text-white text-white"
                  >
                    Pasadas
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="data-[state=active]:bg-secondary data-[state=active]:text-white text-white"
                  >
                    Canceladas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <Card className="bg-black/30 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Reservas Próximas</CardTitle>
                      <CardDescription className="text-white/50">
                        Tus próximas visitas a nuestro restaurante
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {upcomingReservations.length === 0 ? (
                        <div className="p-6 text-center border border-white/10 rounded-md bg-black/20">
                          <CalendarDays className="w-10 h-10 mx-auto mb-3 text-white/30" />
                          <p className="text-white/70 mb-4">No tienes reservas próximas</p>
                          <Button asChild>
                            <Link href="/reservations">Hacer una reserva</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {upcomingReservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              className="p-4 border border-white/10 rounded-md bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    {format(parseISO(reservation.date), "EEEE, d 'de' MMMM", { locale: es })}
                                    {" a las "}
                                    {reservation.time}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    {reservation.guests} {reservation.guests === 1 ? "persona" : "personas"}
                                    {reservation.occasion !== "Ninguna" && ` • ${reservation.occasion}`}
                                  </p>
                                </div>
                                <Badge className="bg-secondary text-white">Confirmada</Badge>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-white/20 hover:bg-white/10 text-white"
                                >
                                  <Link href={`/reservations/confirmation/${reservation.id}`}>Ver detalles</Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                  <Link href={`/reservations/cancel/${reservation.id}`}>Cancelar</Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="past">
                  <Card className="bg-black/30 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Reservas Pasadas</CardTitle>
                      <CardDescription className="text-white/50">Historial de tus visitas anteriores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pastReservations.length === 0 ? (
                        <div className="p-6 text-center border border-white/10 rounded-md bg-black/20">
                          <User className="w-10 h-10 mx-auto mb-3 text-white/30" />
                          <p className="text-white/70">No tienes reservas pasadas</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pastReservations.map((reservation) => (
                            <div key={reservation.id} className="p-4 border border-white/10 rounded-md bg-black/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    {format(parseISO(reservation.date), "EEEE, d 'de' MMMM", { locale: es })}
                                    {" a las "}
                                    {reservation.time}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    {reservation.guests} {reservation.guests === 1 ? "persona" : "personas"}
                                    {reservation.occasion !== "Ninguna" && ` • ${reservation.occasion}`}
                                  </p>
                                </div>
                                <Badge variant="outline" className="border-white/20 text-white">
                                  Completada
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cancelled">
                  <Card className="bg-black/30 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Reservas Canceladas</CardTitle>
                      <CardDescription className="text-white/50">Reservas que has cancelado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cancelledReservations.length === 0 ? (
                        <div className="p-6 text-center border border-white/10 rounded-md bg-black/20">
                          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-white/30" />
                          <p className="text-white/70">No tienes reservas canceladas</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cancelledReservations.map((reservation) => (
                            <div key={reservation.id} className="p-4 border border-white/10 rounded-md bg-black/20">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">
                                    {format(parseISO(reservation.date), "EEEE, d 'de' MMMM", { locale: es })}
                                    {" a las "}
                                    {reservation.time}
                                  </p>
                                  <p className="text-sm text-white/70">
                                    {reservation.guests} {reservation.guests === 1 ? "persona" : "personas"}
                                    {reservation.occasion !== "Ninguna" && ` • ${reservation.occasion}`}
                                  </p>
                                </div>
                                <Badge variant="destructive">Cancelada</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 bg-black/30 border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="text-center text-sm text-white/50">
            © {new Date().getFullYear()} ReservaSabores. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}