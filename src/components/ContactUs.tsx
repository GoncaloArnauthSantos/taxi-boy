"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import DriverInfoDialog from "./DriverInfoDialog"
import type { Driver, PageSection } from "@/cms/types"

type Props = {
  content: PageSection | null
  driver: Driver | null
}

const ContactUs = ({ content, driver }: Props) => {
  const [driverDialogOpen, setDriverDialogOpen] = useState<boolean>(false)

  if(!content) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            {content.title}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {content.label}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline">
              <a href="mailto:info@lisbontours.com">Email Us</a>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <a
                href="https://wa.me/351912345678"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setDriverDialogOpen(true)}
            >
              Meet Your Driver
            </Button>
          </div>
        </div>
      </div>

      { driver && (
        <DriverInfoDialog
          open={driverDialogOpen}
          onOpenChange={setDriverDialogOpen}
          driver={driver}
        />
      )}
    </>
  )
}

export default ContactUs
