/* eslint-disable quotes */
import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Admin Login Page Object
 *
 * Represents the admin login page and form interactions
 * Uses semantic selectors (role, label, text) first, data-testid only when necessary
 */
export class AdminLoginPage extends BasePage {
  readonly emailInput = () => this.page.locator('input[id="email"]');
  readonly passwordInput = () => this.page.locator('input[id="password"]');

  // Submit button - use role and text (semantic)
  readonly submitButton = () =>
    this.page.locator('button[type="submit"]');

  // Error messages - use role="alert" (semantic)
  readonly emailError = () =>
    this.page.locator('p[role="alert"]').filter({ hasText: /email/i }).first();
  readonly passwordError = () =>
    this.page
      .locator('p[role="alert"]')
      .filter({ hasText: /password/i })
      .first();

  // Page title - use heading (semantic)
  readonly loginTitle = () =>
    this.page.getByRole("heading", { name: /admin login/i });

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to admin login page
   */
  async navigate() {
    await this.goto("/admin/login");
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.emailInput().fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  /**
   * Fill complete login form
   */
  async fillLoginForm(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  /**
   * Submit the form
   */
  async submitForm() {
    await this.submitButton().click();
  }

  /**
   * Perform login
   */
  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.submitForm();
  }

  /**
   * Verify form is visible
   */
  async verifyFormVisible() {
    await expect(this.page.locator("form")).toBeVisible();

    await expect(this.emailInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  /**
   * Verify validation error is shown
   */
  async verifyValidationError(field: "email" | "password") {
    const errorMap = {
      email: this.emailError(),
      password: this.passwordError(),
    };

    await expect(errorMap[field]).toBeVisible({ timeout: 2000 });
  }
  /**
   * Verify validation error is not shown
   */
  async verifyNoValidationError(field: "email" | "password") {
    const errorMap = {
      email: this.emailError(),
      password: this.passwordError(),
    };
    await expect(errorMap[field]).not.toBeVisible({ timeout: 2000 });
  }

  /**
   * Verify admin page is visible
   */
  async verifyAdminPageIsVisible() {
    await expect(this.page).toHaveURL(/\/admin$/);
  }
  /**
   * Verify submit form error
   */
  async verifySubmitFormError() {
    await expect(this.page.locator('p[role="alert"]').filter({ hasText: /invalid email or password/i })).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify no submit form error
   */
  async verifyNoSubmitFormError() {
    await expect(this.page.locator('p[role="alert"]')).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify login page is visible
   */
  async verifyLoginPageIsVisible() {
    await expect(this.page).toHaveURL(/\/admin\/login/);
  }

}
