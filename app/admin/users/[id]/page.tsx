"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  const isNewUser = params.id === "new"

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

      if (!isNewUser) {
        fetchUser()
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, toast, isNewUser, params.id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${params.id}`)

      if (!response.ok) {
        throw new Error("Error al obtener usuario")
      }

      const data = await response.json()
      setUser(data)
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        role: data.role,
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la información del usuario.",
      })
      router.push("/admin/users")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || (isNewUser && !formData.password)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
      })
      return
    }

    try {
      setSaving(true)

      const url = isNewUser ? "/api/users" : `/api/users/${params.id}`
      const method = isNewUser ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error al ${isNewUser ? "crear" : "actualizar"} usuario`)
      }

      toast({
        variant: "success",
        title: isNewUser ? "Usuario creado" : "Usuario actualizado",
        description: `El usuario ha sido ${isNewUser ? "creado" : "actualizado"} correctamente.`,
      })

      router.push("/admin/users")
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isNewUser ? "crear" : "actualizar"} el usuario.`,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{isNewUser ? "Nuevo Usuario" : `Editar Usuario: ${user?.name}`}</h1>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          {!isNewUser && <TabsTrigger value="reservations">Reservaciones</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>
                {isNewUser
                  ? "Completa el formulario para crear un nuevo usuario."
                  : "Edita la información del usuario."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {isNewUser ? "Contraseña" : "Nueva contraseña (dejar en blanco para mantener)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={isNewUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {!isNewUser && (
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Reservaciones del Usuario</CardTitle>
                <CardDescription>Historial de reservaciones realizadas por este usuario.</CardDescription>
              </CardHeader>
              <CardContent>
                {user?.reservations?.length === 0 ? (
                  <div className="p-4 text-center border rounded-md">
                    <p className="text-muted-foreground">Este usuario no tiene reservaciones.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Personas</TableHead>
                        <TableHead>Ocasión</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user?.reservations?.map((reservation: any) => (
                        <TableRow key={reservation.id}>
                          <TableCell>{format(parseISO(reservation.date), "dd/MM/yyyy", { locale: es })}</TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{reservation.guests}</TableCell>
                          <TableCell>{reservation.occasion}</TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

