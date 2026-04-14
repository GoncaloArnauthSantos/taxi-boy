/**
 * Checkout Page
 * 
 * Displays booking details and payment options.
 * 
 * Route: /checkout/[bookingId]
 */

import { notFound, redirect } from "next/navigation";
import { getBookingById } from "@/app/api/bookings/store";
import { getTourByID } from "@/cms/tours/api";
import { getContacts } from "@/cms/contact";
import CheckoutDetails from "@/components/checkout/CheckoutDetails";
import PaymentSection from "@/components/checkout/PaymentSection";
import { BookingStatus } from "@/domain/booking";
import { getCheckoutHeaderContent } from "@/lib/payments/get-checkout-header-content";

type Props = {
  params: Promise<{ bookingId: string }>;
};

const CheckoutPage = async ({ params }: Props) => {
  const { bookingId } = await params;

  const booking = await getBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  const { status, tourId } = booking;

  // Don't allow checkout if cancelled
  if (status === BookingStatus.CANCELLED) {
    redirect(`/booking?error=${BookingStatus.CANCELLED}`);
  }

  const [tour, driverContact] = await Promise.all([
    getTourByID(tourId),
    getContacts(),
  ]);

  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen my-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tour not found</h1>
          <p className="text-muted-foreground">
            The tour for this booking could not be found.
          </p>
        </div>
      </div>
    );
  }

  const headerContent = getCheckoutHeaderContent(booking);

  return (
    <div className="py-16 lg:py-24 bg-muted/30 min-h-screen my-8 lg:my-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {headerContent.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {headerContent.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CheckoutDetails booking={booking} tour={tour} />

            <PaymentSection 
              booking={booking} 
              tour={tour} 
              driverContact={driverContact}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

