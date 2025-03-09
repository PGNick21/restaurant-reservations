import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface MenuCardProps {
  name: string
  description: string
  price: number
  image: string
}

export default function MenuCard({ name, description, price, image }: MenuCardProps) {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <span className="text-secondary font-medium">${price.toFixed(2)}</span>
        </div>
        <p className="text-white/70 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}