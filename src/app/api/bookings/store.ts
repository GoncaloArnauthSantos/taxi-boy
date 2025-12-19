/**
 * Booking Store
 *
 * Database operations for bookings using Supabase.
 */

import type {
  Booking,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";
import { createClient } from "@/db/client";
import { logError } from "@/cms/shared/logger";
import {
  mapBookingToInsert,
  mapBookingPatchToUpdate,
  mapRowToBooking,
} from "@/db/bookings/mapper";


/**
 * Create a new booking
 */
export const createBooking = async (
  input: Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt">
): Promise<Booking> => {
  try {
    const supabase = createClient();
    const insertData = mapBookingToInsert(input);

    const { data, error } = await supabase
      .from("bookings")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      logError("Failed to create booking", error, { input });
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from database");
    }

    return mapRowToBooking(data);
  } catch (error) {
    logError("Error creating booking", error, { input });
    throw error;
  }
};

/**
 * Get a booking by ID (only active bookings, excludes soft deleted)
 */
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .limit(1);

    if (error) {
      logError("Failed to fetch booking by ID", error, { bookingId: id });
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const [booking] = data;
    return mapRowToBooking(booking);
  } catch (error) {
    logError("Error fetching booking by ID", error, { bookingId: id });
    throw error;
  }
};

/**
 * Filters for fetching bookings.
 */
export interface GetAllBookingsFilters {
  status?: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  future?: boolean;
  past?: boolean;
  dateRange?: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD (exclusive)
  };
}

/**
 * Get all bookings (optionally filtered)
 */
export const getAllBookings = async (filters: GetAllBookingsFilters = {}): Promise<Booking[]> => {
  try {
    const supabase = createClient();
    // Only fetch active bookings (exclude soft deleted)
    let query = supabase
      .from("bookings")
      .select("*")
      .is("deleted_at", null);

    // Apply status filter
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    // Apply payment status filter
    if (filters?.paymentStatus) {
      query = query.eq("payment_status", filters.paymentStatus);
    }

    // Apply date filters (future/past)
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    if (filters?.future !== undefined) {
      if (filters.future) {
        query = query.gte("client_selected_date", now);
      } else {
        query = query.lt("client_selected_date", now);
      }
    }

    if (filters?.past !== undefined) {
      if (filters.past) {
        query = query.lt("client_selected_date", now);
      } else {
        query = query.gte("client_selected_date", now);
      }
    }

    // Apply date range filter (more precise than future/past)
    if (filters?.dateRange) {
      query = query
        .gte("client_selected_date", filters.dateRange.start)
        .lt("client_selected_date", filters.dateRange.end);
    }

    // Order by creation date (most recent first) for consistent results
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      logError("Failed to fetch bookings", error, { filters });
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(mapRowToBooking);
  } catch (error) {
    logError("Error fetching bookings", error, { filters });
    throw error;
  }
};

/**
 * Check if a specific date is available for booking.
 * Returns false if there's already a booking on that date.
 * 
 * @param date - Date to check (ISO string format YYYY-MM-DD)
 * @returns true if date is available, false if already booked
 */
export const isDateAvailable = async (date: string): Promise<boolean> => {
  try {
    const supabase = createClient();
    const dateStr = date.split("T")[0]; // Ensure YYYY-MM-DD format

    // Check if there are any active bookings on this date
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("client_selected_date", dateStr)
      .is("deleted_at", null) // Exclude soft deleted
      .in("status", ["pending", "confirmed"]) // Only active bookings
      .limit(1);

    if (error) {
      logError("Failed to check date availability", error, { date });
      throw error;
    }

    // Date is available if no bookings found
    return !data || data.length === 0;
  } catch (error) {
    logError("Error checking date availability", error, { date });
    throw error;
  }
};

/**
 * Get unavailable dates (dates with existing bookings).
 * Returns only the dates, not the full booking objects.
 * More efficient than fetching all bookings when you only need the dates.
 */
export const getUnavailableDates = async (): Promise<Date[]> => {
  try {
    const supabase = createClient();
    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Fetch only client_selected_date for future bookings (exclude soft deleted)
    const { data, error } = await supabase
      .from("bookings")
      .select("client_selected_date")
      .gte("client_selected_date", now) // Only future dates
      .is("deleted_at", null) // Exclude soft deleted
      .in("status", ["pending", "confirmed"]); // Only active bookings (exclude cancelled)

    if (error) {
      logError("Failed to fetch unavailable dates", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Extract unique dates and convert to Date objects
    const uniqueDates = new Set<string>();
    data.forEach((row) => {
      if (row.client_selected_date) {
        uniqueDates.add(row.client_selected_date);
      }
    });

    return Array.from(uniqueDates)
      .map((dateStr) => new Date(dateStr))
      .filter((date) => !isNaN(date.getTime())); // Filter out invalid dates
  } catch (error) {
    logError("Error fetching unavailable dates", error);
    throw error;
  }
};

/**
 * Update a booking by ID
 * Only updates active bookings (excludes soft deleted bookings)
 */
export const updateBooking = async (
  id: string,
  patch: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt">>
): Promise<Booking | null> => {
  try {
    const supabase = createClient();
    const updateData = mapBookingPatchToUpdate(patch);

    // Only update active bookings (exclude soft deleted)
    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .is("deleted_at", null)
      .select()
      .limit(1);

    if (error) {
      logError("Failed to update booking", error, { bookingId: id, patch });
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const [booking] = data;
    return mapRowToBooking(booking);
  } catch (error) {
    logError("Error updating booking", error, { bookingId: id, patch });
    throw error;
  }
};

/**
 * Soft delete a booking by ID
 * Sets deleted_at timestamp instead of physically deleting the record
 */
export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient();

    // Soft delete: update deleted_at instead of deleting the record
    // Only update if deleted_at is NULL (not already deleted)
    const { data, error } = await supabase
      .from("bookings")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .is("deleted_at", null)
      .select();

    if (error) {
      logError("Failed to soft delete booking", error, { bookingId: id });
      throw error;
    }

    // If there is no data or empty, booking was not found or already deleted
    if (!data || data.length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    logError("Error soft deleting booking", error, { bookingId: id });
    throw error;
  }
};
