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

import type { Locator, Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

import { SettingsPage } from './settings-page';

export class ExperimentalPage extends SettingsPage {
  readonly heading: Locator;
  readonly enableAllExperimentalFeaturesCheckbox: Locator;
  readonly enableAllExperimentalFeaturesButton: Locator;
  readonly statusBarProvidersCheckbox: Locator;

  constructor(page: Page) {
    super(page, 'Experimental');
    this.heading = this.header.getByRole('heading', { name: 'Title' }).and(this.header.getByText('Experimental'));
    this.enableAllExperimentalFeaturesCheckbox = this.content
      .getByRole('checkbox')
      .and(this.content.locator('#input-experimental-enable-all'));
    this.enableAllExperimentalFeaturesButton = this.enableAllExperimentalFeaturesCheckbox.locator('..');
    this.statusBarProvidersCheckbox = this.content.getByRole('checkbox', { name: 'Show providers in the status bar' });
  }

  public async enableAllExperimentalFeatures(): Promise<void> {
    await playExpect(this.enableAllExperimentalFeaturesCheckbox).toBeVisible();

    if (!(await this.enableAllExperimentalFeaturesCheckbox.isChecked())) {
      await this.enableAllExperimentalFeaturesButton.check();
    }

    await playExpect(this.enableAllExperimentalFeaturesCheckbox).toBeChecked();
  }

  public async disableAllExperimentalFeatures(): Promise<void> {
    await playExpect(this.enableAllExperimentalFeaturesCheckbox).toBeVisible();

    if (await this.enableAllExperimentalFeaturesCheckbox.isChecked()) {
      await this.enableAllExperimentalFeaturesButton.uncheck();
    }

    await playExpect(this.enableAllExperimentalFeaturesCheckbox).not.toBeChecked();
  }

  public async setExperimentalCheckbox(checkbox: Locator, enable: boolean): Promise<void> {
    await playExpect(checkbox).toBeVisible();
    const isEnabled = await checkbox.isChecked();
    if (isEnabled !== enable) {
      await checkbox.locator('..').setChecked(enable);
      const isEnabled = await checkbox.isChecked();
      playExpect(isEnabled).toEqual(enable);
    }
  }
}
