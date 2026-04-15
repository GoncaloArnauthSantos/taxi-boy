"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import type { PageSection, Tour } from "@/cms/types";

type Props = {
  tours: Tour[];
  languages: string[];
  bookingPageContent: PageSection | null;
  unavailableDates: Date[];
  initialTourId?: string;
  showCancelledMessage?: boolean;
};

const BookingPageContent = ({
  tours,
  languages,
  bookingPageContent,
  unavailableDates,
  initialTourId,
  showCancelledMessage,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMessage, setShowMessage] = useState(showCancelledMessage);

  // Remove error from URL without reload
  useEffect(() => {
    if (showCancelledMessage) {
      if (searchParams.has("error")) {
        const params = new URLSearchParams(searchParams);
        params.delete("error");

        const newUrl = window.location.pathname;
        router.replace(newUrl);
      }
    }
  }, [showCancelledMessage, searchParams, router]);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const { title: bookingPageTitle, label: bookingPageLabel } =
    bookingPageContent || {};

  return (
    <>
      {/* Cancelled Booking Message */}
      {showMessage && (
        <div className="fixed top-20 md:top-24 left-0 right-0 z-50 bg-yellow-50 dark:bg-yellow-900/20 border-b md:border border-yellow-200 dark:border-yellow-800 shadow-sm md:rounded-lg md:mx-4 md:max-w-2xl md:left-1/2 md:-translate-x-1/2">
          <div className="px-4 py-3 md:px-6 md:py-4">
            <p className="text-xs md:text-base text-yellow-800 dark:text-yellow-200 text-center whitespace-nowrap">
              <span className="md:hidden">Booking cancelled. Create a new booking.</span>
              <span className="hidden md:inline">Your booking has been cancelled. Please create a new booking.</span>
            </p>
          </div>
        </div>
      )}

      <div
        className="py-8 lg:py-24 bg-muted/30"
        data-testid="booking-page-content"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {bookingPageTitle}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {bookingPageLabel}
              </p>
            </div>

            <BookingForm
              tours={tours}
              languages={languages}
              unavailableDates={unavailableDates}
              initialTourId={initialTourId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPageContent;
