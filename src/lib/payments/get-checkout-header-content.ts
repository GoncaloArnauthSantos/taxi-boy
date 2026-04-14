import { BookingPaymentStatus, BookingStatus, type Booking } from "@/domain/booking";

type CheckoutHeaderContent = {
  title: string;
  description: string;
};

/**
 * Returns checkout page header content based on booking/payment status.
 */
export const getCheckoutHeaderContent = (
  booking: Pick<Booking, "status" | "paymentStatus">
): CheckoutHeaderContent => {
  const { paymentStatus, status } = booking;

  if (paymentStatus === BookingPaymentStatus.PAID) {
    return {
      title: "Payment Confirmed",
      description: "Your payment has been successfully processed. Your booking is confirmed.",
    };
  }

  if (
    status === BookingStatus.CONFIRMED &&
    paymentStatus === BookingPaymentStatus.PENDING
  ) {
    return {
      title: "Booking Confirmed",
      description: "Your reservation has been confirmed. Payment will be completed on the day of your tour.",
    };
  }

  if (paymentStatus === BookingPaymentStatus.FAILED) {
    return {
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again or contact us for assistance.",
    };
  }

  return {
    title: "Complete Your Payment",
    description: "Review your booking details and proceed to payment",
  };
};
