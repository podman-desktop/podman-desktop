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

import type { Locator, Page } from '@playwright/test';
import { expect as playExpect, test } from '@playwright/test';

import {
  developerSandboxExtension,
  extensionsInstallationSmokeList,
  openshiftCheckerExtension,
  openshiftDockerExtension,
  openshiftLocalExtension,
} from '../model/core/extensions';
import { ExtensionState } from '../model/core/states';
import { DashboardPage } from '../model/pages/dashboard-page';
import { ExtensionCatalogCardPage } from '../model/pages/extension-catalog-card-page';
import { ExtensionsPage } from '../model/pages/extensions-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { SettingsBar } from '../model/pages/settings-bar';
import { WelcomePage } from '../model/pages/welcome-page';
import { NavigationBar } from '../model/workbench/navigation';
import { Runner } from '../runner/podman-desktop-runner';

let pdRunner: Runner;
let page: Page;

let extensionDashboardStatus: Locator | undefined;
let extensionDashboardProvider: Locator | undefined;
let resourceLabel: string | undefined;
let ociImageUrl: string;

let navigationBar: NavigationBar;

async function _startup(extensionLabel: string): Promise<void> {
  pdRunner = await Runner.getInstance();
  page = pdRunner.getPage();
  pdRunner.setVideoAndTraceName(`${extensionLabel}-installation-e2e`);

  const welcomePage = new WelcomePage(page);
  await welcomePage.handleWelcomePage(true);

  navigationBar = new NavigationBar(page);
}

for (const {
  extensionLabel,
  extensionFullLabel,
  extensionName,
  extensionFullName,
} of extensionsInstallationSmokeList) {
  test.describe.serial(`Extension installation for ${extensionName}`, { tag: '@smoke' }, () => {
    test.beforeAll(async () => {
      await _startup(extensionLabel);
    });
    test.afterAll(async () => {
      await pdRunner.close();
    });

    test('Initialize extension type', async () => {
      initializeLocators(extensionName);
      await navigationBar.openExtensions();
    });

    test('Install extension through Extensions Catalog', async () => {
      test.skip(
        extensionName === openshiftCheckerExtension.extensionName ||
          extensionName === openshiftDockerExtension.extensionName,
      );
      test.setTimeout(200_000);

      const extensionsPage = new ExtensionsPage(page);
      await playExpect(extensionsPage.heading).toBeVisible();

      await extensionsPage.openCatalogTab();
      const extensionCatalog = new ExtensionCatalogCardPage(page, extensionName);
      await playExpect(extensionCatalog.parent).toBeVisible();

      await playExpect.poll(async () => await extensionCatalog.isInstalled()).toBeFalsy();
      await extensionCatalog.install(180_000);

      await extensionsPage.openInstalledTab();
      await playExpect.poll(async () => await extensionsPage.extensionIsInstalled(extensionFullLabel)).toBeTruthy();
    });

    test('Install extension from OCI Image', async () => {
      test.skip(
        extensionName !== openshiftCheckerExtension.extensionName &&
          extensionName !== openshiftDockerExtension.extensionName,
      );
      test.setTimeout(200_000);

      const extensionsPage = new ExtensionsPage(page);

      await extensionsPage.installExtensionFromOCIImage(ociImageUrl, 180_000);
      if (extensionName !== openshiftDockerExtension.extensionName) {
        await extensionsPage.openCatalogTab();
        const extensionCatalog = new ExtensionCatalogCardPage(page, extensionName);
        await playExpect(extensionCatalog.parent).toBeVisible();
        await playExpect.poll(async () => await extensionCatalog.isInstalled()).toBeTruthy();
      }

      await extensionsPage.openInstalledTab();
      await playExpect
        .poll(async () => await extensionsPage.extensionIsInstalled(extensionFullLabel), { timeout: 15_000 })
        .toBeTruthy();
    });

    test.describe
      .serial('Extension verification after installation', () => {
        test('Extension details can be opened', async () => {
          const extensionsPage = await navigationBar.openExtensions();

          const extensionDetailsPage = await extensionsPage.openExtensionDetails(
            extensionLabel,
            extensionFullLabel,
            extensionFullName,
          );
          await playExpect(extensionDetailsPage.status).toBeVisible({ timeout: 15000 });
        });

        test('Extension is active and there are not errors', async () => {
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

        test.describe
          .serial('Extension can be disabled and reenabled', () => {
            test.skip(
              extensionName === openshiftDockerExtension.extensionName,
              'OpenShift Docker extension cannot be disabled',
            );

            test('Disable extension and verify Dashboard and Resources components if present', async () => {
              const extensionsPage = await navigationBar.openExtensions();
              const extensionPage = await extensionsPage.openExtensionDetails(
                extensionLabel,
                extensionFullLabel,
                extensionFullName,
              );

              await extensionPage.disableExtension();
              await playExpect(extensionPage.status).toHaveText(ExtensionState.Disabled);

              // check that dashboard card provider is hidden/shown
              if (extensionDashboardProvider && extensionDashboardStatus) {
                await goToDashboard();
                await playExpect(extensionDashboardProvider).toBeHidden();
              }

              // check that the provider card is on Resources Page
              if (resourceLabel) {
                const settingsBar = await goToSettings();
                const resourcesPage = await settingsBar.openTabPage(ResourcesPage);
                const extensionResourceBox = resourcesPage.featuredProviderResources.getByRole('region', {
                  name: resourceLabel,
                });
                await playExpect(extensionResourceBox).toBeHidden();
              }
            });

            test('Enable extension and verify Dashboard and Resources components', async () => {
              const extensionsPage = await navigationBar.openExtensions();
              const extensionPage = await extensionsPage.openExtensionDetails(
                extensionLabel,
                extensionFullLabel,
                extensionFullName,
              );

              await extensionPage.enableExtension();
              await playExpect(extensionPage.status).toHaveText(ExtensionState.Active, { timeout: 10000 });

              // check that dashboard card provider is hidden/shown
              if (extensionDashboardProvider && extensionDashboardStatus) {
                await goToDashboard();
                await playExpect(extensionDashboardProvider).toBeVisible();
                await playExpect(extensionDashboardStatus).toBeVisible();
                if (extensionName === developerSandboxExtension.extensionName) {
                  await playExpect(extensionDashboardStatus).toHaveText(ExtensionState.Running);
                } else {
                  await playExpect(extensionDashboardStatus).toHaveText(ExtensionState.NotInstalled);
                }
              }

              // check that the provider card is on Resources Page
              if (resourceLabel) {
                const settingsBar = await goToSettings();
                const resourcesPage = await settingsBar.openTabPage(ResourcesPage);
                const extensionResourceBox = resourcesPage.featuredProviderResources.getByRole('region', {
                  name: resourceLabel,
                });
                await playExpect(extensionResourceBox).toBeVisible();
              }
            });
          });
      });

    test.describe
      .serial('Remove extension and verify UI', () => {
        test('Remove extension and verify components', async () => {
          let extensionsPage = await navigationBar.openExtensions();

          const extensionDetails = await extensionsPage.openExtensionDetails(
            extensionLabel,
            extensionFullLabel,
            extensionFullName,
          );

          if (extensionName !== openshiftDockerExtension.extensionName) {
            await extensionDetails.disableExtension();
          }
          await extensionDetails.removeExtension(false);

          if (extensionName !== openshiftDockerExtension.extensionName) {
            // now if deleted from extension details, the page details are still there, just different
            await playExpect(extensionDetails.status).toHaveText(ExtensionState.Downloadable);
            await playExpect(
              extensionDetails.page.getByRole('button', { name: `Install ${extensionFullLabel} Extension` }),
            ).toBeVisible();
          }

          await goToDashboard();
          extensionsPage = await navigationBar.openExtensions();
          await playExpect
            .poll(async () => extensionsPage.extensionIsInstalled(extensionFullLabel), { timeout: 15_000 })
            .toBeFalsy();
        });
      });
  });
}

function initializeLocators(extensionName: string): void {
  const dashboardPage = new DashboardPage(page);
  switch (extensionName) {
    case developerSandboxExtension.extensionName: {
      extensionDashboardStatus = dashboardPage.devSandboxStatusLabel;
      extensionDashboardProvider = dashboardPage.devSandboxProvider;
      resourceLabel = 'redhat.sandbox';
      ociImageUrl = '';
      break;
    }
    case openshiftLocalExtension.extensionName: {
      extensionDashboardStatus = dashboardPage.openshiftLocalStatusLabel;
      extensionDashboardProvider = dashboardPage.openshiftLocalProvider;
      resourceLabel = 'crc';
      ociImageUrl = '';
      break;
    }
    case openshiftCheckerExtension.extensionName: {
      extensionDashboardStatus = undefined;
      extensionDashboardProvider = undefined;
      resourceLabel = undefined;
      ociImageUrl = 'ghcr.io/redhat-developer/podman-desktop-image-checker-openshift-ext:0.1.5';
      break;
    }
    case openshiftDockerExtension.extensionName: {
      extensionDashboardStatus = undefined;
      extensionDashboardProvider = undefined;
      resourceLabel = undefined;
      ociImageUrl = 'redhatdeveloper/openshift-dd-ext:0.0.1-100';
      break;
    }
  }
}

async function goToDashboard(): Promise<void> {
  const navigationBar = page.getByRole('navigation', { name: 'AppNavigation' });
  const dashboardLink = navigationBar.getByRole('link', { name: 'Dashboard' });
  await playExpect(dashboardLink).toBeVisible();
  await dashboardLink.click();
}

async function goToSettings(): Promise<SettingsBar> {
  const navigationBar = page.getByRole('navigation', { name: 'AppNavigation' });
  const settingsLink = navigationBar.getByRole('link', { name: 'Settings' });
  await playExpect(settingsLink).toBeVisible();
  await settingsLink.click();
  return new SettingsBar(page);
}
