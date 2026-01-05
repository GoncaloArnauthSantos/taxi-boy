import { test } from "@playwright/test";
import { BookingPage } from "./pages/BookingPage";
import { getFutureDate, TEST_DATA, mockBookingApi } from "./helpers/test-helpers";

test.describe("Booking Flow", () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });

  test("should display booking form", async () => {
    await bookingPage.verifyFormVisible();
  });

  test("should show validation errors for empty required fields", async () => {
    // Try to submit without filling any fields
    await bookingPage.submitForm();

    await bookingPage.verifyFormAllEmpty();
  });

  test("should show error for invalid email", async () => {
    await bookingPage.fillBookingForm({
      name: TEST_DATA.booking.name,
      email: "invalid-email",
      phone: TEST_DATA.booking.phone,
      country: TEST_DATA.booking.country,
    });

    await bookingPage.selectFirstAvailablePhoneCountryCode();
    await bookingPage.selectFirstAvailableLanguage();
    await bookingPage.selectFirstAvailableTour();

    await bookingPage.submitForm();

    await bookingPage.verifyValidationError("email");
  });

  test("should show error for invalid phone number", async () => {
    await bookingPage.fillBookingForm({
      name: TEST_DATA.booking.name,
      email: TEST_DATA.booking.email,
      phone: "123", // Too short
      country: TEST_DATA.booking.country,
      date: TEST_DATA.booking.date,
    });
    
    await bookingPage.selectFirstAvailablePhoneCountryCode();
    await bookingPage.selectFirstAvailableLanguage();
    await bookingPage.selectFirstAvailableTour();

    await bookingPage.submitForm();
    await bookingPage.verifyValidationError("phone");
  });

  test("should show error for missing date", async () => {
    await bookingPage.fillBookingForm({
      name: TEST_DATA.booking.name,
      email: TEST_DATA.booking.email,
      phone: TEST_DATA.booking.phone,
      phoneCountryCode: TEST_DATA.booking.phoneCountryCode,
    });

    await bookingPage.submitForm();
    await bookingPage.verifyValidationError("date");
  });

  test("should successfully submit booking with valid data", async () => {
    await mockBookingApi(bookingPage.page, true);

    const futureDate = getFutureDate(7); // 7 days from now

    await bookingPage.fillBookingForm({
      name: TEST_DATA.booking.name,
      email: TEST_DATA.booking.email,
      phone: TEST_DATA.booking.phone,
      phoneCountryCode: TEST_DATA.booking.phoneCountryCode,
      country: "Portugal",
      date: futureDate,
    });

    // Select tour and language if available
    await bookingPage.selectFirstAvailableTour();
    await bookingPage.selectFirstAvailableLanguage();

    await bookingPage.submitForm();

    // Wait for confirmation
    await bookingPage.verifyConfirmationShown();
  });

  test("should handle API error gracefully", async () => {
    await mockBookingApi(bookingPage.page);

    const futureDate = getFutureDate(7);

    await bookingPage.fillBookingForm({
      name: TEST_DATA.booking.name,
      email: TEST_DATA.booking.email,
      phone: TEST_DATA.booking.phone,
      phoneCountryCode: TEST_DATA.booking.phoneCountryCode,
      country: TEST_DATA.booking.country,
      date: futureDate,
    });

    // Select tour and language dynamically (don't hardcode CMS values)
    await bookingPage.selectFirstAvailableTour();
    await bookingPage.selectFirstAvailableLanguage();

    await bookingPage.submitForm();

    // Wait for error message
    await bookingPage.verifyFormErrorShown();
  });
});