import { getAllTours } from "@/cms/tours"
import { getDriverLanguages } from "@/cms/drivers"
import BookingPageContent from "@/components/booking/BookingPageContent"
import { getPageSectionByUID } from "@/cms/page-sections"
import { getUnavailableDates } from "@/app/api/bookings/store"

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
