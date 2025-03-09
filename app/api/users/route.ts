import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser || !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser || !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

