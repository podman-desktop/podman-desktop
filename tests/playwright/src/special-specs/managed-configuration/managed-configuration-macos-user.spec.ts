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

import { constants } from 'node:fs';
import { copyFile, readFile, unlink } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { join, resolve } from 'node:path';

import { Preferences } from '/@/model/core/settings/preferences';
import { PreferencesPage } from '/@/model/pages/preferences-page';
import { NavigationBar } from '/@/model/workbench/navigation';
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isMac } from '/@/utility/platform';

const MANAGED_PREFERENCES_DIR = '/Library/Managed Preferences';
const PLIST_FILENAME = 'io.podman_desktop.PodmanDesktop.plist';
const MANAGED_APPEARANCE = 'light';
const SESSION_APPEARANCE = 'dark';
const PROFILE_FOLDER = 'managed-configuration-macos-user';
let managedFile: string | undefined;

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: PROFILE_FOLDER,
    customSettings: {
      'preferences.appearance': 'system',
      'feedback.dialog': false,
    },
  }),
});

test.describe('macOS per-user managed preferences', { tag: '@managed-configuration' }, () => {
  test.skip(!isMac, 'Managed preference plists are only supported on macOS');

  test.beforeAll(async () => {
    const destination = join(MANAGED_PREFERENCES_DIR, userInfo().username, PLIST_FILENAME);
    const source = resolve('tests/playwright/resources/managed-configuration/user-preferences.plist');

    // CI provisions the directory. Never overwrite an existing account policy.
    await copyFile(source, destination, constants.COPYFILE_EXCL);
    managedFile = destination;
  });

  test.afterAll(async () => {
    if (managedFile) {
      await unlink(managedFile);
    }
  });

  test('Apply user values without additional locks and reapply them after restart', async ({
    runner,
    welcomePage,
    navigationBar,
  }) => {
    test.setTimeout(180_000);
    runner.setVideoAndTraceName('managed-configuration-macos-user-e2e');

    try {
      await welcomePage.handleWelcomePage(true);
      const settingsBar = await navigationBar.openSettings();
      let preferencesPage = await settingsBar.openTabPage(PreferencesPage);

      await test.step('Override the local appearance without a lock', async () => {
        playExpect(await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE)).toBe(
          MANAGED_APPEARANCE,
        );
        playExpect(await preferencesPage.isPreferenceManaged(Preferences.Labels.APPEARANCE)).toBeFalsy();

        // The plist includes a lock, but a per-user policy cannot enforce it.
        const appearanceRow = preferencesPage.getPreferenceRowByName(Preferences.Labels.APPEARANCE);
        await playExpect(appearanceRow.getByRole('button', { name: 'Reset to default value' })).toBeVisible();
      });

      await test.step('Preserve local settings absent from the plist', async () => {
        playExpect(
          await preferencesPage.getPreferenceCheckboxValue(
            Preferences.Labels.FEEDBACK_DIALOG,
            Preferences.FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL,
          ),
        ).toBe(false);
      });

      await test.step('Keep the JSON policy lock despite a conflicting per-user value', async () => {
        playExpect(
          await preferencesPage.getPreferenceCheckboxValue(
            Preferences.Labels.EXIT_ON_CLOSE,
            Preferences.EXIT_ON_CLOSE_TOGGLE_BUTTON_LABEL,
          ),
        ).toBe(false);
        playExpect(await preferencesPage.isPreferenceManaged(Preferences.Labels.EXIT_ON_CLOSE)).toBeTruthy();

        const exitRow = preferencesPage.getPreferenceRowByName(Preferences.Labels.EXIT_ON_CLOSE);
        await playExpect(exitRow.getByLabel(Preferences.EXIT_ON_CLOSE_TOGGLE_BUTTON_LABEL)).toBeDisabled();
      });

      await test.step('Allow a session change', async () => {
        await preferencesPage.setPreferenceDropdownValue(Preferences.Labels.APPEARANCE, SESSION_APPEARANCE);
        playExpect(await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE)).toBe(
          SESSION_APPEARANCE,
        );

        // Wait for the save so the restart tests precedence over a persisted edit.
        const settingsFile = join(runner.getTestOutput(), PROFILE_FOLDER, 'configuration', 'settings.json');
        await playExpect
          .poll(async () => {
            const settings: unknown = JSON.parse(await readFile(settingsFile, 'utf8'));
            if (!settings || typeof settings !== 'object' || !('preferences.appearance' in settings)) {
              return undefined;
            }

            return settings['preferences.appearance'];
          })
          .toBe(SESSION_APPEARANCE);
      });

      await test.step('Reapply the per-user value at the next startup', async () => {
        await runner.close();
        // Reuse launch options so the runner does not recreate settings.json.
        await runner.start();
        runner.setVideoAndTraceName('managed-configuration-macos-user-restart-e2e');

        const restartedNavigation = new NavigationBar(runner.getPage());
        const restartedSettings = await restartedNavigation.openSettings();
        preferencesPage = await restartedSettings.openTabPage(PreferencesPage);
        playExpect(await preferencesPage.getPreferenceDropdownValue(Preferences.Labels.APPEARANCE)).toBe(
          MANAGED_APPEARANCE,
        );
      });
    } finally {
      if (runner.isRunning()) {
        await runner.close();
      }
    }
  });
});
