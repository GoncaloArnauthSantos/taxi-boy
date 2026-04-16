import { getStripeClient } from "@/lib/stripe";

type ValidateCheckoutSessionParams = {
  sessionId: string;
  bookingId: string;
};

/**
 * Validates if a Stripe Checkout session belongs to the booking
 * and was successfully paid.
 */
export const validateCheckoutSession = async ({
  sessionId,
  bookingId,
}: ValidateCheckoutSessionParams): Promise<boolean> => {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const sessionBookingId = session.metadata?.bookingId;

  return sessionBookingId === bookingId && session.payment_status === "paid";
};
