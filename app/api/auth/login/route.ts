import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    // Compare password
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}

