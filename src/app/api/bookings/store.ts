/**
 * In-Memory Booking Store
 *
 * Simple in-memory storage for bookings during development.
 * This will be replaced with a database in the next phase.
 */

import type {
  Booking,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";
import { randomUUID } from "crypto";

// In-memory storage (will be lost on server restart)
let BOOKINGS_STORE_DATA: Booking[] = [];

/**
 * Create a new booking
 */
export const createBooking = (
  input: Omit<Booking, "id" | "createdAt" | "updatedAt">
): Booking => {
  const now = new Date().toISOString();

  const booking: Booking = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  BOOKINGS_STORE_DATA.push(booking);

  return booking;
};

/**
 * Get a booking by ID
 */
export const getBookingById = (id: string): Booking | null => {
  const booking = BOOKINGS_STORE_DATA.find((b) => b.id === id);

  if (!booking) return null;

  return booking;
};

/**
 * Get all bookings (optionally filtered)
 */
export const getAllBookings = (filters?: {
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  future?: boolean;
  past?: boolean;
}): Booking[] => {
  let bookings = [...BOOKINGS_STORE_DATA];

  if (filters?.status) {
    bookings = bookings.filter((b) => b.status === filters.status);
  }

  if (filters?.paymentStatus) {
    bookings = bookings.filter(
      (b) => b.paymentStatus === filters.paymentStatus
    );
  }

  // Filter by date (future/past)
  if (filters?.future !== undefined || filters?.past !== undefined) {
    const now = new Date();

    bookings = bookings.filter((b) => {
      const bookingDate = new Date(b.clientSelectedDate);
      const isFuture = bookingDate >= now;
      const isPast = bookingDate < now;

      if (filters.future !== undefined) {
        return filters.future ? isFuture : !isFuture;
      }
      if (filters.past !== undefined) {
        return filters.past ? isPast : !isPast;
      }
      return true;
    });
  }

  return bookings;
};

/**
 * Update a booking by ID
 */
export const updateBooking = (
  id: string,
  patch: Partial<Omit<Booking, "id" | "createdAt">>
): Booking | null => {
  const index = BOOKINGS_STORE_DATA.findIndex((b) => b.id === id);

  if (index === -1) return null;

  const updated: Booking = {
    ...BOOKINGS_STORE_DATA[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  BOOKINGS_STORE_DATA[index] = updated;

  return updated;
};

/**
 * Delete a booking by ID
 */
export const deleteBooking = (id: string): boolean => {
  const index = BOOKINGS_STORE_DATA.findIndex((b) => b.id === id);

  if (index === -1) return false;

  BOOKINGS_STORE_DATA.splice(index, 1);

  return true;
};
