import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Este correo electrónico ya está registrado" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new user with current timestamp
    const now = new Date()

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: now,
        updatedAt: now,
      },
    })

    console.log("Usuario creado exitosamente:", newUser.id)

    // Return success without sending the password
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      success: true,
      message: "Usuario registrado correctamente",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al registrar usuario. Detalles: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}

