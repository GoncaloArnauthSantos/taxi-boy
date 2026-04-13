/**
 * Payment Success Page
 * 
 * Shown after successful payment.
 * 
 * Route: /checkout/[bookingId]/success
 */

import { notFound } from "next/navigation";
import { getBookingById } from "@/app/api/bookings/store";
import { getTourByID } from "@/cms/tours/api";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

const PaymentSuccessPage = async ({ params, searchParams }: Props) => {
  const { bookingId } = await params;
  const { session_id } = await searchParams;

  // Fetch booking and tour
  const booking = await getBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  const tour = await getTourByID(booking.tourId);
  const bookingDate = format(new Date(booking.clientSelectedDate), "EEEE, MMMM d, yyyy");

  // PHASE 1: This is just a placeholder
  // In Phase 2, we'll verify the payment with Stripe using session_id
  // and redirect if payment is not confirmed

  return (
    <div className="flex items-center justify-center min-h-screen py-16 px-4 bg-muted/30">
      <Card className="max-w-md w-full border-border">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Thank you for your payment. Your booking for{" "}
            <span className="font-semibold">{tour?.title || "your tour"}</span> on{" "}
            <span className="font-semibold">{bookingDate}</span> is now confirmed.
          </p>
          {session_id && (
            <p className="text-xs text-muted-foreground mb-6">
              Session ID: {session_id}
            </p>
          )}
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

