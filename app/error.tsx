"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-md p-6 mx-auto text-center border rounded-lg shadow-sm">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
            <h1 className="mt-4 text-2xl font-bold">Algo salió mal</h1>
            <p className="mt-2 text-muted-foreground">Lo sentimos, ha ocurrido un error al procesar tu solicitud.</p>
            <div className="flex flex-col gap-2 mt-6 sm:flex-row sm:justify-center">
              <Button onClick={() => reset()}>
                Intentar de nuevo
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                asChild
              >
                <Link href="/">Regresar al inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
