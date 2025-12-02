"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users } from "lucide-react"
import Image from "next/image"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DriverInfoDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Meet Your Driver</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Driver Profile */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
              <Image src="/professional-taxi-driver.png" alt="Driver" className="w-full h-full object-cover" width={128} height={128} />
            </div>
            <div>
              <h3 className="text-xl font-bold">João Silva</h3>
              <p className="text-muted-foreground text-sm mt-1">Professional Tour Driver</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              With over 15 years of experience as a professional tour driver in Lisbon, I&apos;m passionate about sharing the
              beauty and rich history of Portugal with visitors from around the world. I pride myself on providing safe,
              comfortable, and memorable tours tailored to your interests.
            </p>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold mb-3">Languages Spoken</h4>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="text-2xl">🇬🇧</span>
                <span className="text-sm font-medium">English</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="text-2xl">🇫🇷</span>
                <span className="text-sm font-medium">French</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="text-2xl">🇩🇪</span>
                <span className="text-sm font-medium">German</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="text-2xl">🇵🇹</span>
                <span className="text-sm font-medium">Portuguese</span>
              </div>
            </div>
          </div>

          {/* Vehicle Options */}
          <div>
            <h4 className="font-semibold mb-4">Available Vehicles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 5 Seats */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <Image src="/comfortable-sedan-car.jpg" alt="5-seat sedan" className="w-full h-full object-cover" width={128} height={128} />
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">5 Seats</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Comfortable sedan perfect for couples and small families
                </p>
              </div>

              {/* 7 Seats */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <Image src="/7-seater-minivan.jpg" alt="7-seat minivan" className="w-full h-full object-cover" width={128} height={128} />
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">7 Seats</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Spacious minivan ideal for families and small groups
                </p>
              </div>

              {/* 9 Seats */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <Image src="/9-seater-passenger-van.jpg" alt="9-seat van" className="w-full h-full object-cover" width={128} height={128} />
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">9 Seats</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Large van perfect for bigger groups and extended tours
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
