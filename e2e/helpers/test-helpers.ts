import { Page } from "@playwright/test";

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
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
}

/**
 * Mock booking API endpoint
 *
 * @param page - Playwright page instance
 * @param success - Whether request should succeed (default: false for error scenario)
 */
export async function mockBookingApi(
  page: Page,
  success: boolean = false
): Promise<void> {
  await page.route("**/api/bookings", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: success ? 201 : 500,
        contentType: "application/json",
        body: JSON.stringify(
          success
            ? {
              id: "test-booking-id",
              message: "Booking created successfully",
            }
            : {
              error: "Internal server error",
            }
        ),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock Supabase auth endpoint
 *
 * @param page - Playwright page instance
 * @param success - Whether login should succeed (default: false for error scenario)
 */
export async function mockSupabaseAuth(
  page: Page,
  success: boolean = false
): Promise<void> {
  await page.route("**/auth/v1/token**", async (route) => {
    if (route.request().method() === "POST") {
      if (success) {
        // Successful Supabase auth response
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: "bearer",
            user: {
              id: "test-user-id",
              email: "admin@example.com",
            },
          }),
        });
      } else {
        // Error Supabase auth response
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Invalid email or password",
          }),
        });
      }
    } else {
      await route.continue();
    }
  });
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
    email: process.env.E2E_ADMIN_EMAIL || "admin@example.com",
    password: process.env.E2E_ADMIN_PASSWORD || "test-password",
  },
};
