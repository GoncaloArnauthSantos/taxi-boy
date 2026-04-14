/* eslint-disable quotes */
import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Booking Page Object
 *
 * Represents the booking page and form interactions
 * Uses semantic selectors (role, label, text) first, data-testid only when necessary
 */
export class BookingPage extends BasePage {

  // Inputs - use labels (semantic)
  readonly nameInput = () => this.page.locator('input[id="name"]');
  readonly emailInput = () => this.page.locator('input[id="email"]');
  readonly phoneInput = () => this.page.locator('input[id="phone"]');
  readonly countryInput = () => this.page.locator('input[id="country"]');
  readonly messageTextarea = () =>
    this.page.locator('textarea[id="message"]');

  // Selects - use labels (semantic)
  readonly phoneCountryCodeSelect = () =>
    this.page.locator('button[id="phoneCountryCode"]');
  readonly languageSelect = () =>
    this.page.locator('button[id="language"]');
  readonly tourSelect = () => this.page.locator('button[id="tourId"]');

  // Date input - use label
  readonly dateInput = () => this.page.locator('button[id="date"]');

  // Submit button - use role and text (semantic)
  readonly submitButton = () => this.page.locator('button[type="submit"]').first();

  // Error messages - use data-testid (they're dynamic and need stable selectors)
  readonly nameError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /name/i }).first();
  readonly emailError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /email/i }).first();
  readonly phoneError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /phone/i }).first();
  readonly dateError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /date/i }).first();
  readonly languageError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /language/i }).first();
  readonly tourError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /tour/i }).first();
  readonly countryError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /country/i }).first();

  // Form error - use role="alert" (semantic)
  readonly formError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /error|failed/i }).first();

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to booking page
   */
  async navigate() {
    await this.goto("/booking");
  }

  /**
   * Fill name field
   */
  async fillName(name: string) {
    await this.nameInput().fill(name);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.emailInput().fill(email);
  }

  /**
   * Fill phone field
   */
  async fillPhone(phone: string) {
    await this.phoneInput().fill(phone);
  }

  /**
   * Select phone country code
   */
  async selectPhoneCountryCode(code: string) {
    await this.phoneCountryCodeSelect().click();
    await this.page.locator(`[role="option"]`, { hasText: code }).click();
  }

  /**
   * Fill country field
   */
  async fillCountry(country: string) {
    await this.countryInput().fill(country);
  }

  /**
   * Select language
   */
  async selectLanguage(language: string) {
    await this.languageSelect().click();
    await this.page.locator(`[role="option"]`, { hasText: language }).click();
  }

  /**
   * Select tour
   */
  async selectTour(tourId: string) {
    await this.tourSelect().click();
    await this.page.locator(`[role="option"]`, { hasText: tourId }).click();
  }

  /**
   * Helper to select first available option from a dropdown
   */
  private async selectFirstAvailableOption(selectButton: Locator) {
    await selectButton.click();
    const options = this.page.locator(`[role="option"]`);
    const count = await options.count();

    if (count > 1) {
      await options.nth(1).click();
    }
  }

  /**
   * Select first available tour
   */
  async selectFirstAvailableTour() {
    await this.selectFirstAvailableOption(this.tourSelect());
  }

  /**
   * Select first available phone country code
   */
  async selectFirstAvailablePhoneCountryCode() {
    await this.selectFirstAvailableOption(this.phoneCountryCodeSelect());
  }

  /**
   * Select first available language
   */
  async selectFirstAvailableLanguage() {
    await this.selectFirstAvailableOption(this.languageSelect());
  }

  /**
   * Fill date field
   */
  async fillDate(date: string) {
    await this.dateInput().click();
    const calendar = this.page.locator('[data-slot="calendar"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    for (let i = 0; i < 24; i++) {
      const dayButton = calendar.locator(`[data-day="${date}"]`).first();

      if ((await dayButton.count()) > 0) {
        await dayButton.click();
        return;
      }

      const nextMonthButton = calendar
        .getByRole("button", { name: /next month/i })
        .first();
      await nextMonthButton.click();
    }

    throw new Error(`Could not find date "${date}" in calendar`);
  }

  /**
   * Fill message
   */
  async fillMessage(message: string) {
    await this.messageTextarea().fill(message);
  }

  /**
   * Submit the form
   */
  async submitForm() {
    await this.submitButton().click();
  }

  /**
   * Fill complete booking form
   */
  async fillBookingForm(data: {
    name?: string;
    email?: string;
    phone?: string;
    phoneCountryCode?: string;
    country?: string;
    language?: string;
    tourId?: string;
    date?: string;
    message?: string;
  }) {
    if (data.name) await this.fillName(data.name);
    if (data.email) await this.fillEmail(data.email);
    if (data.phoneCountryCode)
      await this.selectPhoneCountryCode(data.phoneCountryCode);
    if (data.phone) await this.fillPhone(data.phone);
    if (data.country) await this.fillCountry(data.country);
    if (data.language) await this.selectLanguage(data.language);
    if (data.tourId) await this.selectTour(data.tourId);
    if (data.date) await this.fillDate(data.date);
    if (data.message) await this.fillMessage(data.message);
  }


  /**
   * Verify form is visible
   */
  async verifyFormVisible() {
    await expect(this.page.getByTestId("booking-page-content")).toBeVisible();

    await expect(this.page.locator("form")).toBeVisible();
    await expect(this.nameInput()).toBeVisible();
    await expect(this.emailInput()).toBeVisible();
    await expect(this.phoneInput()).toBeVisible();
    await expect(this.phoneCountryCodeSelect()).toBeVisible();
    await expect(this.countryInput()).toBeVisible();
    await expect(this.languageSelect()).toBeVisible();
    await expect(this.tourSelect()).toBeVisible();
    await expect(this.dateInput()).toBeVisible();
    await expect(this.messageTextarea()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  /**
   * Verify form is all empty
   */
  async verifyFormAllEmpty() {
    await this.verifyValidationError("name");
    await this.verifyValidationError("email");
    await this.verifyValidationError("phone");
    await this.verifyValidationError("country");
    await this.verifyValidationError("language");
    await this.verifyValidationError("tourId");
    await this.verifyValidationError("date");
  }

  /**
   * Verify validation error is shown
   */
  async verifyValidationError(field: "name" | "email" | "phone" | "date" | "language" | "tourId" | "country") {
    const errorMap: Record<string, Locator> = {
      name: this.nameError(),
      email: this.emailError(),
      phone: this.phoneError(),
      country: this.countryError(),
      language: this.languageError(),
      tourId: this.tourError(),
      date: this.dateError(),
    };

    await expect(errorMap[field]).toBeVisible({ timeout: 2000 });
  }

  /**
   * Verify user is redirected to checkout page
   */
  async verifyRedirectedToCheckout(bookingId?: string) {
    if (bookingId) {
      await expect(this.page).toHaveURL(new RegExp(`/checkout/${bookingId}$`), {
        timeout: 10000,
      });
      return;
    }

    await expect(this.page).toHaveURL(/\/checkout\/[^/]+$/, { timeout: 10000 });
  }

  /**
   * Verify form error is shown
   */
  async verifyFormErrorShown() {
    await expect(this.formError()).toBeVisible({ timeout: 5000 });
  }
}
