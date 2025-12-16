/**
 * Bookings API Route
 * 
 * Handles GET (list with filters) and POST (create) operations for bookings.
 */

import { NextRequest, NextResponse } from "next/server"
import { bookingFormSchema, transformFormToBooking } from "./schema"
import { createBooking, getAllBookings } from "./store"
import { getTourByID } from "@/cms/tours"
import { logError } from "@/cms/shared/logger"
import { BookingPaymentStatus, BookingStatus } from "@/domain/booking"

const VALID_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled"]
const VALID_PAYMENT_STATUSES: BookingPaymentStatus[] = ["pending", "paid", "failed"]

/**
 * Parse and validate query parameters for bookings filtering
 * 
 * @param searchParams - URL search parameters from the request
 * @returns Object with validated filter parameters
 * 
 * @example
 * // Query: ?status=pending&future=true
 * // Returns: { status: "pending", future: true }
 */
const parseBookingsQuery = (searchParams: URLSearchParams) => {
  const filters: {
    status?: BookingStatus
    paymentStatus?: BookingPaymentStatus
    future?: boolean
    past?: boolean
  } = {}

  // Validate and parse status
  const statusParam = searchParams.get("status")
  if (statusParam && VALID_STATUSES.includes(statusParam as BookingStatus)) {
    filters.status = statusParam as BookingStatus
  }

  // Validate and parse paymentStatus
  const paymentStatusParam = searchParams.get("paymentStatus")
  if (
    paymentStatusParam &&
    VALID_PAYMENT_STATUSES.includes(paymentStatusParam as BookingPaymentStatus)
  ) {
    filters.paymentStatus = paymentStatusParam as BookingPaymentStatus
  }

  // Parse future (boolean from string)
  const futureParam = searchParams.get("future")
  if (futureParam === "true") {
    filters.future = true
  } else if (futureParam === "false") {
    filters.future = false
  }

  // Parse past (boolean from string)
  const pastParam = searchParams.get("past")
  if (pastParam === "true") {
    filters.past = true
  } else if (pastParam === "false") {
    filters.past = false
  }

  return filters
}

/**
 * GET /api/bookings
 *
 * List all bookings with optional filters.
 * 
 * @param request - Next.js request object
 * @param request.nextUrl.searchParams - Query parameters for filtering
 * @param {string} [request.nextUrl.searchParams.status] - Filter by status: "pending" | "confirmed" | "cancelled"
 * @param {string} [request.nextUrl.searchParams.paymentStatus] - Filter by payment status: "pending" | "paid" | "failed"
 * @param {string} [request.nextUrl.searchParams.future] - Filter for future bookings: "true" | "false" (date >= today)
 * @param {string} [request.nextUrl.searchParams.past] - Filter for past bookings: "true" | "false" (date < today)
 * 
 * @returns {Promise<NextResponse>} Response with array of bookings
 * @returns {number} status - HTTP status code (200 on success, 500 on error)
 * @returns {Booking[]} bookings - Array of booking objects matching the filters
 * @returns {Object} error - Error object if request fails
 * 
 * @example
 * // Get all future paid bookings
 * GET /api/bookings?paymentStatus=paid&future=true
 * 
 * @example
 * // Get all bookings
 * GET /api/bookings
 */
export const GET = async (request: NextRequest) => {
  try {
    const filters = parseBookingsQuery(request.nextUrl.searchParams)
    const hasFilters = Object.keys(filters).length > 0

    const bookings = getAllBookings(hasFilters ? filters : undefined)

    return NextResponse.json(bookings, { status: 200 })
  } catch (error) {
    logError("Error fetching bookings", error, { request: request.url, function: "GET" })

    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings
 *
 * Create a new booking from form data.
 * Validates the input, fetches tour information, and creates a booking.
 * 
 * @param request - Next.js request object
 * @param request.body - JSON body containing booking form data
 * @param {string} request.body.name - Client name (2-100 chars, letters, spaces, hyphens, apostrophes, periods)
 * @param {string} request.body.email - Client email (valid email format)
 * @param {string} request.body.phonePhoneCountryCode - Phone country code (e.g., "+351")
 * @param {string} request.body.phoneNumber - Phone number (6-15 digits, may include spaces, hyphens, parentheses)
 * @param {string} request.body.country - Country name (2-100 chars)
 * @param {string} request.body.language - Preferred language
 * @param {string} request.body.tourId - Tour ID (must exist in CMS)
 * @param {string|Date} request.body.date - Booking date (ISO string or Date, must be today or future)
 * @param {string} [request.body.message] - Optional message (max 1000 chars)
 * 
 * @returns {Promise<NextResponse>} Response with created booking or error
 * @returns {number} status - HTTP status code
 *   - 201: Booking created successfully
 *   - 400: Validation failed or invalid JSON
 *   - 404: Tour not found
 *   - 500: Server error
 * @returns {Booking} booking - Created booking object (on success)
 * @returns {Object} error - Error message (on failure)
 * @returns {Array} [error.details] - Validation error details (on validation failure)
 * 
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    
    // Convert date string back to Date object for validation
    if (body.date && typeof body.date === "string") {
      body.date = new Date(body.date)
    }

    // Validate form data
    const validationResult = bookingFormSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // Get tour to extract price
    const tour = await getTourByID(formData.tourId)
    
    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      )
    }

    // Transform form data to booking
    const bookingInput = transformFormToBooking(formData, tour.price)

    // Create booking
    const booking = createBooking(bookingInput)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    logError("Error creating booking", error, { request: request.url })
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

