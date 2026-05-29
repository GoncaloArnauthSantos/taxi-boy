"use client";

import type { Booking } from "@/domain/booking";
import { formatDateOnly } from "@/lib/utils";

type Props = {
  booking: Booking;
};

const BookingDetailsTourInfo = ({ booking }: Props) => {
  return (
    <div className="rounded-lg border p-3 text-sm">
      <p className="font-medium text-foreground">{booking.tourTitle || booking.tourId}</p>
      <p className="text-muted-foreground">{formatDateOnly(booking.clientSelectedDate)}</p>
      <p className="mt-2 text-muted-foreground">{booking.clientEmail}</p>
      <p className="text-muted-foreground">
        {booking.clientPhoneCountryCode} {booking.clientPhone}
      </p>

      {booking.clientMessage && (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Additional information
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {booking.clientMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsTourInfo;
