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

import type { Page } from '@playwright/test';
import { expect as playExpect, test } from '@playwright/test';

import { extensionsPackExtension as rhextpack, extensionsRHPackList } from '../model/core/extensions';
import { ExtensionState } from '../model/core/states';
import { ExtensionCatalogCardPage } from '../model/pages/extension-catalog-card-page';
import { ExtensionsPage } from '../model/pages/extensions-page';
import { WelcomePage } from '../model/pages/welcome-page';
import { NavigationBar } from '../model/workbench/navigation';
import { Runner } from '../runner/podman-desktop-runner';

let pdRunner: Runner;
let page: Page;
let navigationBar: NavigationBar;

test.describe
  .serial(`Red Hat Extension pack extension installation`, () => {
    test.beforeAll(async () => {
      pdRunner = await Runner.getInstance();
      page = pdRunner.getPage();
      pdRunner.setVideoAndTraceName('rh-pack-extension-installation-e2e');

      const welcomePage = new WelcomePage(page);
      await welcomePage.handleWelcomePage(true);
      navigationBar = new NavigationBar(page);
    });

    test.afterAll(async () => {
      await pdRunner.close();
    });

    test('Install RH Pack extension through Extensions Catalog', async () => {
      test.setTimeout(200_000);

      await navigationBar.openExtensions();
      const extensionsPage = new ExtensionsPage(page);
      await playExpect(extensionsPage.heading).toBeVisible();

      await extensionsPage.openCatalogTab();
      const extensionCatalog = new ExtensionCatalogCardPage(page, rhextpack.extensionName);
      await playExpect(extensionCatalog.parent).toBeVisible();

      await playExpect.poll(async () => await extensionCatalog.isInstalled()).toBeFalsy();
      await extensionCatalog.install(180_000);

      await extensionsPage.openInstalledTab();
      await playExpect
        .poll(async () => await extensionsPage.extensionIsInstalled(rhextpack.extensionLabel))
        .toBeTruthy();
    });

    for (const { extensionName, extensionFullName, extensionLabel, extensionFullLabel } of extensionsRHPackList) {
      test.describe
        .serial(`Extension verification after installation - ${extensionName}`, () => {
          test('Extension details can be opened', async () => {
            await navigationBar.openExtensions();
            const extensionsPage = new ExtensionsPage(page);

            const extensionDetailsPage = await extensionsPage.openExtensionDetails(
              extensionLabel,
              extensionFullLabel,
              extensionFullName,
            );
            await playExpect(extensionDetailsPage.status).toBeVisible({ timeout: 15000 });
          });

          test('Extension is active and there are no errors', async () => {
            const extensionsPage = await navigationBar.openExtensions();
            const extensionPage = await extensionsPage.openExtensionDetails(
              extensionLabel,
              extensionFullLabel,
              extensionFullName,
            );
            await playExpect(extensionPage.heading).toBeVisible();
            await playExpect(extensionPage.status).toHaveText(ExtensionState.Active);
            // tabs are empty in case there is no error. If there is error, there are two tabs' buttons present
            const errorTab = extensionPage.tabs.getByRole('button', { name: 'Error' });
            // we would like to propagate the error's stack trace into test failure message
            let stackTrace = '';
            if ((await errorTab.count()) > 0) {
              stackTrace = await errorTab.innerText();
            }
            await playExpect(errorTab, `Error Tab was present with stackTrace: ${stackTrace}`).not.toBeVisible();
          });

          test('Disable and re-enable extension', async () => {
            const extensionsPage = await navigationBar.openExtensions();
            const extensionPage = await extensionsPage.openExtensionDetails(
              extensionLabel,
              extensionFullLabel,
              extensionFullName,
            );

            await extensionPage.disableExtension();
            await playExpect(extensionPage.status).toHaveText(ExtensionState.Disabled);

            await extensionPage.enableExtension();
            await playExpect(extensionPage.status).toHaveText(ExtensionState.Active);
          });
        });
    }

    test('Remove RH Pack extension and verify UI', async () => {
      let extensionsPage = await navigationBar.openExtensions();

      const extensionDetails = await extensionsPage.openExtensionDetails(
        rhextpack.extensionLabel,
        rhextpack.extensionFullLabel,
        rhextpack.extensionFullName,
      );

      await extensionDetails.disableExtension();
      await extensionDetails.removeExtension();

      // now if deleted from extension details, the page details still there, just different
      await playExpect(extensionDetails.status).toHaveText(ExtensionState.Downloadable);
      await playExpect(extensionDetails.page.getByLabel(`Install ${rhextpack.extensionFullLabel}`)).toBeVisible();

      extensionsPage = await navigationBar.openExtensions();
      playExpect(await extensionsPage.extensionIsInstalled(rhextpack.extensionLabel)).toBeFalsy();
    });
  });
