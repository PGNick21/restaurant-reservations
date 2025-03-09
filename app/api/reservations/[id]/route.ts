import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de reserva no proporcionado" }, { status: 400 })
    }

    const reservation = await prisma.reservation.findUnique({
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

    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reserva no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: reservation })
  } catch (error) {
    console.error(`Error fetching reservation with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Error al obtener la reserva" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener el ID del usuario de la cookie o del localStorage
    const authHeader = request.headers.get("Authorization")
    let userId = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      try {
        // Intentar parsear el token como JSON (asumiendo que es el objeto de usuario)
        const userData = JSON.parse(token)
        userId = userData.id
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    // Check if reservation exists
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!existingReservation) {
      return NextResponse.json({ success: false, error: "Reservación no encontrada" }, { status: 404 })
    }

    // Verificar si el usuario es el propietario de la reserva
    // Nota: Estamos simplificando la verificación de admin para este caso
    const isAdmin = false // Simplificado para este ejemplo
    if (existingReservation.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "No autorizado para modificar esta reserva" }, { status: 401 })
    }

    const { date, time, guests, occasion, special, status } = await request.json()

    // Prepare update data
    const updateData: any = {}
    if (date) updateData.date = date
    if (time) updateData.time = time
    if (guests) updateData.guests = guests
    if (occasion) updateData.occasion = occasion
    if (special !== undefined) updateData.special = special
    if (status) updateData.status = status

    console.log("Actualizando reserva:", params.id)
    console.log("Datos de actualización:", updateData)

    // Update reservation
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: reservation })
  } catch (error) {
    console.error(`Error updating reservation ${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Error al actualizar reservación" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Check if user is authorized to delete this reservation
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!existingReservation) {
      return NextResponse.json({ error: "Reservación no encontrada" }, { status: 404 })
    }

    if (existingReservation.userId !== currentUser.id && !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Delete reservation
    await prisma.reservation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting reservation ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar reservación" }, { status: 500 })
  }
}

