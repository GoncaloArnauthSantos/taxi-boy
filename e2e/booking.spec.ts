import { test } from "@playwright/test";
import { BookingPage } from "./pages/BookingPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { getFutureDate, TEST_DATA } from "./helpers/test-helpers";

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
    const checkoutPage = new CheckoutPage(bookingPage.page);
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

    // Wait for redirect to checkout page and verify key content
    await checkoutPage.verifyCheckoutUrl();
    await checkoutPage.verifyCheckoutCoreContent();
    await checkoutPage.verifyPaymentDisabledWithInfoTooltip();
  });

});