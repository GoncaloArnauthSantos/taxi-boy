import { test, expect } from "@playwright/test";
import { ToursPage } from "./pages/ToursPage";
import { TourDetailsPage } from "./pages/TourDetailsPage";

test.describe("Tours Page", () => {
  let toursPage: ToursPage;

  test.beforeEach(async ({ page }) => {
    toursPage = new ToursPage(page);
    await toursPage.navigate();
  });

  test("should display tours page", async () => {
    await toursPage.verifyPageLoaded();
  });

  test("should display tours list", async () => {
    await toursPage.verifyPageLoaded();
    
    const tourCount = await toursPage.getTourCount();
    if (tourCount > 0) {
      await toursPage.verifyToursDisplayed();
    } else {
      await toursPage.verifyEmptyState();
    }
  });

  test("should find a tour by search query", async () => {
    await toursPage.verifyPageLoaded();
    
    await toursPage.fillSearch("Lisbon");
    await toursPage.page.waitForTimeout(500);
    
    await toursPage.verifySearchValue("Lisbon");
    
    const tourCount = await toursPage.getTourCount();
    expect(tourCount).toBeGreaterThan(0);
  });

  test("should show empty state when no tours match search", async () => {
    await toursPage.verifyPageLoaded();
    
    await toursPage.fillSearch("nonexistenttourxyz123");
    await toursPage.page.waitForTimeout(500);
    
    await toursPage.verifyEmptyState();
  });

  test("should clear search and show all tours", async () => {
    await toursPage.verifyPageLoaded();
    
    const initialCount = await toursPage.getTourCount();
    
    await toursPage.fillSearch("nonexistenttourxyz123");
    await toursPage.page.waitForTimeout(500);
    
    await toursPage.clearSearch();
    await toursPage.page.waitForTimeout(500);
    
    const finalCount = await toursPage.getTourCount();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });

  test("should filter tours by location", async () => {
    await toursPage.verifyPageLoaded();
    const initialCount = await toursPage.getTourCount();

    await toursPage.selectLocation("Lisbon");
    await toursPage.page.waitForTimeout(500);
    
    const filteredCount = await toursPage.getTourCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("should filter tours by duration", async () => {
    await toursPage.verifyPageLoaded();
    const initialCount = await toursPage.getTourCount();
    
    await toursPage.selectDuration("short");
    await toursPage.page.waitForTimeout(500);
    
    const filteredCount = await toursPage.getTourCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("should remove location filter badge", async () => {
    await toursPage.verifyPageLoaded();
    const initialCount = await toursPage.getTourCount();
    
    if (initialCount > 0) {
      await toursPage.selectLocation("Lisbon");
      await toursPage.page.waitForTimeout(500);
      
      await toursPage.removeLocationBadge("Lisbon");
      await toursPage.page.waitForTimeout(500);
      
      const finalCount = await toursPage.getTourCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    }
  });

  test("should clear all filters", async () => {
    await toursPage.verifyPageLoaded();
    const initialCount = await toursPage.getTourCount();
    
    if (initialCount > 0) {
      await toursPage.selectLocation("Lisbon");
      await toursPage.selectDuration("short");
      await toursPage.page.waitForTimeout(500);
      
      await toursPage.clearFilters();
      await toursPage.page.waitForTimeout(500);
      
      const finalCount = await toursPage.getTourCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    }
  });

  test("should navigate to tour details when clicking tour card", async () => {
    await toursPage.verifyPageLoaded();
    
    const tourCount = await toursPage.getTourCount();
    
    if (tourCount > 0) {
      const firstTour = toursPage.firstTourCard();
      const tourLink = await firstTour.getAttribute("href");
      
      if (tourLink) {
        // Click and wait for navigation - clickFirstTour already handles this
        await toursPage.clickFirstTour();
        
        // Verify URL matches (with or without base URL)
        const currentUrl = toursPage.page.url();
        expect(currentUrl).toContain(tourLink);
      }
    }
  });

  test("should show results counter when tours are displayed", async () => {
    await toursPage.verifyPageLoaded();
    
    const tourCount = await toursPage.getTourCount();
    
    if (tourCount > 0) {
      const counter = toursPage.resultsCounter();
      await expect(counter).toBeVisible();
      await toursPage.verifyResultsCounter(tourCount);
    }
  });
});

test.describe("Tour Details Page", () => {
  let toursPage: ToursPage;
  let tourDetailsPage: TourDetailsPage;

  test.beforeEach(async ({ page }) => {
    toursPage = new ToursPage(page);
    tourDetailsPage = new TourDetailsPage(page);
    
    await toursPage.navigate();
    
    const tourCount = await toursPage.getTourCount();
    if (tourCount > 0) {
      const firstTour = toursPage.firstTourCard();
      const tourLink = await firstTour.getAttribute("href");
      const tourUid = tourLink?.split("/").pop();
      
      if (tourUid) {
        await tourDetailsPage.navigate(tourUid);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test("should display tour details page", async () => {
    await tourDetailsPage.verifyPageLoaded();
  });

  test("should display tour title", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyTourTitle();
  });

  test("should display about section", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyAboutSection();
  });

  test("should display locations", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyLocationsDisplayed();
  });

  test("should display included items if available", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyIncludedItems();
  });

  test("should display booking card", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyBookingCard();
  });

  test("should display booking button that links to booking page", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyBookingButton();
  });

  test("should navigate to booking page when clicking booking button", async () => {
    await tourDetailsPage.verifyPageLoaded();
    
    await tourDetailsPage.clickBookingButton();
    
    await expect(tourDetailsPage.page).toHaveURL(/\/booking/);
  });

  test("should display languages if available", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyLanguagesDisplayed();
  });

  test("should display gallery if available", async () => {
    await tourDetailsPage.verifyPageLoaded();
    await tourDetailsPage.verifyGallery();
  });
});

test.describe("Tour Details - 404 Handling", () => {
  test("should show 404 for non-existent tour", async ({ page }) => {
    const tourDetailsPage = new TourDetailsPage(page);
    
    await tourDetailsPage.navigate("non-existent-tour-uid-12345");
    
    await expect(page).toHaveURL(/\/tours\/non-existent-tour-uid-12345/);
    
    const notFoundContent = page.locator("text=/404|not found|page not found/i");
    const isNotFound = await notFoundContent.isVisible({ timeout: 3000 }).catch(() => false);
    
    expect(isNotFound || page.url().includes("404")).toBeTruthy();
  });
});
