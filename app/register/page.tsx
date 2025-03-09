import type { Metadata } from "next"
import Link from "next/link"
import RegisterForm from "@/components/register-form"
import { UtensilsCrossed } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Registro - ReservaSabores",
  description: "Crea una cuenta en ReservaSabores",
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop"
            alt="Restaurant background"
            fill
            className="object-cover brightness-[0.15]"
          />
        </div>
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg relative z-10">
          <div className="flex flex-col items-center space-y-2 text-center">
            <UtensilsCrossed className="w-10 h-10 text-secondary" />
            <h1 className="text-2xl font-bold">Crear Cuenta</h1>
            <p className="text-sm text-white/70">Regístrate para hacer reservas y gestionar tus visitas</p>
          </div>

          <RegisterForm />

          <div className="text-center text-sm">
            <p className="text-white/70">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="font-medium text-secondary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

