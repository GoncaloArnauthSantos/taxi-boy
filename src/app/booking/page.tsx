import { getAllTours } from "@/cms/tours"
import { getDriverLanguages } from "@/cms/drivers"
import BookingPageContent from "@/components/booking/BookingPageContent"
import { getPageSectionByUID } from "@/cms/page-sections"

/**
 * Server Component that fetches tours and languages from CMS
 * Passes data to client component for form interaction
 */
const BookingPage = async () => {
  const [tours, languages, confirmationContent, bookingPageContent] = await Promise.all([
    getAllTours(),
    getDriverLanguages(),
    getPageSectionByUID("booking-page-confirmation"),
    getPageSectionByUID("booking-page"),
  ])

  return <BookingPageContent tours={tours} languages={languages} confirmationContent={confirmationContent} bookingPageContent={bookingPageContent} />
}

export default BookingPage
