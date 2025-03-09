import type { Metadata } from "next"
import Link from "next/link"
import LoginForm from "@/components/login-form"
import { UtensilsCrossed } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Iniciar Sesión - ReservaSabores",
  description: "Inicia sesión en tu cuenta de ReservaSabores",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
            alt="Restaurant background"
            fill
            className="object-cover brightness-[0.15]"
          />
        </div>
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg relative z-10">
          <div className="flex flex-col items-center space-y-2 text-center">
            <UtensilsCrossed className="w-10 h-10 text-secondary" />
            <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
            <p className="text-sm text-white/70">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <LoginForm />

          <div className="text-center text-sm">
            <p className="text-white/70">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-medium text-secondary hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

