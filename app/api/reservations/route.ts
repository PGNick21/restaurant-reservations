import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // Get user from Authorization header
    const authHeader = request.headers.get("Authorization")
    let userData = null

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
    }

    try {
      const token = authHeader.substring(7)
      userData = JSON.parse(token)
    } catch (e) {
      console.error("Error parsing auth token:", e)
      return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 })
    }

    if (!userData || !userData.id) {
      return NextResponse.json({ success: false, error: "Usuario no válido" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { date, time, guests, occasion, special } = body

    // Validate required fields
    if (!date || !time || !guests) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        date,
        time,
        guests,
        occasion: occasion || "Ninguna",
        special: special || "",
        status: "confirmed",
        userId: userData.id,
      },
    })

    return NextResponse.json({ success: true, data: reservation }, { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ success: false, error: "Error al crear reservación" }, { status: 500 })
  }
}

