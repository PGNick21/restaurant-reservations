import { format } from "date-fns"
import { prisma } from "./prisma"
import { getCurrentUser } from "./auth"

// Get all reservations
export async function getAllReservations() {
  try {
    return await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return []
  }
}

// Get reservation by ID - Esta función solo debe usarse en el servidor
export async function getReservationById(id: string) {
  if (!id) return null

  try {
    return await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error)
    return null
  }
}

// Create a new reservation
export async function createReservation(data: any) {
  try {
    const user = getCurrentUser()

    if (!user) {
      throw new Error("Usuario no autenticado")
    }

    const newReservation = await prisma.reservation.create({
      data: {
        date: data.date,
        time: data.time,
        guests: data.guests,
        occasion: data.occasion || "Ninguna",
        special: data.special || "",
        status: "confirmed",
        user: {
          connect: { id: user.id },
        },
      },
    })

    return newReservation
  } catch (error) {
    console.error("Error creating reservation:", error)
    throw error
  }
}

// Cancel a reservation
export async function cancelReservation(id: string) {
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status: "cancelled" },
    })
    return true
  } catch (error) {
    console.error(`Error cancelling reservation ${id}:`, error)
    return false
  }
}

// Update a reservation
export async function updateReservation(id: string, data: any) {
  try {
    return await prisma.reservation.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error)
    return null
  }
}

// Get available time slots for a specific date and party size
export async function getAvailableTimeSlots(date: Date, partySize: number) {
  // All possible time slots
  const allTimeSlots = [
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

  // Get the date string
  const dateString = format(date, "yyyy-MM-dd")

  try {
    // Get all confirmed reservations for this date
    const dateReservations = await prisma.reservation.findMany({
      where: {
        date: dateString,
        status: "confirmed",
      },
    })

    // Example logic to determine availability based on total guests at each time
    const bookedSlots: Record<string, number> = {}
    dateReservations.forEach((res) => {
      if (!bookedSlots[res.time]) {
        bookedSlots[res.time] = 0
      }
      bookedSlots[res.time] += res.guests
    })

    // Filter out time slots that are fully booked
    const MAX_CAPACITY_PER_TIME = 30
    return allTimeSlots.filter((time) => {
      const currentBookings = bookedSlots[time] || 0
      return currentBookings + partySize <= MAX_CAPACITY_PER_TIME
    })
  } catch (error) {
    console.error("Error getting available time slots:", error)
    return allTimeSlots // Return all slots in case of error
  }
}