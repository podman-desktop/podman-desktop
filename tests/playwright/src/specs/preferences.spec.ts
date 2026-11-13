/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { Preferences } from '/@/model/core/settings/preferences';
import { PreferencesPage } from '/@/model/pages/preferences-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { expect as playExpect, test } from '/@/utility/fixtures';

const preferencesTestString = 'this text should persist through page change';
const defaultScrollback = '1000';
const customScrollback = '5000';

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('preferences-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Preferences text persistence validation', { tag: '@macos_sanity' }, () => {
  test.describe.configure({ mode: 'serial' });
  test('Check preferences text persistence', async ({ page, navigationBar }) => {
    //Open Settings/Preferences page
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.preferencesTab.click();

    //Change kubeconfig path
    const preferencesPage = new PreferencesPage(page);
    await playExpect(preferencesPage.heading).toBeVisible();
    await preferencesPage.kubePathInput.scrollIntoViewIfNeeded();
    await preferencesPage.selectKubeFile(preferencesTestString);
    await playExpect(preferencesPage.kubePathInput).toHaveValue(preferencesTestString);

    //Change page and check new kubeconfig path persists
    await settingsBar.resourcesTab.click();
    await settingsBar.preferencesTab.click();
    await playExpect(preferencesPage.heading).toBeVisible();
    await playExpect(preferencesPage.kubePathInput).toHaveValue(preferencesTestString);
  });
});

test.describe('Terminal scrollback preference', () => {
  test.describe.configure({ mode: 'serial' });

  let settingsBar: SettingsBar;
  let preferencesPage: PreferencesPage;

  const getScrollbackValue = async (): Promise<string> =>
    preferencesPage.getPreferenceNumberInputValue(
      Preferences.Labels.SCROLLBACK,
      Preferences.TERMINAL_SCROLLBACK_INPUT_LABEL,
    );

  // leave and re-enter the preferences page so the value is read back from the stored configuration
  const reopenPreferences = async (): Promise<string> => {
    await settingsBar.resourcesTab.click();
    await settingsBar.preferencesTab.click();
    return getScrollbackValue();
  };

  test.beforeAll(async ({ page, navigationBar }) => {
    settingsBar = await navigationBar.openSettings();
    await settingsBar.preferencesTab.click();
    preferencesPage = new PreferencesPage(page);
    await playExpect(preferencesPage.heading).toBeVisible();
  });

  test('Scrollback has the default value of 1000 lines', async () => {
    const scrollbackRow = preferencesPage.getPreferenceRowByName(Preferences.Labels.SCROLLBACK);
    await playExpect(scrollbackRow).toBeAttached();
    playExpect(await preferencesPage.isPreferenceManaged(Preferences.Labels.SCROLLBACK)).toBeFalsy();
    playExpect(await getScrollbackValue()).toBe(defaultScrollback);
  });

  test('Scrollback can be changed and the value persists', async () => {
    await preferencesPage.setPreferenceNumberInputValue(
      Preferences.Labels.SCROLLBACK,
      Preferences.TERMINAL_SCROLLBACK_INPUT_LABEL,
      customScrollback,
    );
    playExpect(await getScrollbackValue()).toBe(customScrollback);

    // the value is saved after a short debounce, so keep reopening the page until it is read back from the configuration
    await playExpect
      .poll(reopenPreferences, { timeout: 10_000, message: 'Scrollback preference was not persisted' })
      .toBe(customScrollback);
  });

  test('Scrollback can be reset to the default value', async () => {
    await preferencesPage.resetPreference(Preferences.Labels.SCROLLBACK);

    await playExpect
      .poll(reopenPreferences, { timeout: 10_000, message: 'Scrollback preference did not reset to default value' })
      .toBe(defaultScrollback);
  });
});
