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

import { ResourceElementState } from '/@/model/core/states';
import { PodmanMachinePrivileges, PodmanVirtualizationProviders } from '/@/model/core/types';
import { CreateMachinePage } from '/@/model/pages/create-machine-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { SettingsBar } from '/@/model/pages/settings-bar';
import { canRunKindTests } from '/@/setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '/@/utility/cluster-operations';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  deletePodmanMachine,
  ensureCliInstalled,
  handleConfirmationDialog,
  setStatusBarProvidersFeature,
  verifyMachinePrivileges,
  verifyVirtualizationProvider,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { getDefaultVirtualizationProvider, getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup, waitUntil } from '/@/utility/wait';

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
    await deletePodmanMachine(page, newMachineName);
  }
  await deleteCluster(page, 'kind', kindNode, kindClusterName);
  await runner.close();
});

test.describe.serial('Status bar providers feature verification', { tag: '@k8s_e2e' }, () => {
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
    if (isLinux) {
      await playExpect
        .poll(async () => await statusBar.isProviderResourceRunning(podmanProviderName, podmanProviderName))
        .toBeTruthy();
    } else {
      await playExpect
        .poll(async () => await statusBar.isProviderResourceRunning(podmanProviderName, defaultMachine))
        .toBeTruthy();
    }
  });
  test('Create and delete new resource and verify providers updated', async ({ page, statusBar }) => {
    test.skip(isLinux, 'Not creating new machine on Linux');
    test.skip(
      getVirtualizationProvider() === PodmanVirtualizationProviders.HyperV,
      'Podman Desktop is not able to have 2 HyperV machines running at the same time',
    );
    test.setTimeout(350_000);

    //Create a new machine
    const settingsBar = new SettingsBar(page);
    await settingsBar.resourcesTab.click();
    const podmanResources = new ResourceConnectionCardPage(page, 'podman');
    await podmanResources.createButton.click();
    const createMachinePage = new CreateMachinePage(page);
    await createMachinePage.createMachine(newMachineName, {
      startNow: true,
      setAsDefault: false,
      virtualizationProvider: getVirtualizationProvider(),
    });

    const machineCard = new ResourceConnectionCardPage(page, 'podman', newMachineName);
    playExpect(await machineCard.doesResourceElementExist()).toBeTruthy();
    await waitUntil(
      async () =>
        (await machineCard.resourceElementConnectionStatus.innerText()).includes(ResourceElementState.Running),
      { timeout: 30_000, sendError: true },
    );

    await verifyMachinePrivileges(machineCard, PodmanMachinePrivileges.Rootful); //default privileges

    await verifyVirtualizationProvider(machineCard, getVirtualizationProvider() ?? getDefaultVirtualizationProvider());

    playExpect(await statusBar.isProviderResourceRunning(podmanProviderName, newMachineName)).toBeTruthy();

    await deletePodmanMachine(page, newMachineName);
    try {
      await handleConfirmationDialog(page, 'Podman', true, 'Yes');
      await handleConfirmationDialog(page, 'Podman', true, 'OK');
    } catch (error) {
      console.log('No handling dialog displayed', error);
    }

    playExpect(await statusBar.isProviderResourceRunning(podmanProviderName, newMachineName)).toBeFalsy();
  });
  test('Create new provider (Kind) and verify providers updated', async ({ page, statusBar }) => {
    test.skip(!canRunKindTests(), `This test can't run on a windows rootless machine`);
    test.setTimeout(600_000);
    await createKindCluster(page, kindClusterName, 550_000, {
      providerType: providerTypeGHA,
      useIngressController: false,
    });

    //Verify its not pinned by default
    const kindStatusBarProviderButton = await statusBar.getProviderButton(kindProviderName);
    await playExpect(kindStatusBarProviderButton).not.toBeVisible();

    await statusBar.pinProvider(kindProviderName, true);
    await playExpect
      .poll(async () => await statusBar.isProviderResourceRunning(kindProviderName, kindClusterName))
      .toBeTruthy();
  });
  test('Disable status bar providers feature', async ({ page, navigationBar, statusBar }) => {
    await setStatusBarProvidersFeature(page, navigationBar, false);
    await playExpect(statusBar.pinProvidersButton).not.toBeVisible();
  });
});
