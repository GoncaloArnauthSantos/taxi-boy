/**
 * Payment Success Page
 * 
 * Shown after successful payment.
 * 
 * Route: /checkout/[bookingId]/success
 */

import { notFound, redirect } from "next/navigation";
import { getBookingById } from "@/app/api/bookings/store";
import { getTourByID } from "@/cms/tours/api";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { logError, LogModule } from "@/lib/logger";
import { formatDateOnly } from "@/lib/utils";
import { BookingPaymentStatus } from "@/domain/booking";
import { validateCheckoutSession } from "@/lib/payments/validate-checkout-session";

type Props = {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

const PaymentSuccessPage = async ({ params, searchParams }: Props) => {
  const { bookingId } = await params;
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect(`/checkout/${bookingId}`);
  }

  // Validate Stripe checkout session
  try {
    const isValidSession = await validateCheckoutSession({
      sessionId: session_id,
      bookingId,
    });

    if (!isValidSession) {
      redirect(`/checkout/${bookingId}`);
    }
  } catch (error) {
    logError({
      message: "Failed to validate Stripe checkout session on success page",
      error,
      context: { bookingId, sessionId: session_id },
      module: LogModule.Payment,
    });
    redirect(`/checkout/${bookingId}`);
  }

  // Get booking from database
  const booking = await getBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  const tour = await getTourByID(booking.tourId);
  const bookingDate = formatDateOnly(booking.clientSelectedDate);
  const paymentConfirmed = booking.paymentStatus === BookingPaymentStatus.PAID;

  return (
    <div className="flex items-center justify-center min-h-screen py-16 px-4 bg-muted/30">
      <Card className="max-w-md w-full border-border">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            {paymentConfirmed ? "Payment Successful!" : "Payment Received"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {paymentConfirmed ? (
              <>
                Thank you for your payment. Your booking for{" "}
                <span className="font-semibold">{tour?.title}</span> on{" "}
                <span className="font-semibold">{bookingDate}</span> is now confirmed.
              </>
            ) : (
              <>
                We received your payment for{" "}
                <span className="font-semibold">{tour?.title}</span> on{" "}
                <span className="font-semibold">{bookingDate}</span>. We&apos;re still
                confirming your booking in our system. Please refresh this page in a few
                seconds.
              </>
            )}
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/booking">Book Another Tour</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;

