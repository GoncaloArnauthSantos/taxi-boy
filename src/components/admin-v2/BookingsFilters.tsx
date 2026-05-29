"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BookingPaymentStatus, BookingStatus, type Booking } from "@/domain/booking";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toDateOnlyString } from "@/lib/utils";
import { BOOKINGS_FILTER_KEYS, BOOKINGS_FILTERS, type BookingsFilterKey } from "./constants";

type Props = {
  bookings: Booking[];
  onFilteredBookingsChange: (bookings: Booking[]) => void;
};

const isBookingToday = (booking: Booking) =>
  toDateOnlyString(booking.clientSelectedDate) === toDateOnlyString(new Date());

const matchesSearch = (booking: Booking, query: string) => {
  if (!query) return true;

  return (
    booking.clientName.toLowerCase().includes(query) ||
    booking.clientEmail.toLowerCase().includes(query) ||
    booking.clientPhone.toLowerCase().includes(query) ||
    booking.tourId.toLowerCase().includes(query) ||
    booking.tourTitle.toLowerCase().includes(query)
  );
};

const matchesFilter = (booking: Booking, filter: BookingsFilterKey) => {
  if (filter === BOOKINGS_FILTER_KEYS.ALL) return true;
  if (filter === BOOKINGS_FILTER_KEYS.TODAY) return isBookingToday(booking);   
  if (filter === BOOKINGS_FILTER_KEYS.CONFIRMED) {
    return booking.status === BookingStatus.CONFIRMED;
  }
  if (filter === BOOKINGS_FILTER_KEYS.PENDING) {
    return booking.status === BookingStatus.PENDING;
  }
  if (filter === BOOKINGS_FILTER_KEYS.UNPAID) {
    return booking.paymentStatus !== BookingPaymentStatus.PAID;
  }
  return true;
};

const BookingsFilters = ({ bookings, onFilteredBookingsChange }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<BookingsFilterKey>(BOOKINGS_FILTER_KEYS.ALL);

  // Keep filtering local to this component, while the parent stays focused on
  // orchestration (data source + selected booking + details modal state).
  const filteredBookings = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return bookings.filter(
      (booking) => matchesSearch(booking, search) && matchesFilter(booking, filter)
    );
  }, [bookings, filter, searchQuery]);

  // Push the already filtered list to the parent so list rendering remains in one place.
  useEffect(() => {
    onFilteredBookingsChange(filteredBookings);
  }, [filteredBookings, onFilteredBookingsChange]);

  return (
    <>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search bookings"
          placeholder="Search by name, email, phone or tour"
          className="pl-9"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BOOKINGS_FILTERS.map((entry) => (
          <Button
            key={entry.key}
            size="sm"
            variant={filter === entry.key ? "default" : "outline"}
            onClick={() => setFilter(entry.key)}
            className="whitespace-nowrap"
          >
            {entry.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default BookingsFilters;
