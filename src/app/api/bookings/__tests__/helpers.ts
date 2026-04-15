/**
 * Test Helpers for Booking API Integration Tests
 * 
 * Provides mock data and utilities for testing booking API routes.
 */

import { BookingPaymentStatus, BookingStatus, type Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";

/**
 * Create a mock booking for testing
 */
export const createMockBooking = (overrides?: Partial<Booking>): Booking => {
  const now = new Date().toISOString();
  const futureDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Tomorrow (YYYY-MM-DD)

  return {
    id: "booking-123",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "912345678",
    clientPhoneCountryCode: "+351",
    clientCountry: "Portugal",
    clientLanguage: "English",
    clientSelectedDate: futureDate,
    clientMessage: "Test message",
    tourId: "tour-123",
    status: BookingStatus.PENDING,
    price: 100,
    paymentStatus: BookingPaymentStatus.PENDING,
    paymentMethod: null,
    stripeSessionId: null,
    stripePaymentIntentId: null,
    paidAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
};

/**
 * Create a mock tour for testing
 */
export const createMockTour = (overrides?: Partial<Tour>): Tour => {
  return {
    id: "tour-123",
    uid: "lisbon-city-tour",
    title: "Lisbon City Tour",
    description: "Explore Lisbon",
    longDescription: "Full description of the tour",
    locations: [{ id: "loc1", value: "Lisbon" }],
    bannerImage: null,
    images: [],
    duration: 4,
    price: 100,
    includedItems: [],
    ...overrides,
  };
};

/**
 * Database booking row type (snake_case)
 */
type BookingRow = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_phone_country_code: string;
  client_country: string;
  client_language: string;
  client_selected_date: string;
  client_message: string | null;
  tour_id: string;
  status: string;
  price: number;
  payment_status: string;
  payment_method: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/**
 * Create a mock booking row (database format - snake_case)
 */
export const createMockBookingRow = (overrides?: Partial<BookingRow>): BookingRow => {
  const now = new Date().toISOString();
  const futureDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return {
    id: "booking-123",
    client_name: "John Doe",
    client_email: "john@example.com",
    client_phone: "912345678",
    client_phone_country_code: "+351",
    client_country: "Portugal",
    client_language: "English",
    client_selected_date: futureDate,
    client_message: "Test message",
    tour_id: "tour-123",
    status: BookingStatus.PENDING,
    price: 100,
    payment_status: "pending",
    payment_method: null,
    stripe_session_id: null,
    stripe_payment_intent_id: null,
    paid_at: null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...overrides,
  };
};

