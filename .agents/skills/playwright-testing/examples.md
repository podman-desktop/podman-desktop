# Playwright Test Examples

## Example 1: Basic Page Object + Test

### Page Object

```typescript
import type { Locator, Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Sign In' });
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByRole('alert');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from './model/login-page';

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    const loginPage = new LoginPage(page);
    await expect(loginPage.heading).toBeVisible();

    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    const loginPage = new LoginPage(page);

    await loginPage.login('wrong@example.com', 'badpassword');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});
```

## Example 2: Serial Suite with Shared State

```typescript
import { test, expect } from '@playwright/test';

let itemCreated = false;

test.describe.serial('CRUD Operations', () => {
  test('create item', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/items/new');

    await page.getByLabel('Name').fill('Test Item');
    await page.getByLabel('Description').fill('A test item');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('Item created successfully')).toBeVisible();
    itemCreated = true;
  });

  test('read item', async ({ page }) => {
    test.skip(!itemCreated, 'Create failed, skipping read');
    await page.goto('/items');

    const row = page.getByRole('row').filter({ hasText: 'Test Item' });
    await expect(row).toBeVisible();
    await expect(row.getByRole('cell').nth(1)).toHaveText('A test item');
  });

  test('update item', async ({ page }) => {
    test.skip(!itemCreated, 'Create failed, skipping update');
    await page.goto('/items');

    const row = page.getByRole('row').filter({ hasText: 'Test Item' });
    await row.getByRole('button', { name: 'Edit' }).click();

    await page.getByLabel('Name').fill('Updated Item');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Item updated')).toBeVisible();
  });

  test('delete item', async ({ page }) => {
    test.skip(!itemCreated, 'Create failed, skipping delete');
    await page.goto('/items');

    const row = page.getByRole('row').filter({ hasText: 'Updated Item' });
    await row.getByRole('button', { name: 'Delete' }).click();

    page.on('dialog', d => d.accept());
    await expect(row).not.toBeVisible();
  });
});
```

## Example 3: Parameterized Tests

```typescript
import { test, expect } from '@playwright/test';

const formValidationCases = [
  { field: 'Email', value: '', error: 'Email is required' },
  { field: 'Email', value: 'not-email', error: 'Invalid email format' },
  { field: 'Password', value: '12', error: 'Password must be at least 8 characters' },
  { field: 'Username', value: 'a', error: 'Username must be at least 3 characters' },
];

for (const tc of formValidationCases) {
  test(`validation: ${tc.field} with "${tc.value}"`, async ({ page }) => {
    await page.goto('/register');
    if (tc.value) {
      await page.getByLabel(tc.field).fill(tc.value);
    }
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(tc.error)).toBeVisible();
  });
}
```

## Example 4: Navigation POM Returning Other POMs

```typescript
import type { Locator, Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';
import { DashboardPage } from './dashboard-page';
import { SettingsPage } from './settings-page';
import { ProfilePage } from './profile-page';

export class AppNavigationBar {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly settingsLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });
  }

  async openDashboard(): Promise<DashboardPage> {
    await this.dashboardLink.click();
    const dashboardPage = new DashboardPage(this.page);
    await playExpect(dashboardPage.heading).toBeVisible();
    return dashboardPage;
  }

  async openSettings(): Promise<SettingsPage> {
    await this.settingsLink.click();
    const settingsPage = new SettingsPage(this.page);
    await playExpect(settingsPage.heading).toBeVisible();
    return settingsPage;
  }

  async openProfile(): Promise<ProfilePage> {
    await this.profileLink.click();
    const profilePage = new ProfilePage(this.page);
    await playExpect(profilePage.heading).toBeVisible();
    return profilePage;
  }
}
```

## Example 5: Custom Fixtures

```typescript
import { test as base, expect } from '@playwright/test';
import { DashboardPage } from './model/dashboard-page';
import { ApiClient } from './helpers/api-client';

type TestFixtures = {
  dashboardPage: DashboardPage;
  apiClient: ApiClient;
};

export const test = base.extend<TestFixtures>({
  dashboardPage: async ({ page }, use) => {
    await page.goto('/dashboard');
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.heading).toBeVisible();
    await use(dashboardPage);
  },

  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
});

// Usage in tests
test('dashboard shows user data', async ({ dashboardPage, apiClient }) => {
  const userData = await apiClient.getUser('test-id');
  await expect(dashboardPage.userName).toHaveText(userData.name);
});
```

## Example 6: Polling for Async State

```typescript
import { test, expect } from '@playwright/test';

test('build completes within timeout', async ({ page }) => {
  test.setTimeout(300_000);

  await page.getByRole('button', { name: 'Start Build' }).click();

  const statusIndicator = page.getByRole('status');

  await expect
    .poll(
      async () => {
        const text = await statusIndicator.textContent();
        return text?.toLowerCase();
      },
      {
        timeout: 240_000,
        intervals: [5_000, 10_000, 15_000],
        message: 'Build did not complete in time',
      },
    )
    .toMatch(/success|error/);

  await expect(statusIndicator).toHaveText('Success');
});
```

## Example 7: Network Mocking in Tests

```typescript
import { test, expect } from '@playwright/test';

test('displays users from API', async ({ page }) => {
  await page.route('**/api/users', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'User' },
      ]),
    }),
  );

  await page.goto('/users');
  const rows = page.getByRole('row');
  await expect(rows).toHaveCount(3); // header + 2 data rows
  await expect(rows.nth(1)).toContainText('Alice');
  await expect(rows.nth(2)).toContainText('Bob');
});

test('handles API error gracefully', async ({ page }) => {
  await page.route('**/api/users', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));

  await page.goto('/users');
  await expect(page.getByText('Failed to load users')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeEnabled();
});
```

## Example 8: Webview / Electron POM

For extensions running in Electron with webview content:

```typescript
import type { Locator, Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

export class ExtensionPage {
  readonly page: Page;
  readonly webview: Page;
  readonly heading: Locator;
  readonly actionButton: Locator;

  constructor(page: Page, webview: Page) {
    this.page = page;
    this.webview = webview;
    // Locators target the webview content, not the outer shell
    this.heading = webview.getByRole('heading', { name: 'My Extension' });
    this.actionButton = webview.getByRole('button', { name: 'Run Action' });
  }

  async performAction(): Promise<void> {
    await playExpect(this.actionButton).toBeEnabled();
    await this.actionButton.click();
  }
}
```

## Example 9: Cleanup with afterAll

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';

test.afterAll(async ({ page }) => {
  test.setTimeout(120_000);
  try {
    await page.goto('/admin/cleanup');
    await page.getByRole('button', { name: 'Delete Test Data' }).click();
    await expect(page.getByText('Cleaned up')).toBeVisible({ timeout: 60_000 });
  } catch (error) {
    console.log(`Cleanup error (non-fatal): ${error}`);
  } finally {
    if (fs.existsSync('tests/output/temp')) {
      fs.rmSync('tests/output/temp', { recursive: true });
    }
  }
});
```

## Example 10: Checkbox and Select Interactions

```typescript
import { test, expect } from '@playwright/test';

test('configure build options', async ({ page }) => {
  await page.goto('/build');

  // Select from dropdown
  await page.getByLabel('image-select').selectOption({ label: 'my-image:latest' });

  // Checkbox interactions
  const checkbox = page.getByLabel('enable-optimization');
  if (!(await checkbox.isChecked())) {
    await checkbox.check();
  }
  await expect(checkbox).toBeChecked();

  // Radio button via role
  await page.getByRole('button', { name: 'amd64' }).click();

  // Fill path input
  const pathInput = page.getByLabel('output-path');
  await pathInput.clear();
  await pathInput.fill('/tmp/output');
  await expect(pathInput).toHaveValue('/tmp/output');

  await page.getByRole('button', { name: 'Build' }).click();
});
```
