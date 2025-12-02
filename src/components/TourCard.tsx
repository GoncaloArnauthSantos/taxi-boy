import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Clock, Euro } from "lucide-react"
import Image from "next/image"

type TourCardProps = {
  id: string
  title: string
  description: string
  duration: number
  price: number
  bannerImage: string
}

export function TourCard({ id, title, description, duration, price, bannerImage }: TourCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={bannerImage || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          width={500}
          height={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 text-balance">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}h</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Euro className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/tours/${id}`}>View Tour</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
