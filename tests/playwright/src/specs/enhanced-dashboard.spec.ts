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

import type { Page } from '@playwright/test';

import { ResourceElementActions } from '/@/model/core/operations';
import { ResourceElementState, SystemOverviewState } from '/@/model/core/states';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import type { NavigationBar } from '/@/model/workbench/navigation';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  resetPodmanMachinesFromCLI,
  setEnhancedDashboardFeature,
  waitForDashboardState,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const PODMAN_MACHINE_NAME: string = 'podman-machine-default';
const PODMAN_MACHINE_VISIBLE_NAME: string = 'Podman Machine';
const CUSTOM_K8S_DUMMY_RESOURCE_EXTENSION: string = 'quay.io/rh-ee-davillan/pd-dummy-k8s-extension';
const DUMMY_K8S_RESOURCE_NAME: string = 'pd-dummy-k8s';
const DUMMY_K8S_EXTENSION_LABEL: string = 'you.pd-dummy-k8s';
const DUMMY_K8S_EXTENSION_NAME: string = 'Dummy Resources';
const DUMMY_CLUSTER_NAME: string = 'dummy-cluster';

const TIMEOUT_SHORT = 10_000;
const TIMEOUT_STANDARD = 30_000;
const TIMEOUT_SETUP = 120_000;
const PODMAN_MACHINE_STARTUP_TIMEOUT = 300_000;
const TIMEOUT_CREATE_MACHINE_TEST = 320_000;

test.skip(
  isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
  'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
);

test.beforeAll(async ({ runner, welcomePage, page }) => {
  test.setTimeout(TIMEOUT_SETUP);
  runner.setVideoAndTraceName('enhanced-dashboard-e2e');
  await welcomePage.handleWelcomePage(true);

  if (process.env.TEST_PODMAN_MACHINE === 'true' || process.env.MACHINE_CLEANUP === 'true') {
    await waitForPodmanMachineStartup(page);
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
  }
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  test.setTimeout(TIMEOUT_SETUP);

  try {
    await deleteDummyCluster(page, navigationBar);
    await uninstallDummyClusterExtension(navigationBar);

    if (test.info().status === 'failed') {
      await resetPodmanMachinesFromCLI();
      await createPodmanMachineFromCLI();
      await waitForPodmanMachineStartup(page);
    }
  } catch (error) {
    console.log('Error during cleanup:', error);
  } finally {
    await runner.close();
  }
});

test.describe('Enhanced dashboard experimental feature', { tag: ['@experimental'] }, () => {
  test.describe.configure({ mode: 'serial' });
  test('Enable/disable experimental feature', async ({ navigationBar, page }) => {
    await test.step('Verify feature is disabled by default', async () => {
      await setEnhancedDashboardFeature(page, navigationBar, false);
      const dashboardPage = await waitForDashboardState(navigationBar, false);
      await playExpect(dashboardPage.systemOverviewButton).not.toBeVisible();
      await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: TIMEOUT_SHORT });
      await dashboardPage.podmanProvider.scrollIntoViewIfNeeded();
    });

    await test.step('Enable feature and verify system overview appears', async () => {
      await setEnhancedDashboardFeature(page, navigationBar, true);
      const dashboardPage = await waitForDashboardState(navigationBar, true);
      await playExpect(dashboardPage.systemOverviewButton).toBeEnabled();
      await dashboardPage.expandSystemOverview(true);
      await playExpect(dashboardPage.systemOverview).toBeVisible({ timeout: TIMEOUT_SHORT });
      await playExpect(dashboardPage.podmanProvider).not.toBeVisible();
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped);
      await playExpect(dashboardPage.noContainerEngineLabel).toBeVisible();
      await playExpect(dashboardPage.setUpPodmanButton).toBeEnabled();
    });

    await test.step('Disable feature and verify dashboard reverts', async () => {
      await setEnhancedDashboardFeature(page, navigationBar, false);
      const dashboardPage = await waitForDashboardState(navigationBar, false);
      await playExpect(dashboardPage.systemOverviewButton).not.toBeVisible();
      await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: TIMEOUT_SHORT });
    });
  });

  test('Create Podman machine from Dashboard', async ({ page, navigationBar }) => {
    test.setTimeout(TIMEOUT_CREATE_MACHINE_TEST);

    await test.step('Create machine from system overview', async () => {
      await setEnhancedDashboardFeature(page, navigationBar, true);
      const dashboardPage = await waitForDashboardState(navigationBar, true);
      await dashboardPage.createPodmanMachineFromSystemOverview(PODMAN_MACHINE_NAME, {
        isRootful: false,
        enableUserNet: false,
        startNow: true,
        virtualizationProvider: getVirtualizationProvider(),
      });
    });

    await test.step('Wait for machine to reach operational state', async () => {
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Starting, {
        timeout: PODMAN_MACHINE_STARTUP_TIMEOUT,
      });
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Operational, {
        timeout: PODMAN_MACHINE_STARTUP_TIMEOUT,
      });
    });

    await test.step('Navigate to resources via status button', async () => {
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toBeEnabled();
      await dashboardPage.statusButton.click();
      const resourcesPage = new ResourcesPage(page);
      await playExpect
        .poll(async () => resourcesPage.resourceCardIsVisible('podman'), { timeout: TIMEOUT_STANDARD })
        .toBeTruthy();
      const resourcesPodmanConnections = new ResourceConnectionCardPage(page, 'podman', PODMAN_MACHINE_NAME);
      await playExpect(resourcesPodmanConnections.providerConnections).toBeVisible({ timeout: TIMEOUT_SHORT });
    });

    await test.step('Stop machine and verify dashboard reflects stopped state', async () => {
      const resourcesPodmanConnections = new ResourceConnectionCardPage(page, 'podman', PODMAN_MACHINE_NAME);
      await resourcesPodmanConnections.performConnectionAction(ResourceElementActions.Stop);
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped, {
        timeout: TIMEOUT_SHORT,
      });
    });

    await test.step('Verify resource details navigation', async () => {
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.checkSystemOverviewResourceDetails(PODMAN_MACHINE_VISIBLE_NAME);
    });

    await test.step('Verify status button navigates to resources page', async () => {
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toBeEnabled();
      await dashboardPage.statusButton.click();
      const resourcesPage = new ResourcesPage(page);
      await playExpect(resourcesPage.header).toBeVisible();
    });
  });

  test('Verify Kubernetes/VM Connections', async ({ page, navigationBar }) => {
    test.setTimeout(150_000);

    const { dashboardPage, dummyK8sResourceCard } =
      await test.step('Install dummy K8s extension and open Dummy Resources', async () => {
        // go to dashboard, verify the 'Kubernetes/VM connections:' label is not visible
        const dashboard = await navigationBar.openDashboard();
        await dashboard.statusButton.scrollIntoViewIfNeeded();
        await playExpect(dashboard.k8sVmConnectionLabel).not.toBeVisible();
        // go to extensions, click on 'install custom'
        // enter 'quay.io/rh-ee-davillan/pd-dummy-k8s-extension' in OCI image field, click 'install'
        const extensionsPage = await navigationBar.openExtensions();
        await extensionsPage.installExtensionFromOCIImage(CUSTOM_K8S_DUMMY_RESOURCE_EXTENSION);
        // go to settings/resources, find 'Dummy Resources' card
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.openTabPage(ResourcesPage);
        const resourceCard = new ResourceConnectionCardPage(page, DUMMY_K8S_RESOURCE_NAME);
        return { dashboardPage: dashboard, dummyK8sResourceCard: resourceCard };
      });

    await test.step('Create dummy-cluster', async () => {
      // click on 'Create new...'
      await playExpect(dummyK8sResourceCard.createButton).toBeVisible();
      await playExpect(dummyK8sResourceCard.createButton).toBeEnabled();
      await dummyK8sResourceCard.createButton.scrollIntoViewIfNeeded();
      await dummyK8sResourceCard.createButton.click();
      // Create Kubernetes cluster (second form)
      const k8sClusterForm = page
        .getByRole('form', { name: 'Properties Information' })
        .filter({ has: page.getByRole('textbox', { name: 'Cluster name' }) });
      const createK8sClusterButton = k8sClusterForm.getByRole('button', { name: 'Create' });
      await playExpect(createK8sClusterButton).toBeEnabled();
      await createK8sClusterButton.click();
    });

    await test.step('Verify Kubernetes/VM connection on dashboard', async () => {
      // check the resource has been created
      const goBackButton = page.getByRole('button', { name: 'Go back to resources' });
      await playExpect(goBackButton).toBeVisible();
      await goBackButton.click();
      // verify the 'Kubernetes/VM connections:' label is visible
      await navigationBar.openDashboard();
      await dashboardPage.k8sVmConnectionLabel.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.k8sVmConnectionLabel).toBeVisible();
      // verify the new k8s connection button appears on the enhanced dashboard card
      const dummyK8sClusterButton = dashboardPage.getNavigateToConnectionButton(DUMMY_CLUSTER_NAME);
      await playExpect(dummyK8sClusterButton).toBeVisible();
      await playExpect(dummyK8sClusterButton).toBeEnabled();
    });
  });
});

async function deleteDummyCluster(page: Page, navigationBar: NavigationBar): Promise<void> {
  return test.step('Remove dummy-cluster from Dummy Resources', async () => {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.openTabPage(ResourcesPage);
    const resourcesPage = new ResourcesPage(page);
    await playExpect(resourcesPage.heading).toBeVisible({ timeout: TIMEOUT_SHORT });

    if (!(await resourcesPage.resourceCardIsVisible(DUMMY_K8S_RESOURCE_NAME))) {
      console.log(`Dummy Resources card [${DUMMY_K8S_RESOURCE_NAME}] not present, skipping deletion.`);
      return;
    }

    const dummyK8sResourceCard = new ResourceConnectionCardPage(page, DUMMY_K8S_RESOURCE_NAME, DUMMY_CLUSTER_NAME);
    if (!(await dummyK8sResourceCard.doesResourceElementExist())) {
      console.log(`Dummy cluster [${DUMMY_CLUSTER_NAME}] not present, skipping deletion.`);
      return;
    }

    await dummyK8sResourceCard.performConnectionAction(ResourceElementActions.Stop);
    await playExpect(dummyK8sResourceCard.resourceElementConnectionStatus).toHaveText(ResourceElementState.Off, {
      timeout: TIMEOUT_STANDARD,
    });
    await dummyK8sResourceCard.performConnectionAction(ResourceElementActions.Delete);
    await playExpect
      .poll(async () => await dummyK8sResourceCard.doesResourceElementExist(), { timeout: TIMEOUT_STANDARD })
      .toBeFalsy();
  });
}

async function uninstallDummyClusterExtension(navigationBar: NavigationBar): Promise<void> {
  return test.step('Uninstall Dummy Resources extension', async () => {
    const extensionsPage = await navigationBar.openExtensions();
    if (!(await extensionsPage.extensionIsInstalled(DUMMY_K8S_EXTENSION_LABEL))) {
      console.log(`Extension [${DUMMY_K8S_EXTENSION_LABEL}] not installed, skipping uninstall.`);
      return;
    }

    const extensionCard = await extensionsPage.getInstalledExtension(
      DUMMY_K8S_EXTENSION_NAME,
      DUMMY_K8S_EXTENSION_LABEL,
    );
    await extensionCard.removeExtension();
    await playExpect
      .poll(async () => await extensionsPage.extensionIsInstalled(DUMMY_K8S_EXTENSION_LABEL), { timeout: 15_000 })
      .toBeFalsy();
  });
}
