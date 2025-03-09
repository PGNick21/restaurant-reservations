import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ReservationNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-md p-6 mx-auto text-center border rounded-lg shadow-sm">
            <AlertTriangle className="w-12 h-12 mx-auto text-amber-500" />
            <h1 className="mt-4 text-2xl font-bold">Reserva no encontrada</h1>
            <p className="mt-2 text-muted-foreground">
              No pudimos encontrar la reserva que estás buscando. Es posible que haya sido cancelada o que la URL sea
              incorrecta.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/">Regresar al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

