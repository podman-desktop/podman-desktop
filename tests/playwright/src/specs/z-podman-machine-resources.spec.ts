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

import { ResourceElementActions } from '/@/model/core/operations';
import { ContainerState, ResourceElementState } from '/@/model/core/states';
import type { ContainerInteractiveParams } from '/@/model/core/types';
import { PodmanMachinePrivileges, PodmanVirtualizationProviders } from '/@/model/core/types';
import { CreateMachinePage } from '/@/model/pages/create-machine-page';
import { PodmanMachineDetails } from '/@/model/pages/podman-machine-details-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deleteContainer,
  deletePodmanMachine,
  handlePodmanConfirmationDialogs,
  resetPodmanMachinesFromCLI,
  verifyMachinePrivileges,
  verifyVirtualizationProvider,
} from '/@/utility/operations';
import { isCI, isLinux, isMac, isWindows } from '/@/utility/platform';
import { getDefaultVirtualizationProvider, getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup, waitUntil } from '/@/utility/wait';

const DEFAULT_PODMAN_MACHINE_NAME = 'podman-machine-default';
const RESOURCE_NAME = 'podman';
const IMAGE_TO_PULL = 'ghcr.io/linuxcontainers/alpine';
const IMAGE_TAG = 'latest';
const CONTAINER_START_PARAMS: ContainerInteractiveParams = { attachTerminal: true, interactive: true };

// Timeout constants
const TIMEOUT_SHORT = 30_000;
const TIMEOUT_MEDIUM = 60_000;
const TIMEOUT_LONG = 120_000;
const TIMEOUT_MACHINE_CREATION = 200_000;
const TIMEOUT_MACHINE_DELETION = 150_000;

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
    PODMAN_MACHINE_NAME: 'podman-machine-usermode',
    MACHINE_VISIBLE_NAME: 'Podman Machine usermode',
    isRoot: true,
    userNet: true,
  },
];

test.skip(
  isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
  'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
);

test.skip(
  getVirtualizationProvider() === PodmanVirtualizationProviders.HyperV,
  'Podman Desktop is not able to have 2 HyperV machines running at the same time',
);

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName('podman-machine-resources-e2e');

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
    { timeout: TIMEOUT_SHORT, sendError: true },
  );
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  test.setTimeout(TIMEOUT_LONG);

  try {
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
      await handlePodmanConfirmationDialogs(page);
    } catch (error) {
      console.log('No handling dialog displayed', error);
    }

    await waitUntil(
      async () =>
        (await defaultMachineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
      { timeout: TIMEOUT_MEDIUM, sendError: true },
    );
  } finally {
    await runner.close();
  }
});

// eslint-disable-next-line no-empty-pattern
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Test "${testInfo.title}" has status ${testInfo.status}... Performing podman machine cleanup`);

    try {
      await resetPodmanMachinesFromCLI();
      await createPodmanMachineFromCLI();
      await waitForPodmanMachineStartup(page);
    } catch (error) {
      console.log('Error occurred while resetting podman machines', error);
    }
  }
});

for (const { PODMAN_MACHINE_NAME, MACHINE_VISIBLE_NAME, isRoot, userNet } of machineTypes) {
  test.describe
    .serial(`${MACHINE_VISIBLE_NAME} Resources workflow Verification`, { tag: '@pdmachine' }, () => {
      test.skip(
        PODMAN_MACHINE_NAME === 'podman-machine-usermode' && !isWindows,
        'Testing user networking machine only on Windows',
      );

      test('Create machine through Resources page', async ({ page, navigationBar }) => {
        test.setTimeout(TIMEOUT_MACHINE_CREATION);

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
          virtualizationProvider: getVirtualizationProvider(),
        });

        await playExpect(resourcePage.heading).toBeVisible();
        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await verifyMachinePrivileges(
          machineCard,
          isRoot ? PodmanMachinePrivileges.Rootful : PodmanMachinePrivileges.Rootless,
        );
        await verifyVirtualizationProvider(
          machineCard,
          getVirtualizationProvider() ?? getDefaultVirtualizationProvider(),
        );
        playExpect(await machineCard.doesResourceElementExist()).toBeTruthy();
        playExpect(await machineCard.resourceElementConnectionStatus.innerText()).toContain(ResourceElementState.Off);
      });

      test('Start the machine', async ({ page }) => {
        test.setTimeout(TIMEOUT_MACHINE_CREATION);
        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await machineCard.performConnectionAction(ResourceElementActions.Start);

        await playExpect(dialog).toBeVisible({ timeout: TIMEOUT_LONG });
        await handlePodmanConfirmationDialogs(page);

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
          { timeout: TIMEOUT_SHORT, sendError: true },
        );
      });

      test('container status recovers after editing machine resources', async ({ page, navigationBar }) => {
        test.setTimeout(TIMEOUT_MACHINE_CREATION);
        // Editing machine memory is only offered on macOS and Hyper-V: the property carries
        // `when: podman.podmanMachineEditMemorySupported`, set from `isMac || isHyperVMachine`.
        // On WSL the Edit form opens but never renders the Memory slider.
        test.skip(
          !isMac && getVirtualizationProvider() !== PodmanVirtualizationProviders.HyperV,
          'Editing machine memory requires macOS or Hyper-V',
        );

        const containerName = `${PODMAN_MACHINE_NAME}-resource-edit`;

        // The previous test only asserted the machine card reads Running; the container
        // engine connection attaches asynchronously after that, and pulling before it is
        // ready fails with "no running provider".
        await waitForPodmanMachineStartup(page);

        // Start a container so there is something running before the machine is edited.
        // Pull and run are kept separate, with a wait for the image to register in
        // between: pullImageAndRun clicks Run as soon as the pull reports done, and on a
        // machine created seconds ago the Run form is not ready for it yet.
        let images = await navigationBar.openImages();
        const pullImagePage = await images.openPullImage();
        images = await pullImagePage.pullImage(IMAGE_TO_PULL, IMAGE_TAG);
        await playExpect
          .poll(async () => await images.waitForImageExists(IMAGE_TO_PULL), { timeout: TIMEOUT_MEDIUM })
          .toBeTruthy();

        const imageDetails = await images.openImageDetails(IMAGE_TO_PULL);
        const runImagePage = await imageDetails.openRunImage();
        await runImagePage.startContainer(containerName, CONTAINER_START_PARAMS);

        let containers = await navigationBar.openContainers();
        await playExpect(containers.heading).toBeVisible({ timeout: TIMEOUT_SHORT });
        await playExpect
          .poll(async () => await containers.containerExists(containerName), { timeout: TIMEOUT_MEDIUM })
          .toBeTruthy();

        let containerDetails = await containers.openContainersDetails(containerName);
        await playExpect
          .poll(async () => await containerDetails.getState(), { timeout: TIMEOUT_SHORT })
          .toContain(ContainerState.Running);

        // Edit the machine's memory through Settings > Resources > Edit, which restarts the machine
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.resourcesTab.click();

        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await playExpect(machineCard.resourceElement).toBeVisible({ timeout: TIMEOUT_SHORT });
        await machineCard.performConnectionAction(ResourceElementActions.Edit);

        const podmanMachineDetails = new PodmanMachineDetails(page, PODMAN_MACHINE_NAME);
        await podmanMachineDetails.editMachineMemory();

        // Wait for the machine to stop and restart
        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
          { timeout: TIMEOUT_LONG, sendError: true },
        );

        // Start a container and check the Containers page reflects it
        containers = await navigationBar.openContainers();
        await playExpect(containers.heading).toBeVisible({ timeout: TIMEOUT_SHORT });
        await containers.startContainer(containerName);

        containerDetails = await containers.openContainersDetails(containerName);
        await playExpect
          .poll(async () => await containerDetails.getState(), { timeout: TIMEOUT_MEDIUM })
          .toContain(ContainerState.Running);

        // Leave the machine quiet: the next test in this serial block restarts it and
        // allows TIMEOUT_SHORT to reach Off, which a running container does not fit into.
        await deleteContainer(page, containerName);

        // Leave the app where this test found it. The tests in this serial block do not
        // navigate: they build a ResourceConnectionCardPage and act on it, so they only
        // work while Settings > Resources is still open.
        const resourcesBar = await navigationBar.openSettings();
        await resourcesBar.resourcesTab.click();
      });

      test('Restart the machine', async ({ page }) => {
        test.skip(
          isCI && userNet,
          'Restarting podman machine is flaky in cicd pipeline with usermode networking. This issue is tracked in https://github.com/podman-desktop/podman-desktop/issues/15889',
        );

        const machineCard = new ResourceConnectionCardPage(page, RESOURCE_NAME, PODMAN_MACHINE_NAME);
        await machineCard.performConnectionAction(ResourceElementActions.Restart);

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Off),
          { timeout: TIMEOUT_SHORT, sendError: true },
        );

        await waitUntil(
          async () =>
            (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
          { timeout: TIMEOUT_SHORT, sendError: true },
        );
      });

      test('Stop and delete the machine', async ({ page }) => {
        test.setTimeout(TIMEOUT_MACHINE_DELETION);
        await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
        await handlePodmanConfirmationDialogs(page);
      });
    });
}
