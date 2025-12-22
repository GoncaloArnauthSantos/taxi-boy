/**
 * Booking by ID API Route
 * 
 * Handles GET (fetch one), PATCH (update), and DELETE operations for a specific booking.
 */

import { NextRequest, NextResponse } from "next/server"
import { bookingPatchSchema } from "../schema"
import { getBookingById, updateBooking, deleteBooking, isDateAvailable } from "../store"
import { logError } from "@/cms/shared/logger"
import { requireAuth } from "@/app/api/auth/helpers"

type BookingRouteContext = {
  params: Promise<{
    id: string
  }>
}

/**
 * UUID v4 validation regex
 * Matches standard UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validate if a string is a valid UUID v4
 */
const isValidUUID = (id: string): boolean => {
  return UUID_REGEX.test(id)
}

/**
 * GET /api/bookings/:id
 *
 * Fetch a single booking by ID.
 * 
 * @param request - Next.js request object (not used, but required by Next.js)
 * @param params - Route parameters
 * @param {Promise<{id: string}>} params.params - Promise containing route params
 * @param {string} params.params.id - Booking ID (UUID)
 * 
 * @returns {Promise<NextResponse>} Response with booking or error
 * @returns {number} status - HTTP status code
 *   - 200: Booking found
 *   - 404: Booking not found
 *   - 500: Server error
 * @returns {Booking} booking - Booking object (on success)
 * @returns {Object} error - Error message (on failure)
 * 
 */
export const GET = async (
  request: NextRequest,
  { params }: BookingRouteContext
) => {
  try {
    const { id } = await params

    // Validate UUID format before querying database
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID format" },
        { status: 400 }
      )
    }

    const booking = await getBookingById(id)

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (error) {
    logError("Error fetching booking", error, { request: request.url, function: "GET" })
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/bookings/:id
 *
 * Update specific fields of a booking.
 * Only allows updating: status, paymentStatus, paymentMethod, price, clientMessage.
 * 
 * @param request - Next.js request object
 * @param request.body - JSON body containing fields to update
 * @param {string} [request.body.status] - Booking status: "pending" | "confirmed" | "cancelled"
 * @param {string} [request.body.paymentStatus] - Payment status: "pending" | "paid" | "failed"
 * @param {string} [request.body.paymentMethod] - Payment method: "bank_transfer" | "card" | "cash"
 * @param {number} [request.body.price] - Booking price (must be positive)
 * @param {string} [request.body.clientMessage] - Client message (max 1000 chars)
 * @param {string} [request.body.clientSelectedDate] - Booking date (ISO string, must be today or future)
 * @param params - Route parameters
 * @param {Promise<{id: string}>} params.params - Promise containing route params
 * @param {string} params.params.id - Booking ID (UUID)
 * 
 * @returns {Promise<NextResponse>} Response with updated booking or error
 * @returns {number} status - HTTP status code
 *   - 200: Booking updated successfully
 *   - 400: Validation failed or invalid JSON
 *   - 404: Booking not found
 *   - 409: Selected date is not available (already has another booking)
 *   - 500: Server error
 * @returns {Booking} booking - Updated booking object (on success)
 * @returns {Object} error - Error message (on failure)
 * @returns {Array} [error.details] - Validation error details (on validation failure)
 * 
 */
export const PATCH = async (
  request: NextRequest,
  { params }: BookingRouteContext
) => {
  // Require authentication for PATCH operations
  const authError = await requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params

    // Validate UUID format before querying database
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID format" },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate patch data
    const validationResult = bookingPatchSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const patch = validationResult.data

    // Check if booking exists
    const existingBooking = await getBookingById(id)
    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Validate date availability if clientSelectedDate is being updated to a different date
    if (patch.clientSelectedDate) {
      // Normalize dates to YYYY-MM-DD format for comparison
      const newDateStr = patch.clientSelectedDate.split("T")[0];
      const existingDateStr = existingBooking.clientSelectedDate.split("T")[0];

      if (newDateStr !== existingDateStr) {
        const dateAvailable = await isDateAvailable(newDateStr);

        if (!dateAvailable) {
          return NextResponse.json(
            { 
              error: "Selected date is not available",
              details: "This date already has another booking. Please select another date.",
            },
            { status: 409 } // 409 Conflict - resource already exists
          )
        }
      }
    }

    // Update booking
    const updated = await updateBooking(id, patch)

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      )
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    logError("Error updating booking", error, { request: request.url, function: "PATCH" })
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/bookings/:id
 *
 * Delete a booking by ID.
 * 
 * @param request - Next.js request object (not used, but required by Next.js)
 * @param params - Route parameters
 * @param {Promise<{id: string}>} params.params - Promise containing route params
 * @param {string} params.params.id - Booking ID (UUID)
 * 
 * @returns {Promise<NextResponse>} Response with success message or error
 * @returns {number} status - HTTP status code
 *   - 200: Booking deleted successfully
 *   - 404: Booking not found
 *   - 500: Server error
 * @returns {Object} message - Success message (on success)
 * @returns {string} message.message - "Booking deleted successfully"
 * @returns {Object} error - Error message (on failure)
 * 
 */
export const DELETE = async (
  request: NextRequest,
  { params }: BookingRouteContext
) => {
  // Require authentication for DELETE operations
  const authError = await requireAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const { id } = await params

    // Validate UUID format before querying database
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid booking ID format" },
        { status: 400 }
      )
    }

    const deleted = await deleteBooking(id)

    if (!deleted) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    logError("Error deleting booking", error, { request: request.url, function: "DELETE" })

    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    )
  }
}

