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

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Locator } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

import { PreferencesPage } from '/@/model/pages/preferences-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_JSON_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'resources',
  'managed-configuration',
  'settings.json',
);

let customSettings: Record<string, unknown>;
try {
  customSettings = JSON.parse(readFileSync(SETTINGS_JSON_PATH, 'utf-8'));
} catch (error) {
  throw new Error(`Failed to load settings.json from ${SETTINGS_JSON_PATH}: ${error}`);
}

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'managed-configuration',
    customSettings: customSettings,
  }),
});

test.beforeAll(async ({ runner, welcomePage }) => {
  test.setTimeout(60_000);
  runner.setVideoAndTraceName('managed-configuration-user-settings-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Managed Configuration - settings.json scenario', { tag: '@managed-configuration' }, () => {
  const appearancePreferenceLabel = 'Appearance';
  let settingsBar: SettingsBar;
  let preferencesPage: PreferencesPage;
  let preferenceRow: Locator;

  test.beforeAll(async ({ navigationBar }) => {
    settingsBar = await navigationBar.openSettings();
    preferencesPage = await settingsBar.openTabPage(PreferencesPage);
    const appearanceSubsectionButton = settingsBar.getPreferencesLinkLocator(appearancePreferenceLabel);
    await playExpect(appearanceSubsectionButton).toBeVisible();
    await appearanceSubsectionButton.click();
    preferenceRow = preferencesPage.getPreferenceRowByName(appearancePreferenceLabel);
    await playExpect(preferenceRow).toBeAttached();
    await preferenceRow.scrollIntoViewIfNeeded();
    await playExpect(preferenceRow).toBeVisible();
  });

  test(`Verify Appearance preference set from settings.json file`, async () => {
    const isManaged = await preferencesPage.isPreferenceManaged(appearancePreferenceLabel);
    playExpect(isManaged).toBe(false);

    const actualValue = await preferencesPage.getAppearancePreferenceValue();
    playExpect(actualValue).toBe('light');
  });

  test(`Change and verify Appearance preference value`, async ({ page }) => {
    await preferencesPage.setAppearancePreference('dark');
    // Wait for the appearance preference to be applied by checking the HTML element's style
    const htmlElement = page.locator('html');
    await playExpect(htmlElement).toHaveAttribute('style', /color-scheme:\s*dark/);
    const updatedValue = await preferencesPage.getAppearancePreferenceValue();
    playExpect(updatedValue).toBe('dark');
  });

  // test is expected to fail because of https://github.com/podman-desktop/podman-desktop/issues/15242
  test.fail(`Restore Appearance preference to default value`, async () => {
    await preferencesPage.resetPreference(appearancePreferenceLabel);
    const restoredValue = await preferencesPage.getAppearancePreferenceValue();
    playExpect(restoredValue).toBe('system');
  });
});
