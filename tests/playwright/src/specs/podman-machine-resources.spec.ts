/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { CreateMachinePage } from '../model/pages/create-machine-page';
import { PodmanMachineDetails } from '../model/pages/podman-machine-details-page';
import { ResourceConnectionCardPage } from '../model/pages/resource-connection-card-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  deletePodmanMachineFromCLI,
  handleConfirmationDialog,
} from '../utility/operations';
import { isLinux, isWindows } from '../utility/platform';
import { waitForPodmanMachineStartup } from '../utility/wait';

const DEFAULT_PODMAN_MACHINE = 'Podman Machine';
const DEFAULT_PODMAN_MACHINE_VISIBLE = 'podman-machine-default';
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

for (const { PODMAN_MACHINE_NAME, MACHINE_VISIBLE_NAME, isRoot, userNet } of machineTypes) {
  test.skip(
    isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
    'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
  );

  test.skip(
    PODMAN_MACHINE_NAME === 'podman-machine-user-networking' && !isWindows,
    'Testing user networking machine only on Windows',
  );

  test.beforeAll(async ({ runner, welcomePage, page }) => {
    runner.setVideoAndTraceName(`${PODMAN_MACHINE_NAME}-resources-e2e`);
    process.env.KEEP_TRACES_ON_PASS = 'true';

    await welcomePage.handleWelcomePage(true);
    await waitForPodmanMachineStartup(page);
    dialog = page.getByRole('dialog', { name: 'Podman', exact: true });
  });

  test.afterAll(async ({ runner, page }) => {
    test.setTimeout(120_000);

    if (test.info().status === 'failed') {
      await deletePodmanMachineFromCLI(PODMAN_MACHINE_NAME);
      await createPodmanMachineFromCLI();
    }

    try {
      await handleConfirmationDialog(page, 'Podman', true, 'Yes');
      await handleConfirmationDialog(page, 'Podman', true, 'OK');
    } catch (error) {
      console.log('No handling dialog displayed', error);
    }

    await runner.close();
  });

  test.describe
    .serial(`${MACHINE_VISIBLE_NAME} Resources creation Verification`, () => {
      test('Check data for available Podman Machine and stop machine', async ({ page, navigationBar }) => {
        test.setTimeout(120_000);
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const resourcesPage = new ResourcesPage(page);
        await playExpect(resourcesPage.heading).toBeVisible();
        await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
        const resourcesPodmanConnections = new ResourceConnectionCardPage(
          page,
          RESOURCE_NAME,
          DEFAULT_PODMAN_MACHINE_VISIBLE,
        );

        await playExpect(resourcesPodmanConnections.resourceElementDetailsButton).toBeVisible({ timeout: 10_000 });
        await resourcesPodmanConnections.resourceElementDetailsButton.click();

        const podmanMachineDetails = new PodmanMachineDetails(page, DEFAULT_PODMAN_MACHINE);

        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('RUNNING', { timeout: 60_000 });
        await playExpect(podmanMachineDetails.podmanMachineStopButton).toBeEnabled();
        await podmanMachineDetails.podmanMachineStopButton.click();
        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('OFF', { timeout: 60_000 });
      });

      test('Create a machine through Resources page', async ({ page, navigationBar }) => {
        test.setTimeout(200_000);

        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const podmanResources = new ResourceConnectionCardPage(page, 'podman');
        await podmanResources.createButton.click();

        const createMachinePage = new CreateMachinePage(page);
        const resourcePage = await createMachinePage.createMachine(PODMAN_MACHINE_NAME, {
          isRootful: isRoot,
          enableUserNet: userNet,
          setAsDefault: false,
          startNow: false,
        });

        await playExpect(resourcePage.heading).toBeVisible();
        const machineBox = new ResourceConnectionCardPage(page, 'podman', PODMAN_MACHINE_NAME); //does not work with visible name

        await playExpect(machineBox.resourceElementDetailsButton).toBeVisible({ timeout: 30_000 });
        await machineBox.resourceElementDetailsButton.click();

        const podmanMachineDetails = new PodmanMachineDetails(page, MACHINE_VISIBLE_NAME);
        await playExpect(podmanMachineDetails.podmanMachineName).toBeVisible({ timeout: 30_000 });
        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('OFF');

        await playExpect(podmanMachineDetails.podmanMachineStartButton).toBeEnabled();
        await podmanMachineDetails.podmanMachineStartButton.click();

        await playExpect(dialog).toBeVisible({ timeout: 60_000 });
        await handleConfirmationDialog(page, 'Podman', true, 'Yes');
        await handleConfirmationDialog(page, 'Podman', true, 'OK');

        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('RUNNING', { timeout: 90_000 });

        await playExpect(podmanMachineDetails.podmanMachineStopButton).toBeEnabled();
        await podmanMachineDetails.podmanMachineStopButton.click();
        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('OFF', { timeout: 60_000 });
      });

      test('Restart default podman machine', async ({ page, navigationBar }) => {
        const dashboard = await navigationBar.openDashboard();
        await playExpect(dashboard.heading).toBeVisible();
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const resourcesPage = new ResourcesPage(page);
        await playExpect(resourcesPage.heading).toBeVisible();
        await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
        const resourcesPodmanConnections = new ResourceConnectionCardPage(
          page,
          RESOURCE_NAME,
          DEFAULT_PODMAN_MACHINE_VISIBLE,
        );
        await playExpect(resourcesPodmanConnections.resourceElementDetailsButton).toBeVisible();
        await resourcesPodmanConnections.resourceElementDetailsButton.click();

        const podmanMachineDetails = new PodmanMachineDetails(page, DEFAULT_PODMAN_MACHINE);

        await playExpect(podmanMachineDetails.podmanMachineStartButton).toBeEnabled();
        await podmanMachineDetails.podmanMachineStartButton.click();

        await playExpect(dialog).toBeVisible({ timeout: 60_000 });
        await handleConfirmationDialog(page, 'Podman', true, 'Yes');
        await handleConfirmationDialog(page, 'Podman', true, 'OK');

        await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('RUNNING', { timeout: 90_000 });
      });

      test('Clean up test machine', async ({ page }) => {
        test.setTimeout(150_000);
        await deletePodmanMachine(page, PODMAN_MACHINE_NAME);

        try {
          await handleConfirmationDialog(page, 'Podman', true, 'Yes');
          await handleConfirmationDialog(page, 'Podman', true, 'OK');
        } catch (error) {
          console.log('No handing dialog displayed', error);
        }
      });
    });
}
