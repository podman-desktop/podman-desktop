---
name: playwright-testing
description: >-
  Guide for writing, organizing, and maintaining Playwright end-to-end tests
  using the Page Object Model pattern. Use when creating new Playwright tests,
  building page objects, debugging test failures, configuring Playwright, or
  when the user asks about E2E testing, test automation, or Playwright.
---

# Playwright Test Automation

## Core Principles

- **Page Object Model (POM)**: Every page/component gets its own class. Tests never touch raw locators directly.
- **Resilient locators**: Prefer accessible selectors (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath.
- **Explicit waits over sleeps**: Use `expect` with auto-retry, `waitForSelector`, or polling — never arbitrary `waitForTimeout` in production tests.
- **Serial vs parallel**: Use `test.describe.serial()` only when tests share state or depend on ordering. Default to parallel.
- **Fail fast, report clearly**: Every assertion should produce a readable error. Prefer `toBeVisible`, `toHaveText`, `toContainText` over generic `toBeTruthy`.

## Project Structure

Organize test code with clear separation of concerns:

```
tests/playwright/
├── playwright.config.ts        # Runner configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── src/
│   ├── *.spec.ts               # Test spec files
│   └── model/                  # Page Object Models
│       ├── *-page.ts           # Full-page POM classes
│       └── *-component.ts      # Reusable component POMs
├── resources/                  # Test fixtures and data files
└── output/                     # Traces, videos, reports (gitignored)
```

## Writing Page Object Models

### Structure

Each POM class encapsulates a page or distinct UI region:

```typescript
import type { Locator, Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

export class ExamplePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly submitButton: Locator;
  readonly nameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Example' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.nameInput = page.getByLabel('Name');
  }

  async fillAndSubmit(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await playExpect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }
}
```

### POM Rules

1. **Declare all locators as `readonly` properties** in the constructor. This makes them discoverable and reusable.
2. **Methods return other POM instances** when navigation occurs (e.g., `openSettings()` returns `SettingsPage`).
3. **Keep assertions in tests**, not in POM methods — unless the method explicitly validates state (e.g., `waitUntilBuildFinished`).
4. **Use descriptive method names**: `fillAndSubmit`, `selectArchitecture`, `waitForImageReady` — not `doAction` or `step2`.

### Navigation POMs

For apps with sidebar/navbar navigation, create a navigation POM that returns page POMs:

```typescript
export class NavigationBar {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
  }

  async openDashboard(): Promise<DashboardPage> {
    await this.dashboardLink.click();
    const dashboard = new DashboardPage(this.page);
    await playExpect(dashboard.heading).toBeVisible();
    return dashboard;
  }
}
```

## Writing Tests

### Test File Template

```typescript
import { test, expect } from '@playwright/test';
import { ExamplePage } from './model/example-page';

test.describe('Feature Name', () => {
  test('should do the expected thing', async ({ page }) => {
    const examplePage = new ExamplePage(page);
    await examplePage.fillAndSubmit('test-name');
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Lifecycle Hooks

```typescript
test.beforeAll(async ({ browser }) => {
  // One-time setup: seed data, start services
});

test.afterAll(async () => {
  // Cleanup: remove test data, close connections
});

test.beforeEach(async ({ page }) => {
  // Per-test setup: navigate to starting page
});
```

### Serial Test Suites

Use `test.describe.serial()` when tests must run in order and share state:

```typescript
let imageBuilt = false;

test.describe.serial('Image Build Pipeline', () => {
  test('build image', async ({ page }) => {
    // ...build logic...
    imageBuilt = true;
  });

  test('verify image exists', async ({ page }) => {
    test.skip(!imageBuilt, 'Build failed, skipping verification');
    // ...verification...
  });
});
```

### Conditional Skipping

```typescript
test.skip(condition, 'reason for skipping');
test.skip(os.platform() === 'linux', 'Not supported on Linux');
test.skip(!!process.env.SKIP_FEATURE, 'Feature disabled via env');
```

### Timeouts

Set timeouts explicitly for long-running operations:

```typescript
test('long operation', async ({ page }) => {
  test.setTimeout(300_000); // 5 minutes
  // ...
});
```

Use numeric separators for readability: `1_200_000` not `1200000`.

## Locator Strategy (Priority Order)

1. **`getByRole`** — best for accessibility and resilience
2. **`getByLabel`** — form inputs and labeled elements
3. **`getByText`** — visible text content
4. **`getByTestId`** — when no semantic alternative exists
5. **`locator('css')`** — last resort

### Locator Examples

```typescript
page.getByRole('button', { name: 'Submit' });
page.getByRole('heading', { name: 'Dashboard' });
page.getByLabel('Email address');
page.getByText('Welcome back');
page.getByTestId('user-avatar');
page.getByRole('link', { name: /settings/i });
```

### Avoid

- **`page.locator('#id')`** — fragile, breaks on refactor
- **`page.locator('.className')`** — fragile, implementation detail
- **`page.locator('xpath=...')`** — brittle and unreadable

## Assertions

### Auto-Retrying Assertions (Preferred)

```typescript
await expect(locator).toBeVisible();
await expect(locator).toBeEnabled();
await expect(locator).toHaveText('Expected');
await expect(locator).toContainText('partial');
await expect(locator).toHaveValue('input-value');
await expect(locator).toBeChecked();
await expect(locator).not.toBeVisible();
```

### Polling Assertions

For conditions that need periodic re-evaluation:

```typescript
await expect.poll(async () => await checkSomeCondition(), { timeout: 30_000 }).toBeTruthy();
```

### Soft Assertions

Continue test execution after failure (for gathering multiple failures):

```typescript
await expect.soft(locator).toBeVisible();
await expect.soft(locator).toHaveText('expected');
```

## Waiting Patterns

### Prefer Built-in Auto-Wait

Playwright actions (`click`, `fill`, `check`) auto-wait for actionability. Don't add explicit waits before them unless there's a specific timing issue.

### When You Need Explicit Waits

```typescript
await page.waitForLoadState('networkidle');
await page.waitForURL('**/dashboard');
await locator.waitFor({ state: 'visible', timeout: 10_000 });
```

### Polling Helper Pattern

For custom conditions without built-in waits:

```typescript
async function waitUntil(
  fn: () => Promise<boolean>,
  opts: { timeout: number; interval?: number; message?: string },
): Promise<void> {
  const { timeout, interval = 1000, message = 'Condition not met' } = opts;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error(`${message} (after ${timeout}ms)`);
}
```

## Configuration

### `playwright.config.ts` Template

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  outputDir: './output/',
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['junit', { outputFile: './tests/output/junit-results.xml' }],
    ['json', { outputFile: './tests/output/json-results.json' }],
    ['html', { open: 'never', outputFolder: './tests/output/html-results/' }],
  ],

  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## Debugging Tests

### Interactive Mode

```bash
npx playwright test --ui
```

### Headed Mode

```bash
npx playwright test --headed
```

### Debug Mode (Step Through)

```bash
npx playwright test --debug
```

### Trace Viewer

```bash
npx playwright show-trace output/trace.zip
```

### Within Tests

```typescript
await page.pause(); // Opens inspector
console.log(await locator.innerHTML());
await page.screenshot({ path: 'debug.png' });
```

## Webview / Electron Testing

When testing Electron apps or extensions with webviews:

```typescript
async function handleWebview(runner: Runner): Promise<[Page, Page]> {
  const page = runner.getPage();
  // Navigate to the extension's entry point
  const extensionButton = page.getByRole('link', { name: 'My Extension' });
  await expect(extensionButton).toBeEnabled();
  await extensionButton.click();

  // Wait for the webview to load
  const webView = page.getByRole('document', { name: 'Webview Label' });
  await expect(webView).toBeVisible();

  // Access webview's separate page context
  const [mainPage, webViewPage] = runner.getElectronApp().windows();
  return [mainPage, webViewPage];
}
```

POMs that operate on webviews accept both `page` and `webview` parameters and use `webview` for locators inside the webview content.

## CI/CD Considerations

- Run headless with `xvfb-maybe` on Linux: `xvfb-maybe --auto-servernum -- npx playwright test`
- Set `SKIP_INSTALLATION` or similar env vars to control test scope in CI
- Use `test.skip(!!isCI && condition)` for platform-specific CI skips
- Configure retries in CI: `retries: process.env.CI ? 2 : 0`
- Archive `output/` directory for traces, screenshots, and video on failure
- Use JUnit reporter for CI test result integration

## Additional Resources

- For detailed API patterns and advanced topics, see [reference.md](reference.md)
- For concrete test examples and patterns, see [examples.md](examples.md)
