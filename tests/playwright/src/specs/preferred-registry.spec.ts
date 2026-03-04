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

import { RegistriesPage } from '/@/model/pages/registries-page';
import { NavigationBar } from '/@/model/workbench/navigation';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const imageToSearch = 'fedora';
const defaultPreferred = 'docker.io';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('preferred-registry-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, page }) => {
  try {
    const navigationBar = new NavigationBar(page);
    const settingsBar = await navigationBar.openSettings();
    const registryPage = await settingsBar.openTabPage(RegistriesPage);
    await registryPage.updatePreferredRepositories(defaultPreferred);
  } catch (error: unknown) {
    console.log('Failed to revert preferred registries:', error);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Preferred registry settings verification', { tag: '@smoke' }, () => {
  test('Default search results for fedora are from docker.io', async ({ navigationBar }) => {
    test.setTimeout(90_000);

    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    await playExpect(pullImagePage.heading).toBeVisible();

    await playExpect
      .poll(async () => await pullImagePage.getFirstSearchResultFor(imageToSearch, false), { timeout: 10_000 })
      .toContain('docker.io');
  });

  test('Add quay.io as preferred registry in front of docker.io', async ({ navigationBar }) => {
    const settingsBar = await navigationBar.openSettings();
    const registryPage = await settingsBar.openTabPage(RegistriesPage);
    await playExpect(registryPage.heading).toBeVisible({ timeout: 10_000 });

    await registryPage.addPreferredRepositories(['quay.io']);
  });

  test('Search results for fedora are from quay.io after preference change', async ({ navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    await playExpect(pullImagePage.heading).toBeVisible();

    await playExpect
      .poll(async () => await pullImagePage.getFirstSearchResultFor(imageToSearch, false), { timeout: 10_000 })
      .toContain('quay.io');
  });

  test('Revert preferred registry to default docker.io', async ({ navigationBar }) => {
    const settingsBar = await navigationBar.openSettings();
    const registryPage = await settingsBar.openTabPage(RegistriesPage);
    await playExpect(registryPage.heading).toBeVisible({ timeout: 10_000 });

    await registryPage.updatePreferredRepositories(defaultPreferred);
  });

  test('Search results for fedora are back to docker.io after revert', async ({ navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    await playExpect(pullImagePage.heading).toBeVisible();

    await playExpect
      .poll(async () => await pullImagePage.getFirstSearchResultFor(imageToSearch, false), { timeout: 10_000 })
      .toContain('docker.io');
  });
});
