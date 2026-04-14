# Framework Reference

Detailed reference for the Podman Desktop Playwright test framework internals.

## Runner Internals

### Singleton Pattern

`Runner` enforces a single Electron instance across all tests in a worker:

```typescript
const runner = await Runner.getInstance({ runnerOptions });
```

Internally this calls `electron.launch()` with options derived from `RunnerOptions`
and environment variables, then stores `firstWindow()` as the `page`.

### Launch Options

The runner resolves its launch configuration from:

1. `PODMAN_DESKTOP_BINARY` env var — packaged app path
2. `PODMAN_DESKTOP_ARGS` env var — path to repo root (dev mode, uses `node_modules/.bin/electron`)
3. `RunnerOptions` — profile directory, settings, extensions, DevTools

These are mutually exclusive: `PODMAN_DESKTOP_BINARY` takes precedence.

### Tracing and Video

- `runner.setVideoAndTraceName('feature-e2e')` — call in `beforeAll` to name artifacts
- On `runner.close()`: tracing stops, video saves, process terminates
- By default, traces and videos are deleted on pass unless `KEEP_TRACES_ON_PASS` / `KEEP_VIDEOS_ON_PASS` env vars are set, or `RunnerOptions` has `saveTracesOnPass: true` / `saveVideosOnPass: true`

### Browser Window Access

For Electron-specific checks:

```typescript
const browserWindow = await runner.getBrowserWindow();
const state = await runner.getBrowserWindowState();
// state: { isVisible, isDevToolsOpened, isCrashed, isFocused }
```

## RunnerOptions Full API

```typescript
new RunnerOptions({
  profile: '', // Profile suffix
  customFolder: 'podman-desktop', // Home directory subfolder
  customOutputFolder: 'tests/playwright/output/',
  openDevTools: 'none', // 'none' | 'right' | 'bottom' | 'undocked'
  autoUpdate: true,
  autoCheckUpdates: true,
  extensionsDisabled: [], // Array of extension IDs to disable
  aiLabModelUploadDisabled: false,
  binaryPath: undefined, // Override binary path
  saveTracesOnPass: false,
  saveVideosOnPass: false,
  customSettings: {}, // Injected into settings.json
});
```

The `createSettingsJson()` method serializes these into the settings file that
Runner writes to the profile directory before launch.

## Fixtures Internals

### How Fixtures Wire Together

```
runnerOptions (option, overridable via test.use)
    └─→ runner (Runner.getInstance)
          └─→ page (runner.getPage())
                ├─→ navigationBar (new NavigationBar(page))
                ├─→ welcomePage (new WelcomePage(page))
                └─→ statusBar (new StatusBar(page))
```

### Overriding RunnerOptions

Use `test.use()` at the file level for custom profiles:

```typescript
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'my-isolated-test',
    extensionsDisabled: ['podman'],
  }),
});
```

## Wait Utilities API

### waitUntil

Polls until a condition becomes `true`:

```typescript
await waitUntil(() => someAsyncCheck(), {
  timeout: 5_000, // max wait (ms), default 5000
  diff: 500, // polling interval (ms), default 500
  sendError: true, // throw on timeout, default true
  message: '', // custom error message
});
```

### waitWhile

Polls until a condition becomes `false`:

```typescript
await waitWhile(() => dialogIsStillOpen(), { timeout: 10_000, message: 'Dialog did not close' });
```

### waitForPodmanMachineStartup

Ensures Podman machine is running before tests proceed:

```typescript
await waitForPodmanMachineStartup(page, timeout);
```

This:

1. Creates a Podman machine via CLI if needed
2. Opens the Dashboard page
3. Waits for the status label to show "RUNNING"
4. If stuck in "STARTING", resets and retries once

## Operations Utility

`/@/utility/operations` provides workflow helpers used across specs:

- `handleConfirmationDialog(page, title?, confirm?, buttonName?, inputText?, timeout?, waitForClose?)` — handles modal confirmation dialogs
- `untagImagesFromPodman(imageName)` — CLI-based image untagging
- `deleteContainer(page, name)`, `deleteImage(page, name)` — cleanup helpers
- `createPodmanMachineFromCLI()`, `resetPodmanMachinesFromCLI()` — machine management

## Platform Utilities

```typescript
import { isLinux, isMac, isWindows, isCI } from '/@/utility/platform';
```

These are boolean constants, not functions. Use directly in `test.skip()`:

```typescript
test.skip(isLinux, 'Compose not supported on Linux CI');
test.skip(isCI && isMac, 'Flaky on macOS CI');
```

## Playwright Configuration

The config lives at the **repo root** (`playwright.config.ts`), not under `tests/playwright/`:

```typescript
export default defineConfig({
  outputDir: 'tests/playwright/output/',
  workers: 1,
  timeout: 90_000,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'tests/playwright/output/junit-results.xml' }],
    ['json', { outputFile: 'tests/playwright/output/json-results.json' }],
    ['html', { open: 'never', outputFolder: 'tests/playwright/output/html-results/' }],
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

The `chromium` project is declared for tooling compatibility (`auth-utils.ts`).
The actual app under test is Electron, launched by `Runner` — not by Playwright's
project configuration.

Tracing and video are managed by `Runner`, not the config's `use` block.

## MainPage Shared Methods

`MainPage` provides methods inherited by all list pages:

- `pageIsEmpty()` — checks for "No Container Engine" or "No {title}" headings
- `noContainerEngine()` — checks engine availability
- `getAllTableRows()` — returns all `row` locators from the content table
- `getRowByName(name, exact?)` — finds a row by its ARIA label
- `waitForRowToExists(name, timeout?)` — polls until a row appears
- `waitForRowToBeDelete(name, timeout?)` — polls until a row disappears
- `countRowsFromTable()` — counts data rows (excludes header)
- `getRowsFromTableByStatus(status)` — filters rows by status cell content
- `checkAllRows()` / `uncheckAllRows()` — toggle selection checkbox

## DetailsPage Shared Methods

`DetailsPage` provides:

- `activateTab(tabName)` — clicks a tab in the detail view
- `closeButton` / `backLink` — breadcrumb navigation locators
- `heading` — scoped to the resource name
- `controlActions` — action button group in the header

## Locator Patterns in This Codebase

### Region-Scoped Locators

The Podman Desktop UI uses ARIA regions extensively. POMs scope locators to
their containing region:

```typescript
this.mainPage = page.getByRole('region', { name: 'images' });
this.header = this.mainPage.getByRole('region', { name: 'header' });
this.additionalActions = this.header.getByRole('group', { name: 'additionalActions' });
this.pullImageButton = this.additionalActions.getByRole('button', { name: 'Pull', exact: true });
```

### Row-Based Locators

Table rows are found by intersecting `getByRole('row')` with `getByLabel(name)`:

```typescript
const locator = this.page
  .getByRole('row')
  .and(this.page.getByLabel(name, { exact: true }))
  .first();
```

### Force Clicks

Navigation links use `click({ force: true })` to bypass actionability checks
when the Electron app's focus state can be unreliable:

```typescript
await this.imagesLink.click({ force: true });
```

## Test Tags

Tags control which tests run in CI:

| Tag               | Meaning                                       |
| ----------------- | --------------------------------------------- |
| `@smoke`          | Core smoke tests — always run                 |
| `@k8s_e2e`        | Kubernetes tests — excluded from default runs |
| `@windows_sanity` | Windows-specific sanity checks                |
| `@macos_sanity`   | macOS-specific sanity checks                  |

Filter with `--grep` / `--grep-invert`:

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @k8s_e2e
```

## CI/CD Patterns

- Tests run from the monorepo root with `xvfb-maybe` on Linux
- Single worker (`workers: 1`) — Electron app is a singleton
- `PODMAN_DESKTOP_BINARY` env var points to the packaged app in CI
- Output directory archived for traces, screenshots, and JUnit results
- Retries configured per-describe: `test.describe.configure({ retries: 2 })`
