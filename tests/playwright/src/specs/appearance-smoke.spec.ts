/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import type { Page } from '@playwright/test';

import { Preferences } from '/@/model/core/settings/preferences';
import { PreferencesPage } from '/@/model/pages/preferences-page';
import { expect as playExpect, test } from '/@/utility/fixtures';

let preferencesPage: PreferencesPage;

test.beforeAll(async ({ runner, welcomePage, navigationBar }) => {
  runner.setVideoAndTraceName('appearance-e2e');
  await welcomePage.handleWelcomePage(true);
  const settingsBar = await navigationBar.openSettings();
  preferencesPage = await settingsBar.openTabPage(PreferencesPage);
});

test.afterAll(async ({ runner }) => {
  try {
    const currentValue = await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE);
    if (currentValue !== 'system') {
      await preferencesPage.resetPreference(Preferences.Labels.APPEARANCE);
    }
  } finally {
    await runner.close();
  }
});

async function getThemeState(page: Page): Promise<{ hasDarkClass: boolean; colorScheme: string }> {
  return page.evaluate(() => {
    const html = document.documentElement;
    return {
      hasDarkClass: html.classList.contains('dark'),
      colorScheme: html.style.colorScheme,
    };
  });
}

test.describe
  .serial('Appearance theme switching', { tag: ['@smoke', '@windows_sanity', '@macos_sanity'] }, () => {
    test.describe.configure({ retries: 1 });

    test('Default appearance value is system', async () => {
      await playExpect
        .poll(async () => preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE), {
          timeout: 15_000,
          message: 'Expected default appearance to be system',
        })
        .toBe('system');
    });

    test('Switching to dark mode applies dark theme', async ({ page }) => {
      await preferencesPage.setPreferenceDropdownValue(Preferences.Labels.APPEARANCE, 'dark');

      const dropdownValue = await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE);
      playExpect(dropdownValue).toBe('dark');

      await playExpect
        .poll(async () => (await getThemeState(page)).hasDarkClass, {
          timeout: 15_000,
          message: 'Expected dark class on document element after switching to dark mode',
        })
        .toBe(true);

      const theme = await getThemeState(page);
      playExpect(theme.colorScheme).toBe('dark');
    });

    test('Switching to light mode applies light theme', async ({ page }) => {
      await preferencesPage.setPreferenceDropdownValue(Preferences.Labels.APPEARANCE, 'light');

      const dropdownValue = await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE);
      playExpect(dropdownValue).toBe('light');

      await playExpect
        .poll(async () => (await getThemeState(page)).hasDarkClass, {
          timeout: 15_000,
          message: 'Expected dark class removed from document element after switching to light mode',
        })
        .toBe(false);

      const theme = await getThemeState(page);
      playExpect(theme.colorScheme).toBe('light');
    });

    test('Switching back to dark mode re-applies dark theme', async ({ page }) => {
      await preferencesPage.setPreferenceDropdownValue(Preferences.Labels.APPEARANCE, 'dark');

      const dropdownValue = await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE);
      playExpect(dropdownValue).toBe('dark');

      await playExpect
        .poll(async () => (await getThemeState(page)).hasDarkClass, {
          timeout: 15_000,
          message: 'Expected dark class on document element after switching back to dark mode',
        })
        .toBe(true);

      const theme = await getThemeState(page);
      playExpect(theme.colorScheme).toBe('dark');
    });

    test('Resetting appearance restores default system value', async () => {
      await preferencesPage.resetPreference(Preferences.Labels.APPEARANCE);

      await playExpect
        .poll(async () => preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE), {
          timeout: 15_000,
          message: 'Appearance preference did not reset to default value',
        })
        .toBe('system');
    });
  });
