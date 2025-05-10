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

import { ResourceElementState } from '../model/core/states';
import { CreateMachinePage } from '../model/pages/create-machine-page';
import { ResourceConnectionCardPage } from '../model/pages/resource-connection-card-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { SettingsBar } from '../model/pages/settings-bar';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import { deletePodmanMachine, ensureCliInstalled, setStatusBarProvidersFeature } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const podmanProviderName = 'Podman';
const defaultMachine = 'podman-machine-default';
const newMachineName = 'podman-machine-new';
const kindProviderName = 'Kind';
const kindClusterName: string = 'kind-cluster';
const kindNode: string = `${kindClusterName}-control-plane`;
const skipKindInstall = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName('status-bar-providers-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);

  if (!skipKindInstall) {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.cliToolsTab.click();
    await ensureCliInstalled(page, 'Kind');
  }
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  if (test.info().status === 'failed') {
    await setStatusBarProvidersFeature(page, navigationBar, false);
    await deleteCluster(page, 'kind', kindNode, kindClusterName);
    await deletePodmanMachine(page, newMachineName);
  }
  await runner.close();
});

test.describe.serial('Status bar providers feature verification', { tag: '@smoke' }, () => {
  test('Enable status bar providers experimental feature', async ({ navigationBar, page }) => {
    await setStatusBarProvidersFeature(page, navigationBar, true);
  });
  test('Verify default Podman provider in status bar', async ({ statusBar }) => {
    const podmanStatusBarProviderButton = await statusBar.getProviderButton(podmanProviderName);
    await playExpect(podmanStatusBarProviderButton).toBeVisible();
  });
  test('Verify clicking on provider', async ({ statusBar, page }) => {
    const podmanStatusBarProviderButton = await statusBar.getProviderButton(podmanProviderName);
    await podmanStatusBarProviderButton.click();
    const resourcesPage = new ResourcesPage(page);
    await playExpect(resourcesPage.heading).toBeVisible();
  });
  test('Verify provider pinning', async ({ statusBar }) => {
    await statusBar.pinProvider(podmanProviderName, false);
    await statusBar.pinProvider(podmanProviderName, true);
  });
  test('Verify hovering podman provider shows machine status', async ({ statusBar }) => {
    playExpect(await statusBar.isProviderResourceRunning(podmanProviderName, defaultMachine)).toBeTruthy();
  });
  test('Create and delete new resource and verify providers updated', async ({ page, statusBar }) => {
    test.setTimeout(300_000);

    //Create a new machine
    const settingsBar = new SettingsBar(page);
    await settingsBar.resourcesTab.click();
    const podmanResources = new ResourceConnectionCardPage(page, 'podman');
    await podmanResources.createButton.click();
    const createMachinePage = new CreateMachinePage(page);
    await createMachinePage.createMachine(newMachineName, { startNow: true, setAsDefault: false });

    const machineCard = new ResourceConnectionCardPage(page, 'podman', newMachineName);
    playExpect(await machineCard.doesResourceElementExist()).toBeTruthy();
    playExpect(await machineCard.resourceElementConnectionStatus.innerText()).toContain(ResourceElementState.Running);

    playExpect(await statusBar.isProviderResourceRunning(podmanProviderName, newMachineName)).toBeTruthy();

    await deletePodmanMachine(page, newMachineName);

    playExpect(await statusBar.isProviderResourceRunning(podmanProviderName, newMachineName)).toBeFalsy();
  });
  test('Create new provider (Kind) and verify providers updated', async ({ page, statusBar }) => {
    if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
      await createKindCluster(page, kindClusterName, false, 300_000, {
        providerType: providerTypeGHA,
        useIngressController: false,
      });
    } else {
      await createKindCluster(page, kindClusterName, true, 300_000);
    }

    //Verify its not pinned by default
    const kindStatusBarProviderButton = await statusBar.getProviderButton(kindProviderName);
    await playExpect(kindStatusBarProviderButton).not.toBeVisible();

    await statusBar.pinProvider(kindProviderName, true);
    playExpect(await statusBar.isProviderResourceRunning(kindProviderName, kindClusterName)).toBeTruthy();
  });
  test('Disable status bar providers feature', async ({ page, navigationBar, statusBar }) => {
    await setStatusBarProvidersFeature(page, navigationBar, false);
    await playExpect(statusBar.pinProvidersButton).not.toBeVisible();
  });
});
