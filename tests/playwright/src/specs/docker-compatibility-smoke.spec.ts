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

import { execSync } from 'node:child_process';

import { DockerCompatibilityPage } from '../model/pages/docker-compatibility-page';
import { ExperimentalPage } from '../model/pages/experimental-page';
import { PodmanMachineDetails } from '../model/pages/podman-machine-details-page';
import { PreferencesPage } from '../model/pages/preferences-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { SettingsBar } from '../model/pages/settings-bar';
import { expect as playExpect, test } from '../utility/fixtures';
import { isWindows } from '../utility/platform';
import { waitForPodmanMachineStartup } from '../utility/wait';

const experimentalDCPreferencesLabel = 'Experimental (Docker Compatibility)';
const settingsDCLabel = 'Docker Compatibility';
const defaultMachine = 'Podman Machine peepo';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('docker-compatibility-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, page }) => {
  if (test.info().status === 'failed') {
    const settingsBar = new SettingsBar(page);
    const experimentalPage = await settingsBar.openTabPage(ExperimentalPage);
    if (!(await experimentalPage.dockerCompatibilityCheckbox.isChecked())) {
      await experimentalPage.dockerCompatibilityCheckbox.locator('..').uncheck();
    }

    try {
      // eslint-disable-next-line sonarjs/no-os-command-from-path
      execSync('podman machine start');
      console.log('Default podman machine started');
    } catch (error) {
      if (error instanceof Error && error.message.includes('VM already running')) {
        console.log('Default podman machine already started, skipping start.');
      }
    }
  }
  await runner.close();
});

test.skip(!isWindows, 'Testing only on Windows');

test.describe.serial('Verify docker compatibility feature', { tag: '@smoke' }, () => {
  test('Enable the docker compatibility experimental feature', async ({ navigationBar, page }) => {
    //Verify Preferences
    await navigationBar.openSettings();
    const settingsBar = new SettingsBar(page);

    const DCLink = settingsBar.getPreferencesLinkLocator(settingsDCLabel);
    await playExpect(DCLink).not.toBeVisible();

    await settingsBar.expandPreferencesTab();
    const DCPreferencesLink = settingsBar.getPreferencesLinkLocator(experimentalDCPreferencesLabel);
    await playExpect(DCPreferencesLink).toBeVisible();
    await DCPreferencesLink.click();
    const DCPreferencesPage = new PreferencesPage(page);
    await playExpect(DCPreferencesPage.heading).toBeVisible();
    const experimentalTitle = DCPreferencesPage.content.getByText(experimentalDCPreferencesLabel);
    await playExpect(experimentalTitle).toBeVisible();

    //Verify Experimental page and enable the feature
    const experimentalPage = await settingsBar.openTabPage(ExperimentalPage);
    await playExpect(experimentalPage.heading).toBeVisible();
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).toBeVisible();
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).not.toBeChecked();

    await experimentalPage.dockerCompatibilityCheckbox.locator('..').check();
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).toBeChecked();

    await playExpect(DCLink).toBeVisible();
  });
  test('Verify Docker Compatibility page', async ({ page }) => {
    const settingsBar = new SettingsBar(page);
    const dockerCompatibilityPage = await settingsBar.openTabPage(DockerCompatibilityPage);
    await playExpect(dockerCompatibilityPage.heading).toBeVisible();
    playExpect(await dockerCompatibilityPage.socketIsReachable()).toBeTruthy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).toBeVisible();
  });
  test('Verify socket reachability is responding to podman machine status', async ({ page }) => {
    const settingsBar = new SettingsBar(page);
    await settingsBar.openTabPage(ResourcesPage);
    const podmanMachineDetails = new PodmanMachineDetails(page, defaultMachine);
    await playExpect(podmanMachineDetails.podmanMachineStopButton).toBeEnabled();
    await podmanMachineDetails.podmanMachineStopButton.click();
    await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('OFF', { timeout: 50_000 });

    const dockerCompatibilityPage = await settingsBar.openTabPage(DockerCompatibilityPage);
    playExpect(await dockerCompatibilityPage.socketIsReachable()).toBeFalsy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).not.toBeVisible();

    await settingsBar.openTabPage(ResourcesPage);
    await playExpect(podmanMachineDetails.podmanMachineStartButton).toBeEnabled();
    await podmanMachineDetails.podmanMachineStartButton.click();
    await playExpect(podmanMachineDetails.podmanMachineStatus).toHaveText('RUNNING', { timeout: 50_000 });

    await settingsBar.openTabPage(DockerCompatibilityPage);
    playExpect(await dockerCompatibilityPage.socketIsReachable()).toBeTruthy();
    await playExpect(dockerCompatibilityPage.serverInformationBox).toBeVisible();
  });
  test('Disable docker compatibility', async ({ page }) => {
    const settingsBar = new SettingsBar(page);
    const experimentalPage = await settingsBar.openTabPage(ExperimentalPage);
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).toBeVisible();
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).toBeChecked();

    await experimentalPage.dockerCompatibilityCheckbox.locator('..').uncheck();
    await playExpect(experimentalPage.dockerCompatibilityCheckbox).not.toBeChecked();

    const DCLink = settingsBar.getPreferencesLinkLocator(settingsDCLabel);
    await playExpect(DCLink).not.toBeVisible();
  });
});
