/**
 * Bookings API Client
 *
 * Centralized API client for booking operations.
 * Provides type-safe functions for all booking-related API calls.
 */

import type {
  Booking,
  BookingStatus,
  BookingPaymentStatus,
} from "@/domain/booking";
import type { BookingFormValues } from "@/app/api/bookings/schema";
import type { BookingPatch } from "@/app/api/bookings/schema";

/**
 * Query parameters for filtering bookings
 */
export type BookingsFilters = {
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  future?: boolean;
  past?: boolean;
};

/**
 * API Error Response
 */
type ApiErrorResponse = {
  error: string;
  details?: unknown;
};

/**
 * Custom error class for API errors
 */
export class BookingApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

/**
 * Base fetch wrapper with error handling
 */
const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new BookingApiError(
      errorData.error || "An unexpected error occurred",
      response.status,
      errorData.details
    );
  }

  return data as T;
};

/**
 * Build query string from filters
 */
const buildQueryString = (filters: BookingsFilters): string => {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.paymentStatus) {
    params.set("paymentStatus", filters.paymentStatus);
  }
  if (filters.future !== undefined) {
    params.set("future", String(filters.future));
  }
  if (filters.past !== undefined) {
    params.set("past", String(filters.past));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Create a new booking
 */
export const createBooking = async (
  formData: BookingFormValues
): Promise<Booking> => {
  const payload = {
    ...formData,
    // Convert date to ISO string for API
    date: formData.date.toISOString(),
  };

  return apiFetch<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Get all bookings with optional filters
 */
export const getBookings = async (
  filters?: BookingsFilters
): Promise<Booking[]> => {
  const queryString = filters ? buildQueryString(filters) : "";
  return apiFetch<Booking[]>(`/api/bookings${queryString}`);
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (id: string): Promise<Booking> => {
  return apiFetch<Booking>(`/api/bookings/${id}`);
};

/**
 * Update a booking by ID
 */
export const updateBooking = async (
  id: string,
  patch: BookingPatch
): Promise<Booking> => {
  return apiFetch<Booking>(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
};

/**
 * Delete a booking by ID
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await apiFetch<{ message: string }>(`/api/bookings/${id}`, {
    method: "DELETE",
  });
};

