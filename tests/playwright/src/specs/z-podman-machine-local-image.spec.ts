/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ResourceElementActions } from '/@/model/core/operations';
import { ResourceElementState } from '/@/model/core/states';
import { CreateMachinePage } from '/@/model/pages/create-machine-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  handlePodmanConfirmationDialogs,
  resetPodmanMachinesFromCLI,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup, waitUntil } from '/@/utility/wait';

const RESOURCE_NAME = 'podman';
const DEFAULT_PODMAN_MACHINE_NAME = 'podman-machine-default';
const LOCAL_IMAGE_MACHINE_NAME = 'podman-machine-local-image';

// Resolve the airgap asset path relative to the repository root.
// This file lives at tests/playwright/src/specs/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const AIRGAP_ASSETS_DIR = path.join(REPO_ROOT, 'extensions/podman/packages/extension/assets');
const AIRGAP_IMAGE_ARCH = process.arch === 'arm64' ? 'arm64' : 'x64';
const AIRGAP_IMAGE_PATH = path.join(AIRGAP_ASSETS_DIR, `podman-image-${AIRGAP_IMAGE_ARCH}.zst`);

// Externally downloaded image path provided via environment variable.
const EXTERNAL_IMAGE_PATH = process.env.MACHINE_IMAGE_PATH ?? '';

const TIMEOUT_MEDIUM = 30_000;
const TIMEOUT_LONG = 60_000;
const TIMEOUT_MACHINE_CREATION = 360_000;
const TIMEOUT_AFTER_ALL = 180_000;

const enableUserNet = process.env.PODMAN_NETWORKING === '1';
const baseSkipCondition = isLinux || process.env.TEST_PODMAN_MACHINE !== 'true';

const scenarios = [
  {
    name: 'airgap-embedded image',
    imagePath: AIRGAP_IMAGE_PATH,
    shouldSkip: baseSkipCondition || !existsSync(AIRGAP_IMAGE_PATH),
    skipReason: `Skipped: requires non-Linux platform, TEST_PODMAN_MACHINE=true, and airgap image at ${AIRGAP_IMAGE_PATH}`,
  },
  {
    name: 'externally provided image path',
    imagePath: EXTERNAL_IMAGE_PATH,
    shouldSkip: baseSkipCondition || !EXTERNAL_IMAGE_PATH,
    skipReason:
      'Skipped: requires non-Linux platform, TEST_PODMAN_MACHINE=true, and MACHINE_IMAGE_PATH env var to be set',
  },
];

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(TIMEOUT_AFTER_ALL);
  runner.setVideoAndTraceName('podman-machine-local-image-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);

  const settingsBar = await navigationBar.openSettings();
  await settingsBar.resourcesTab.click();

  const resourcesPage = new ResourcesPage(page);
  await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
  const defaultMachineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, DEFAULT_PODMAN_MACHINE_NAME);

  playExpect(await defaultMachineCard.resourceElementConnectionStatus.innerText()).toContain(
    ResourceElementState.Running,
  );
  // Stop the default machine before creating a second one. Creating with startNow: false and
  // starting explicitly later also makes the "not the default machine" dialog deterministic.
  await defaultMachineCard.performConnectionAction(ResourceElementActions.Stop);
  await waitUntil(
    async () =>
      (await defaultMachineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Off),
    { timeout: TIMEOUT_LONG, sendError: true },
  );

  await deletePodmanMachine(page, LOCAL_IMAGE_MACHINE_NAME);
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  test.setTimeout(TIMEOUT_AFTER_ALL);

  try {
    if (test.info().status === 'failed') {
      // Reset any machines left in a broken state before recreating the default.
      await resetPodmanMachinesFromCLI();
      await createPodmanMachineFromCLI();
      await waitForPodmanMachineStartup(page);
    } else {
      // Restore the default machine that was stopped in beforeAll so subsequent
      // suites in the same CI run have a clean running environment.
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.resourcesTab.click();

      const resourcesPage = new ResourcesPage(page);
      await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
      const defaultMachineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, DEFAULT_PODMAN_MACHINE_NAME);

      playExpect(await defaultMachineCard.resourceElementConnectionStatus.innerText()).toContain(
        ResourceElementState.Off,
      );
      await defaultMachineCard.performConnectionAction(ResourceElementActions.Start);
      await handlePodmanConfirmationDialogs(page);

      await waitUntil(
        async () =>
          (await defaultMachineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
        { timeout: TIMEOUT_LONG, sendError: true },
      );
    }
  } finally {
    await runner.close();
  }
});

for (const scenario of scenarios) {
  test.describe(`Podman machine creation with ${scenario.name}`, { tag: ['@pdmachine'] }, () => {
    test.describe.configure({ mode: 'serial' });

    test.skip(scenario.shouldSkip, scenario.skipReason);

    test(`Create podman machine using ${scenario.name}`, async ({ page, navigationBar }) => {
      test.setTimeout(TIMEOUT_MACHINE_CREATION + TIMEOUT_MEDIUM);

      await test.step('Navigate to Resources and open machine creation page', async () => {
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const resourcesPage = new ResourcesPage(page);
        await playExpect(resourcesPage.heading).toBeVisible();
        await playExpect
          .poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME), {
            timeout: TIMEOUT_MEDIUM,
          })
          .toBeTruthy();

        const podmanResources = new ResourceConnectionCardPage(page, RESOURCE_NAME);
        await podmanResources.createButton.click();
      });

      await test.step(`Create machine without starting (image: ${scenario.imagePath})`, async () => {
        const createMachinePage = new CreateMachinePage(page);
        const resourcesPage = await createMachinePage.createMachine(LOCAL_IMAGE_MACHINE_NAME, {
          isRootful: true,
          enableUserNet,
          startNow: false,
          setAsDefault: false,
          virtualizationProvider: getVirtualizationProvider(),
          imagePath: scenario.imagePath,
          timeout: TIMEOUT_MACHINE_CREATION,
        });

        await playExpect(resourcesPage.heading).toBeVisible();

        // Connection registration is async after create completes. Poll for the
        // card, and refresh Resources once if the provider list is still stale.
        let machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, LOCAL_IMAGE_MACHINE_NAME);
        await waitUntil(async () => await machineCard.doesResourceElementExist(), {
          timeout: TIMEOUT_MEDIUM,
          sendError: false,
        });

        if (!(await machineCard.doesResourceElementExist())) {
          await navigationBar.openDashboard();
          const settingsBar = await navigationBar.openSettings();
          await settingsBar.resourcesTab.click();
          await playExpect(resourcesPage.heading).toBeVisible();
          machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, LOCAL_IMAGE_MACHINE_NAME);
        }

        await playExpect(machineCard.resourceElement).toBeVisible({ timeout: TIMEOUT_MEDIUM });
        await playExpect(machineCard.resourceElementConnectionStatus).toHaveText(ResourceElementState.Off, {
          timeout: TIMEOUT_MEDIUM,
        });
      });
    });

    test(`Start machine created from ${scenario.name}`, async ({ page }) => {
      test.setTimeout(TIMEOUT_MACHINE_CREATION);

      const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, LOCAL_IMAGE_MACHINE_NAME);
      await machineCard.performConnectionAction(ResourceElementActions.Start);

      const dialog = page.getByRole('dialog', { name: 'Podman', exact: true });
      await playExpect(dialog).toBeVisible({ timeout: TIMEOUT_LONG });
      await handlePodmanConfirmationDialogs(page);

      await playExpect(machineCard.resourceElementConnectionStatus).toHaveText(ResourceElementState.Running, {
        timeout: TIMEOUT_MACHINE_CREATION,
      });
    });

    test(`Delete machine created from ${scenario.name}`, async ({ page }) => {
      test.setTimeout(TIMEOUT_AFTER_ALL);
      await deletePodmanMachine(page, LOCAL_IMAGE_MACHINE_NAME);
      await handlePodmanConfirmationDialogs(page);
    });
  });
}
