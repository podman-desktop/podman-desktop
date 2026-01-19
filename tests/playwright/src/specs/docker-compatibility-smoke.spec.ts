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
import { DockerCompatibilityPage } from '/@/model/pages/docker-compatibility-page';
import { PodmanMachineDetails } from '/@/model/pages/podman-machine-details-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { SettingsBar } from '/@/model/pages/settings-bar';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { createPodmanMachineFromCLI, setDockerCompatibilityFeature } from '/@/utility/operations';
import { isWindows } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const defaultMachine = 'Podman Machine';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('docker-compatibility-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, page }) => {
  if (test.info().status === 'failed') {
    await setDockerCompatibilityFeature(page, false);
    await createPodmanMachineFromCLI();
  }
  await runner.close();
});

//Feature unstable on mac and linux atm
test.skip(!isWindows, 'Testing only on Windows');

test.describe.serial('Verify docker compatibility feature', { tag: '@smoke' }, () => {
  test('Enable the docker compatibility experimental feature', async ({ navigationBar, page }) => {
    //Verify Settings
    await navigationBar.openSettings();
    const settingsBar = new SettingsBar(page);

    const DCLink = settingsBar.getLinkLocatorByHref('/preferences/docker-compatibility');
    await playExpect(DCLink).not.toBeVisible();

    //Enable the feature
    await setDockerCompatibilityFeature(page, true);
  });
  test('Verify Docker Compatibility page', async ({ page }) => {
    const settingsBar = new SettingsBar(page);
    const dockerCompatibilityPage = await settingsBar.openTabPage(DockerCompatibilityPage);
    await playExpect(dockerCompatibilityPage.heading).toBeVisible();
    await playExpect.poll(async () => await dockerCompatibilityPage.socketIsReachable()).toBeTruthy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).toBeVisible();
  });
  test('Verify socket reachability is responding to podman machine status', async ({ page }) => {
    test.setTimeout(180_000);
    const settingsBar = new SettingsBar(page);
    await settingsBar.openTabPage(ResourcesPage);
    const podmanMachineDetails = new PodmanMachineDetails(page, defaultMachine);
    await playExpect(podmanMachineDetails.podmanMachineStopButton).toBeEnabled();
    await podmanMachineDetails.podmanMachineStopButton.click();
    await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText(ResourceElementState.Off, {
      timeout: 60_000,
    });

    const dockerCompatibilityPage = await settingsBar.openTabPage(DockerCompatibilityPage);
    await playExpect
      .poll(async () => await dockerCompatibilityPage.socketIsReachable(), { timeout: 60_000 })
      .toBeFalsy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).not.toBeVisible();

    await settingsBar.openTabPage(ResourcesPage);
    await playExpect(podmanMachineDetails.podmanMachineStartButton).toBeEnabled();
    await podmanMachineDetails.podmanMachineStartButton.click();
    await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText(ResourceElementState.Running, {
      timeout: 120_000,
    });

    await settingsBar.openTabPage(DockerCompatibilityPage);
    await playExpect
      .poll(async () => await dockerCompatibilityPage.socketIsReachable(), { timeout: 60_000 })
      .toBeTruthy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).toBeVisible();
  });
  test('Disable docker compatibility', async ({ page }) => {
    await setDockerCompatibilityFeature(page, false);
  });
});
