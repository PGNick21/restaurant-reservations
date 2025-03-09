import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCurrentUser } from "./auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if user is admin
export function isAdmin() {
  const user = getCurrentUser()
  return user?.role === "admin"
}

