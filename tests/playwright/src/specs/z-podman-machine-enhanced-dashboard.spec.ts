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

import { ResourceElementState, SystemOverviewState } from '/@/model/core/states';
import { PodmanMachineDetails } from '/@/model/pages/podman-machine-details-page';
import { PodmanOnboardingPage } from '/@/model/pages/podman-onboarding-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  resetPodmanMachinesFromCLI,
  setEnhancedDashboardFeature,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { getVirtualizationProvider } from '/@/utility/provider';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const PODMAN_MACHINE_NAME_1: string = 'podman-machine-default-1';
const PODMAN_MACHINE_VISIBLE_NAME_1: string = 'Podman Machine default-1';

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

  if (process.env.MACHINE_CLEANUP !== 'true') {
    await waitForPodmanMachineStartup(page);
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
      await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: 20_000 });

      await setEnhancedDashboardFeature(page, navigationBar, true);
      // 'System Overview' card may take a second to load, poll by changing the page until it appears?
      dashboardPage = await navigationBar.openDashboard();
      // system overview card button visible
      await playExpect(dashboardPage.systemOverviewButton).toBeVisible({ timeout: 20_000 });
      await playExpect(dashboardPage.systemOverviewButton).toBeEnabled({ timeout: 20_000 });
      await dashboardPage.systemOverviewButton.click();
      await playExpect(dashboardPage.systemOverview).toBeVisible({ timeout: 20_000 });
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
        await dashboardPage.setUpPodmanButton.click();
        // handle podman machine onboarding process, start the machine
        const podmanOnboardingPage = new PodmanOnboardingPage(page);
        await playExpect(podmanOnboardingPage.header).toBeVisible();
        await playExpect(podmanOnboardingPage.mainPage).toBeVisible();
        await podmanOnboardingPage.machineCreationForm.setupAndCreateMachine(PODMAN_MACHINE_NAME_1, {
          isRootful: false,
          enableUserNet: false,
          startNow: true,
          virtualizationProvider: getVirtualizationProvider(),
        });
        // systemOverview button -> starting up; status label -> starting (missing aria-label)
        dashboardPage = await navigationBar.openDashboard();
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Starting, { timeout: 10_000 });
        // systemOverview button -> systems operational; status label -> running (missing aria-label)
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Operational, {
          timeout: 300_000,
        });
        // click on 'view' button (missing aria-label) to go to podman machine details
        await playExpect(dashboardPage.viewButton).toBeEnabled();
        await dashboardPage.viewButton.click();
        const podmanMachine1Details = new PodmanMachineDetails(page, PODMAN_MACHINE_NAME_1);
        // stop machine
        await playExpect(podmanMachine1Details.podmanMachineStopButton).toBeEnabled();
        await podmanMachine1Details.podmanMachineStopButton.click();
        await playExpect(podmanMachine1Details.podmanMachineStatus).toHaveText(ResourceElementState.Off, {
          timeout: 120_000,
        });
        // come back to dashboard, button -> some systems are stopped
        await navigationBar.openDashboard();
        await playExpect(dashboardPage.statusButton).toHaveText(SystemOverviewState.Stopped, { timeout: 10_000 });
        // click on 'navigate to...' button, verify it goes to machine details
        await playExpect(dashboardPage.navigateToButton).toBeEnabled();
        await dashboardPage.navigateToButton.click();
        await playExpect(podmanMachine1Details.header).toBeVisible();
        // come back to dashboard, click on status button, verify it goes to resources
        await navigationBar.openDashboard();
        await playExpect(dashboardPage.statusButton).toBeEnabled();
        await dashboardPage.statusButton.click();
        const resourcesPage = new ResourcesPage(page);
        await playExpect(resourcesPage.header).toBeVisible();
      });

      await test.step('Verify other resources', async () => {});
    });

    test('Clean Up Podman Machine', async ({ page }) => {
      test.skip(process.env.MACHINE_CLEANUP !== 'true', 'Machine cleanup is disabled');
      await deletePodmanMachine(page, PODMAN_MACHINE_VISIBLE_NAME_1);
    });
  });
