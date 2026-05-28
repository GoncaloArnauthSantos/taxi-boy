"use client";

import { useCallback, useState } from "react";
import type { Booking } from "@/domain/booking";
import BookingsFilters from "./BookingsFilters";
import BookingsCardsList from "./BookingsCardsList";
import BookingDetails from "./BookingDetails";

type Props = {
  initialBookings: Booking[];
};

const AdminBookingsPageClient = ({ initialBookings }: Props) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  }, []);

  const handleBookingSaved = (updated: Booking) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === updated.id ? updated : booking))
    );
    setSelectedBooking(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        <header className="sticky top-0 z-10 bg-background/95 pb-4 backdrop-blur">
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <BookingsFilters bookings={bookings} onFilteredBookingsChange={setFilteredBookings} />
        </header>

        <main>
          {filteredBookings.length === 0 ? (
            <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No bookings match the current filters.
            </p>
          ) : (
            <BookingsCardsList
              bookings={filteredBookings}
              onOpenDetails={openDetails}
            />
          )}
        </main>
      </div>

      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onBookingSaved={handleBookingSaved}
      />
    </div>
  );
};

export default AdminBookingsPageClient;
