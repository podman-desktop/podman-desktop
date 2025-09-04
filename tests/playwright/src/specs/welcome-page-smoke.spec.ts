/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import { RunnerOptions } from '../runner/runner-options';
import { expect as playExpect, test } from '../utility/fixtures';
import { isCI, isLinux } from '../utility/platform';

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'welcome-podman-desktop' }) });
test.beforeAll(async ({ runner }) => {
  runner.setVideoAndTraceName('welcome-page-e2e');
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Basic e2e verification of podman desktop start', { tag: '@smoke' }, () => {
  test.describe
    .serial('Welcome page handling', () => {
      test('Check the Welcome page is displayed', async ({ welcomePage }) => {
        await playExpect(welcomePage.welcomeMessage).toBeVisible();
      });

      test('Telemetry checkbox is present, set to true, consent can be changed', async ({ welcomePage }) => {
        await playExpect(welcomePage.telemetryConsent).toBeVisible();
        await playExpect(welcomePage.telemetryConsent).toBeChecked();
        await welcomePage.turnOffTelemetry();
      });

      test('Check podman installation', async ({ welcomePage }) => {
        await playExpect(welcomePage.startOnboarding).toBeEnabled({ timeout: 10_000 });
        await welcomePage.startOnboarding.click();

        await playExpect(welcomePage.onboardingMessageStatus).toBeVisible({ timeout: 10_000 });
        await playExpect(welcomePage.onboardingMessageStatus).toContainText('Podman has been set up correctly', {
          timeout: 10_000,
        });
        await playExpect(welcomePage.nextStepButton).toBeEnabled();
        await welcomePage.nextStepButton.click();

        await playExpect(welcomePage.onboardingMessageStatus).toContainText('Podman installed', { timeout: 10_000 });
        await playExpect(welcomePage.nextStepButton).toBeEnabled();
        await welcomePage.nextStepButton.click();
      });

      test('Check k8s is installed', async ({ welcomePage }) => {
        await playExpect(welcomePage.onboardingMessageStatus).toContainText('kubectl installed', { timeout: 10_000 });
        await playExpect(welcomePage.nextStepButton).toBeEnabled();
        await welcomePage.nextStepButton.click();
      });

      test('Check other versions for compose', async ({ welcomePage, page }) => {
        test.skip(!isCI || !isLinux, 'This test should run only on Ubuntu platform in Github Actions');

        await playExpect(welcomePage.onboardingMessageStatus).toContainText('Compose download', { timeout: 10_000 });
        await playExpect(welcomePage.otherVersionButton).toBeVisible();
        await welcomePage.otherVersionButton.click();

        await playExpect(welcomePage.dropDownDialog).toBeVisible({ timeout: 10_000 });
        await page.waitForTimeout(500); // wait for animation

        await playExpect(welcomePage.latestVersionFromDropDown).toBeEnabled();
        await welcomePage.latestVersionFromDropDown.click();

        await playExpect(welcomePage.dropDownDialog).not.toBeVisible({ timeout: 10_000 });
        await playExpect(welcomePage.cancelSetupButton).toBeEnabled();
      });

      test('Navigate to dashboard', async ({ welcomePage }) => {
        await playExpect(welcomePage.cancelSetupButton).toBeEnabled();
        await welcomePage.cancelSetupButton.click();

        await playExpect(welcomePage.confirmationPopUp).toBeVisible();
        await playExpect(welcomePage.okButtonPopup).toBeEnabled();
        await welcomePage.okButtonPopup.click();
      });
    });

  test.describe
    .serial('Navigation Bar test', () => {
      test('Verify navigation items are visible', async ({ navigationBar }) => {
        await playExpect(navigationBar.navigationLocator).toBeVisible();
        await playExpect(navigationBar.dashboardLink).toBeVisible();
        await playExpect(navigationBar.imagesLink).toBeVisible();
        await playExpect(navigationBar.podsLink).toBeVisible();
        await playExpect(navigationBar.containersLink).toBeVisible();
        await playExpect(navigationBar.volumesLink).toBeVisible();
        await playExpect(navigationBar.settingsLink).toBeVisible();
      });
    });
});
