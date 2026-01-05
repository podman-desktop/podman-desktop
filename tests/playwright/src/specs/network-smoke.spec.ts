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

import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteNetwork, isPodmanCliVersionAtLeast } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const defaultNetworkName = 'bridge';
const testNetworkName = 'e2e-test-network';
const testNetworkSubnet = '10.89.0.0/24';

test.describe.serial('Network smoke tests', { tag: ['@smoke'] }, () => {
  test.skip(
    !isPodmanCliVersionAtLeast('5.7.0'),
    'Skipping network smoke tests since Podman CLI version is less than 5.7.0 or not available',
  );

  test.beforeAll(async ({ runner, welcomePage, page }) => {
    runner.setVideoAndTraceName('network-smoke');
    await welcomePage.handleWelcomePage(true);
    await waitForPodmanMachineStartup(page);
  });

  test.afterAll(async ({ runner, page }) => {
    try {
      await deleteNetwork(page, testNetworkName);
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

    networksPage = await networksPage.createNetwork(testNetworkName, testNetworkSubnet);
    await playExpect(networksPage.heading).toBeVisible({ timeout: 30_000 });

    await playExpect
      .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
        timeout: 30_000,
      })
      .toBeTruthy();
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
    let networksPage = await navigationBar.openNetworks();
    await playExpect(networksPage.heading).toBeVisible();

    networksPage = await networksPage.createNetwork(testNetworkName, testNetworkSubnet);
    await playExpect(networksPage.heading).toBeVisible({ timeout: 30_000 });

    await playExpect
      .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
        timeout: 30_000,
      })
      .toBeTruthy();

    const networkDetails = await networksPage.openNetworkDetails(testNetworkName);
    await playExpect(networkDetails.heading).toBeVisible();

    networksPage = await networkDetails.deleteNetwork();
    await playExpect(networksPage.heading).toBeVisible();

    await playExpect
      .poll(async () => await networksPage.getNetworkRowByName(testNetworkName), {
        timeout: 30_000,
      })
      .toBeFalsy();
  });
});
