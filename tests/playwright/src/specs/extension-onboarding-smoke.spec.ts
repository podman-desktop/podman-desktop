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

import { RunnerOptions } from '../runner/runner-options';
import { expect as playExpect, test } from '../utility/fixtures';
import { isCI, isLinux } from '../utility/platform';

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'compose-onboarding' }) });
test.beforeAll(async ({ runner }) => {
  runner.setVideoAndTraceName('compose-onboarding');
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.skip(!isCI || !isLinux, 'This test suite should run only on Ubuntu platform in Github Actions');

test.describe.serial('Verify onboarding experience for compose versioning', { tag: '@smoke' }, () => {
  test('Welcome message available and handle telemetry', async ({ welcomePage }) => {
    await playExpect(welcomePage.welcomeMessage).toBeVisible();
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

    await playExpect(welcomePage.onboardingMessageStatus).toContainText('Podman installed', {
      timeout: 10_000,
    });
    await playExpect(welcomePage.nextStepButton).toBeEnabled();
    await welcomePage.nextStepButton.click();
  });

  test('Check k8s is installed', async ({ welcomePage }) => {
    await playExpect(welcomePage.onboardingMessageStatus).toContainText('kubectl installed', { timeout: 10_000 });
    await playExpect(welcomePage.nextStepButton).toBeEnabled();
    await welcomePage.nextStepButton.click();
  });

  test('Check other versions for compose', async ({ welcomePage }) => {
    await playExpect(welcomePage.onboardingMessageStatus).toContainText('Compose download', { timeout: 10_000 });
    await playExpect(welcomePage.otherVersionButton).toBeVisible();
    await welcomePage.otherVersionButton.click();

    await playExpect(welcomePage.dropDownDialog).toBeVisible({ timeout: 10_000 });
    await playExpect(welcomePage.latestVersionFromDropDown).toBeEnabled();
    await welcomePage.latestVersionFromDropDown.click();

    await playExpect(welcomePage.dropDownDialog).not.toBeVisible({ timeout: 10_000 });
    await playExpect(welcomePage.cancelSetupButton).toBeEnabled();
  });
});
