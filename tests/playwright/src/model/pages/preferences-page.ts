/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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
      .filter({ has: this.page.locator('span.font-semibold').getByText(name, { exact: true }) });
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

  async getPreferenceDropdownValue(preferenceLabel: string): Promise<string> {
    const preferenceRow = this.getPreferenceRowByName(preferenceLabel);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const preferenceInput = preferenceRow.getByLabel('hidden input');
    await playExpect(preferenceInput).toBeAttached();
    return await preferenceInput.inputValue();
  }

  async setPreferenceDropdownValue(preferenceLabel: string, value: string): Promise<void> {
    const preferenceRow = this.getPreferenceRowByName(preferenceLabel);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const triggerButton = preferenceRow
      .locator('div[aria-label]:has(input[aria-label="hidden input"])')
      .getByRole('button')
      .first();
    await playExpect(triggerButton).toBeVisible();
    await triggerButton.click();

    const option = preferenceRow.getByRole('button', { name: value, exact: true });
    await playExpect(option).toBeVisible();
    await option.click();
  }

  async getPreferenceCheckboxValue(preferenceName: string, toggleLabel: string): Promise<boolean> {
    const preferenceRow = this.getPreferenceRowByName(preferenceName);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const toggle = preferenceRow.getByLabel(toggleLabel);
    await playExpect(toggle).toBeAttached();
    return await toggle.isChecked();
  }

  async togglePreferenceCheckbox(preferenceName: string, toggleLabel: string): Promise<void> {
    const preferenceRow = this.getPreferenceRowByName(preferenceName);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const toggle = preferenceRow.getByLabel(toggleLabel);
    await playExpect(toggle).toBeVisible();
    await toggle.click({ force: true });
  }

  async getPreferenceNumberInputValue(preferenceName: string, configId: string): Promise<string> {
    const preferenceRow = this.getPreferenceRowByName(preferenceName);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const preferenceInput = preferenceRow.locator(`input[name="${configId}"]`);
    await playExpect(preferenceInput).toBeAttached();
    return await preferenceInput.inputValue();
  }

  async setPreferenceNumberInputValue(preferenceName: string, configId: string, value: string): Promise<void> {
    const preferenceRow = this.getPreferenceRowByName(preferenceName);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();

    const preferenceInput = preferenceRow.locator(`input[name="${configId}"]`);
    await playExpect(preferenceInput).toBeAttached();
    await preferenceInput.fill(value);
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
