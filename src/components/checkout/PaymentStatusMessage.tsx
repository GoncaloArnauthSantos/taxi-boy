import { memo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  type Booking,
  BookingPaymentStatus,
  BookingStatus,
  BookingPaymentMethod,
} from "@/domain/booking";

type Props = {
  booking: Booking;
};

/**
 * Helper to format payment method for display
 */
const formatPaymentMethod = (method: BookingPaymentMethod): string => {
  switch (method) {
  case BookingPaymentMethod.CARD:
    return "Card";
  case BookingPaymentMethod.BANK_TRANSFER:
    return "Bank Transfer";
  case BookingPaymentMethod.CASH:
    return "Cash";
  default:
    return method;
  }
};

/**
 * PaymentStatusMessage Component
 * 
 * Displays status messages based on booking payment and status.
 * Handles different states: paid, confirmed+pending, failed
 * 
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 */
const PaymentStatusMessage = memo(({ booking }: Props) => {
  const { paymentStatus, status, price, paymentMethod } = booking;

  if (paymentStatus === BookingPaymentStatus.PAID) {
    return (
      <>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Payment Confirmed
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your payment of €{price.toFixed(2)} has been successfully processed.
                {paymentMethod && (
                  <span className="block mt-1">
                    Payment method: {formatPaymentMethod(paymentMethod)}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {status === BookingStatus.CONFIRMED && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Booking Confirmed
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your booking is confirmed and ready. We&apos;ll be in touch soon with more details.
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (status === BookingStatus.CONFIRMED && paymentStatus === BookingPaymentStatus.PENDING) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Your Booking is Confirmed
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your reservation has been confirmed. Payment will be completed on the day of your tour.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === BookingPaymentStatus.FAILED) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
              Payment Could Not Be Processed
            </p>
            <p className="text-sm text-red-800 dark:text-red-200">
              Your payment attempt was unsuccessful. Please try again or contact us for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

PaymentStatusMessage.displayName = "PaymentStatusMessage";

export default PaymentStatusMessage;

