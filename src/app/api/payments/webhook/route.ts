/**
 * Stripe Webhook Handler
 * 
 * POST /api/payments/webhook
 * 
 * Receives webhooks from Stripe when payment events occur.
 * 
 * IMPORTANT SECURITY:
 * - This endpoint MUST verify the webhook signature
 * - Only process webhooks that come from Stripe
 * - Use idempotency to prevent duplicate processing
 * 
 * PHASE 1: This is just a skeleton. The actual Stripe integration comes in Phase 2.
 * 
 * Webhook Events We'll Handle:
 * - checkout.session.completed: When customer completes payment
 * - payment_intent.succeeded: When payment is successful
 * - payment_intent.payment_failed: When payment fails
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { logError, logInfo, LogModule } from "@/lib/logger";
import { getBookingById, updateBooking } from "@/app/api/bookings/store";
import {
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

/**
 * IMPORTANT: This route must NOT use Next.js body parsing
 * Stripe needs the raw body to verify the signature
 */
export const runtime = "nodejs";

const getPaymentIntentId = (
  paymentIntent: string | Stripe.PaymentIntent | null
): string | null => {
  if (!paymentIntent) {
    return null;
  }
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logError({
        message: "Invalid Stripe webhook signature",
        error,
        context: { function: "webhook" },
        module: LogModule.Payment,
      });

      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      const stripeSessionId = session.id;
      const stripePaymentIntentId = getPaymentIntentId(session.payment_intent);

      if (bookingId) {
        const booking = await getBookingById(bookingId);
        if (!booking) {
          logInfo({
            message: "Stripe webhook booking not found",
            context: { bookingId, stripeSessionId, eventId: event.id },
            module: LogModule.Payment,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        if (booking.stripeSessionId === stripeSessionId) {
          logInfo({
            message: "Stripe webhook duplicate ignored",
            context: { bookingId, stripeSessionId, eventId: event.id },
            module: LogModule.Payment,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        await updateBooking(bookingId, {
          paymentStatus: BookingPaymentStatus.PAID,
          paymentMethod: BookingPaymentMethod.CARD,
          status: BookingStatus.CONFIRMED,
          stripeSessionId,
          stripePaymentIntentId,
          paidAt: new Date().toISOString(),
        });

        logInfo({
          message: "Booking marked as paid from Stripe webhook",
          context: { bookingId, stripeSessionId, stripePaymentIntentId, eventId: event.id },
          module: LogModule.Payment,
        });
      }
    }

    if (
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "checkout.session.expired"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      const stripeSessionId = session.id;
      const stripePaymentIntentId = getPaymentIntentId(session.payment_intent);

      if (bookingId) {
        const booking = await getBookingById(bookingId);
        if (!booking) {
          logInfo({
            message: "Stripe webhook booking not found for failure event",
            context: { bookingId, stripeSessionId, eventId: event.id },
            module: LogModule.Payment,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        if (booking.paymentStatus === BookingPaymentStatus.PAID) {
          logInfo({
            message: "Stripe failure event ignored for already paid booking",
            context: { bookingId, stripeSessionId, eventId: event.id },
            module: LogModule.Payment,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        if (booking.stripeSessionId === stripeSessionId) {
          logInfo({
            message: "Stripe webhook duplicate failure ignored",
            context: { bookingId, stripeSessionId, eventId: event.id },
            module: LogModule.Payment,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        await updateBooking(bookingId, {
          paymentStatus: BookingPaymentStatus.FAILED,
          paymentMethod: BookingPaymentMethod.CARD,
          stripeSessionId,
          stripePaymentIntentId,
        });

        logInfo({
          message: "Booking marked as failed from Stripe webhook",
          context: { bookingId, stripeSessionId, stripePaymentIntentId, eventId: event.id },
          module: LogModule.Payment,
        });
      }
    }

    logInfo({
      message: "Stripe webhook processed",
      context: { eventType: event.type, eventId: event.id },
      module: LogModule.Payment,
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logError({
      message: "Error processing webhook",
      error,
      context: { function: "webhook" },
      module: LogModule.Payment,
    });

    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
};

