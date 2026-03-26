# Examples

Concrete examples drawn from actual Podman Desktop spec files and POMs.

## Example 1: Minimal Smoke Test Spec

From `welcome-page-smoke.spec.ts` — the simplest spec pattern:

```typescript
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'welcome-podman-desktop' }) });

test.beforeAll(async ({ runner }) => {
  runner.setVideoAndTraceName('welcome-page-e2e');
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial(
  'Basic e2e verification of podman desktop start',
  {
    tag: ['@smoke', '@windows_sanity', '@macos_sanity'],
  },
  () => {
    test('Check the Welcome page is displayed', async ({ welcomePage }) => {
      await playExpect(welcomePage.welcomeMessage).toBeVisible();
    });

    test('Telemetry checkbox is present and set to true', async ({ welcomePage }) => {
      await playExpect(welcomePage.telemetryConsent).toBeVisible();
      await playExpect(welcomePage.telemetryConsent).toBeChecked();
    });

    test('Redirection from Welcome page to Dashboard works', async ({ welcomePage }) => {
      const dashboardPage = await welcomePage.closeWelcomePage();
      await playExpect(dashboardPage.heading).toBeVisible();
    });
  },
);
```

Key points:

- Imports from `/@/utility/fixtures`
- `test.use()` for isolated profile
- `runner.setVideoAndTraceName()` in `beforeAll`
- `runner.close()` in `afterAll`
- `test.describe.serial` with tag array
- Destructures `welcomePage` fixture directly

## Example 2: Full Smoke Test with Podman Machine Setup

From `image-smoke.spec.ts` — standard pattern for tests needing a running engine:

```typescript
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const helloContainer = 'ghcr.io/podmandesktop-ci/hello';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('pull-image-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Image workflow verification', { tag: '@smoke' }, () => {
  test.describe.configure({ retries: 1 });

  test('Pull image', async ({ navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    const updatedImages = await pullImagePage.pullImage(helloContainer);
    await playExpect(updatedImages.heading).toBeVisible({ timeout: 10_000 });

    await playExpect
      .poll(async () => updatedImages.waitForImageExists(helloContainer, 30_000), { timeout: 0 })
      .toBeTruthy();
  });

  test('Delete image', async ({ navigationBar }) => {
    let imagesPage = await navigationBar.openImages();
    const imageDetailPage = await imagesPage.openImageDetails(helloContainer);
    imagesPage = await imageDetailPage.deleteImage();

    await playExpect
      .poll(async () => await imagesPage.waitForImageDelete(helloContainer, 60_000), { timeout: 0 })
      .toBeTruthy();
  });
});
```

Key points:

- `welcomePage.handleWelcomePage(true)` dismisses the welcome screen
- `waitForPodmanMachineStartup(page)` ensures engine is ready
- `test.describe.configure({ retries: 1 })` for flaky-tolerant CI
- POM methods chain: `navigationBar.openImages()` → `imagesPage.openPullImage()` → `pullImagePage.pullImage()`
- `playExpect.poll()` with `{ timeout: 0 }` wraps methods that have their own internal timeout

## Example 3: Concrete Page Object (MainPage Subclass)

Abridged from `images-page.ts`:

```typescript
import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { handleConfirmationDialog } from '/@/utility/operations';
import { waitUntil, waitWhile } from '/@/utility/wait';

import { BuildImagePage } from './build-image-page';
import { ImageDetailsPage } from './image-details-page';
import { MainPage } from './main-page';
import { PullImagePage } from './pull-image-page';

export class ImagesPage extends MainPage {
  readonly pullImageButton: Locator;
  readonly pruneImagesButton: Locator;
  readonly buildImageButton: Locator;

  constructor(page: Page) {
    super(page, 'images');
    this.pullImageButton = this.additionalActions.getByRole('button', { name: 'Pull', exact: true });
    this.pruneImagesButton = this.additionalActions.getByRole('button', { name: 'Prune', exact: true });
    this.buildImageButton = this.additionalActions.getByRole('button', { name: 'Build', exact: true });
  }

  async openPullImage(): Promise<PullImagePage> {
    return test.step('Open pull image page', async () => {
      await waitWhile(() => this.noContainerEngine(), {
        timeout: 50_000,
        message: 'No Container Engine is available, cannot pull an image',
      });
      await this.pullImageButton.click();
      return new PullImagePage(this.page);
    });
  }

  async pullImage(image: string): Promise<ImagesPage> {
    return test.step(`Pull image: ${image}`, async () => {
      const pullImagePage = await this.openPullImage();
      await playExpect(pullImagePage.heading).toBeVisible();
      return await pullImagePage.pullImage(image);
    });
  }

  async openImageDetails(name: string): Promise<ImageDetailsPage> {
    return test.step(`Open image details page for image: ${name}`, async () => {
      const imageRow = await this.getImageRowByName(name);
      if (imageRow === undefined) {
        throw Error(`Image: '${name}' does not exist`);
      }
      const imageRowName = imageRow.getByRole('cell').nth(3);
      await imageRowName.click();
      return new ImageDetailsPage(this.page, name);
    });
  }

  async waitForImageExists(name: string, timeout = 5_000): Promise<boolean> {
    return test.step(`Wait for image: ${name} to exist`, async () => {
      await waitUntil(async () => await this.imageExists(name), { timeout });
      return true;
    });
  }
}
```

Key points:

- Extends `MainPage` with `super(page, 'images')`
- Locators scoped to inherited `this.additionalActions`
- Every method wrapped in `test.step()`
- Uses `waitWhile`/`waitUntil` from project utilities
- Navigation methods return new POM instances
- `handleConfirmationDialog` for modal dialogs

## Example 4: NavigationBar Usage

The `NavigationBar` POM provides navigation to all main pages:

```typescript
// In a test — navigationBar comes from fixtures
test('Navigate to containers', async ({ navigationBar }) => {
  const containersPage = await navigationBar.openContainers();
  await playExpect(containersPage.heading).toBeVisible();
});

// Navigate through multiple pages in sequence
test('Check all main pages', async ({ navigationBar }) => {
  const images = await navigationBar.openImages();
  await playExpect(images.heading).toBeVisible();

  const containers = await navigationBar.openContainers();
  await playExpect(containers.heading).toBeVisible();

  const volumes = await navigationBar.openVolumes();
  await playExpect(volumes.heading).toBeVisible();

  const pods = await navigationBar.openPods();
  await playExpect(pods.heading).toBeVisible();
});
```

Available navigation methods:

- `openDashboard()` → `DashboardPage`
- `openImages()` → `ImagesPage`
- `openContainers()` → `ContainersPage`
- `openPods()` → `PodsPage`
- `openVolumes()` → `VolumesPage`
- `openSettings()` → `SettingsBar`
- `openKubernetes()` → `KubernetesBar`
- `openExtensions()` → `ExtensionsPage`
- `openNetworks()` → `NetworksPage`

## Example 5: Test with Timeouts and Build Resources

From `image-smoke.spec.ts` — building an image with file paths:

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ArchitectureType } from '/@/model/core/platforms';
import { expect as playExpect, test } from '/@/utility/fixtures';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Build image', async ({ navigationBar }) => {
  let imagesPage = await navigationBar.openImages();
  await playExpect(imagesPage.heading).toBeVisible();

  const buildImagePage = await imagesPage.openBuildImage();
  await playExpect(buildImagePage.heading).toBeVisible();

  const dockerfilePath = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
  const contextDirectory = path.resolve(__dirname, '..', '..', 'resources');

  imagesPage = await buildImagePage.buildImage('build-image-test', dockerfilePath, contextDirectory);
  playExpect(await imagesPage.waitForImageExists('docker.io/library/build-image-test')).toBeTruthy();

  const imageDetailsPage = await imagesPage.openImageDetails('docker.io/library/build-image-test');
  await playExpect(imageDetailsPage.heading).toBeVisible();
  imagesPage = await imageDetailsPage.deleteImage();
  playExpect(await imagesPage.waitForImageDelete('docker.io/library/build-image-test')).toBeTruthy();
});

test('Build with target stage', async ({ navigationBar }) => {
  test.setTimeout(180_000);
  // ... similar but with stage parameter
});
```

Key points:

- `__dirname` derived from `import.meta.url` (ESM)
- Resources in `tests/playwright/resources/`
- Path resolution relative to the spec file
- `test.setTimeout()` for long-running operations

## Example 6: Conditional Skipping and Platform Checks

```typescript
import { isLinux, isMac, isCI } from '/@/utility/platform';

// Skip at describe level
test.describe.serial('Compose tests', { tag: '@smoke' }, () => {
  test.skip(isCI && isLinux, 'Compose not available on Linux CI');

  test('deploy compose file', async ({ navigationBar }) => {
    // ...
  });
});

// Skip individual tests
test('macOS-only feature', async ({ page }) => {
  test.skip(!isMac, 'Only runs on macOS');
  // ...
});

// Skip based on env var
test('registry push', async ({ page }) => {
  test.skip(!process.env.REGISTRY_URL, 'No registry configured');
  // ...
});
```

## Example 7: Cleanup Pattern with try/finally

From typical `afterAll` blocks:

```typescript
test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90_000);
  try {
    const imagesPage = await new NavigationBar(page).openImages();
    await imagesPage.deleteAllUnusedImages();
  } catch (error) {
    console.log(`Cleanup error (non-fatal): ${error}`);
  } finally {
    await runner.close();
  }
});
```

`runner.close()` must always be called, even if cleanup fails.

## Example 8: Polling with playExpect.poll

The codebase wraps methods that have internal timeouts with `{ timeout: 0 }`:

```typescript
// The inner method (waitForImageExists) has its own timeout.
// The outer poll with timeout: 0 prevents double-timeout issues.
await playExpect
  .poll(async () => updatedImages.waitForImageExists(helloContainer, 30_000), { timeout: 0 })
  .toBeTruthy();

// Polling for a count to change
await playExpect
  .poll(async () => await imagesPage.countImagesByName('<none>'), { timeout: 60_000 })
  .toBeGreaterThan(baselineCount);
```

## Example 9: DetailsPage Subclass

Pattern for a resource details page:

```typescript
import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { DetailsPage } from './details-page';
import { ImagesPage } from './images-page';

export class ImageDetailsPage extends DetailsPage {
  readonly summaryTab: Locator;
  readonly historyTab: Locator;
  readonly inspectTab: Locator;

  constructor(page: Page, imageName: string) {
    super(page, imageName);
    this.summaryTab = this.tabs.getByRole('link', { name: 'Summary' });
    this.historyTab = this.tabs.getByRole('link', { name: 'History' });
    this.inspectTab = this.tabs.getByRole('link', { name: 'Inspect' });
  }

  async deleteImage(): Promise<ImagesPage> {
    return test.step('Delete image from details', async () => {
      const deleteButton = this.controlActions.getByRole('button', { name: 'Delete Image' });
      await playExpect(deleteButton).toBeEnabled();
      await deleteButton.click();
      await handleConfirmationDialog(this.page);
      return new ImagesPage(this.page);
    });
  }
}
```

Key points:

- Extends `DetailsPage` with resource name
- Tab locators scoped to inherited `this.tabs`
- Action buttons scoped to inherited `this.controlActions`
- Returns parent list page POM after destructive actions

## Example 10: Using test.use for Custom Runner Options

```typescript
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

// Disable specific extensions for this test file
test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'extension-test',
    extensionsDisabled: ['compose', 'kind'],
    autoUpdate: false,
    autoCheckUpdates: false,
  }),
});

// Tests in this file get an isolated Podman Desktop profile
// with compose and kind extensions disabled
```
