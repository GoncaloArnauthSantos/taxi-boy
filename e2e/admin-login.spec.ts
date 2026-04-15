/* eslint-disable quotes */
import { test } from "@playwright/test";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { TEST_DATA } from "./helpers/test-helpers";

test.describe("Admin Login Flow", () => {
  let loginPage: AdminLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdminLoginPage(page);
    await loginPage.navigate();
  });

  test("should display login form", async () => {
    await loginPage.verifyFormVisible();
  });

  test("should show validation errors for empty fields", async () => {
    // Try to submit without filling any fields
    await loginPage.submitForm();
    await loginPage.page.waitForTimeout(500);

    await loginPage.verifyValidationError("email");
    await loginPage.verifyValidationError("password");
  });

  test("should show required error for email but not for password", async () => {
    await loginPage.fillLoginForm("", TEST_DATA.admin.password);
    await loginPage.submitForm();

    await loginPage.verifyValidationError("email");
    await loginPage.verifyNoValidationError("password");
  });

  test("should show error for invalid email format", async () => {
    await loginPage.fillLoginForm("invalid-email", TEST_DATA.admin.password);
    await loginPage.submitForm();
    await loginPage.page.waitForTimeout(500);

    await loginPage.verifyValidationError("email");
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.login("wrong@example.com", "wrong-password");

    await loginPage.verifySubmitFormError();
    await loginPage.verifyLoginPageIsVisible();
  });

  test("should successfully login with valid credentials", async () => {
    await loginPage.login(TEST_DATA.admin.email, TEST_DATA.admin.password);
    await loginPage.verifyNoSubmitFormError();

    await loginPage.verifyAdminPageIsVisible();
  });

  test("should redirect to admin page if user authenticates and visits login page", async () => {
    await loginPage.login(TEST_DATA.admin.email, TEST_DATA.admin.password);
    await loginPage.verifyNoSubmitFormError();

    await loginPage.verifyAdminPageIsVisible();

    await loginPage.page.goto("/admin/login");
    await loginPage.page.waitForTimeout(500);

    await loginPage.verifyAdminPageIsVisible();
  });

  test("should redirect to login page if user is not authenticated and visits admin page", async () => {
    await loginPage.page.goto("/admin");
    await loginPage.page.waitForTimeout(500);

    await loginPage.verifyLoginPageIsVisible();
  });
});