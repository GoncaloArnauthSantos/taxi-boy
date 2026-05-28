import {
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";

export const BOOKINGS_FILTER_KEYS = {
  ALL: "all",
  TODAY: "today",
  CONFIRMED: "confirmed",
  PENDING: "pending",
  UNPAID: "unpaid",
} as const;

export type BookingsFilterKey = (typeof BOOKINGS_FILTER_KEYS)[keyof typeof BOOKINGS_FILTER_KEYS];

export const BOOKINGS_FILTERS: Array<{ key: BookingsFilterKey; label: string }> = [
  { key: BOOKINGS_FILTER_KEYS.ALL, label: "All" },
  { key: BOOKINGS_FILTER_KEYS.TODAY, label: "Today" },
  { key: BOOKINGS_FILTER_KEYS.CONFIRMED, label: "Confirmed" },
  { key: BOOKINGS_FILTER_KEYS.PENDING, label: "Pending" },
  { key: BOOKINGS_FILTER_KEYS.UNPAID, label: "Unpaid" },
];

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CANCELLED,
];

export const PAYMENT_STATUS_OPTIONS: BookingPaymentStatus[] = [
  BookingPaymentStatus.PENDING,
  BookingPaymentStatus.PAID,
  BookingPaymentStatus.FAILED,
];

export const PAYMENT_METHOD_OPTIONS: BookingPaymentMethod[] = [
  BookingPaymentMethod.BANK_TRANSFER,
  BookingPaymentMethod.CARD,
  BookingPaymentMethod.CASH,
];
