"use client";

import type { Booking } from "@/domain/booking";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  booking: Booking;
};

const BookingDetailsHeader = ({ booking }: Props) => {
  return (
    <DialogHeader>
      <DialogTitle>{booking.clientName}</DialogTitle>
    </DialogHeader>
  );
};

export default BookingDetailsHeader;
