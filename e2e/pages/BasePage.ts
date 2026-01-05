import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object
 * 
 * Contains common functionality shared across all pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * Uses 'load' instead of 'networkidle' for faster execution
   */
  async goto(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Wait for load state with shorter timeout
    await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
      // If load takes too long, continue anyway
    });
  }

  /**
   * Wait for page to be fully loaded
   * Uses 'load' for faster execution (networkidle can be very slow)
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
      // If load takes too long, continue anyway
    });
  }

  /**
   * Get element by data-testid
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Verify navigation menu is visible
   */
  async verifyNavigationVisible() {
    const nav = this.page.getByRole("navigation").first();
    await nav.waitFor({ state: "visible", timeout: 5000 });
  }

  /**
   * Click on mobile menu button
   */
  async clickMobileMenu() {
    const mobileMenuButton = this.page
      .locator("button[aria-label='Toggle menu']")
      .first();
    await mobileMenuButton.click();
  }

  /**
   * Verify footer is visible
   */
  async verifyFooterVisible() {
    const footer = this.page.locator("footer").first();
    await expect(footer).toBeVisible();
  }
}

