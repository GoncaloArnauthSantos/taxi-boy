"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, CreditCard } from "lucide-react";
import type { Booking } from "@/domain/booking";
import type { PageSection } from "@/cms/types";

type Props = {
  booking: Booking;
  confirmationContent: PageSection | null;
  onClose: () => void;
};

/**
 * BookingConfirmation Component
 * 
 * Displays booking confirmation with payment options.
 */
const BookingConfirmation = ({
  booking,
  confirmationContent,
  onClose,
}: Props) => {
  const router = useRouter();

  const {
    title: confirmationTitle,
    label: confirmationLabel,
    buttonText: confirmationButtonText,
  } = confirmationContent || {};

  const handlePayNow = () => {
    router.push(`/checkout/${booking.id}`);
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card
        className="max-w-md w-full border-border"
        data-testid="booking-confirmation-card"
      >
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2
            className="text-2xl font-bold mb-4 text-foreground"
            data-testid="booking-confirmation-title"
          >
            {confirmationTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {confirmationLabel}
          </p>

          {/* Payment Buttons */}
          <div className="space-y-3 mb-6">
            <Button onClick={handlePayNow} className="w-full" size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full text-sm"
              size="sm"
            >
              Pay Later
            </Button>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full">
            {confirmationButtonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;

