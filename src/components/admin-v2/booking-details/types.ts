"use client";

import type {
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";

export type BookingDetailsDraft = {
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  paymentMethod: BookingPaymentMethod | "";
  adminNotes: string;
};

export type SaveState = "idle" | "saving" | "to-save" | "error";
