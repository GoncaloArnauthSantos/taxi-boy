import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";

test.describe("Navigation", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);  

    await homePage.navigate();
  });

  test("should navigate to home page", async () => {
    await homePage.verifyPageLoaded();
    await expect(homePage.page).toHaveTitle(/taxi|tour|lisbon/i);
  });

  test("should navigate to booking page", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyNavigationVisible();

    await homePage.clickBookingLink();
    await homePage.verifyBookingPageLoaded();
  });

  test("should navigate to tours page", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyNavigationVisible();

    await homePage.clickToursLink();
    await homePage.verifyToursPageLoaded();
  });

  test("should navigate to contact section", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyNavigationVisible();

    await homePage.clickContactLink();
    await homePage.verifyContactPageLoaded();
  });

  test("mobile should have working navigation menu", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyNavigationVisible();

    await homePage.page.setViewportSize({ width: 375, height: 667 });
    await homePage.clickMobileMenu();

    await homePage.verifyNavigationVisible();
  });

  test("should be responsive on mobile viewport", async () => {
    // Set mobile viewport
    await homePage.page.setViewportSize({ width: 375, height: 667 });
    await homePage.navigate();

    // Check if page loads without horizontal scroll
    const bodyWidth = await homePage.page.evaluate(
      () => document.body.scrollWidth
    );
    const viewportWidth = homePage.page.viewportSize()?.width || 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Allow small margin
  });

  test("should have a footer visible", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyFooterVisible();
  });

  test("should have a banner visible", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyBannerVisible();
  });
});
