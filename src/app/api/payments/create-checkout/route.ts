/**
 * Create Checkout Session
 * 
 * POST /api/payments/create-checkout
 * 
 * Creates a Stripe Checkout session for a booking.
 * 
 * Request Body:
 * {
 *   bookingId: string;
 * }
 * 
 * Response:
 * {
 *   url: string; // Stripe Checkout URL
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo, LogModule } from "@/lib/logger";
import { getBookingById } from "@/app/api/bookings/store";
import { BookingPaymentStatus, BookingStatus } from "@/domain/booking";
import { getStripeClient } from "@/lib/stripe";
import { formatDateOnly } from "@/lib/utils";
import { getTourByID } from "@/cms/tours/api";

export const runtime = "nodejs";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const { bookingId } = body as {
      bookingId?: string;
    };

    // Validate request
    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required field: bookingId" },
        { status: 400 }
      );
    }

    // Verify booking exists
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    const { clientEmail, price, paymentStatus, clientSelectedDate, clientName, tourId } = booking;
    const bookingDate = formatDateOnly(clientSelectedDate);
    const tour = await getTourByID(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    // Don't allow checkout if already paid
    if (paymentStatus === BookingPaymentStatus.PAID) {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const baseUrl = request.nextUrl.origin;
    const unitAmount =  Math.round(price * 100);

    logInfo({
      message: "Create checkout session requested",
      context: {
        bookingId,
        tourTitle: tour.title,
        bookingPrice: price,
        unitAmount,
        clientSelectedDate,
      },
      module: LogModule.Payment,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: tour.title,
              description: `Hi ${clientName}, you are booking "${tour.title}" on ${bookingDate}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/${bookingId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking?error=${BookingStatus.CANCELLED}`,
      metadata: {
        bookingId,
      },
    });

    if (!session.url) {
      throw new Error("Stripe session URL was not returned");
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    logError({
      message: "Error creating checkout session",
      error,
      context: { function: "create-checkout" },
      module: LogModule.Payment,
    });

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
};

