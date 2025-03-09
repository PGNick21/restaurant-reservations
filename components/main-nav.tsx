"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UtensilsCrossed, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
    toast({
      variant: "success",
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
    setUser(null)
    router.push("/")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-10 bg-dark/80 backdrop-blur-sm border-b border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-secondary" />
          <span className="text-xl font-bold">ReservaSabores</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`font-medium ${isActive("/") ? "text-secondary" : "text-white/70 hover:text-white"}`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            className={`font-medium ${isActive("/menu") ? "text-secondary" : "text-white/70 hover:text-white"}`}
          >
            Menú
          </Link>
          <Link
            href="/reservations"
            className={`font-medium ${isActive("/reservations") ? "text-secondary" : "text-white/70 hover:text-white"}`}
          >
            Reservas
          </Link>
          <Link
            href="/contact"
            className={`font-medium ${isActive("/contact") ? "text-secondary" : "text-white/70 hover:text-white"}`}
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-dark border border-white/20">
                  <DropdownMenuLabel className="text-white/70">Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => router.push("/reservations")}
                  >
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    <span>Mis Reservas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="outline"
              asChild
              className="border-white/20 text-white hover:bg-secondary/20 hover:text-secondary hover:border-secondary/50 transition-colors"
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          )}
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/reservations">Hacer Reserva</Link>
          </Button>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark border-t border-white/10">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className={`font-medium ${isActive("/") ? "text-secondary" : "text-white/70"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`font-medium ${isActive("/menu") ? "text-secondary" : "text-white/70"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Menú
            </Link>
            <Link
              href="/reservations"
              className={`font-medium ${isActive("/reservations") ? "text-secondary" : "text-white/70"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reservas
            </Link>
            <Link
              href="/contact"
              className={`font-medium ${isActive("/contact") ? "text-secondary" : "text-white/70"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            {user && (
              <>
                <Link href="/profile" className="font-medium text-white/70" onClick={() => setMobileMenuOpen(false)}>
                  Mi Perfil
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto text-red-400 hover:text-red-300 hover:bg-transparent"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

