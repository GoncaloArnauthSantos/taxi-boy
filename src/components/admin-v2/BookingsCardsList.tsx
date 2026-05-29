"use client";

import type { Booking } from "@/domain/booking";
import BookingCard from "./BookingCard";

type Props = {
  bookings: Booking[];
  onOpenDetails: (booking: Booking) => void;
};

const BookingsCardsList = ({
  bookings,
  onOpenDetails,
}: Props) => {
  return (
    <div className="grid grid-cols-1 gap-3 pb-8 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-6 2xl:grid-cols-3">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onOpenDetails={onOpenDetails} />
      ))}
    </div>
  );
};

export default BookingsCardsList;
