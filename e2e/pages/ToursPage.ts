/* eslint-disable quotes */
import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Tours Page Object
 *
 * Represents the tours listing page with filters and tour grid
 */
export class ToursPage extends BasePage {
  // Search input
  readonly searchInput = () =>
    this.page.locator('input[placeholder*="Search tours"]');

  // Filter buttons (desktop)
  readonly locationsFilterButton = () =>
    this.page.locator('button[name="locations-filter"]');
  readonly durationFilterButton = () =>
    this.page.locator('button[name="duration-filter"]');

  // Clear filters button
  readonly clearFiltersButton = () =>
    this.page.locator('button[name="clear-filters"]').or(
      this.page.locator('button:has-text("Clear Filters")')
    );

  // Results counter
  readonly resultsCounter = () =>
    this.page.locator('text=/Showing \\d+ (tour|tours)/i');

  // Tour cards
  readonly tourCards = () => this.page.locator('a[href^="/tours/"]');
  readonly firstTourCard = () => this.tourCards().first();

  // Empty state
  readonly emptyState = () =>
    this.page.locator('text=/No tours found/i');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to tours page
   */
  async navigate() {
    await this.goto("/tours");
    await this.waitForPageLoad();
  }

  /**
   * Fill search input
   */
  async fillSearch(query: string) {
    await this.searchInput().fill(query);
    await this.page.waitForTimeout(300);
  }

  /**
   * Clear search input
   */
  async clearSearch() {
    await this.searchInput().clear();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select location from filter dropdown
   */
  async selectLocation(location: string) {
    await this.locationsFilterButton().click();
    await this.page.waitForTimeout(500);
    
    const locationOption = this.page
      .locator('[role="menuitemcheckbox"]')
      .filter({ hasText: location })
      .first();
    
    await locationOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Remove location filter by clicking badge
   */
  async removeLocationBadge(location: string) {
    this.page.locator('div[role="badge"]').filter({ hasText: location }).click();
    
    await this.page.waitForTimeout(300);
  }

  /**
   * Select duration filter
   */
  async selectDuration(duration: "all" | "short" | "medium" | "long") {
    await this.durationFilterButton().click();
    await this.page.waitForTimeout(200);
    
    const durationLabels: Record<string, string> = {
      all: "All Durations",
      short: "Short (≤4 hours)",
      medium: "Medium (5-7 hours)",
      long: "Long (8+ hours)",
    };
    
    const option = this.page
      .locator('[role="menuitemcheckbox"]')
      .filter({ hasText: durationLabels[duration] });
    
    await option.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    const clearButton = this.clearFiltersButton();
    if (await clearButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await clearButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Click on first tour card
   */
  async clickFirstTour() {
    const firstTour = this.firstTourCard();
    
    // Wait for the link to be visible and ready
    await expect(firstTour).toBeVisible({ timeout: 5000 });
    
    // Get the href before clicking
    const href = await firstTour.getAttribute("href");
    
    if (!href) {
      throw new Error("Tour card link href not found");
    }
    
    // Click and wait for navigation using the href
    await Promise.all([
      this.page.waitForURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), { timeout: 10000 }),
      firstTour.click(),
    ]);
    
    // Wait for page to be fully loaded
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  }

  /**
   * Get number of visible tour cards
   */
  async getTourCount(): Promise<number> {
    return await this.tourCards().count();
  }

  /**
   * Verify page loaded
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/tours/);
  }

  /**
   * Verify tours are displayed
   */
  async verifyToursDisplayed() {
    const count = await this.getTourCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify empty state is shown
   */
  async verifyEmptyState() {
    await expect(this.emptyState()).toBeVisible();
  }

  /**
   * Verify results counter shows correct count
   */
  async verifyResultsCounter(expectedCount: number) {
    const counter = this.resultsCounter();
    await expect(counter).toBeVisible();
    const text = await counter.textContent();
    expect(text).toContain(expectedCount.toString());
  }

  /**
   * Verify search input has value
   */
  async verifySearchValue(expectedValue: string) {
    await expect(this.searchInput()).toHaveValue(expectedValue);
  }
}
