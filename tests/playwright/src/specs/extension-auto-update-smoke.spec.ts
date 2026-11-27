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

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { extensionInstallConfigs, podmanQuadletExtension } from '/@/model/core/extensions';
import type { ExtensionDetailsPage } from '/@/model/pages/extension-details-page';
import type { NavigationBar } from '/@/model/workbench/navigation';
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';

const PROFILE_FOLDER = 'extension-auto-update';
const AUTO_UPDATE_DISABLED_KEY = 'extensions.autoUpdateDisabled';

const extension = podmanQuadletExtension;
const extensionImage = extensionInstallConfigs[extension.extensionName]?.ociImageUrl;
const skipExtensionsTest = process.env.SKIP_EXTENSIONS_TEST === 'true';

test.skip(skipExtensionsTest, 'Skip test suite based on env. variable');
test.use({ runnerOptions: new RunnerOptions({ customFolder: PROFILE_FOLDER }) });

let settingsFile: string;

test.beforeAll(async ({ runner, welcomePage }) => {
  test.setTimeout(180_000);

  runner.setVideoAndTraceName('extension-auto-update-e2e');
  settingsFile = join(runner.getTestOutput(), PROFILE_FOLDER, 'configuration', 'settings.json');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner, navigationBar }) => {
  test.setTimeout(90_000);

  try {
    // the extension must not be left installed if a test failed before removing it
    const extensionsPage = await navigationBar.openExtensions();
    if (await extensionsPage.extensionIsInstalled(extension.extensionFullLabel)) {
      const detailsPage = await extensionsPage.openExtensionDetails(
        extension.extensionLabel,
        extension.extensionFullLabel,
        extension.extensionFullName,
      );
      await detailsPage.removeExtension();
    }
  } catch (error) {
    console.log('Error removing the extension:', error);
  } finally {
    await runner.close();
  }
});

/**
 * Read the ids of the extensions having their automatic updates disabled from the settings file.
 */
async function getAutoUpdateDisabledExtensionIds(): Promise<string[]> {
  const settings: unknown = JSON.parse(await readFile(settingsFile, 'utf8'));
  if (!settings || typeof settings !== 'object' || !(AUTO_UPDATE_DISABLED_KEY in settings)) {
    return [];
  }
  const ids = settings[AUTO_UPDATE_DISABLED_KEY];
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
}

async function openExtensionDetails(navigationBar: NavigationBar): Promise<ExtensionDetailsPage> {
  const extensionsPage = await navigationBar.openExtensions();
  return await extensionsPage.openExtensionDetails(
    extension.extensionLabel,
    extension.extensionFullLabel,
    extension.extensionFullName,
  );
}

test.describe('Extension auto-update management', { tag: '@smoke' }, () => {
  test.describe.configure({ mode: 'serial' });

  test('Install an extension from an OCI image', async ({ navigationBar }) => {
    test.setTimeout(200_000);
    if (!extensionImage) throw new Error(`No OCI image configured for extension ${extension.extensionName}`);

    const extensionsPage = await navigationBar.openExtensions();
    await extensionsPage.installExtensionFromOCIImage(extensionImage, 180_000);

    await extensionsPage.openInstalledTab();
    await playExpect
      .poll(async () => await extensionsPage.extensionIsInstalled(extension.extensionFullLabel), { timeout: 15_000 })
      .toBeTruthy();
  });

  test('Automatic updates are enabled by default', async ({ navigationBar }) => {
    const detailsPage = await openExtensionDetails(navigationBar);

    await playExpect(detailsPage.autoUpdateRegion).toBeVisible();
    await playExpect(detailsPage.autoUpdateEnabledLabel).toBeVisible();
    await playExpect(detailsPage.autoUpdateDisableButton).toBeVisible();
    playExpect(await getAutoUpdateDisabledExtensionIds()).not.toContain(extension.extensionFullLabel);
  });

  test('Disable the automatic updates of the extension', async ({ navigationBar }) => {
    const detailsPage = await openExtensionDetails(navigationBar);

    await detailsPage.disableAutoUpdate();

    await playExpect
      .poll(async () => await getAutoUpdateDisabledExtensionIds(), { timeout: 10_000 })
      .toContain(extension.extensionFullLabel);
  });

  test('The disabled automatic updates are kept when reopening the extension', async ({ navigationBar }) => {
    // leave the extension details page, then come back to it
    await navigationBar.openDashboard();
    const detailsPage = await openExtensionDetails(navigationBar);

    await playExpect(detailsPage.autoUpdateDisabledLabel).toBeVisible();
    await playExpect(detailsPage.autoUpdateEnableButton).toBeVisible();
  });

  test('Enable the automatic updates of the extension again', async ({ navigationBar }) => {
    const detailsPage = await openExtensionDetails(navigationBar);

    await detailsPage.enableAutoUpdate();

    await playExpect
      .poll(async () => await getAutoUpdateDisabledExtensionIds(), { timeout: 10_000 })
      .not.toContain(extension.extensionFullLabel);
  });

  test('Uninstalling the extension enables its automatic updates again', async ({ navigationBar, statusBar }) => {
    test.setTimeout(200_000);
    if (!extensionImage) throw new Error(`No OCI image configured for extension ${extension.extensionName}`);

    const detailsPage = await openExtensionDetails(navigationBar);
    await detailsPage.disableAutoUpdate();
    await playExpect
      .poll(async () => await getAutoUpdateDisabledExtensionIds(), { timeout: 10_000 })
      .toContain(extension.extensionFullLabel);

    await detailsPage.removeExtension();
    await playExpect
      .poll(async () => await getAutoUpdateDisabledExtensionIds(), { timeout: 10_000 })
      .not.toContain(extension.extensionFullLabel);

    // clear the tasks of the first installation, so the task of the new one is the only one matching its name
    const tasksPage = await statusBar.openTasksPage();
    await tasksPage.clearAllTasks();
    await tasksPage.closeButton.click();
    await playExpect(tasksPage.tasksManagerWindow).not.toBeVisible();

    // a new installation starts with the automatic updates enabled
    const extensionsPage = await navigationBar.openExtensions();
    await extensionsPage.installExtensionFromOCIImage(extensionImage, 180_000);
    await extensionsPage.openInstalledTab();
    await playExpect
      .poll(async () => await extensionsPage.extensionIsInstalled(extension.extensionFullLabel), { timeout: 15_000 })
      .toBeTruthy();

    const reinstalledDetailsPage = await openExtensionDetails(navigationBar);
    await playExpect(reinstalledDetailsPage.autoUpdateEnabledLabel).toBeVisible();
    await playExpect(reinstalledDetailsPage.autoUpdateDisableButton).toBeVisible();
  });
});
