"use client"

import { useState } from "react"
import { format, parseISO, addDays, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Operating hours of the restaurant
const HOURS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
]

export default function DailyCalendar({ date, reservations }) {
  const [currentDate, setCurrentDate] = useState(date)

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1))
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1))

  // Filter reservations for the current date
  const dayReservations = reservations.filter(
    (res) => format(parseISO(res.date), "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevDay}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-medium">{format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</h3>
        <Button variant="outline" size="icon" onClick={handleNextDay}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-1 gap-2 overflow-x-auto">
          {HOURS.map((hour) => {
            const reservationsAtHour = dayReservations.filter((res) => res.time === hour)

            return (
              <div key={hour} className="flex items-center border-b last:border-0">
                <div className="w-16 py-2 pr-4 font-medium">{hour}</div>
                <div className="flex-1 min-h-[40px] py-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  {reservationsAtHour.length > 0 ? (
                    reservationsAtHour.map((res) => (
                      <Tooltip key={res.id}>
                        <TooltipTrigger asChild>
                          <Card
                            className={`p-2 text-xs overflow-hidden cursor-pointer
                            ${
                              res.status === "confirmed"
                                ? "bg-blue-50 border-blue-200"
                                : res.status === "cancelled"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="font-medium truncate">{res.user?.name || res.name}</div>
                            <div className="flex justify-between">
                              <span>{res.guests} personas</span>
                              <span>{res.occasion !== "Ninguna" ? res.occasion : ""}</span>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="text-sm">
                            <p className="font-medium">{res.user?.name || res.name}</p>
                            <p>{res.user?.email || res.email}</p>
                            <p>{res.phone}</p>
                            <p>{res.guests} personas</p>
                            {res.special && <p>Nota: {res.special}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-10 px-2 text-xs border border-dashed rounded-md text-muted-foreground">
                      Sin reservas
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}

