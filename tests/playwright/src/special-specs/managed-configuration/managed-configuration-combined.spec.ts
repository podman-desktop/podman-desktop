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

import type { Locator } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

import { PreferenceLabels, PreferencesPage } from '/@/model/pages/preferences-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

const FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL: string = 'Show feedback dialog for experimental features';
const ZOOM_LEVEL_NUMBER_INPUT_LABEL: string = 'preferences.zoomLevel';
const TERMINAL_LINE_HEIGHT_INPUT_LABEL: string = 'terminal.integrated.lineHeight';

let settingsBar: SettingsBar;
let preferencesPage: PreferencesPage;

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'managed-configuration',
    customSettings: {
      'feedback.dialog': false,
      'preferences.appearance': 'system',
      'tasks.Toast': true,
    },
  }),
});

test.beforeAll(async ({ runner, welcomePage, navigationBar }) => {
  test.setTimeout(60_000);
  runner.setVideoAndTraceName('managed-configuration-combined-e2e');
  await welcomePage.handleWelcomePage(true);
  settingsBar = await navigationBar.openSettings();
  preferencesPage = await settingsBar.openTabPage(PreferencesPage);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Managed Configuration - preferences', { tag: '@managed-configuration' }, () => {
  test.describe
    .serial('User preference: Appearance', () => {
      let appearanceRow: Locator;
      let value: string;
      test('Expected settings value', async () => {
        appearanceRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.APPEARANCE);
        await playExpect(appearanceRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.APPEARANCE);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getPreferenceDropdownValue(PreferenceLabels.APPEARANCE);
        playExpect(value).toBe('system');
      });
      test('Preference can be changed', async () => {
        await preferencesPage.setPreferenceDropdownValue(PreferenceLabels.APPEARANCE, 'dark');

        value = await preferencesPage.getPreferenceDropdownValue(PreferenceLabels.APPEARANCE);
        playExpect(value).toBe('dark');
      });
      test('Reset preference to default', async () => {
        await preferencesPage.resetPreference(PreferenceLabels.APPEARANCE);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getPreferenceDropdownValue(PreferenceLabels.APPEARANCE);
        playExpect(value).toBe('system');
      });
    });

  test.describe
    .serial('User + Defaults preference: Feedback Dialog', () => {
      let feedbackDialogRow: Locator;
      let value: boolean;
      test('Expected settings value', async () => {
        feedbackDialogRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.FEEDBACK_DIALOG);
        await playExpect(feedbackDialogRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.FEEDBACK_DIALOG);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getPreferenceCheckboxValue(
          PreferenceLabels.FEEDBACK_DIALOG,
          FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL,
        );
        playExpect(value).toBe(false);
      });
      test('Preference can be reset', async () => {
        await preferencesPage.resetPreference(PreferenceLabels.FEEDBACK_DIALOG);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getPreferenceCheckboxValue(
          PreferenceLabels.FEEDBACK_DIALOG,
          FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL,
        );
        playExpect(value).toBe(true);
      });
      test('Preference can be changed', async () => {
        await preferencesPage.togglePreferenceCheckbox(
          PreferenceLabels.FEEDBACK_DIALOG,
          FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL,
        );

        value = await preferencesPage.getPreferenceCheckboxValue(
          PreferenceLabels.FEEDBACK_DIALOG,
          FEEDBACK_DIALOG_TOGGLE_BUTTON_LABEL,
        );
        playExpect(value).toBe(false);
      });
    });

  test.describe
    .serial('User + Locked preference: Toast', () => {
      let toastRow: Locator;
      let value: boolean;
      test('Expected settings value', async () => {
        toastRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.TOAST);
        await playExpect(toastRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.TOAST);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getToastPreferenceValue();
        playExpect(value).toBeTruthy();
      });
      test('Preference can not be changed', async () => {
        const selectionToggle = toastRow.getByLabel('Display a notification toast when task is created');
        await playExpect(selectionToggle).toBeDisabled();
      });
      test('Preference can not be reset', async () => {
        const resetButton = toastRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });

  test.describe
    .serial('Defaults preference: Zoom Level', () => {
      let zoomLevelRow: Locator;
      let value: string;
      test('Expected settings value', async () => {
        zoomLevelRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.ZOOM_LEVEL);
        await playExpect(zoomLevelRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.ZOOM_LEVEL);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getPreferenceNumberInputValue(
          PreferenceLabels.ZOOM_LEVEL,
          ZOOM_LEVEL_NUMBER_INPUT_LABEL,
        );
        playExpect(value).toBe('0.5');
      });
      test('Preference can be changed', async () => {
        await preferencesPage.setPreferenceNumberInputValue(
          PreferenceLabels.ZOOM_LEVEL,
          ZOOM_LEVEL_NUMBER_INPUT_LABEL,
          '1.0',
        );

        value = await preferencesPage.getPreferenceNumberInputValue(
          PreferenceLabels.ZOOM_LEVEL,
          ZOOM_LEVEL_NUMBER_INPUT_LABEL,
        );
        playExpect(value).toBe('1');
      });
      test.fail('Preference can be reset', async () => {
        // Fails because of https://github.com/podman-desktop/podman-desktop/issues/16000
        await preferencesPage.resetPreference(PreferenceLabels.ZOOM_LEVEL);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getPreferenceNumberInputValue(
          PreferenceLabels.ZOOM_LEVEL,
          ZOOM_LEVEL_NUMBER_INPUT_LABEL,
        );
        playExpect(value).toBe('0.5');
      });
    });

  test.describe
    .serial('Defaults + Locked preference: Exit On Close', () => {
      let exitOnCloseRow: Locator;
      let value: boolean;
      test('Expected settings value', async () => {
        exitOnCloseRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.EXIT_ON_CLOSE);
        await playExpect(exitOnCloseRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.EXIT_ON_CLOSE);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getExitOnClosePreferenceValue();
        playExpect(value).toBeFalsy();
      });
      test('Preference can not be changed', async () => {
        const selectionToggle = exitOnCloseRow.getByLabel(
          'Quit the app when the close button is clicked instead of minimizing to the tray.',
        );
        await playExpect(selectionToggle).toBeDisabled();
      });
      test('Preference can not be reset', async () => {
        const resetButton = exitOnCloseRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });

  test.describe
    .serial('Locked preference: Line Height', () => {
      let lineHeightRow: Locator;
      let value: string;
      test('Expected settings value', async () => {
        lineHeightRow = preferencesPage.getPreferenceRowByName(PreferenceLabels.LINE_HEIGHT);
        await playExpect(lineHeightRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(PreferenceLabels.LINE_HEIGHT);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getPreferenceNumberInputValue(
          PreferenceLabels.LINE_HEIGHT,
          TERMINAL_LINE_HEIGHT_INPUT_LABEL,
        );
        playExpect(value).toBe('1');
      });
      test('Preference can not be changed', async () => {
        const preferenceInput = lineHeightRow.getByLabel(
          'Line height of the terminal. This number is multiplied by the terminal font size to get the actual terminal height in pixels.',
        );
        await playExpect(preferenceInput).toBeDisabled();
      });
      test('Preference can not be reset', async () => {
        const resetButton = lineHeightRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });
});
