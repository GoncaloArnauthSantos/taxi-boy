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
    const bookingLink = this.page
      .getByRole("link", { name: /^Book Now$/i })
      .first();
    
    // Wait for link to be visible and enabled
    await bookingLink.waitFor({ state: "visible", timeout: 10000 });
    
    // Click and wait for navigation
    await Promise.all([
      this.page.waitForURL("/booking", { timeout: 15000 }),
      bookingLink.click(),
    ]);
  }

  /**
   * Verify booking page is loaded
   */
  async verifyBookingPageLoaded() {
    await expect(this.page).toHaveURL("/booking", { timeout: 15000 });
    // Wait for page to be fully loaded
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  }

  /**
   * Click on tours link
   */
  async clickToursLink() {
    const toursLink = this.page
      .getByRole("link", { name: /^Tours$/i })
      .first();
    
    // Wait for link to be visible and enabled
    await toursLink.waitFor({ state: "visible", timeout: 10000 });
    
    // Click and wait for navigation
    await Promise.all([
      this.page.waitForURL("/tours", { timeout: 15000 }),
      toursLink.click(),
    ]);
  }

  async verifyToursPageLoaded() {
    await expect(this.page).toHaveURL("/tours", { timeout: 15000 });
    // Wait for page to be fully loaded
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  }

  /**
   * Click on contact link
   * Optimized to find and click quickly
   */
  async clickContactLink() {
    const contactLink = this.page
      .getByRole("link", { name: /^Contact$/i })
      .first();
    
    // Wait for link to be visible and enabled
    await contactLink.waitFor({ state: "visible", timeout: 10000 });
    
    // Click and wait for navigation
    await Promise.all([
      this.page.waitForURL("/contact", { timeout: 15000 }),
      contactLink.click(),
    ]);
  }

  /**
   * Verify contact page is loaded
   */
  async verifyContactPageLoaded() {
    await expect(this.page).toHaveURL("/contact", { timeout: 15000 });
    // Wait for page to be fully loaded
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
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
