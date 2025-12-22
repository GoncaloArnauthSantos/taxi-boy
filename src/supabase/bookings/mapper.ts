/**
 * Booking Mappers
 *
 * Maps between database format (snake_case) and application format (camelCase).
 * This separation keeps the mapping logic centralized and reusable.
 */

import type { Booking, BookingPaymentMethod, BookingPaymentStatus, BookingStatus } from "@/domain/booking";

/**
 * Database row format (snake_case)
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/**
 * Database insert format (snake_case)
 */
type BookingInsert = {
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
};

/**
 * Map Booking type to database insert format (camelCase → snake_case)
 */
export const mapBookingToInsert = (
  input: Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt">
): BookingInsert => {
  return {
    client_name: input.clientName,
    client_email: input.clientEmail,
    client_phone: input.clientPhone,
    client_phone_country_code: input.clientPhoneCountryCode,
    client_country: input.clientCountry,
    client_language: input.clientLanguage,
    client_selected_date: input.clientSelectedDate,
    client_message: input.clientMessage,
    tour_id: input.tourId,
    status: input.status,
    price: input.price,
    payment_status: input.paymentStatus,
    payment_method: input.paymentMethod,
  };
};

/**
 * Map Booking patch to database update format (camelCase → snake_case)
 * Only includes fields that are provided in the patch
 */
export const mapBookingPatchToUpdate = (
  patch: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt">>
): Partial<BookingInsert> => {  
  const updateData: Partial<BookingInsert> = {};

  // Use !== undefined to allow falsy values (0, "", false, null)
  if (patch.clientName !== undefined) {
    updateData.client_name = patch.clientName;
  }
  if (patch.clientEmail !== undefined) {
    updateData.client_email = patch.clientEmail;
  }
  if (patch.clientPhone !== undefined) {
    updateData.client_phone = patch.clientPhone;
  }
  if (patch.clientPhoneCountryCode !== undefined) {
    updateData.client_phone_country_code = patch.clientPhoneCountryCode;
  }
  if (patch.clientCountry !== undefined) {
    updateData.client_country = patch.clientCountry;
  }
  if (patch.clientLanguage !== undefined) {
    updateData.client_language = patch.clientLanguage;
  }
  if (patch.clientSelectedDate !== undefined) {
    updateData.client_selected_date = patch.clientSelectedDate;
  }
  if (patch.clientMessage !== undefined) {
    updateData.client_message = patch.clientMessage ?? null;
  }
  if (patch.tourId !== undefined) {
    updateData.tour_id = patch.tourId;
  }
  if (patch.status !== undefined) {
    updateData.status = patch.status;
  }
  if (patch.paymentStatus !== undefined) {
    updateData.payment_status = patch.paymentStatus;
  }
  if (patch.paymentMethod !== undefined) {
    updateData.payment_method = patch.paymentMethod ?? null;
  }
  if (patch.price !== undefined) {
    updateData.price = patch.price;
  }

  return updateData;
};

/**
 * Map database row to Booking type (snake_case → camelCase)
 */
export const mapRowToBooking = (row: BookingRow): Booking => {
  return {
    id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    clientPhoneCountryCode: row.client_phone_country_code,
    clientCountry: row.client_country,
    clientLanguage: row.client_language,
    clientSelectedDate: row.client_selected_date,
    clientMessage: row.client_message,
    tourId: row.tour_id,
    status: row.status as BookingStatus,
    price: Number(row.price),
    paymentStatus: row.payment_status as BookingPaymentStatus,
    paymentMethod: (row.payment_method as BookingPaymentMethod),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
};

