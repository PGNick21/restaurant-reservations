import type { Metadata } from "next"
import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import ContactForm from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contacto - ReservaSabores",
  description: "Ponte en contacto con nosotros en ReservaSabores",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <header className="sticky top-0 z-10 bg-dark/80 backdrop-blur-sm border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-secondary" />
            <span className="text-xl font-bold">ReservaSabores</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium text-white/70 hover:text-white">
              Inicio
            </Link>
            <Link href="/menu" className="font-medium text-white/70 hover:text-white">
              Menú
            </Link>
            <Link href="/reservations" className="font-medium text-white/70 hover:text-white">
              Reservas
            </Link>
            <Link href="/contact" className="font-medium text-secondary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/reservations">Hacer Reserva</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop"
              alt="Restaurant background"
              fill
              className="object-cover brightness-[0.2]"
              priority
            />
          </div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contáctanos</h1>
              <p className="max-w-xl mt-4 mx-auto text-lg text-white/70">
                Estamos aquí para responder tus preguntas y escuchar tus comentarios. No dudes en ponerte en contacto
                con nosotros.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark">
          <div className="container px-4 mx-auto">
            <div className="grid gap-12 md:grid-cols-2 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                <div className="p-6 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm">
                  <ContactForm />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
                <div className="p-6 border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dirección</h3>
                      <p className="text-white/70">
                        Calle Principal 123
                        <br />
                        Ciudad, CP 12345
                        <br />
                        España
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Horario</h3>
                      <p className="text-white/70">
                        Lunes a Viernes: 12:00 - 23:00
                        <br />
                        Sábados y Domingos: 11:00 - 00:00
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Contacto</h3>
                      <p className="text-white/70">
                        Teléfono: (123) 456-7890
                        <br />
                        Email: info@reservasabores.com
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Ubicación</h3>
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1577086664693-894d8405334a?q=80&w=2574&auto=format&fit=crop"
                        alt="Mapa de ubicación"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button className="bg-secondary hover:bg-secondary/90">Ver en Google Maps</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-black/30">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">ReservaSabores</h3>
              <p className="mt-2 text-sm text-white/70">La mejor experiencia gastronómica de la ciudad.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Horario</h3>
              <p className="mt-2 text-sm text-white/70">
                Lunes a Viernes: 12:00 - 23:00
                <br />
                Sábados y Domingos: 11:00 - 00:00
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contacto</h3>
              <p className="mt-2 text-sm text-white/70">
                Calle Principal 123
                <br />
                Tel: (123) 456-7890
                <br />
                info@reservasabores.com
              </p>
            </div>
          </div>
          <div className="mt-8 text-sm text-center text-white/50">
            © {new Date().getFullYear()} ReservaSabores. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

