"use client"

import { useState } from "react";
import { Button } from "./ui/Button";
import { DriverInfoDialog } from "./DriverInfoDialog";

const ContactUs = () => {
  const [driverDialogOpen, setDriverDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            Get In Touch
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Have questions or need a custom tour? Contact us and we&apos;ll 
            create the perfect experience for you.
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

      {/* Driver Info Dialog */}
      <DriverInfoDialog
        open={driverDialogOpen}
        onOpenChange={setDriverDialogOpen}
      />
    </>
  );
};

export default ContactUs;
