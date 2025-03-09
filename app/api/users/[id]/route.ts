import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser || !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        reservations: {
          orderBy: {
            date: "desc",
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser || !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { name, email, password, role } = await request.json()

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (password) updateData.password = await hash(password, 10)

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = getCurrentUser()

    if (!currentUser || !isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Delete user's reservations first
    await prisma.reservation.deleteMany({
      where: { userId: params.id },
    })

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}

