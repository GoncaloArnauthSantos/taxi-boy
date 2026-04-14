"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, MessageCircle, Mail } from "lucide-react";
import {
  type Booking,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";
import type { Contact, Tour } from "@/cms/types";
import PaymentButton from "./PaymentButton";
import PaymentStatusMessage from "./PaymentStatusMessage";
import { buildWhatsAppLink, buildMailtoLink } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  booking: Booking;
  tour: Tour;
  driverContact: Contact | null;
};

/**
 * PaymentSection Component
 *
 * Displays payment options, status messages, and contact buttons for a booking.
 * Handles different payment states: pending, paid, failed, and confirmed with pending payment.
 */
const PaymentSection = ({ booking, tour, driverContact }: Props) => {
  const {
    price,
    clientName,
    clientSelectedDate,
    clientMessage,
    paymentStatus,
    status,
  } = booking;

  const driverPhone = driverContact?.phone || "";
  const driverEmail = driverContact?.email || "";

  const whatsappMessage = useMemo(() => {
    const bookingDate = format(
      new Date(clientSelectedDate),
      "EEEE, MMMM d, yyyy"
    );
    let message = `Hello! I am interested in booking "${tour.title}" for ${bookingDate}.\n\n`;
    message += "My details:\n";
    message += `- Name: ${clientName}\n`;
    message += `- Booking ID: ${booking.id}\n`;
    message += `- Tour: ${tour.title}\n`;
    message += `- Price: €${price.toFixed(2)}\n`;

    if (clientMessage) {
      message += `\nAdditional information: ${clientMessage}`;
    }

    message += "\n\nCould you please provide more information or help me complete this booking?";

    return message;
  }, [
    clientName,
    clientSelectedDate,
    clientMessage,
    booking.id,
    tour.title,
    price,
  ]);

  const whatsappLink = useMemo(
    () => (driverPhone ? buildWhatsAppLink(driverPhone, whatsappMessage) : "#"),
    [driverPhone, whatsappMessage]
  );

  const emailLink = useMemo(
    () => (driverEmail ? buildMailtoLink(driverEmail) : "#"),
    [driverEmail]
  );

  const cardTitle = useMemo(() => {
    if (paymentStatus === BookingPaymentStatus.PAID) {
      return "Payment Status";
    }
    if (
      status === BookingStatus.CONFIRMED &&
      paymentStatus === BookingPaymentStatus.PENDING
    ) {
      return "Booking Confirmed";
    }
    if (paymentStatus === BookingPaymentStatus.FAILED) {
      return "Payment Failed";
    }
    return "Payment";
  }, [paymentStatus, status]);

  const showPaymentButton =
    paymentStatus !== BookingPaymentStatus.PAID &&
    !(
      status === BookingStatus.CONFIRMED &&
      paymentStatus === BookingPaymentStatus.PENDING
    );

  const contactSectionTitle = useMemo(() => {
    if (paymentStatus === BookingPaymentStatus.PAID) {
      return "Need to contact us?";
    }
    if (paymentStatus === BookingPaymentStatus.FAILED) {
      return "Need help? Contact us directly";
    }
    return "Prefer to contact us directly?";
  }, [paymentStatus]);

  const showPriceSummary = paymentStatus !== BookingPaymentStatus.PAID;
  const showSecurityNote =
    paymentStatus === BookingPaymentStatus.PENDING &&
    status === BookingStatus.PENDING;

  return (
    <Card className="border-border h-fit">
      <CardHeader>
        <CardTitle className="text-2xl">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentStatusMessage booking={booking} />

        {showPriceSummary && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tour Price</span>
              <span className="font-semibold">€{price.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl">€{price.toFixed(2)}</span>
            </div>
          </div>
        )}

        {showPaymentButton && <PaymentButton booking={booking} tour={tour} />}

        <div className="border-t pt-6 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {contactSectionTitle}
          </p>
          <div className="flex flex-col gap-2">
            {driverPhone && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact via WhatsApp
                </a>
              </Button>
            )}
            {driverEmail && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={emailLink}
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact via Email
                </a>
              </Button>
            )}
          </div>
        </div>

        {showSecurityNote && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 mt-0.5" />
            <p>
              Your payment is secure and encrypted. We use Stripe to process all
              payments safely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
