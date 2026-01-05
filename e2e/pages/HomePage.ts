import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Home Page Object
 *
 * Represents the home page and its interactions
 * Uses semantic selectors (role, text) first, data-testid only when necessary
 */
export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.goto("/");
  }

  /**
   * Click on booking link
   * Optimized to find and click quickly
   */
  async clickBookingLink() {
    await this.page
      .getByRole("link", { name: /Book Now$/i })
      .first()
      .click();
  }

  /**
   * Verify booking page is loaded
   */
  async verifyBookingPageLoaded() {
    await expect(this.page).toHaveURL("/booking", { timeout: 5000 });
  }

  /**
   * Click on tours link
   */
  async clickToursLink() {
    await this.page
      .getByRole("link", { name: /Tours$/i })
      .first()
      .click();
  }

  async verifyToursPageLoaded() {
    await expect(this.page).toHaveURL("/tours", { timeout: 5000 });
  }

  /**
   * Click on contact link
   * Optimized to find and click quickly
   */
  async clickContactLink() {
    await this.page
      .getByRole("link", { name: /Contact$/i })
      .first()
      .click();
  }

  /**
   * Verify contact page is loaded
   */
  async verifyContactPageLoaded() {
    await expect(this.page).toHaveURL("/contact", { timeout: 5000 });
  }

  /**
   * Verify home page is loaded
   * Optimized to check quickly without waiting for networkidle
   */
  async verifyPageLoaded() {
    // Wait for DOM to be ready (faster than networkidle)
    await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });

    // Quick check: verify header is visible (fastest check)
    const header = this.page.locator("header");
    await header.waitFor({ state: "visible", timeout: 5000 });

    // Optional: check if at least one section exists (non-blocking)
    const hasSection = await this.page
      .locator("section")
      .first()
      .isVisible()
      .catch(() => false);
    if (!hasSection) {
      // If no sections, at least verify we have some content
      const hasContent = await this.page
        .locator("body")
        .textContent()
        .then((text) => text && text.length > 100)
        .catch(() => false);
      if (!hasContent) {
        throw new Error("Home page did not load correctly");
      }
    }
  }


  /**
   * Verify banner is visible
   */
  async verifyBannerVisible() {
    const banner = this.page.getByTestId("home-banner");
    expect(banner).toBeVisible();
  }
}
