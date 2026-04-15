/**
 * Test Helpers for E2E Tests
 *
 * Shared utility functions and test data for E2E testing.
 */

/**
 * Get a future date (tomorrow by default)
 * @param daysFromNow - Number of days from today (default: 1)
 * @returns Date string in YYYY-MM-DD format
 */
export function getFutureDate(daysFromNow: number = 1): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD format (local date)
}

/**
 * Test data constants
 *
 * IMPORTANT: These values are for form inputs only, NOT for CMS content.
 *
 * For CMS content (tours, languages), use Page Object methods:
 * - `selectFirstAvailableTour()` - Selects whatever tour is available
 * - `selectFirstAvailableLanguage()` - Selects whatever language is available
 *
 * This ensures tests are resilient to CMS content changes.
 */
export const TEST_DATA = {
  booking: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "912345678",
    phoneCountryCode: "+1",
    country: "Portugal",
    date: getFutureDate(7), // 7 days from now
    message: "Test booking message",
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || "admin_test@taxiboy.com",
    password: process.env.E2E_ADMIN_PASSWORD || "Pass1234567890",
  },
};
