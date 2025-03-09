import type { Metadata } from "next"
import ClientReservationsPage from "./ClientReservationsPage"

export const metadata: Metadata = {
  title: "Reservaciones - El Buen Sabor",
  description: "Haz tu reserva en nuestro restaurante y disfruta de la mejor gastronomía",
}

export default function ReservationsPage() {
  return <ClientReservationsPage />
}

