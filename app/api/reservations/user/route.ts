import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
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

    const reservations = await prisma.reservation.findMany({
      where: { userId: userId },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json({ success: true, data: reservations })
  } catch (error) {
    console.error("Error fetching user reservations:", error)
    return NextResponse.json({ success: false, error: "Error al obtener reservaciones" }, { status: 500 })
  }
}

