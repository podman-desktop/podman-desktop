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

import { ExtensionState } from '/@/model/core/states';
import type { DashboardPage } from '/@/model/pages/dashboard-page';
import type { ExtensionDetailsPage } from '/@/model/pages/extension-details-page';
import { NavigationBar } from '/@/model/workbench/navigation';
import { expect as playExpect, test } from '/@/utility/fixtures';

const extensionsToTest = [
  {
    regionAreaLabel: 'podman-desktop.lima',
    extensionLabelName: 'lima',
    extensionHeading: 'lima',
  },
  {
    regionAreaLabel: 'podman-desktop.registries',
    extensionLabelName: 'registries',
    extensionHeading: 'registries',
  },
  {
    regionAreaLabel: 'podman-desktop.compose',
    extensionLabelName: 'compose',
    extensionHeading: 'compose',
  },
  {
    regionAreaLabel: 'podman-desktop.docker',
    extensionLabelName: 'docker',
    extensionHeading: 'docker',
  },
  {
    regionAreaLabel: 'podman-desktop.kind',
    extensionLabelName: 'kind',
    extensionHeading: 'kind',
  },
];

let dashboardPage: DashboardPage;
let navigationBar: NavigationBar;

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('builtin-extension-e2e');
  await welcomePage.handleWelcomePage(true);
  navigationBar = new NavigationBar(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

for (const extension of extensionsToTest) {
  test.describe(`Verification of Built-In Extension: ${extension.extensionLabelName}`, {
    tag: ['@smoke', '@windows_sanity', '@macos_sanity'],
  }, () => {
    test.describe.configure({ mode: 'serial', retries: 1 });

    test(`Check ${extension.extensionLabelName} extension is enabled and present`, async () => {
      await verifyBuiltInExtensionStatus(true, extension);
    });

    test(`Check that ${extension.extensionLabelName} extension can be disabled from Extension Page`, async () => {
      const podmanExtensionPage = await openExtensionsPodmanPage(extension);
      await podmanExtensionPage.disableExtension();
      await verifyBuiltInExtensionStatus(false, extension);
    });

    test(`Check that ${extension.extensionLabelName} extension can be re-enabled from Extension Page`, async () => {
      const podmanExtensionPage = await openExtensionsPodmanPage(extension);
      await podmanExtensionPage.enableExtension();
      await verifyBuiltInExtensionStatus(true, extension);
    });
  });
}

async function verifyBuiltInExtensionStatus(
  enabled: boolean,
  ext: { regionAreaLabel: string; extensionLabelName: string; extensionHeading: string },
): Promise<void> {
  dashboardPage = await navigationBar.openDashboard();
  await playExpect(dashboardPage.heading).toBeVisible({ timeout: 20_000 });

  const extensionsPage = await navigationBar.openExtensions();
  const extensionDetailsPage = await extensionsPage.openExtensionDetails(
    ext.extensionLabelName,
    ext.regionAreaLabel,
    ext.extensionHeading,
  );

  const extensionStatusLabel = extensionDetailsPage.status;

  await playExpect(extensionStatusLabel).toBeVisible();
  await extensionStatusLabel.scrollIntoViewIfNeeded();

  if (enabled) {
    await playExpect(extensionStatusLabel).toContainText(ExtensionState.Active, { timeout: 20_000 });
  } else {
    await playExpect(extensionStatusLabel).toContainText(ExtensionState.Disabled, { timeout: 20_000 });
  }

  const extensionsPageAfter = await navigationBar.openExtensions();
  const podmanExtensionPage = await extensionsPageAfter.openExtensionDetails(
    ext.extensionLabelName,
    ext.regionAreaLabel,
    ext.extensionHeading,
  );

  if (enabled) {
    await playExpect(podmanExtensionPage.enableButton).not.toBeVisible({
      timeout: 10_000,
    });
    await playExpect(podmanExtensionPage.disableButton).toBeVisible({
      timeout: 10_000,
    });
    await playExpect(podmanExtensionPage.status.getByText(ExtensionState.Active)).toBeVisible();
  } else {
    await playExpect(podmanExtensionPage.enableButton).toBeVisible({
      timeout: 10_000,
    });
    await playExpect(podmanExtensionPage.disableButton).not.toBeVisible({
      timeout: 10_000,
    });
    await playExpect(podmanExtensionPage.status.getByText(ExtensionState.Disabled)).toBeVisible();
  }
}

async function openExtensionsPodmanPage(ext: {
  regionAreaLabel: string;
  extensionLabelName: string;
  extensionHeading: string;
}): Promise<ExtensionDetailsPage> {
  const extensionsPage = await navigationBar.openExtensions();
  return extensionsPage.openExtensionDetails(ext.extensionLabelName, ext.regionAreaLabel, ext.extensionHeading);
}

test.describe('Extension search filtering', { tag: ['@smoke', '@windows_sanity', '@macos_sanity'] }, () => {
  test.describe.configure({ mode: 'serial' });

  test('Filter installed extensions by name', async () => {
    const extensionsPage = await navigationBar.openExtensions();
    await playExpect(extensionsPage.heading).toBeVisible();
    await extensionsPage.openInstalledTab();

    const totalCards = await extensionsPage.countInstalledExtensionCards();
    playExpect(totalCards).toBeGreaterThan(0);

    const extensionsToFilter = [
      { search: 'podman', label: 'podman-desktop.podman' },
      { search: 'compose', label: 'podman-desktop.compose' },
    ];

    for (const { search, label } of extensionsToFilter) {
      await extensionsPage.filterByName(search);
      await playExpect
        .poll(async () => await extensionsPage.extensionCardIsVisible(label), { timeout: 10_000 })
        .toBeTruthy();
    }

    await extensionsPage.clearFilterByName();
    await playExpect
      .poll(async () => await extensionsPage.countInstalledExtensionCards(), { timeout: 10_000 })
      .toBe(totalCards);
  });

  test('Filter catalog extensions by name', async () => {
    const extensionsPage = await navigationBar.openExtensions();
    await playExpect(extensionsPage.heading).toBeVisible();
    await extensionsPage.openCatalogTab();

    await playExpect
      .poll(async () => await extensionsPage.countCatalogExtensionCards(), { timeout: 10_000 })
      .toBeGreaterThan(0);
    const totalCards = await extensionsPage.countCatalogExtensionCards();

    await extensionsPage.filterByName('Bootable Containers');
    await playExpect
      .poll(async () => await extensionsPage.extensionCardIsVisible('Bootable Containers'), { timeout: 10_000 })
      .toBeTruthy();
    await playExpect
      .poll(async () => await extensionsPage.countCatalogExtensionCards(), { timeout: 10_000 })
      .toBeGreaterThanOrEqual(1);
    const filteredCards = await extensionsPage.countCatalogExtensionCards();
    playExpect(filteredCards).toBeLessThan(totalCards);

    await extensionsPage.clearFilterByName();
    await playExpect
      .poll(async () => await extensionsPage.countCatalogExtensionCards(), { timeout: 10_000 })
      .toBe(totalCards);
  });
});
