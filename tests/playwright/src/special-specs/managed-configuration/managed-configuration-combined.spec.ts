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

import { PreferencesPage } from '/@/model/pages/preferences-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

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

test.describe.serial('Managed Configuration - preference verification', { tag: '@managed-configuration' }, () => {
  test.describe
    .serial('Verify [user] Appearance preference', () => {
      let appearanceRow: Locator;
      let value: string;
      test('Check Appearance preference state', async () => {
        appearanceRow = preferencesPage.getPreferenceRowByName(preferencesPage.APPEARANCE_PREFERENCE_LABEL);
        await playExpect(appearanceRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.APPEARANCE_PREFERENCE_LABEL);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getAppearancePreferenceValue();
        playExpect(value).toBe('system');
      });
      test('Change Appearance preference to dark', async () => {
        await preferencesPage.setAppearancePreference('dark');

        value = await preferencesPage.getAppearancePreferenceValue();
        playExpect(value).toBe('dark');
      });
      test.fail('Reset Appearance preference to default', async () => {
        // Fails because of https://github.com/podman-desktop/podman-desktop/issues/15242
        await preferencesPage.resetPreference(preferencesPage.APPEARANCE_PREFERENCE_LABEL);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getAppearancePreferenceValue();
        playExpect(value).toBe('system');
      });
    });

  test.describe
    .serial('Verify [user + default] Feedback Dialog preference', () => {
      let feedbackDialogRow: Locator;
      let value: boolean;
      test('Check Feedback Dialog preference state', async () => {
        feedbackDialogRow = preferencesPage.getPreferenceRowByName(preferencesPage.FEEDBACK_DIALOG_PREFERENCE_LABEL);
        await playExpect(feedbackDialogRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.FEEDBACK_DIALOG_PREFERENCE_LABEL);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getFeedbackDialogPreferenceValue();
        playExpect(value).toBe(false);
      });
      test('Reset Feedback Dialog preference to default', async () => {
        await preferencesPage.resetPreference(preferencesPage.FEEDBACK_DIALOG_PREFERENCE_LABEL);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getFeedbackDialogPreferenceValue();
        playExpect(value).toBe(true);
      });
      test('Toggle Feedback Dialog preference', async () => {
        await preferencesPage.toggleFeedbackDialogPreference();

        value = await preferencesPage.getFeedbackDialogPreferenceValue();
        playExpect(value).toBe(false);
      });
    });

  test.describe
    .serial('Verify [user + locked] Toast preference', () => {
      let toastRow: Locator;
      let value: boolean;
      test('Check Toast preference state', async () => {
        toastRow = preferencesPage.getPreferenceRowByName(preferencesPage.TOAST_PREFERENCE_LABEL);
        await playExpect(toastRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.TOAST_PREFERENCE_LABEL);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getToastPreferenceValue();
        playExpect(value).toBeTruthy();
      });
      test('Attempt and fail to change Toast preference', async () => {
        const selectionToggle = toastRow.getByLabel('Display a notification toast when task is created');
        await playExpect(selectionToggle).toBeDisabled();
      });
      test('Attempt and fail to reset managed Toast preference', async () => {
        const resetButton = toastRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });

  test.describe
    .serial('Verify [default] Zoom Level preference', () => {
      let zoomLevelRow: Locator;
      let value: string;
      test('Check Zoom Level preference state', async () => {
        zoomLevelRow = preferencesPage.getPreferenceRowByName(preferencesPage.ZOOM_LEVEL_PREFERENCE_LABEL);
        await playExpect(zoomLevelRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.ZOOM_LEVEL_PREFERENCE_LABEL);
        playExpect(isManaged).toBeFalsy();

        value = await preferencesPage.getZoomLevelPreferenceValue();
        playExpect(value).toBe('0.5');
      });
      test('Change Zoom Level preference to 1.0', async () => {
        await preferencesPage.setZoomLevelPreference('1.0');

        value = await preferencesPage.getZoomLevelPreferenceValue();
        playExpect(value).toBe('1');
      });
      test.fail('Reset Zoom Level preference to default', async () => {
        // Fails because of https://github.com/podman-desktop/podman-desktop/issues/16000
        await preferencesPage.resetPreference(preferencesPage.ZOOM_LEVEL_PREFERENCE_LABEL);
        await preferencesPage.page.waitForTimeout(1000); // wait for reset to apply

        value = await preferencesPage.getZoomLevelPreferenceValue();
        playExpect(value).toBe('0.5');
      });
    });

  test.describe
    .serial('Verify [default + locked] Exit On Close preference', () => {
      let exitOnCloseRow: Locator;
      let value: boolean;
      test('Check Exit On Close preference state', async () => {
        exitOnCloseRow = preferencesPage.getPreferenceRowByName(preferencesPage.EXIT_ON_CLOSE_PREFERENCE_LABEL);
        await playExpect(exitOnCloseRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.EXIT_ON_CLOSE_PREFERENCE_LABEL);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getExitOnClosePreferenceValue();
        playExpect(value).toBeFalsy();
      });
      test('Attempt and fail to change Exit On Close preference', async () => {
        const selectionToggle = exitOnCloseRow.getByLabel(
          'Quit the app when the close button is clicked instead of minimizing to the tray.',
        );
        await playExpect(selectionToggle).toBeDisabled();
      });
      test('Attempt and fail to reset managed Exit On Close preference', async () => {
        const resetButton = exitOnCloseRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });

  test.describe
    .serial('Verify [locked] Line Height preference', () => {
      let lineHeightRow: Locator;
      let value: string;
      test('Check Line Height preference state', async () => {
        lineHeightRow = preferencesPage.getPreferenceRowByName(preferencesPage.LINE_HEIGHT_PREFERENCE_LABEL);
        await playExpect(lineHeightRow).toBeAttached();

        const isManaged = await preferencesPage.isPreferenceManaged(preferencesPage.LINE_HEIGHT_PREFERENCE_LABEL);
        playExpect(isManaged).toBeTruthy();

        value = await preferencesPage.getLineHeightPreferenceValue();
        playExpect(value).toBe('1');
      });
      test('Attempt and fail to change Line Height preference', async () => {
        const preferenceInput = lineHeightRow.getByLabel(
          'Line height of the terminal. This number is multiplied by the terminal font size to get the actual terminal height in pixels.',
        );
        await playExpect(preferenceInput).toBeDisabled();
      });
      test('Attempt and fail to reset managed Line Height preference', async () => {
        const resetButton = lineHeightRow.getByRole('button', { name: 'Reset to default value' });
        await playExpect(resetButton).not.toBeAttached();
      });
    });
});
