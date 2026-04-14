/**
 * Booking Schema
 *
 * Zod schemas for validating booking data in the API layer.
 * Reuses and extends the form validation schema.
 */

import * as z from "zod";
import { BookingPaymentMethod, BookingPaymentStatus, BookingStatus, type Booking } from "@/domain/booking";
import { emailSchema, toDateOnlyString } from "@/lib/utils";

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
  email: emailSchema,
  phoneCountryCode: z.string().min(1, "Country code is required"),
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
    status: z.enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED]).optional(),
    paymentStatus: z.enum([BookingPaymentStatus.PENDING, BookingPaymentStatus.PAID, BookingPaymentStatus.FAILED]).optional(),
    paymentMethod: z.enum([BookingPaymentMethod.BANK_TRANSFER, BookingPaymentMethod.CARD, BookingPaymentMethod.CASH]).optional(),
    price: z.number().positive().optional(),
    clientMessage: z.string().max(1000).optional(),
    clientSelectedDate: z
      .string()
      .refine((date) => {
        const normalizedDate = toDateOnlyString(date);
        if (!normalizedDate) {
          return false;
        }

        const today = toDateOnlyString(new Date());
        return normalizedDate >= today;
      }, "Date must be today or in the future")
      .optional(),
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
    phoneCountryCode,
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
    clientPhoneCountryCode: phoneCountryCode,
    clientCountry: country,
    clientLanguage: language,
    clientSelectedDate: toDateOnlyString(date),
    clientMessage: message ?? null,
    price,
    tourId,
    status: BookingStatus.PENDING,
    paymentStatus: BookingPaymentStatus.PENDING,
    paymentMethod: null,
  };
};
