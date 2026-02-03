/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { waitWhile } from '/@/utility/wait';

import { BasePage } from './base-page';
import { DashboardPage } from './dashboard-page';

export class WelcomePage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly telemetryConsent: Locator;
  readonly skipOnBoarding: Locator;
  readonly checkLoader: Locator;
  readonly startOnboarding: Locator;
  readonly onboardingMessageStatus: Locator;
  readonly nextStepButton: Locator;
  readonly cancelSetupButton: Locator;
  readonly otherVersionButton: Locator;
  readonly dropDownDialog: Locator;
  readonly latestVersionFromDropDown: Locator;
  readonly confirmationPopUp: Locator;
  readonly okButtonPopup: Locator;
  readonly markdownContentLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByText('Welcome to Podman Desktop');
    this.telemetryConsent = page.getByLabel('Enable telemetry');
    this.skipOnBoarding = page.getByRole('button', {
      name: 'Skip',
      exact: true,
    });
    this.checkLoader = this.page.getByRole('heading', {
      name: 'Initializing...',
    });
    this.startOnboarding = page.getByRole('button', {
      name: 'Start onboarding',
      exact: true,
    });
    this.onboardingMessageStatus = this.page.getByLabel('Onboarding Status Message');
    this.nextStepButton = this.page.getByRole('button', { name: 'Next Step' });
    this.cancelSetupButton = this.page.getByRole('button', { name: 'Cancel Setup' });
    this.markdownContentLocator = this.page.getByLabel('markdown-content');
    this.otherVersionButton = this.markdownContentLocator.getByText('Want to download a different version?');
    this.dropDownDialog = this.page.getByLabel('drop-down-dialog');
    this.latestVersionFromDropDown = this.dropDownDialog.getByRole('button').first();
    this.confirmationPopUp = page.getByRole('dialog', { name: 'Skip Setup Popup' });
    this.okButtonPopup = this.confirmationPopUp.getByRole('button', { name: 'OK' });
  }

  async turnOffTelemetry(): Promise<void> {
    return test.step('Turn off Telemetry', async () => {
      // Extensions load sequentially (faster speed but can block ui)
      await playExpect(this.startOnboarding).toBeEnabled({ timeout: 45_000 });

      if (await this.telemetryConsent.isChecked()) {
        await playExpect(this.telemetryConsent).toBeChecked();
        await this.telemetryConsent.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(5_000);
        await this.telemetryConsent.focus();
        await this.telemetryConsent.uncheck({ force: true });
      }

      await playExpect(this.telemetryConsent).not.toBeChecked();
    });
  }

  async closeWelcomePage(): Promise<DashboardPage> {
    return test.step('Close Welcome Page', async () => {
      await playExpect(this.skipOnBoarding).toBeEnabled();
      await this.skipOnBoarding.click({ force: true });
      try {
        await waitWhile(async () => await this.skipOnBoarding.isVisible(), { timeout: 5_000, diff: 250 });
      } catch (err) {
        console.log('Skip Onboarding button is still visible, retrying to press the button');
        await this.skipOnBoarding.click({ force: true });
      }
      return new DashboardPage(this.page);
    });
  }

  /**
   * Waits for application to initialize, turn off telemetry and closes welcome page
   */
  async handleWelcomePage(skipIfNotPresent: boolean): Promise<void> {
    return test.step('Handle Welcome Page', async () => {
      if (skipIfNotPresent) {
        try {
          await this.skipOnBoarding.waitFor({ state: 'visible' });
        } catch (err) {
          if ((err as Error).name !== 'TimeoutError') {
            throw err;
          }
          return;
        }
      }

      await this.page.waitForTimeout(5_000);
      await this.turnOffTelemetry();
      await this.closeWelcomePage();
      await playExpect(this.welcomeMessage).toHaveCount(0);
    });
  }
}
