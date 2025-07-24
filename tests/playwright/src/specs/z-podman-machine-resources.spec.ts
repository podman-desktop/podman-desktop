/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import type { Locator } from '@playwright/test';

import { ResourceElementActions } from '../model/core/operations';
import { ResourceElementState } from '../model/core/states';
import { CreateMachinePage } from '../model/pages/create-machine-page';
import { ResourceConnectionCardPage } from '../model/pages/resource-connection-card-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  deletePodmanMachineFromCLI,
  handleConfirmationDialog,
  resetPodmanMachinesFromCLI,
} from '../utility/operations';
import { isLinux, isWindows } from '../utility/platform';
import { waitForPodmanMachineStartup, waitUntil } from '../utility/wait';

const DEFAULT_PODMAN_MACHINE_NAME = 'podman-machine-default';
const RESOURCE_NAME = 'podman';
let dialog: Locator;

const machineTypes = [
  {
    PODMAN_MACHINE_NAME: 'podman-machine-rootless',
    MACHINE_VISIBLE_NAME: 'Podman Machine rootless',
    isRoot: false,
    userNet: false,
  },
  {
    PODMAN_MACHINE_NAME: 'podman-machine-rootful',
    MACHINE_VISIBLE_NAME: 'Podman Machine rootful',
    isRoot: true,
    userNet: false,
  },
  {
    PODMAN_MACHINE_NAME: 'podman-machine-user-networking',
    MACHINE_VISIBLE_NAME: 'Podman Machine user-networking',
    isRoot: true,
    userNet: true,
  },
];

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName(`podman-machine-resources-e2e`);

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  dialog = page.getByRole('dialog', { name: 'Podman', exact: true });

  // Check for default machine and stop
  const settingsBar = await navigationBar.openSettings();
  await settingsBar.resourcesTab.click();

  const resourcesPage = new ResourcesPage(page);
  await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
  const defaultMachineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, DEFAULT_PODMAN_MACHINE_NAME);

  playExpect(await defaultMachineCard.resourceElementConnectionStatus.innerText()).toContain(
    ResourceElementState.Running,
  );
  await defaultMachineCard.performConnectionAction(ResourceElementActions.Stop);
  await waitUntil(
    async () =>
      (await defaultMachineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Off),
    { timeout: 30_000, sendError: true },
  );
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  test.setTimeout(120_000);

  try {
    if (test.info().status === 'failed') {
      await resetPodmanMachinesFromCLI();
      await createPodmanMachineFromCLI();
    }

    const settingsBar = await navigationBar.openSettings();
    await settingsBar.resourcesTab.click();

    const resourcesPage = new ResourcesPage(page);
    await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
    const defaultMachineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, DEFAULT_PODMAN_MACHINE_NAME);

    try {
      playExpect(await defaultMachineCard.resourceElementConnectionStatus.innerText()).toContain(
        ResourceElementState.Off,
      );
      await defaultMachineCard.performConnectionAction(ResourceElementActions.Start);
      await handleConfirmationDialog(page, 'Podman', true, 'Yes');
      await handleConfirmationDialog(page, 'Podman', true, 'OK');
    } catch (error) {
      console.log('No handling dialog displayed', error);
    }

    await waitUntil(
      async () =>
        (await defaultMachineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
      { timeout: 60_000, sendError: true },
    );
  } finally {
    await runner.close();
  }
});

for (const { PODMAN_MACHINE_NAME, MACHINE_VISIBLE_NAME, isRoot, userNet } of machineTypes) {
  test.afterAll(async () => {
    test.setTimeout(60_000);
    if (test.info().status === 'failed') {
      await deletePodmanMachineFromCLI(PODMAN_MACHINE_NAME);
    }
  });

  test.skip(
    isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
    'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
  );

  test.skip(
    PODMAN_MACHINE_NAME === 'podman-machine-user-networking' && !isWindows,
    'Testing user networking machine only on Windows',
  );

  test.describe
    .serial(`${MACHINE_VISIBLE_NAME} Resources workflow Verification`, () => {
      test('Create machine through Resources page', async ({ page, navigationBar }) => {
        test.setTimeout(200_000);

        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const podmanResources = new ResourceConnectionCardPage(page, RESOURCE_NAME);
        await podmanResources.createButton.click();

        const createMachinePage = new CreateMachinePage(page);
        const resourcePage = await createMachinePage.createMachine(PODMAN_MACHINE_NAME, {
          isRootful: isRoot,
          enableUserNet: userNet,
          setAsDefault: false,
          startNow: false,
        });

        await playExpect(resourcePage.heading).toBeVisible();
        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        playExpect(await machineCard.doesResourceElementExist()).toBeTruthy();
        playExpect(await machineCard.resourceElementConnectionStatus.innerText()).toContain(ResourceElementState.Off);
      });

      test('Start the machine', async ({ page }) => {
        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await machineCard.performConnectionAction(ResourceElementActions.Start);

        await playExpect(dialog).toBeVisible({ timeout: 60_000 });
        await handleConfirmationDialog(page, 'Podman', true, 'Yes');
        await handleConfirmationDialog(page, 'Podman', true, 'OK');

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
          { timeout: 30_000, sendError: true },
        );
      });

      test('Restart the machine', async ({ page }) => {
        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await machineCard.performConnectionAction(ResourceElementActions.Restart);

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Off),
          { timeout: 30_000, sendError: true },
        );

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
          { timeout: 30_000, sendError: true },
        );
      });

      test('Stop and delete the machine', async ({ page }) => {
        test.setTimeout(150_000);
        await deletePodmanMachine(page, PODMAN_MACHINE_NAME);

        try {
          await handleConfirmationDialog(page, 'Podman', true, 'Yes');
          await handleConfirmationDialog(page, 'Podman', true, 'OK');
        } catch (error) {
          console.log('No handling dialog displayed', error);
        }
      });
    });
}
