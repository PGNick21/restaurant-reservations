// Este archivo ahora solo maneja la autenticación en el cliente
// No importa prisma directamente

// Login function
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.success) {
      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(data.user))
      }
      return { success: true, user: data.user }
    }

    return { success: false, error: data.error || "Credenciales inválidas" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Error al iniciar sesión" }
  }
}

// Register function
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    return {
      success: data.success,
      error: data.error,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Error al registrar usuario: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Get current user
export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const userJson = localStorage.getItem("currentUser")
    if (!userJson) {
      console.log("No hay usuario en localStorage")
      return null
    }

    const userData = JSON.parse(userJson)

    // Verificar que los datos del usuario son válidos
    if (!userData || !userData.id || !userData.email) {
      console.log("Datos de usuario inválidos:", userData)
      localStorage.removeItem("currentUser")
      return null
    }

    console.log("Usuario actual recuperado:", userData)
    return userData
  } catch (error) {
    console.error("Error getting current user:", error)
    localStorage.removeItem("currentUser")
    return null
  }
}

// Logout function
export function logout() {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("currentUser")

  // Forzar un refresh completo para asegurar que todo se actualice
  window.location.href = "/"
}

// Check if user is admin
export function isAdmin() {
  const user = getCurrentUser()
  return user?.role === "admin"
}

// Get all users (admin only) - ahora usa la API
export async function getAllUsers() {
  try {
    const response = await fetch("/api/users")
    if (!response.ok) {
      throw new Error("Error al obtener usuarios")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

