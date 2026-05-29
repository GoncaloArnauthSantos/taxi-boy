"use client";

import { Loader2, Mail, MessageCircle, Save, X } from "lucide-react";
import type { Booking } from "@/domain/booking";
import { formatDateOnly } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SaveState } from "./types";

type Props = {
  booking: Booking;
  saveState: SaveState;
  onSave: () => void;
};

const getWhatsAppLink = (booking: Booking) => {
  const phone = `${booking.clientPhoneCountryCode}${booking.clientPhone}`.replace(
    /\D/g,
    ""
  );
  const message = encodeURIComponent(
    `Hello ${booking.clientName}, this is your driver from Go Lisbon Tours regarding your booking on ${formatDateOnly(
      booking.clientSelectedDate
    )}.`
  );
  return `https://wa.me/${phone}?text=${message}`;
};

const BookingDetailsFooter = ({ booking, saveState, onSave }: Props) => {
  const getSaveButtonText = (saveState: SaveState) => {
    switch (saveState) {
    case "saving":
      return <Loader2 className="ml-2 h-4 w-4 animate-spin" />;
    case "to-save":
      return <Save className="ml-2 h-4 w-4" />;
    case "error":
      return <X className="ml-2 h-4 w-4" />;
    case "idle":
      return <Save className="ml-2 h-4 w-4" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-2 border-t bg-background p-4 sm:left-auto sm:w-[min(100%,28rem)]">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() =>
          window.open(getWhatsAppLink(booking), "_blank", "noopener,noreferrer")
        }
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => {
          window.location.href = `mailto:${booking.clientEmail}`;
        }}
      >
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
      <Button className="flex-1" onClick={onSave} disabled={saveState === "saving" || saveState === "idle"}>
        {getSaveButtonText(saveState)}
      </Button>
    </div>
  );
};

export default BookingDetailsFooter;
