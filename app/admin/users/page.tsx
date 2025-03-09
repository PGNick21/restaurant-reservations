"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, PlusCircle, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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

      fetchUsers()
    }

    checkAuth()
  }, [router, toast])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")

      if (!response.ok) {
        throw new Error("Error al obtener usuarios")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar usuario")
      }

      toast({
        variant: "success",
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })

      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el usuario.",
      })
    }
  }

  const filteredUsers = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Administra los usuarios del sistema.</CardDescription>
          <div className="relative mt-4 w-full md:w-72">
            <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Administrador" : "Usuario"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>{user._count.reservations}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

