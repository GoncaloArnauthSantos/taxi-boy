import { Metadata } from "next"
import { getAllTours } from "@/cms/tours"
import { getDriverLanguages } from "@/cms/drivers"
import BookingPageContent from "@/components/booking/BookingPageContent"
import { getPageSectionByUID } from "@/cms/page-sections"
import { getUnavailableDates } from "@/app/api/bookings/store"
import { getBaseUrl, generateOpenGraphMetadata, generateTwitterMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Book a Tour",
  description:
    "Book your personalized Lisbon taxi tour today. Choose your preferred date, tour, and language. Experience the best of Lisbon with a multilingual local driver.",
  keywords: ["book tour", "Lisbon booking", "taxi tour reservation", "Portugal tours"],
  openGraph: generateOpenGraphMetadata({
    title: "Book Your Lisbon Taxi Tour",
    description:
      "Book your personalized Lisbon taxi tour today. Choose your preferred date, tour, and language. Experience the best of Lisbon with a multilingual local driver.",
    url: `${getBaseUrl()}/booking`,
  }),
  twitter: generateTwitterMetadata({
    title: "Book Your Lisbon Taxi Tour",
    description:
      "Book your personalized Lisbon taxi tour today. Choose your preferred date, tour, and language. Experience the best of Lisbon with a multilingual local driver.",
  }),
  alternates: {
    canonical: `${getBaseUrl()}/booking`,
  },
}

/**
 * Server Component that fetches tours, languages, and unavailable dates
 * Passes data to client component for form interaction
 */
const BookingPage = async () => {
  const [tours, languages, confirmationContent, bookingPageContent, unavailableDates] = await Promise.all([
    getAllTours(),
    getDriverLanguages(),
    getPageSectionByUID("booking-page-confirmation"),
    getPageSectionByUID("booking-page"),
    getUnavailableDates(),
  ])

  return (
    <BookingPageContent
      tours={tours}
      languages={languages}
      confirmationContent={confirmationContent}
      bookingPageContent={bookingPageContent}
      unavailableDates={unavailableDates}
    />
  )
}

export default BookingPage
