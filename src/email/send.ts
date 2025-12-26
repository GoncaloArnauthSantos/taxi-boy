/**
 * Email Sending Functions
 *
 * Functions to send booking confirmation emails.
 */

import { createEmailClient } from "./client";
import type { Booking } from "@/domain/booking";
import type { Tour } from "@/cms/types";
import { logError, logInfo, LogModule } from "@/lib/logger";
import { BookingNotificationDriverTemplate } from "./templates/booking-notification-driver";
import { BookingConfirmationClientTemplate } from "./templates/booking-confirmation-client";
import { BookingReminderClientTemplate } from "./templates/booking-reminder-client";


/**
 * Get the email address to send from
 */
const getFromEmail = (): string => {
  const fromEmail = process.env.EMAIL_FROM;
  if (!fromEmail) {
    throw new Error(
      "EMAIL_FROM environment variable is required. " +
        "Please set it in your .env.local file."
    );
  }
  return fromEmail;
};

/**
 * Get the driver email address
 */
const getDriverEmail = (): string => {
  const driverEmail = process.env.DRIVER_EMAIL;

  if (!driverEmail) {
    throw new Error(
      "DRIVER_EMAIL environment variable is required. " +
        "Please set it in your .env.local file."
    );
  }
  return driverEmail;
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format price for display
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

/**
 * Send booking confirmation email to client
 */
export const sendClientConfirmation = async (
  booking: Booking,
  tour: Tour
): Promise<void> => {
  try {
    const resend = createEmailClient();
    const fromEmail = getFromEmail();

    const bookingDate = formatDate(booking.clientSelectedDate);
    const price = formatPrice(booking.price);

    const html = BookingConfirmationClientTemplate({
      booking,
      tour,
      bookingDate,
      price,
    });

    await resend.emails.send({
      from: fromEmail,
      to: booking.clientEmail,
      subject: `Booking Confirmation - ${tour.title}`,
      html,
    });

    logInfo({
      message: "Client confirmation email sent",
      context: {
        bookingId: booking.id,
        clientEmail: booking.clientEmail,
      },
      module: LogModule.Email,
    });

  } catch (error) {
    logError({
      message: "Failed to send client confirmation email",
      error,
      context: {
        bookingId: booking.id,
        clientEmail: booking.clientEmail,
      },
      module: LogModule.Email,
    });
    throw error;
  }
};

/**
 * Send booking notification email to driver
 */
export const sendDriverNotification = async (
  booking: Booking,
  tour: Tour
): Promise<void> => {
  try {
    const resend = createEmailClient();
    const fromEmail = getFromEmail();
    const driverEmail = getDriverEmail();

    const bookingDate = formatDate(booking.clientSelectedDate);
    const price = formatPrice(booking.price);

    const html = BookingNotificationDriverTemplate({
      booking,
      tour,
      bookingDate,
      price,
    });

    await resend.emails.send({
      from: fromEmail,
      to: driverEmail,
      subject: `New Booking - ${tour.title} on ${bookingDate}`,
      html,
    });

    logInfo({
      message: "Driver notification email sent",
      context: {
        bookingId: booking.id,
        driverEmail: driverEmail,
      },
      module: LogModule.Email,
    });

  } catch (error) {
    logError({
      message: "Failed to send driver notification email",
      error,
      context: {
        bookingId: booking.id,
      },
      module: LogModule.Email,
    });
    throw error;
  }
};

/**
 * Send both confirmation emails (client and driver)
 * This function sends emails asynchronously and doesn't block
 */
export const sendBookingConfirmationEmails = async (
  booking: Booking,
  tour: Tour
): Promise<void> => {
  // Send both emails in parallel
  await Promise.all([
    sendClientConfirmation(booking, tour),
    sendDriverNotification(booking, tour),
  ]);
};

/**
 * Send booking reminder email to client (day before the tour)
 */
export const sendBookingReminderEmail = async (
  booking: Booking,
  tour: Tour
): Promise<void> => {
  try {
    const resend = createEmailClient();
    const fromEmail = getFromEmail();

    const bookingDate = formatDate(booking.clientSelectedDate);

    const html = BookingReminderClientTemplate({
      booking,
      tour,
      bookingDate,
    });

    await resend.emails.send({
      from: fromEmail,
      to: booking.clientEmail,
      subject: `Reminder - Your tour is tomorrow: ${tour.title}`,
      html,
    });

    logInfo({
      message: "Client reminder email sent",
      context: {
        bookingId: booking.id,
        clientEmail: booking.clientEmail,
      },
      module: LogModule.Email,
    });
  } catch (error) {
    logError({
      message: "Failed to send client reminder email",
      error,
      context: {
        bookingId: booking.id,
        clientEmail: booking.clientEmail,
      },
      module: LogModule.Email,
    });
    throw error;
  }
};

