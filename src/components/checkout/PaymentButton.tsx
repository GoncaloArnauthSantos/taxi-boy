"use client";

import { useCallback, useState } from "react";
import { Button } from "../ui/Button";
import { BookingPaymentStatus, type Booking } from "@/domain/booking";
import { CreditCard, InfoIcon, Loader2, Lock } from "lucide-react";
import type { Tour } from "@/cms/types";
import { logError, LogModule } from "@/lib/logger";
import { isPaymentsEnabled } from "@/lib/features";
import Tooltip from "../ui/Tooltip";

type Props = {
  booking: Booking;
  tour: Tour;
};

const PAYMENT_COMING_SOON_MESSAGE = "Payment integration coming soon!";

const PaymentButton = ({ booking, tour }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentsEnabled = isPaymentsEnabled();

  const { id: bookingId, paymentStatus, price } = booking;
  const { title } = tour;
  const handlePayment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // PHASE 1: Call the endpoint (it will return 501, but we can test the flow)
      // In Phase 2, this will work and redirect to Stripe Checkout
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          price: price,
          tourTitle: title,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Phase 1 fallback message while Stripe is not integrated
        if (response.status === 501) {
          setError(
            PAYMENT_COMING_SOON_MESSAGE
          );
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      // PHASE 2: This will work when Stripe is integrated
      const { url } = await response.json();
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initiate payment";
      setError(errorMessage);
      logError({
        message: "Payment error",
        error: err,
        context: { bookingId, price, title },
        module: LogModule.Checkout,
      });
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, price, title]);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handlePayment}
          disabled={
            isLoading ||
            paymentStatus === BookingPaymentStatus.PAID ||
            !paymentsEnabled
          }
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === BookingPaymentStatus.PAID ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Already Paid
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay €{price.toFixed(2)}
            </>
          )}
        </Button>

        {!paymentsEnabled && paymentStatus !== BookingPaymentStatus.PAID && (
          <Tooltip content={PAYMENT_COMING_SOON_MESSAGE}>
            <InfoIcon className="h-4 w-4 cursor-help" />
          </Tooltip>
        )}
      </div>


      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </>
  );
};

export default PaymentButton;
