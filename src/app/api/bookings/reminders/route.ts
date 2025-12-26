/**
 * Booking Reminders API Route
 *
 * GET /api/bookings/reminders
 *
 * Simple daily job to send "don't forget" reminder emails
 * for bookings scheduled for tomorrow.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBookings } from "../store";
import { getTourByID } from "@/cms/tours";
import { sendBookingReminderEmail } from "@/email/send";
import { logError, logInfo, LogModule } from "@/lib/logger";

/**
 * Calculate the start and end of "tomorrow" in the server timezone.
 * Returns dates in YYYY-MM-DD format for database queries.
 */
const getTomorrowRange = () => {
  const now = new Date();

  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  // Convert to YYYY-MM-DD format for database queries
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Simple protection using a shared secret in the Authorization header
    const secret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("Authorization");

    if (secret) {
      const expected = `Bearer ${secret}`;
      if (!authHeader || authHeader !== expected) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const { start, end } = getTomorrowRange();

    // Fetch bookings for tomorrow directly from the database
    // This is more efficient than fetching all future bookings and filtering in memory
    const bookingsForTomorrow = await getAllBookings({
      dateRange: { start, end },
    });

    if (bookingsForTomorrow.length === 0) {
      logInfo({
        message: "No bookings found for tomorrow. Skipping reminders.",
        module: LogModule.API,
      });
      return NextResponse.json(
        { total: 0, sent: 0, failed: 0, skipped: 0 },
        { status: 200 }
      );
    }

    const results = await Promise.all(
      bookingsForTomorrow.map(async (booking) => {
        const tour = await getTourByID(booking.tourId);

        if (!tour) {
          logInfo({
            message: "Skipping reminder - tour not found",
            context: {
              bookingId: booking.id,
              tourId: booking.tourId,
            },
            module: LogModule.API,
          });

          return { bookingId: booking.id, status: "skipped_no_tour" as const };
        }

        try {

          await sendBookingReminderEmail(booking, tour);
          return { bookingId: booking.id, status: "sent" as const };
        } catch (error) {
          logError({
            message: "Failed to send reminder email",
            error,
            context: {
              bookingId: booking.id,
              tourId: booking.tourId,
            },
            module: LogModule.API,
          });
          return { bookingId: booking.id, status: "failed" as const };
        }
      })
    );

    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = results.filter((r) => r.status === "skipped_no_tour").length;

    logInfo({
      message: "Booking reminders job completed",
      context: {
        total: bookingsForTomorrow.length,
        sent,
        failed,
        skipped,
      },
      module: LogModule.API,
    });

    return NextResponse.json(
      {
        total: bookingsForTomorrow.length,
        sent,
        failed,
        skipped,
      },
      { status: 200 }
    );
  } catch (error) {
    logError({
      message: "Error running booking reminders job",
      error,
      context: {
        request: request.url,
        function: "GET /api/bookings/reminders",
      },
      module: LogModule.API,
    });

    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}


