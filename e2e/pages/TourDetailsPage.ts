/* eslint-disable quotes */
import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Tour Details Page Object
 *
 * Represents the tour detail page with tour information and booking card
 * Uses semantic selectors (role, heading, text) first
 */
export class TourDetailsPage extends BasePage {
  // Hero section
  readonly heroSection = () => this.page.locator("section").first();

  // Tour title (in hero or main content)
  readonly tourTitle = () =>
    this.page.getByRole("heading", { level: 1 }).or(
      this.page.locator('h1, h2').filter({ hasText: /./ }).first()
    );

  // About section
  readonly aboutSection = () =>
    this.page.locator('text=/About This Tour/i').locator("..");

  // Locations section
  readonly locationsSection = () =>
    this.page.locator('text=/Locations Visited/i').locator("..");
  readonly locationBadges = () =>
    this.locationsSection().locator('div[role="badge"]');

  // Included items section
  readonly includedSection = () =>
    this.page.locator('text=/What.*s Included/i').locator("..");
  readonly includedItems = () =>
    this.includedSection().locator('text=/./');

  // Gallery
  readonly gallery = () => this.page.locator('section, div').filter({ hasText: /gallery/i }).or(
    this.page.locator('img').nth(1) // Second image (first is hero)
  );

  // Booking card
  readonly bookingCard = () =>
    this.page.locator('div[role="booking-card"]');
  readonly bookingCardPrice = () =>
    this.bookingCard().locator('text=/€\\d+/');
  readonly bookingCardDuration = () =>
    this.bookingCard().locator('text=/\\d+ hours/');
  readonly bookingCardButton = () =>
    this.bookingCard().locator('a[href*="/booking"], button').filter({ hasText: /book|Book/i });

  // Languages section
  readonly languagesSection = () =>
    this.bookingCard().locator('div[role="languages-section"]');
  readonly languageBadges = () =>
    this.languagesSection().locator('span[role="language-badge"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to tour details page by UID
   */
  async navigate(uid: string) {
    await this.goto(`/tours/${uid}`);
    await this.waitForPageLoad();
  }

  /**
   * Verify page loaded
   */
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/\/tours\/.+/);
    await expect(this.tourTitle()).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify tour title is displayed
   */
  async verifyTourTitle() {
    await expect(this.tourTitle()).toBeVisible();
    const title = await this.tourTitle().textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  }

  /**
   * Verify about section is displayed
   */
  async verifyAboutSection() {
    await expect(this.aboutSection()).toBeVisible();
  }

  /**
   * Verify locations are displayed
   */
  async verifyLocationsDisplayed() {
    await expect(this.locationsSection()).toBeVisible();
    const count = await this.locationBadges().count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify included items are displayed (if section exists)
   */
  async verifyIncludedItems() {
    const section = this.includedSection();
    const isVisible = await section.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVisible) {
      const count = await this.includedItems().count();
      expect(count).toBeGreaterThan(0);
    }
  }

  /**
   * Verify booking card is displayed
   */
  async verifyBookingCard() {
    await expect(this.bookingCard()).toBeVisible();
    await expect(this.bookingCardPrice()).toBeVisible();
    await expect(this.bookingCardDuration()).toBeVisible();
  }

  /**
   * Verify booking button exists and links to booking page
   */
  async verifyBookingButton() {
    const button = this.bookingCardButton();
    await expect(button).toBeVisible();
    const href = await button.getAttribute("href");
    expect(href).toContain("/booking");
  }

  /**
   * Click booking button
   */
  async clickBookingButton() {
    await this.bookingCardButton().click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Verify languages are displayed
   */
  async verifyLanguagesDisplayed() {
    await expect(this.languagesSection()).toBeVisible();
    const count = await this.languageBadges().count();
    
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verify gallery is displayed (if exists)
   */
  async verifyGallery() {
    const gallery = this.gallery();
    const isVisible = await gallery.isVisible({ timeout: 2000 }).catch(() => false);
    // Gallery is optional, so we don't fail if it doesn't exist
    if (isVisible) {
      await expect(gallery).toBeVisible();
    }
  }
}

