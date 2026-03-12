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

import { ResourceElementState } from '/@/model/core/states';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createPodmanMachineFromCLI,
  deletePodmanMachine,
  resetPodmanMachinesFromCLI,
  setEnhancedDashboardFeature,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const PODMAN_MACHINE_NAME: string = 'podman-machine-default';

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

  if (process.env.MACHINE_CLEANUP !== 'true') {
    await waitForPodmanMachineStartup(page);
  }

  await runner.close();
});

test.describe.serial('Podman machine enhanced dashboard', { tag: '@pdmachine' }, () => {
  test('Enable enhanced dashboard experimental feature', async ({ navigationBar, page }) => {
    await setEnhancedDashboardFeature(page, navigationBar, true);
  });
  test('Create Podman machine from Dashboard', async ({ navigationBar }) => {
    test.setTimeout(320_000);

    await test.step('Open dashboard and initialize Podman machine', async () => {
      const dashboardPage = await navigationBar.openDashboard();
      // system overview card visible
      await playExpect(dashboardPage.setUpPodmanButton).toBeEnabled({ timeout: 60_000 });
      await dashboardPage.setUpPodmanButton.click();
      // handle podman machine onboarding process
      // button -> starting up
      // button -> systems operational
      await playExpect(dashboardPage.podmanStatusLabel).toHaveText(ResourceElementState.Running, {
        timeout: 300_000,
      });
      // go to resources, stop machine
      // come back to dashboard, button -> some systems are stopped
      // click on podman machine from carousel, verify it goes to resources
      // come back to dashboard, minimize carousel, verify it goes to resources
      // create a stopped podman machine
      // start original podman machine -> 1 card + 1 in carousel
    });
  });

  test('Clean Up Podman Machine', async ({ page }) => {
    test.skip(process.env.MACHINE_CLEANUP !== 'true', 'Machine cleanup is disabled');
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
  });
});
