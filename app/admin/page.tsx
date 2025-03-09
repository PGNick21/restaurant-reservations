"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, SearchIcon, User, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DailyCalendar from "@/components/daily-calendar"
import { Calendar } from "@/components/ui/calendar"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [allReservations, setAllReservations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser()

      if (!currentUser || !isAdmin()) {
        toast({
          variant: "destructive",
          title: "Acceso denegado",
          description: "No tienes permisos para acceder a esta página.",
        })
        router.push("/login")
        return
      }

      fetchData()
    }

    checkAuth()
  }, [router, toast])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch reservations
      const reservationsResponse = await fetch("/api/reservations")
      if (!reservationsResponse.ok) {
        throw new Error("Error al obtener reservaciones")
      }
      const reservationsData = await reservationsResponse.json()
      setAllReservations(reservationsData)

      // Fetch user count
      const usersResponse = await fetch("/api/users")
      if (!usersResponse.ok) {
        throw new Error("Error al obtener usuarios")
      }
      const usersData = await usersResponse.json()
      setUserCount(usersData.length)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos.",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = allReservations.filter((reservation: any) => {
    const matchesSearch =
      reservation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    const matchesDate =
      !dateFilter || format(parseISO(reservation.date), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDate
  })

  const upcomingReservations = filteredReservations.filter((res: any) => res.status === "confirmed")
  const todayReservations = upcomingReservations.filter(
    (res: any) => format(parseISO(res.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center h-16 px-4 border-b lg:gap-10 bg-white">
        <div className="flex items-center gap-2 font-semibold">
          <CalendarDays className="w-5 h-5 text-primary" />
          <span>Panel de Administración</span>
        </div>
        <div className="relative ml-auto w-60">
          <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar reservaciones..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayReservations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Próximas Reservas</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingReservations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total de Clientes Hoy</CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayReservations.reduce((sum: number, res: any) => sum + res.guests, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                <Link href="/admin/users">Gestionar usuarios</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="table">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="table">Lista</TabsTrigger>
            <TabsTrigger value="day">Vista Diaria</TabsTrigger>
            <TabsTrigger value="month">Calendario</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="p-0 border rounded-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Todas las reservaciones</h3>
              <p className="text-sm text-muted-foreground">
                Gestiona las reservaciones, cambia su estado o edita detalles.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Personas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron reservaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation: any) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="font-medium">{reservation.user.name}</div>
                        <div className="text-sm text-muted-foreground">{reservation.user.email}</div>
                      </TableCell>
                      <TableCell>{format(parseISO(reservation.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>{reservation.guests}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reservation.status === "confirmed"
                              ? "default"
                              : reservation.status === "cancelled"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {reservation.status === "confirmed"
                            ? "Confirmada"
                            : reservation.status === "cancelled"
                              ? "Cancelada"
                              : "Completada"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="day">
            <Card>
              <CardHeader>
                <CardTitle>
                  Vista Diaria - {dateFilter ? format(dateFilter, "d 'de' MMMM", { locale: es }) : "Hoy"}
                </CardTitle>
                <CardDescription>Ver todas las reservaciones para un día específico.</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyCalendar
                  date={dateFilter || new Date()}
                  reservations={filteredReservations.filter(
                    (res: any) =>
                      dateFilter && format(parseISO(res.date), "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd"),
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card>
              <CardHeader>
                <CardTitle>Calendario Mensual</CardTitle>
                <CardDescription>Ver un resumen de las reservaciones mensuales.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  className="border rounded-md"
                  modifiers={{
                    booked: filteredReservations.map((r: any) => new Date(r.date)),
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

