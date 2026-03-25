---
name: playwright-testing
description: >-
  Guide for writing, updating, and maintaining Playwright end-to-end tests for
  Podman Desktop using the project's Electron runner, custom fixtures, and Page
  Object Model hierarchy. Use when creating new E2E spec files, building or
  modifying page objects, updating the test framework or utilities, debugging
  test failures, adding smoke tests, or when the user asks about Playwright
  tests, test automation, spec files, page models, or the E2E test structure.
---

# Playwright E2E Testing for Podman Desktop

This skill covers the Podman Desktop-specific Playwright framework. It is an
Electron desktop app — tests launch the app via `Runner`, not a browser URL.

## Project Structure

```
playwright.config.ts                          # At repo root, not under tests/
tests/playwright/
├── package.json                              # @podman-desktop/tests-playwright
├── tsconfig.json                             # Path alias: /@/ → src/
├── vite.config.js                            # Library build config
├── src/
│   ├── specs/                                # Test spec files
│   │   ├── *-smoke.spec.ts                   # Smoke test suites
│   │   ├── *.spec.ts                         # Other specs
│   │   └── z-*.spec.ts                       # Ordered-last suites (Podman machine)
│   ├── special-specs/                        # Isolated/focused suites
│   │   ├── installation/
│   │   ├── managed-configuration/
│   │   ├── podman-remote/
│   │   └── ui-stress/
│   ├── model/                                # Page Object Models
│   │   ├── pages/                            # Page POMs (base-page, main-page, details-page, ...)
│   │   │   ├── base-page.ts                  # Abstract base: holds readonly page
│   │   │   ├── main-page.ts                  # Abstract: list pages (Images, Containers, Volumes, Pods)
│   │   │   ├── details-page.ts               # Abstract: resource detail views
│   │   │   ├── *-page.ts                     # Concrete page POMs
│   │   │   ├── forms/                        # Form-specific POMs
│   │   │   └── compose-onboarding/           # Compose onboarding flow POMs
│   │   ├── workbench/                        # App shell POMs
│   │   │   ├── navigation.ts                 # NavigationBar — sidebar nav, returns page POMs
│   │   │   └── status-bar.ts                 # StatusBar
│   │   ├── components/                       # Reusable widget POMs
│   │   └── core/                             # Enums, types, states, settings helpers
│   ├── runner/                               # Electron app launcher
│   │   ├── podman-desktop-runner.ts          # Runner singleton
│   │   └── runner-options.ts                 # RunnerOptions config class
│   ├── utility/                              # Shared helpers
│   │   ├── fixtures.ts                       # Custom Playwright test + fixtures
│   │   ├── operations.ts                     # UI workflow helpers
│   │   ├── wait.ts                           # waitUntil, waitWhile, waitForPodmanMachineStartup
│   │   ├── kubernetes.ts                     # K8s helpers
│   │   ├── cluster-operations.ts             # Kind cluster helpers
│   │   ├── platform.ts                       # isLinux, isMac, isWindows, isCI
│   │   └── auth-utils.ts                     # Browser-based auth flows (Chromium)
│   ├── setupFiles/                           # Feature gate helpers
│   └── globalSetup/                          # Setup/teardown (exported, not in config)
├── resources/                                # Containerfiles, YAML, fixtures
└── output/                                   # Traces, videos, reports (gitignored)
```

## Imports and Fixtures

**Always** import `test` and `expect` from the project fixtures, not from `@playwright/test`:

```typescript
import { expect as playExpect, test } from '/@/utility/fixtures';
```

All source imports use the `/@/` path alias, which Vite resolves to `src/`.

### Available Test Fixtures

The custom `test` provides these fixtures:

| Fixture         | Type            | Description                                                 |
| --------------- | --------------- | ----------------------------------------------------------- |
| `runner`        | `Runner`        | Electron app lifecycle (singleton via `Runner.getInstance`) |
| `page`          | `Page`          | The Electron renderer window (`runner.getPage()`)           |
| `navigationBar` | `NavigationBar` | Sidebar navigation POM                                      |
| `welcomePage`   | `WelcomePage`   | Welcome/onboarding page POM                                 |
| `statusBar`     | `StatusBar`     | Bottom status bar POM                                       |
| `runnerOptions` | `RunnerOptions` | Configurable option (override with `test.use`)              |

Destructure these directly in test hooks and test functions:

```typescript
test.beforeAll(async ({ runner, welcomePage, page }) => { ... });
test('my test', async ({ navigationBar }) => { ... });
```

## Page Object Model Hierarchy

### Three-Level Inheritance

```
BasePage (abstract)
├── MainPage (abstract) — list pages with tables (Images, Containers, Volumes, Pods)
│   ├── ImagesPage
│   ├── ContainersPage
│   ├── VolumesPage
│   └── PodsPage
├── DetailsPage (abstract) — resource detail views with tabs
│   ├── ImageDetailsPage
│   ├── ContainerDetailsPage
│   └── ...
└── Other concrete pages (WelcomePage, DashboardPage, ...)

Workbench classes (not BasePage subclasses):
├── NavigationBar
└── StatusBar
```

### BasePage

All page POMs extend `BasePage`:

```typescript
import type { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
```

### MainPage

For list pages with header, search, content regions, and table rows:

```typescript
export abstract class MainPage extends BasePage {
  readonly title: string;
  readonly mainPage: Locator;
  readonly header: Locator;
  readonly search: Locator;
  readonly content: Locator;
  readonly additionalActions: Locator;
  readonly heading: Locator;

  constructor(page: Page, title: string) {
    super(page);
    this.title = title;
    this.mainPage = page.getByRole('region', { name: this.title });
    this.header = this.mainPage.getByRole('region', { name: 'header' });
    this.search = this.mainPage.getByRole('region', { name: 'search' });
    this.content = this.mainPage.getByRole('region', { name: 'content' });
    this.additionalActions = this.header.getByRole('group', { name: 'additionalActions' });
    this.heading = this.header.getByRole('heading', { name: this.title });
  }
}
```

Concrete pages call `super(page, 'images')`, `super(page, 'containers')`, etc.

### DetailsPage

For resource detail views with tabs, breadcrumb, and control actions:

```typescript
export abstract class DetailsPage extends BasePage {
  readonly header: Locator;
  readonly tabs: Locator;
  readonly tabContent: Locator;
  readonly closeButton: Locator;
  readonly backLink: Locator;
  readonly heading: Locator;

  constructor(page: Page, resourceName: string) {
    super(page);
    this.tabContent = page.getByRole('region', { name: 'Tab Content' });
    this.header = page.getByRole('region', { name: 'Header' });
    this.tabs = page.getByRole('region', { name: 'Tabs' });
    this.heading = this.header.getByRole('heading', { name: resourceName });
    // ... breadcrumb, close, back locators
  }
}
```

### POM Rules

1. **Extend the correct base class**: `MainPage` for list pages, `DetailsPage` for detail views, `BasePage` for other pages
2. **Declare all locators as `readonly` in the constructor** — eager `Locator` chains, not lazy getters
3. **Wrap every method body in `test.step()`** for trace readability:

```typescript
async pullImage(image: string): Promise<ImagesPage> {
  return test.step(`Pull image: ${image}`, async () => {
    const pullImagePage = await this.openPullImage();
    await playExpect(pullImagePage.heading).toBeVisible();
    return await pullImagePage.pullImage(image);
  });
}
```

4. **Navigation methods return POM instances** — e.g. `openPullImage()` returns `PullImagePage`
5. **Use `playExpect`** (aliased from `@playwright/test`) inside POM files for assertions
6. **Import `test` from `@playwright/test`** in POM files (for `test.step`), but from `/@/utility/fixtures` in spec files

### NavigationBar

Returns page POMs from sidebar navigation. Each method wraps in `test.step()`:

```typescript
async openImages(): Promise<ImagesPage> {
  return test.step('Open Images page', async () => {
    await playExpect(this.imagesLink).toBeVisible({ timeout: 10_000 });
    await this.imagesLink.click({ force: true });
    return new ImagesPage(this.page);
  });
}
```

## Writing Spec Files

### Template

```typescript
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

// Optional: override runner options for isolated profile
test.use({ runnerOptions: new RunnerOptions({ customFolder: 'my-feature' }) });

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('my-feature-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Feature name', { tag: '@smoke' }, () => {
  test.describe.configure({ retries: 1 });

  test('first test', async ({ navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();
    // ... test body
  });
});
```

### Key Patterns

- **Serial suites**: Use `test.describe.serial()` — most Podman Desktop E2E tests share Electron state
- **Tags**: `{ tag: '@smoke' }`, `{ tag: '@k8s_e2e' }`, `{ tag: ['@smoke', '@windows_sanity'] }`
- **Retries**: `test.describe.configure({ retries: 1 })` inside the describe block
- **Timeouts**: `test.setTimeout(180_000)` per test or in `beforeAll`
- **Conditional skip**: `test.skip(isLinux, 'Not supported on Linux')`
- **Runner options**: `test.use({ runnerOptions: new RunnerOptions({ ... }) })` for custom profiles
- **Cleanup in afterAll**: Always wrap in `try/finally` with `runner.close()` in `finally`

### Naming Conventions

- Spec files: `kebab-case-smoke.spec.ts` (use `-smoke` suffix for smoke tests)
- Prefix with `z-` for suites that must run last (e.g. `z-podman-machine-tests.spec.ts`)
- POM files: `feature-page.ts` in `model/pages/`, `feature-component.ts` in `model/components/`

## Runner and RunnerOptions

### Runner Lifecycle

`Runner` is a singleton that launches the Electron app:

1. `Runner.getInstance({ runnerOptions })` — creates/reuses the singleton, calls `electron.launch()`
2. `runner.getPage()` — returns the `Page` from `firstWindow()`
3. `runner.setVideoAndTraceName('name')` — sets artifact naming (call in `beforeAll`)
4. `runner.close()` — stops tracing, closes app, saves artifacts

### RunnerOptions

Configure with `test.use()`:

```typescript
test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'my-test-profile', // isolated profile directory
    extensionsDisabled: ['podman'], // disable specific extensions
    autoUpdate: false, // disable auto-update checks
    saveTracesOnPass: true, // keep traces even on pass
    customSettings: { key: 'value' }, // inject settings.json values
  }),
});
```

### Environment Variables

| Variable                | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `PODMAN_DESKTOP_BINARY` | Path to packaged binary (mutually exclusive with `PODMAN_DESKTOP_ARGS`) |
| `PODMAN_DESKTOP_ARGS`   | Path to repo for dev mode                                               |
| `KEEP_TRACES_ON_PASS`   | Retain traces on passing tests                                          |
| `KEEP_VIDEOS_ON_PASS`   | Retain videos on passing tests                                          |

## Wait Utilities

Use the project's wait helpers from `/@/utility/wait`, not custom polling:

```typescript
import { waitUntil, waitWhile, waitForPodmanMachineStartup } from '/@/utility/wait';

await waitUntil(() => someCondition(), { timeout: 10_000, diff: 500, message: 'Condition not met' });
await waitWhile(() => dialogIsOpen(), { timeout: 5_000 });
await waitForPodmanMachineStartup(page);
```

Parameters: `timeout` (ms, default 5000), `diff` (polling interval ms, default 500), `sendError` (throw on timeout, default true), `message` (error text).

## Locator Strategy

1. **`getByRole`** — primary choice, use `exact: true` when needed
2. **`getByLabel`** — form inputs and ARIA-labeled elements
3. **`getByText`** — visible text
4. **`getByTestId`** — when no semantic option exists
5. **CSS locators** — last resort

Scope locators to parent regions when possible:

```typescript
this.pullImageButton = this.additionalActions.getByRole('button', { name: 'Pull', exact: true });
```

## Running Tests

Tests execute from the **repo root** (not from `tests/playwright/`):

```bash
# All E2E tests (excluding k8s)
npx playwright test tests/playwright/src/specs/ --grep-invert @k8s_e2e

# Smoke tests only
npx playwright test tests/playwright/src/specs/ --grep @smoke

# Single spec file
npx playwright test tests/playwright/src/specs/image-smoke.spec.ts

# View report
pnpm exec playwright show-report tests/playwright/output/html-results
```

## Troubleshooting

### Podman machine stuck in STARTING

The `waitForPodmanMachineStartup` utility handles this by resetting via CLI. If tests time out waiting for RUNNING state, check that Podman is installed and the machine provider is available.

### No Container Engine

Some POM methods (e.g. `openPullImage`) use `waitWhile(() => this.noContainerEngine())` to gate on engine availability. If tests fail with "No Container Engine", the Podman machine likely didn't start.

### Platform-specific skips

Use helpers from `/@/utility/platform`:

```typescript
import { isLinux, isMac, isWindows, isCI } from '/@/utility/platform';
test.skip(isLinux, 'Not supported on Linux');
```

## Additional Resources

- For the project's wait utilities, operation helpers, and framework API, see [references/reference.md](references/reference.md)
- For concrete examples from actual spec files, see [references/examples.md](references/examples.md)
