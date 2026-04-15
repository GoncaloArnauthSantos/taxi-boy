# E2E Tests with Playwright

This directory contains end-to-end tests for the TaxiBoy application using [Playwright](https://playwright.dev/).

## 🏗️ **Architecture**

This test suite follows **Page Object Model (POM)** pattern for better maintainability and reusability.

### **Structure:**
```
e2e/
├── pages/              # Page Objects (POM)
│   ├── BasePage.ts     # Base class with common functionality
│   ├── HomePage.ts     # Home page interactions
│   ├── BookingPage.ts  # Booking form interactions
│   ├── AdminLoginPage.ts # Admin login interactions
│   └── index.ts        # Exports
├── helpers/            # Test helpers and utilities
│   └── test-helpers.ts # Shared test data and functions
├── booking.spec.ts    # Booking flow tests
├── admin-login.spec.ts # Admin login tests
└── navigation.spec.ts  # Navigation tests
```

### **Page Object Model Benefits:**
- ✅ **Maintainable**: UI changes only affect Page Objects
- ✅ **Reusable**: Page Objects can be used across multiple tests
- ✅ **Readable**: Tests describe what they do, not how
- ✅ **Robust**: Stable selectors with `data-testid` attributes

## 📋 **Test Coverage**

### **Booking Flow** (`booking.spec.ts`)
- ✅ Form display and validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Date validation (past dates)
- ✅ Successful booking submission

### **Admin Login Flow** (`admin-login.spec.ts`)
- ✅ Login form display
- ✅ Field validation
- ✅ Invalid credentials handling
- ✅ Successful login and redirect
- ✅ Already authenticated redirect

### **Navigation** (`navigation.spec.ts`)
- ✅ Home page navigation
- ✅ Booking page navigation
- ✅ Tours page navigation
- ✅ Contact section navigation
- ✅ Navigation menu functionality
- ✅ Mobile responsiveness

## 🚀 **Running Tests**

### **Run all E2E tests**
```bash
npm run test:e2e
```

### **Run tests in UI mode** (recommended for development)
```bash
npm run test:e2e:ui
```

### **Run tests in headed mode** (see browser)
```bash
npm run test:e2e:headed
```

### **Debug tests**
```bash
npm run test:e2e:debug
```

### **Run specific test file**
```bash
npx playwright test e2e/booking.spec.ts
npx playwright test e2e/admin-login.spec.ts
npx playwright test e2e/navigation.spec.ts
```

### **Run tests matching a pattern** (grep)
```bash
# Run tests with "booking" in the name
npx playwright test --grep "booking"

# Run tests with "validation" in the name
npx playwright test --grep "validation"

# Run tests with "should display" in the name
npx playwright test --grep "should display"
```

### **Run only one test** (temporary - add to test)
```typescript
// In your test file, change test() to test.only()
test.only('should display booking form', async ({ page }) => {
  // This will be the ONLY test that runs
});
```

### **Skip specific tests** (temporary)
```typescript
// In your test file, change test() to test.skip()
test.skip('should handle API error', async ({ page }) => {
  // This test will be skipped
});
```

### **Run tests in specific browser**
```bash
npx playwright test --project=chromium
```

## ⚙️ **Configuration**

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (or `PLAYWRIGHT_TEST_BASE_URL` env var)
- **Browser**: Chromium (default)
- **Auto-start server**: Automatically starts `npm run dev` before tests
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry
- **Videos**: Recorded for all tests (saved in `test-results/`)
- **Global setup cleanup**: Cleans previous E2E bookings before test run

## 🔧 **Test Helpers**

Shared utilities are in `e2e/helpers/test-helpers.ts`:

- `getFutureDate()` - Get future date for booking (YYYY-MM-DD format)
- `TEST_DATA` - Test data constants (form inputs only, not CMS content)

### Important behavior
- Booking date picker now selects calendar dates via `data-day="YYYY-MM-DD"` and may navigate months internally in the page object.
- E2E tests use real API/database flows against the table configured by `BOOKINGS_TABLE_NAME`.
- E2E booking records use email `*@taxiboy-e2e.test` and are soft-deleted in global setup before each run.

## 📝 **Writing New Tests**

### **Using Page Objects (Recommended)**

```typescript
import { test } from '@playwright/test';
import { BookingPage } from './pages/BookingPage';

test.describe('Booking Flow', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigate();
  });

  test('should submit booking successfully', async () => {
    await bookingPage.fillBookingForm({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '912345678',
      phoneCountryCode: '+351',
      country: 'Portugal',
      date: getFutureDate(7),
    });
    
    await bookingPage.selectFirstAvailableTour();
    await bookingPage.selectFirstAvailableLanguage();
    await bookingPage.submitForm();
    
    await bookingPage.verifyRedirectedToCheckout();
  });
});
```

### **Basic Test Structure (Without Page Objects)**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Use data-testid for stable selectors
    await expect(page.locator('[data-testid="element-id"]')).toBeVisible();
  });
});
```

## 🌍 **Environment Variables**

For tests that require authentication, you can set:

```env
E2E_ADMIN_EMAIL=admin@example.com
E2E_ADMIN_PASSWORD=your-password
E2E_BOOKINGS_TABLE_NAME=bookings_test
```

### Safety guardrails
- E2E defaults to `bookings_test` if `E2E_BOOKINGS_TABLE_NAME` is not set.
- Playwright always injects `BOOKINGS_TABLE_NAME` from the resolved E2E table.
- Global setup refuses to run cleanup if the table name does not look like a test table.

### E2E DB lifecycle
1. Resolve E2E table name (`E2E_BOOKINGS_TABLE_NAME` or default `bookings_test`).
2. Run `global-setup.ts` to authenticate and clear all rows from that table.
3. Start a fresh Next.js server with `BOOKINGS_TABLE_NAME` forced to the E2E table.
4. Runtime guardrails in booking store reject non-test tables when `E2E_TEST_RUN=true`.

These are optional and have defaults in `test-helpers.ts`.

## 📊 **Test Reports & Videos**

After running tests, you can:

### **View HTML Report**
```bash
npx playwright show-report
```

### **View Test Videos**
Videos are automatically recorded for all tests and saved in `test-results/`. 

Each test has its own video file showing the complete execution path. You can:
- Open the HTML report and click on any test to see its video
- Navigate to `test-results/` folder and find videos organized by test
- Videos are named after the test file and test name

**Note:** Videos are only saved for tests that run. Use `test.only()` or filters to record specific tests.

## 🐛 **Debugging**

1. **Use UI mode** for step-by-step debugging:
   ```bash
   npm run test:e2e:ui
   ```

2. **Use debug mode** to pause execution:
   ```bash
   npm run test:e2e:debug
   ```

3. **Add breakpoints** in your test code:
   ```typescript
   await page.pause(); // Pauses execution
   ```

4. **View traces** for failed tests:
   ```bash
   npx playwright show-trace trace.zip
   ```

## ✅ **Best Practices**

1. **Use data-testid attributes** for stable selectors (when possible)
2. **Wait for network idle** before assertions
3. **Mock external APIs** to avoid flakiness
4. **Use helpers** for common operations
5. **Keep tests independent** - each test should be able to run alone
6. **Clean up** - reset state between tests if needed

## 🔄 **CI/CD Integration**

The tests are configured to:
- Retry failed tests 2 times on CI
- Run in parallel (1 worker on CI)
- Generate HTML reports
- Take screenshots on failure

Add to your CI pipeline:
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```

