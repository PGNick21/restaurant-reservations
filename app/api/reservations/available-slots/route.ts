import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

// All possible time slots
const ALL_TIME_SLOTS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
]

// Maximum capacity per time slot
const MAX_CAPACITY_PER_TIME = 30

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")
    const guestsParam = searchParams.get("guests")

    if (!dateParam || !guestsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Fecha y número de personas son requeridos",
          availableSlots: [],
        },
        { status: 400 },
      )
    }

    const date = new Date(dateParam)
    const guests = Number.parseInt(guestsParam)

    if (isNaN(guests) || guests <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Número de personas inválido",
          availableSlots: [],
        },
        { status: 400 },
      )
    }

    // Get the date string
    const dateString = format(date, "yyyy-MM-dd")

    // Get all confirmed reservations for this date
    const dateReservations = await prisma.reservation.findMany({
      where: {
        date: dateString,
        status: "confirmed",
      },
    })

    // Calculate booked slots
    const bookedSlots: Record<string, number> = {}
    dateReservations.forEach((res) => {
      if (!bookedSlots[res.time]) {
        bookedSlots[res.time] = 0
      }
      bookedSlots[res.time] += res.guests
    })

    // Filter out time slots that are fully booked
    const availableSlots = ALL_TIME_SLOTS.filter((time) => {
      const currentBookings = bookedSlots[time] || 0
      return currentBookings + guests <= MAX_CAPACITY_PER_TIME
    })

    return NextResponse.json({
      success: true,
      availableSlots,
      error: null,
    })
  } catch (error) {
    console.error("Error getting available time slots:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener horarios disponibles",
        availableSlots: [],
      },
      { status: 500 },
    )
  }
}