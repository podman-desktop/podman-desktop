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
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
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

test.skip(
  isLinux || process.env.TEST_PODMAN_MACHINE !== 'true',
  'Tests suite should not run on Linux platform or if TEST_PODMAN_MACHINE is not true',
);

test.beforeAll(async ({ runner, welcomePage, page }) => {
  test.setTimeout(120_000);
  runner.setVideoAndTraceName('enhanced-dashboard-e2e');
  await welcomePage.handleWelcomePage(true);

  if (process.env.TEST_PODMAN_MACHINE === 'true' || process.env.MACHINE_CLEANUP === 'true') {
    await waitForPodmanMachineStartup(page);
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(120_000);

  try {
    if (test.info().status === 'failed') {
      await resetPodmanMachinesFromCLI();
      await createPodmanMachineFromCLI();
      await waitForPodmanMachineStartup(page);
    }
  } catch (error) {
    console.log('Error during cleanup:', error);
  }

  await runner.close();
});

test.describe('Enhanced dashboard experimental feature', { tag: ['@experimental'] }, () => {
  test.describe.configure({ mode: 'serial' });
  test('Enable/disable experimental feature', async ({ navigationBar, page }) => {
    // assert assets state before enabling it (disabled by default for the time being)
    await setEnhancedDashboardFeature(page, navigationBar, false);
    let dashboardPage = await waitForDashboardState(navigationBar, false);
    await playExpect(dashboardPage.systemOverviewButton).not.toBeVisible();
    await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: 10_000 });
    await dashboardPage.podmanProvider.scrollIntoViewIfNeeded();
    // enable the feature
    await setEnhancedDashboardFeature(page, navigationBar, true);
    dashboardPage = await waitForDashboardState(navigationBar, true);
    // assert assets state after enabling it
    await playExpect(dashboardPage.systemOverviewButton).toBeEnabled();
    await dashboardPage.expandSystemOverview(true);
    await playExpect(dashboardPage.systemOverview).toBeVisible({ timeout: 10_000 });
    await playExpect(dashboardPage.podmanProvider).not.toBeVisible();
    await playExpect(dashboardPage.statusButton).toBeEnabled();
    await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped);
    await playExpect(dashboardPage.noContainerEngineLabel).toBeVisible();
    await playExpect(dashboardPage.setUpPodmanButton).toBeEnabled();
    // disable the feature and assert everything went back to the expected state
    await setEnhancedDashboardFeature(page, navigationBar, false);
    dashboardPage = await waitForDashboardState(navigationBar, false);
    await playExpect(dashboardPage.systemOverviewButton).not.toBeVisible();
    await dashboardPage.podmanProvider.scrollIntoViewIfNeeded();
  });

  test('Create Podman machine from Dashboard', async ({ page, navigationBar }) => {
    test.setTimeout(320_000);

    await test.step('Open dashboard and initialize Podman machine', async () => {
      // enable the feature
      await setEnhancedDashboardFeature(page, navigationBar, true);
      let dashboardPage = await waitForDashboardState(navigationBar, true);
      await dashboardPage.createPodmanMachineFromSystemOverview(PODMAN_MACHINE_NAME, {
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
      await playExpect
        .poll(async () => resourcesPage.resourceCardIsVisible('podman'), { timeout: 30_000 })
        .toBeTruthy();
      const resourcesPodmanConnections = new ResourceConnectionCardPage(page, 'podman', PODMAN_MACHINE_NAME);
      await playExpect(resourcesPodmanConnections.providerConnections).toBeVisible({ timeout: 10_000 });
      // stop machine
      await resourcesPodmanConnections.performConnectionAction(ResourceElementActions.Stop);
      // come back to dashboard, button -> some systems are stopped
      await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped, { timeout: 10_000 });
      // click on 'navigate to...' button, verify it goes to machine details
      await dashboardPage.checkSystemOverviewResourceDetails(PODMAN_MACHINE_VISIBLE_NAME);
      // come back to dashboard, click on status button, verify it goes to resources
      await navigationBar.openDashboard();
      await dashboardPage.statusButton.scrollIntoViewIfNeeded();
      await playExpect(dashboardPage.statusButton).toBeEnabled();
      await dashboardPage.statusButton.click();
      resourcesPage = new ResourcesPage(page);
      await playExpect(resourcesPage.header).toBeVisible();
    });
  });
});
