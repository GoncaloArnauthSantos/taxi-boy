/**
 * Booking Schema
 *
 * Zod schemas for validating booking data in the API layer.
 * Reuses and extends the form validation schema.
 */

import * as z from "zod";
import type { Booking } from "@/domain/booking";

/**
 * Schema for booking form submission (matches BookingForm)
 */
export const bookingFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[\p{L}\s'.-]+$/u,
      "Name can only contain letters (including accented characters), spaces, hyphens, apostrophes, and periods"
    ),
  email: z.string().email("Please enter a valid email address"),
  phonePhoneCountryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(
      /^[\d\s\-\(\)]+$/,
      "Phone number can only contain digits, spaces, hyphens, and parentheses"
    ),
  country: z
    .string()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must be less than 100 characters"),
  language: z.string().min(1, "Please select a preferred language"),
  tourId: z.string().min(1, "Please select a tour"),
  date: z
    .date({
      message: "Please select a preferred date",
    })
    .refine(
      (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      "Date must be today or in the future"
    ),
  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

/**
 * Schema for PATCH requests (partial updates)
 */
export const bookingPatchSchema = z
  .object({
    status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
    paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
    paymentMethod: z.enum(["bank_transfer", "card", "cash"]).optional(),
    price: z.number().positive().optional(),
    clientMessage: z.string().max(1000).optional(),
  })
  .strict();

export type BookingPatch = z.infer<typeof bookingPatchSchema>;

/**
 * Transform form data into a Booking object
 */
export const transformFormToBooking = (
  formData: BookingFormValues,
  price: number
): Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt"> => {
  const {
    name,
    email,
    phoneNumber,
    phonePhoneCountryCode,
    country,
    language,
    date,
    message,
    tourId,
  } = formData;

  return {
    clientName: name,
    clientEmail: email,
    clientPhone: phoneNumber,
    clientPhoneCountryCode: phonePhoneCountryCode,
    clientCountry: country,
    clientLanguage: language,
    clientSelectedDate: date.toISOString(),
    clientMessage: message ?? null,
    price,
    tourId,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: null,
  };
};
