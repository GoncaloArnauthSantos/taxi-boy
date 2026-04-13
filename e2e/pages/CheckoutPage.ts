import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout Page Object
 *
 * Represents checkout page assertions for booking flow validation.
 */
export class CheckoutPage extends BasePage {
  readonly paymentButton = () => this.page.getByRole("button", { name: /Pay €/i });
  readonly pageHeading = () => this.page.getByRole("heading", { level: 1 });
  readonly bookingDetailsTitle = () =>
    this.page.getByText("Booking Details", { exact: true });
  readonly paymentCardTitle = () => this.page.getByText("Payment", { exact: true });
  readonly totalLabel = () => this.page.getByText("Total", { exact: true });
  readonly tooltip = () =>
    this.page.getByRole("tooltip", { name: "Payment integration coming soon!" });

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify current URL is checkout page for any booking id
   */
  async verifyCheckoutUrl(bookingId?: string) {
    if (bookingId) {
      await expect(this.page).toHaveURL(new RegExp(`/checkout/${bookingId}$`), {
        timeout: 10000,
      });
      return;
    }

    await expect(this.page).toHaveURL(/\/checkout\/[^/]+$/, { timeout: 10000 });
  }

  /**
   * Verify key checkout content is visible for a pending payment booking
   */
  async verifyCheckoutCoreContent() {
    await expect(this.pageHeading()).toHaveText("Complete Your Payment");
    await expect(this.bookingDetailsTitle()).toBeVisible();
    await expect(this.paymentCardTitle()).toBeVisible();
    await expect(this.totalLabel()).toBeVisible();
  }

  /**
   * Verify payment CTA state when feature flag is OFF
   */
  async verifyPaymentDisabledWithInfoTooltip() {
    await expect(this.paymentButton()).toBeDisabled();
    await expect(this.tooltip()).toBeVisible();
  }
}
