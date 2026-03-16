# Playwright Reference

## Locator API Deep Dive

### Filtering Locators

Chain filters to narrow down results:

```typescript
page.getByRole('listitem').filter({ hasText: 'Product A' });
page.getByRole('listitem').filter({ has: page.getByRole('button', { name: 'Buy' }) });
page.locator('article').filter({ hasNot: page.getByText('Draft') });
```

### Nth Selection

```typescript
page.getByRole('listitem').first();
page.getByRole('listitem').last();
page.getByRole('listitem').nth(2); // 0-indexed
```

### Chaining Locators

```typescript
const row = page.getByRole('row').filter({ hasText: 'John' });
const editBtn = row.getByRole('button', { name: 'Edit' });
```

### Frame Locators

For iframes and embedded content:

```typescript
const frame = page.frameLocator('#my-iframe');
await frame.getByRole('button', { name: 'Submit' }).click();
```

## Advanced Assertions

### toPass — Retry a Block

Retry an entire block of code until it passes:

```typescript
await expect(async () => {
  const response = await page.request.get('/api/status');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.ready).toBe(true);
}).toPass({ timeout: 30_000, intervals: [1_000, 2_000, 5_000] });
```

### Custom Matchers

Extend `expect` with project-specific matchers:

```typescript
expect.extend({
  async toBeInViewport(locator: Locator) {
    const box = await locator.boundingBox();
    const viewport = locator.page().viewportSize();
    const pass =
      box !== null &&
      viewport !== null &&
      box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= viewport.width &&
      box.y + box.height <= viewport.height;
    return { pass, message: () => `Expected element to be in viewport` };
  },
});
```

### Snapshot Testing

```typescript
await expect(page).toHaveScreenshot('homepage.png', { maxDiffPixels: 100 });
await expect(locator).toHaveScreenshot('component.png');
```

## Network Interception

### Mock API Responses

```typescript
await page.route('**/api/users', route =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Test User' }]),
  }),
);
```

### Wait for Network Requests

```typescript
const responsePromise = page.waitForResponse('**/api/data');
await page.getByRole('button', { name: 'Load' }).click();
const response = await responsePromise;
expect(response.status()).toBe(200);
```

### Intercept and Modify

```typescript
await page.route('**/api/config', async route => {
  const response = await route.fetch();
  const json = await response.json();
  json.featureFlag = true;
  await route.fulfill({ response, json });
});
```

## Authentication & State

### Storage State (Reuse Login)

```typescript
// Save auth state after login
await page.context().storageState({ path: 'auth-state.json' });

// Reuse in config
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'tests',
      dependencies: ['setup'],
      use: { storageState: 'auth-state.json' },
    },
  ],
});
```

## Fixtures

### Custom Fixtures

```typescript
import { test as base } from '@playwright/test';
import { DashboardPage } from './model/dashboard-page';

type MyFixtures = {
  dashboardPage: DashboardPage;
};

export const test = base.extend<MyFixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await page.goto('/dashboard');
    await use(dashboard);
  },
});
```

### Worker-Scoped Fixtures

Shared across all tests in a worker (useful for expensive setup):

```typescript
type WorkerFixtures = {
  dbConnection: DatabaseClient;
};

export const test = base.extend<{}, WorkerFixtures>({
  dbConnection: [
    async ({}, use) => {
      const db = await DatabaseClient.connect();
      await use(db);
      await db.disconnect();
    },
    { scope: 'worker' },
  ],
});
```

## Parameterized Tests

### Loop-Based

```typescript
const imageTypes = ['QCOW2', 'AMI', 'RAW', 'VMDK', 'ISO', 'VHD'];

for (const type of imageTypes) {
  test(`build ${type} image`, async ({ page }) => {
    // test body using type
  });
}
```

### Data-Driven with Objects

```typescript
const testCases = [
  { name: 'valid email', input: 'user@test.com', expected: 'Success' },
  { name: 'invalid email', input: 'not-an-email', expected: 'Invalid email' },
];

for (const tc of testCases) {
  test(`form submission: ${tc.name}`, async ({ page }) => {
    await page.getByLabel('Email').fill(tc.input);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText(tc.expected)).toBeVisible();
  });
}
```

## Multi-Page / Multi-Tab

```typescript
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'Open in new tab' }).click(),
]);
await newPage.waitForLoadState();
await expect(newPage.getByRole('heading')).toHaveText('New Page');
```

## File Upload / Download

### Upload

```typescript
await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');
await page.getByLabel('Upload file').setInputFiles(['file1.pdf', 'file2.pdf']);
```

### Download

```typescript
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Download' }).click();
const download = await downloadPromise;
await download.saveAs('path/to/save.pdf');
```

## Dialog Handling

```typescript
page.on('dialog', async dialog => {
  expect(dialog.message()).toContain('Are you sure?');
  await dialog.accept();
});
await page.getByRole('button', { name: 'Delete' }).click();
```

## Parallel Execution Strategies

### Worker Isolation

Each worker gets its own browser context. Tests in the same file share a worker by default.

### Shard Across CI

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

### Fully Parallel

```typescript
// In config
export default defineConfig({
  fullyParallel: true,
});

// Or per-file
test.describe.configure({ mode: 'parallel' });
```

## Trace Configuration

```typescript
// Always capture traces
use: {
  trace: 'on';
}

// Only on first retry (recommended for CI)
use: {
  trace: 'on-first-retry';
}

// Only on failure
use: {
  trace: 'retain-on-failure';
}
```

## Global Setup / Teardown

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});

// global-setup.ts
export default async function globalSetup() {
  // Start services, seed database, etc.
}
```

## Accessibility Testing

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page passes a11y checks', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## API Testing (Without Browser)

```typescript
test('API returns user list', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  const users = await response.json();
  expect(users.length).toBeGreaterThan(0);
});
```

## Useful CLI Commands

| Command                                  | Purpose                  |
| ---------------------------------------- | ------------------------ |
| `npx playwright test`                    | Run all tests            |
| `npx playwright test file.spec.ts`       | Run specific file        |
| `npx playwright test -g "test name"`     | Run by test name         |
| `npx playwright test --headed`           | Run with browser visible |
| `npx playwright test --debug`            | Step-through debugger    |
| `npx playwright test --ui`               | Interactive UI mode      |
| `npx playwright show-trace trace.zip`    | View trace file          |
| `npx playwright codegen url`             | Record actions as code   |
| `npx playwright test --reporter=html`    | Generate HTML report     |
| `npx playwright test --project=chromium` | Run specific project     |
| `npx playwright install`                 | Install browsers         |
