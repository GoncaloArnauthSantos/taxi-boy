import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import {
  Globe,
  Clock,
  Star,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

const LANGUAGE_FLAGS: Record<string, string> = {
  English: "🇬🇧",
  French: "🇫🇷",
  German: "🇩🇪",
  Portuguese: "🇵🇹",
  Spanish: "🇪🇸",
  Italian: "🇮🇹",
};

export const getLanguageFlag = (language: string): string => {
  return LANGUAGE_FLAGS[language] || "🌐";
};

/**
 * Icon name to Lucide icon component mapping
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Clock,
  Star,
  MessageCircle,
};

/**
 * Get a Lucide icon component by name
 *
 * @param iconName - The name of the icon (must match a key in ICON_MAP)
 * @returns The icon component or null if not found
 */
export const getIcon = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
};

/**
 * Build a mailto link with subject "Private tour request".
 */
export const buildMailtoLink = (email: string): string => {
  const emailSubject = "Private tour request";

  const params = new URLSearchParams();
  params.set("subject", emailSubject);

  return `mailto:${email}?${params.toString()}`;
};

/**
 * Build a WhatsApp link with a pre-filled message.
 * 
 * @param phone - Phone number in international format (e.g., "351912345678" without +)
 * @param message - Optional custom message. If not provided, uses default message.
 * @returns WhatsApp deep link URL
 */
export const buildWhatsAppLink = (
  phone: string,
  message?: string
): string => {
  // Remove any non-digit characters from phone number
  const cleanPhone = phone.replace(/\D/g, "");

  // Default message if none provided
  const defaultMessage =
    "Hello! I'm interested in booking a personalized taxi tour in Lisbon. Could you please provide more information?";

  const finalMessage = message || defaultMessage;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(finalMessage);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const phonePreview = (phone: string): string => {
  return `(${phone.slice(0, 4)}) ${phone.slice(4)}`;
};

const DATE_ONLY_REGEX = /^(\d{4}-\d{2}-\d{2})/;

/**
 * Convert a date value to YYYY-MM-DD without timezone drift.
 */
export const toDateOnlyString = (value: Date | string): string => {
  if (typeof value === "string") {
    const match = value.match(DATE_ONLY_REGEX);
    if (match?.[1]) {
      return match[1];
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Format a date value into a long readable format:
 * Example: "Monday, April 14, 2026".
 *
 * @param value - Date value as Date object or ISO/string input
 * @returns Formatted date string (or empty string for invalid values)
 */
export const formatDateOnly = (value: Date | string): string => {
  const dateOnly = toDateOnlyString(value);
  if (!dateOnly) {
    return "";
  }

  const utcDate = new Date(`${dateOnly}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate);
};

/**
 * Email validation regex pattern
 * Matches standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Email schema with custom validation
 * Uses regex instead of deprecated .email() method
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .trim()
  .refine(
    (value) => EMAIL_REGEX.test(value),
    {
      message: "Please enter a valid email address",
    }
  );