"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default function ReservationButton({ className }: { className?: string }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setIsLoggedIn(!!user)
  }, [])

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/reservations")
    } else {
      router.push("/login?redirect=reservations")
    }
  }

  return (
    <Button onClick={handleClick} className={className} size="lg">
      Reservar ahora
    </Button>
  )
}

