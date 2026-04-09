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

import { ContainerState } from '/@/model/core/states';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteContainer, deleteImage, deleteNetwork, isPodmanCliVersionAtLeast } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const defaultNetworkName = 'bridge';
const testNetworkName = 'e2e-test-network';
const testNetworkSubnet = '192.168.1.0/24';
const testContainerName = 'e2e-network-test-container';
const testImageName = 'ghcr.io/linuxcontainers/alpine';

test.skip(
  !isPodmanCliVersionAtLeast('5.7.0'),
  'Skipping network smoke tests since Podman CLI version is less than 5.7.0 or not available',
);

test.describe
  .serial('Network smoke tests', { tag: ['@smoke'] }, () => {
    test.beforeAll(async ({ runner, welcomePage, page }) => {
      runner.setVideoAndTraceName('network-smoke');
      await welcomePage.handleWelcomePage(true);
      await waitForPodmanMachineStartup(page);
    });

    test.afterAll(async ({ runner, page }) => {
      try {
        await deleteContainer(page, testContainerName);
        await deleteNetwork(page, testNetworkName);
        await deleteImage(page, testImageName);
      } finally {
        await runner.close();
      }
    });

    test('Check default network exists', async ({ navigationBar }) => {
      const networksPage = await navigationBar.openNetworks();
      await playExpect(networksPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await networksPage.getNetworkRowByName(defaultNetworkName), { timeout: 30_000 })
        .toBeTruthy();
    });

    test('Create network and verify it exists', async ({ navigationBar }) => {
      let networksPage = await navigationBar.openNetworks();
      await playExpect(networksPage.heading).toBeVisible();

      const networkDetails = await networksPage.createNetwork(testNetworkName, testNetworkSubnet);
      await playExpect(networkDetails.heading).toBeVisible({ timeout: 30_000 });

      networksPage = await navigationBar.openNetworks();
      await playExpect(networksPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
          timeout: 30_000,
        })
        .toBeTruthy();
    });

    test('Pull image for network container test', async ({ navigationBar }) => {
      test.setTimeout(90_000);

      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      await imagesPage.pullImage(testImageName);

      await playExpect
        .poll(async () => await imagesPage.waitForImageExists(testImageName, 60_000), { timeout: 0 })
        .toBeTruthy();
    });

    test('Start container using the network', async ({ navigationBar }) => {
      test.setTimeout(90_000);

      // Open the image and run it on the test network (network already exists from previous test)
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const imageDetails = await imagesPage.openImageDetails(testImageName);
      await playExpect(imageDetails.heading).toBeVisible();

      const runImagePage = await imageDetails.openRunImage();
      await playExpect(runImagePage.heading).toBeVisible();

      await runImagePage.selectUserDefinedNetwork(testNetworkName);
      await runImagePage.startContainer(testContainerName);

      // After startContainer(), alpine's /bin/sh causes the app to navigate to
      // Container Details → Tty tab (interactive shell scenario). Explicitly navigate
      // to the Containers page to verify the container was created.
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      // Wait for container row to appear, then open details and verify it is running
      await playExpect
        .poll(async () => await containersPage.getContainerRowByName(testContainerName), { timeout: 30_000 })
        .toBeTruthy();
      const containerDetails = await containersPage.openContainersDetails(testContainerName);
      await playExpect(containerDetails.heading).toContainText(testContainerName);
      await playExpect
        .poll(async () => await containerDetails.getState(), { timeout: 30_000 })
        .toBe(ContainerState.Running);
    });

    test('Verify container inspect shows correct network', async ({ navigationBar }) => {
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      const containerDetails = await containersPage.openContainersDetails(testContainerName);
      await playExpect(containerDetails.heading).toContainText(testContainerName);

      await playExpect
        .poll(async () => await containerDetails.searchInInspectEditor(testNetworkName), { timeout: 10_000 })
        .toBeTruthy();
    });

    test('Stop and delete the network container', async ({ navigationBar }) => {
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      const containerDetails = await containersPage.openContainersDetails(testContainerName);
      await playExpect(containerDetails.heading).toContainText(testContainerName);

      await containerDetails.stopContainer();
      await playExpect
        .poll(async () => await containerDetails.getState(), { timeout: 30_000 })
        .toBe(ContainerState.Exited);

      const updatedContainersPage = await containerDetails.deleteContainer();
      await playExpect(updatedContainersPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await updatedContainersPage.getContainerRowByName(testContainerName), { timeout: 30_000 })
        .toBeFalsy();
    });

    test('Delete network from networks page and verify it was removed', async ({ navigationBar }) => {
      const networksPage = await navigationBar.openNetworks();
      await playExpect(networksPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
          timeout: 30_000,
        })
        .toBeTruthy();

      await networksPage.deleteNetwork(testNetworkName);
      await playExpect
        .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
          timeout: 30_000,
        })
        .toBeFalsy();
    });

    test('Delete network from details page and verify it was removed', async ({ navigationBar }) => {
      const networksPage = await navigationBar.openNetworks();
      await playExpect(networksPage.heading).toBeVisible();

      const networkDetails = await networksPage.createNetwork(testNetworkName, testNetworkSubnet);
      await playExpect(networkDetails.heading).toBeVisible({ timeout: 30_000 });

      const updatedNetworksPage = await networkDetails.deleteNetwork();
      await playExpect(updatedNetworksPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await updatedNetworksPage.getNetworkRowByName(testNetworkName), {
          timeout: 30_000,
        })
        .toBeFalsy();
    });
  });
