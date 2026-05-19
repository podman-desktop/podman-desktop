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

import { ResourceElementActions } from '/@/model/core/operations';
import { SystemOverviewState } from '/@/model/core/states';
import { PodmanOnboardingPage } from '/@/model/pages/podman-onboarding-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deletePodmanMachine, deletePodmanMachineFromCLI, setEnhancedDashboardFeature } from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const PODMAN_MACHINE_NAME_1: string = 'podman-machine-default-1';
const PODMAN_MACHINE_VISIBLE_NAME_1: string = 'Podman Machine default-1';
const CUSTOM_K8S_DUMMY_RESOURCE_EXTENSION: string = 'quay.io/rh-ee-davillan/pd-dummy-k8s-extension';

test.skip(
  isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
  'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
);

test.beforeAll(async ({ runner, welcomePage, page }) => {
  test.setTimeout(120_000);
  runner.setVideoAndTraceName('podman-machine-enhanced-dashboard');
  await welcomePage.handleWelcomePage(true);

  if (
    (process.env.TEST_PODMAN_MACHINE !== undefined && process.env.TEST_PODMAN_MACHINE === 'true') ||
    (process.env.MACHINE_CLEANUP !== undefined && process.env.MACHINE_CLEANUP === 'true')
  ) {
    await waitForPodmanMachineStartup(page);
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME_1);
  }
});

test.afterAll(async ({ runner }) => {
  test.setTimeout(120_000);

  try {
    await deletePodmanMachineFromCLI(PODMAN_MACHINE_NAME_1);
  } catch (error) {
    console.log('Error during cleanup:', error);
  }

  await runner.close();
});

test.describe
  .serial('Podman machine enhanced dashboard', { tag: '@pdmachine' }, () => {
    test('Enable/disable enhanced dashboard experimental feature', async ({ navigationBar, page }) => {
      await setEnhancedDashboardFeature(page, navigationBar, false);
      let dashboardPage = await navigationBar.openDashboard();
      // system overview card button not visible
      await playExpect(dashboardPage.systemOverviewButton).not.toBeVisible({ timeout: 5_000 });
      // podman card visible
      await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: 10_000 });
      await dashboardPage.podmanProvider.scrollIntoViewIfNeeded();

      await setEnhancedDashboardFeature(page, navigationBar, true);
      // 'System Overview' card may take a second to load, poll by changing the page until it appears?
      await page.waitForTimeout(2_000); //TODO: remove
      dashboardPage = await navigationBar.openDashboard();
      // system overview card button visible
      await playExpect(dashboardPage.systemOverviewButton).toBeVisible({ timeout: 10_000 });
      await playExpect(dashboardPage.systemOverviewButton).toBeEnabled({ timeout: 10_000 });
      await dashboardPage.systemOverviewButton.scrollIntoViewIfNeeded();
      await dashboardPage.systemOverviewButton.click();
      await playExpect(dashboardPage.systemOverview).toBeVisible({ timeout: 10_000 });
      // podman card not visible
      await playExpect(dashboardPage.podmanProvider).not.toBeVisible({ timeout: 5_000 });
      // "some systems are stopped" enabled and correct text
      await playExpect(dashboardPage.statusButton).toBeEnabled({ timeout: 5_000 });
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped, { timeout: 5_000 });
      // "no container engine" visible
      await playExpect(dashboardPage.noContainerEngineLabel).toBeVisible({ timeout: 5_000 });
      // "set up podman" button enabled
      await playExpect(dashboardPage.setUpPodmanButton).toBeEnabled({ timeout: 5_000 });
    });

    test('Create Podman machine from Dashboard', async ({ page, navigationBar }) => {
      test.setTimeout(320_000);

      await test.step('Open dashboard and initialize Podman machine', async () => {
        let dashboardPage = await navigationBar.openDashboard();
        await playExpect(dashboardPage.setUpPodmanButton).toBeEnabled({ timeout: 5_000 });
        await dashboardPage.setUpPodmanButton.scrollIntoViewIfNeeded();
        await dashboardPage.setUpPodmanButton.click();
        // handle podman machine onboarding process, start the machine
        const podmanOnboardingPage = new PodmanOnboardingPage(page);
        await playExpect(podmanOnboardingPage.header).toBeVisible();
        await playExpect(podmanOnboardingPage.mainPage).toBeVisible();
        await podmanOnboardingPage.nextStepButton.click();
        await playExpect(podmanOnboardingPage.onboardingStatusMessage).toHaveText(
          `We could not find any Podman machine. Let's create one!`,
          { timeout: 10_000 },
        );
        await podmanOnboardingPage.nextStepButton.click();
        await podmanOnboardingPage.machineCreationForm.setupAndCreateMachine(PODMAN_MACHINE_NAME_1, {
          isRootful: false,
          enableUserNet: false,
          startNow: true,
          virtualizationProvider: getVirtualizationProvider(),
        });
        // systemOverview button -> starting up; status label -> starting (missing aria-label)
        dashboardPage = await navigationBar.openDashboard();
        await dashboardPage.statusButton.scrollIntoViewIfNeeded();
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Starting, { timeout: 300_000 });
        // systemOverview button -> systems operational; status label -> running (missing aria-label)
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Operational, {
          timeout: 300_000,
        });
        // click on 'status' button to go to podman machine in settings/resources
        await playExpect(dashboardPage.statusButton).toBeEnabled();
        await dashboardPage.statusButton.click();
        let resourcesPage = new ResourcesPage(page);
        await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible('podman')).toBeTruthy();
        const resourcesPodmanConnections = new ResourceConnectionCardPage(page, 'podman', PODMAN_MACHINE_NAME_1);
        await playExpect(resourcesPodmanConnections.providerConnections).toBeVisible({ timeout: 10_000 });
        // stop machine
        await resourcesPodmanConnections.performConnectionAction(ResourceElementActions.Stop);
        // come back to dashboard, button -> some systems are stopped
        await navigationBar.openDashboard();
        await dashboardPage.statusButton.scrollIntoViewIfNeeded();
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped, { timeout: 10_000 });
        // click on 'navigate to...' button, verify it goes to machine details
        await playExpect(dashboardPage.navigateToButton).toBeEnabled();
        await dashboardPage.navigateToButton.click();
        const { ResourceDetailsPage } = await import('/@/model/pages/resource-details-page'); // avoid circular import
        const podmanMachine1Details = new ResourceDetailsPage(page, PODMAN_MACHINE_VISIBLE_NAME_1);
        await playExpect(podmanMachine1Details.heading).toBeVisible();
        // come back to dashboard, click on status button, verify it goes to resources
        await navigationBar.openDashboard();
        await dashboardPage.statusButton.scrollIntoViewIfNeeded();
        await playExpect(dashboardPage.statusButton).toBeEnabled();
        await dashboardPage.statusButton.click();
        resourcesPage = new ResourcesPage(page);
        await playExpect(resourcesPage.header).toBeVisible();
      });
    });

    test('Verify Kubernetes/VM Connections', async ({ page, navigationBar }) => {
      test.setTimeout(90_000);
      // go to dashboard, verify the 'Kubernetes/VM connections:' label is not visible
      const dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.k8sVmConnectionLabel).not.toBeVisible();
      // go to extensions, click on 'install custom'
      // enter 'quay.io/rh-ee-davillan/pd-dummy-k8s-extension' in OCI image field, click 'install'
      const extensionsPage = await navigationBar.openExtensions();
      await extensionsPage.installExtensionFromOCIImage(CUSTOM_K8S_DUMMY_RESOURCE_EXTENSION);
      // go to settings/resources, find 'Dummy Resources' card
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.openTabPage(ResourcesPage);
      const dummyK8sResourceCard = new ResourceConnectionCardPage(page, 'pd-dummy-k8s');
      // click on 'Create new...'
      await playExpect(dummyK8sResourceCard.createButton).toBeVisible();
      await playExpect(dummyK8sResourceCard.createButton).toBeEnabled();
      await dummyK8sResourceCard.createButton.scrollIntoViewIfNeeded();
      await dummyK8sResourceCard.createButton.click();
      // Create Kubernetes cluster (second form)
      const createK8sClusterButton = page
        .locator('form')
        .filter({ hasText: 'Cluster name' })
        .getByRole('button', { name: 'Create' });
      await createK8sClusterButton.click();
      // verify the 'Kubernetes/VM connections:' label is visible
      await navigationBar.openDashboard();
      await dashboardPage.k8sVmConnectionLabel.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.k8sVmConnectionLabel).toBeVisible();
      // verify the new k8s connection button appears on the enhanced dashboard card
      await playExpect(dashboardPage.dummyK8sClusterButton).toBeVisible();
      await playExpect(dashboardPage.dummyK8sClusterButton).toBeEnabled();
    });
  });
