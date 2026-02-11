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

import { DashboardPage } from '/@/model/pages/dashboard-page';
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';

let rateLimitReachedFlag = false;
let composeOnboardingStatusText: string | undefined;

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'compose-onboarding' }) });
test.beforeAll(async ({ runner, page }) => {
  runner.setVideoAndTraceName('compose-onboarding');

  page.on('console', msg => {
    if (msg.text().includes('API rate limit exceeded')) {
      console.log('Rate limit flag triggered!');
      rateLimitReachedFlag = true;
    }
  });
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

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

  test('Check other versions for compose', async ({ welcomePage, page }) => {
    await playExpect(welcomePage.onboardingMessageStatus).toBeVisible({ timeout: 10_000 });
    await playExpect.poll(async () => welcomePage.onboardingMessageStatus).toBeTruthy();

    // Wait for compose step to be shown (either "Compose installed" or "Compose download")
    await playExpect(welcomePage.onboardingMessageStatus).toContainText(/Compose (installed|download)/, {
      timeout: 10_000,
    });
    composeOnboardingStatusText = await welcomePage.onboardingMessageStatus.innerText();

    if (composeOnboardingStatusText?.toLowerCase().includes('compose installed')) {
      test.skip(true, 'Compose already installed; see "Compose already installed" test');
      return;
    }

    await playExpect(welcomePage.onboardingMessageStatus).toContainText('Compose download', { timeout: 10_000 });
    await playExpect(welcomePage.otherVersionButton).toBeVisible();

    const rateLimitExceededText = '${onboardingContext}';
    const rateLimitExceededLocator = page.getByText(rateLimitExceededText);

    if ((await rateLimitExceededLocator.count()) > 0 || rateLimitReachedFlag) {
      // we have hit the rate limit, we cannot continue, exit the test suite
      test.info().annotations.push({ type: 'skip', description: 'Rate limit exceeded for Compose download' });
      test.skip(true, 'Rate limit exceeded; skipping compose onboarding checks');
    }

    await welcomePage.otherVersionButton.click();

    await playExpect(welcomePage.dropDownDialog).toBeVisible({ timeout: 10_000 });
    await playExpect(welcomePage.latestVersionFromDropDown).toBeEnabled();
    await welcomePage.latestVersionFromDropDown.click();
  });

  test('Compose already installed', async ({ welcomePage, page }) => {
    if (!composeOnboardingStatusText?.toLowerCase().includes('compose installed')) {
      test.skip(true, 'Compose download path; handled by "Check other versions for compose" test');
    }

    await playExpect(welcomePage.nextStepButton).toBeEnabled({ timeout: 10_000 });
    await welcomePage.nextStepButton.click();

    const dashboardPage = new DashboardPage(page);
    await playExpect(dashboardPage.heading).toBeVisible({ timeout: 10_000 });
  });
});
