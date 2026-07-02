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

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(TIMEOUT_SETUP);

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

test.describe
  .serial('Enhanced dashboard experimental feature', { tag: ['@experimental'] }, () => {
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
  });
