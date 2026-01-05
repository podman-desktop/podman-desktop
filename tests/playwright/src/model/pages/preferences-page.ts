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

import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { SettingsPage } from './settings-page';

export class PreferencesPage extends SettingsPage {
  readonly heading: Locator;
  readonly searchbar: Locator;
  readonly kubePathInput: Locator;
  readonly APPEARANCE_PREFERENCE_LABEL = 'Appearance';

  constructor(page: Page) {
    super(page, 'Preferences');
    this.heading = this.header.getByLabel('Title', { exact: true });
    this.searchbar = this.header.getByLabel('search preferences');
    this.kubePathInput = this.content.getByLabel(
      'Path to the Kubeconfig file for accessing clusters. (Default is usually ~/.kube/config)',
    );
  }

  getPreferenceRowByName(name: string): Locator {
    return this.content
      .locator('div.flex.flex-row.justify-between')
      .filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async isPreferenceManaged(name: string): Promise<boolean> {
    const preferenceRow = this.getPreferenceRowByName(name);
    return (await preferenceRow.getByText('Managed').count()) > 0;
  }

  async resetPreference(name: string): Promise<void> {
    const preferenceRow = this.getPreferenceRowByName(name);
    const resetButton = preferenceRow.getByRole('button', { name: 'Reset to default value' });
    await playExpect(resetButton).toBeVisible();
    await resetButton.click();
  }

  async getAppearancePreferenceValue(): Promise<string> {
    const appearancePreferenceRow = this.getPreferenceRowByName(this.APPEARANCE_PREFERENCE_LABEL);
    await playExpect(appearancePreferenceRow).toBeAttached();
    await appearancePreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(appearancePreferenceRow).toBeVisible();

    const preferenceInput = appearancePreferenceRow.getByLabel('hidden input');
    await playExpect(preferenceInput).toBeAttached();
    return await preferenceInput.inputValue();
  }

  async setAppearancePreference(value: string): Promise<void> {
    const appearancePreferenceRow = this.getPreferenceRowByName(this.APPEARANCE_PREFERENCE_LABEL);
    await playExpect(appearancePreferenceRow).toBeAttached();
    await appearancePreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(appearancePreferenceRow).toBeVisible();

    const selectionButton = appearancePreferenceRow.getByLabel(
      'Select between light or dark mode, or use your system setting.',
    );
    await playExpect(selectionButton).toBeVisible();
    await selectionButton.click();

    const option = appearancePreferenceRow.getByRole('button', { name: value, exact: true });
    await playExpect(option).toBeVisible();
    await option.click();
  }

  async selectKubeFile(pathToKube: string): Promise<void> {
    return test.step('Select Kube File', async () => {
      if (!pathToKube) {
        throw Error('Path to Kube config file is incorrect or not provided!');
      }
      playExpect(this.kubePathInput).toBeDefined();
      await this.kubePathInput.clear();
      await playExpect(this.kubePathInput).toHaveValue('');

      await this.kubePathInput.fill(pathToKube);
      await playExpect(this.kubePathInput).toHaveValue(pathToKube);
    });
  }
}
