"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import DriverInfoDialog from "./DriverInfoDialog"
import type { Contact, Driver, PageSection } from "@/cms/types"
import { buildMailtoLink } from "@/lib/utils"

type Props = {
  content: PageSection | null
  driver: Driver | null
  contactInfo: Contact | null
}

const ContactUs = ({ content, driver, contactInfo }: Props) => {
  const [driverDialogOpen, setDriverDialogOpen] = useState<boolean>(false)

  if(!content) {
    return null;
  }
const {title, label} = content;
const { email = "", phone = "" } = contactInfo || {};
  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {label}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline">
              <a href={buildMailtoLink(email)}>Email Us</a>
            </Button>
            
            <Button asChild size="lg" variant="outline">
              <a
                href={`https://wa.me/${phone}`}
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
