"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent} from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";
import BookingForm from "@/components/BookingForm";


const BookingPage = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);


  if (submitted) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="max-w-md w-full border-border">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Thank You for Your Booking!
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your booking request has been received. You will be contacted by
              the driver via email or WhatsApp to confirm availability and
              finalize the details.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Book Another Tour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Book Your Tour
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Fill out the form below and we&apos;ll contact you to confirm your
              booking
            </p>
          </div>

          <BookingForm setSubmitted={setSubmitted} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
