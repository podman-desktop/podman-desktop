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
  readonly FEEDBACK_DIALOG_PREFERENCE_LABEL = 'Dialog';
  readonly TOAST_PREFERENCE_LABEL = 'Toast';
  readonly ZOOM_LEVEL_PREFERENCE_LABEL = 'Zoom Level';
  readonly EXIT_ON_CLOSE_PREFERENCE_LABEL = ' Exit On Close';
  readonly LINE_HEIGHT_PREFERENCE_LABEL = 'Line Height';

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
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .first();
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

  async getFeedbackDialogPreferenceValue(): Promise<boolean> {
    const feedbackPreferenceRow = this.getPreferenceRowByName(this.FEEDBACK_DIALOG_PREFERENCE_LABEL);
    await playExpect(feedbackPreferenceRow).toBeAttached();
    await feedbackPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(feedbackPreferenceRow).toBeVisible();

    const selectionToggle = feedbackPreferenceRow.getByLabel('Show feedback dialog for experimental features');
    await playExpect(selectionToggle).toBeAttached();
    return await selectionToggle.isChecked();
  }

  async toggleFeedbackDialogPreference(): Promise<void> {
    const feedbackPreferenceRow = this.getPreferenceRowByName(this.FEEDBACK_DIALOG_PREFERENCE_LABEL);
    await playExpect(feedbackPreferenceRow).toBeAttached();
    await feedbackPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(feedbackPreferenceRow).toBeVisible();

    const selectionToggle = feedbackPreferenceRow.getByLabel('Show feedback dialog for experimental features');
    await playExpect(selectionToggle).toBeVisible();
    await selectionToggle.click({ force: true });
  }

  async getToastPreferenceValue(): Promise<boolean> {
    const toastPreferenceRow = this.getPreferenceRowByName(this.TOAST_PREFERENCE_LABEL);
    await playExpect(toastPreferenceRow).toBeAttached();
    await toastPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(toastPreferenceRow).toBeVisible();

    const selectionToggle = toastPreferenceRow.getByLabel('Display a notification toast when task is created');
    await playExpect(selectionToggle).toBeAttached();
    return await selectionToggle.isChecked();
  }

  async getZoomLevelPreferenceValue(): Promise<string> {
    const zoomLevelPreferenceRow = this.getPreferenceRowByName(this.ZOOM_LEVEL_PREFERENCE_LABEL);
    await playExpect(zoomLevelPreferenceRow).toBeAttached();
    await zoomLevelPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(zoomLevelPreferenceRow).toBeVisible();

    const preferenceInput = zoomLevelPreferenceRow.locator('input[name="preferences.zoomLevel"]');
    await playExpect(preferenceInput).toBeAttached();
    return await preferenceInput.inputValue();
  }

  async setZoomLevelPreference(value: string): Promise<void> {
    const zoomLevelPreferenceRow = this.getPreferenceRowByName(this.ZOOM_LEVEL_PREFERENCE_LABEL);
    await playExpect(zoomLevelPreferenceRow).toBeAttached();
    await zoomLevelPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(zoomLevelPreferenceRow).toBeVisible();

    const preferenceInput = zoomLevelPreferenceRow.locator('input[name="preferences.zoomLevel"]');
    await playExpect(preferenceInput).toBeAttached();
    await preferenceInput.fill(value);
  }

  async getExitOnClosePreferenceValue(): Promise<boolean> {
    const exitOnClosePreferenceRow = this.getPreferenceRowByName(this.EXIT_ON_CLOSE_PREFERENCE_LABEL);
    await playExpect(exitOnClosePreferenceRow).toBeAttached();
    await exitOnClosePreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(exitOnClosePreferenceRow).toBeVisible();

    const selectionToggle = exitOnClosePreferenceRow.getByLabel(
      'Quit the app when the close button is clicked instead of minimizing to the tray.',
    );
    await playExpect(selectionToggle).toBeAttached();
    return await selectionToggle.isChecked();
  }

  async getLineHeightPreferenceValue(): Promise<string> {
    const lineHeightPreferenceRow = this.getPreferenceRowByName(this.LINE_HEIGHT_PREFERENCE_LABEL);
    await playExpect(lineHeightPreferenceRow).toBeAttached();
    await lineHeightPreferenceRow.scrollIntoViewIfNeeded();
    await playExpect(lineHeightPreferenceRow).toBeVisible();

    const preferenceInput = lineHeightPreferenceRow.getByLabel(
      'Line height of the terminal. This number is multiplied by the terminal font size to get the actual terminal height in pixels.',
    );
    await playExpect(preferenceInput).toBeAttached();
    return await preferenceInput.inputValue();
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
