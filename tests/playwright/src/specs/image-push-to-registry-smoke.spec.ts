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

import { ImagesPage } from '/@/model/pages/images-page';
import { RegistriesPage } from '/@/model/pages/registries-page';
import { SettingsBar } from '/@/model/pages/settings-bar';
import { canTestRegistry, setupRegistry } from '/@/setupFiles/setup-registry';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteImage, deleteRegistry } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const helloContainer = 'quay.io/podman/hello';
let registryUrl: string;
let registryUsername: string;
let registryPswdSecret: string;
let fullName: string;
const registryName: string = 'GitHub';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('push-image-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);

  [registryUrl, registryUsername, registryPswdSecret] = setupRegistry();
});

test.afterAll(async ({ runner, page }) => {
  try {
    await deleteImage(page, helloContainer).catch((error: unknown) => {
      console.log('Failed to delete hello container image:', error);
    });
    await deleteImage(page, fullName).catch((error: unknown) => {
      console.log('Failed to delete renamed image:', error);
    });
    await deleteRegistry(page, 'GitHub').catch((error: unknown) => {
      console.log('Failed to delete registry:', error);
    });
  } finally {
    await runner.close();
  }
});

test.skip(!canTestRegistry(), 'Registry tests are disabled');

test.describe.serial('Push image to container registry', { tag: '@smoke' }, () => {
  test('Add registry', async ({ navigationBar, page }) => {
    await navigationBar.openSettings();
    const settingsBar = new SettingsBar(page);
    const registryPage = await settingsBar.openTabPage(RegistriesPage);
    await playExpect(registryPage.heading).toBeVisible();

    await registryPage.createRegistry(registryUrl, registryUsername, registryPswdSecret);

    const registryBox = registryPage.registriesTable.getByLabel('GitHub');
    const username = registryBox.getByText(registryUsername);
    await playExpect(username).toBeVisible();
  });

  test('Pull image', async ({ navigationBar }) => {
    let imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    imagesPage = await pullImagePage.pullImage(helloContainer);
    await playExpect(imagesPage.heading).toBeVisible();

    await playExpect
      .poll(async () => imagesPage.waitForRowToExists(helloContainer, 30_000), { timeout: 0 })
      .toBeTruthy();
  });

  test('Rename image', async ({ page }) => {
    let imagesPage = new ImagesPage(page);
    await playExpect(imagesPage.heading).toBeVisible();

    fullName = `${registryUrl}/${registryUsername}/test-image`;

    imagesPage = await imagesPage.renameImage(helloContainer, fullName, 'latest');
    await playExpect(imagesPage.heading).toBeVisible();

    await playExpect
      .poll(async () => imagesPage.waitForRowToExists(fullName, 30_000), {
        timeout: 0,
      })
      .toBeTruthy();
  });

  test('Push image to registry', async ({ page }) => {
    const imagesPage = new ImagesPage(page);
    await playExpect(imagesPage.heading).toBeVisible();

    const imageDetailsPage = await imagesPage.openImageDetails(fullName);
    await playExpect(imageDetailsPage.heading).toBeVisible();

    await imageDetailsPage.pushImage();
  });

  test('Delete image', async ({ navigationBar }) => {
    let imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    await playExpect
      .poll(async () => imagesPage.waitForRowToExists(fullName, 30_000), {
        timeout: 0,
      })
      .toBeTruthy();

    const imageDetailPage = await imagesPage.openImageDetails(fullName);
    await playExpect(imageDetailPage.heading).toBeVisible();

    imagesPage = await imageDetailPage.deleteImage();
    await playExpect(imagesPage.heading).toBeVisible({ timeout: 30_000 });

    await playExpect
      .poll(async () => await imagesPage.waitForRowToBeDelete(fullName, 60_000), { timeout: 0 })
      .toBeTruthy();
  });

  test('Pull image from github repo under new name', async ({ navigationBar }) => {
    let imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    const pullImagePage = await imagesPage.openPullImage();
    imagesPage = await pullImagePage.pullImage(fullName, 'latest');
    await playExpect(imagesPage.heading).toBeVisible();

    await playExpect
      .poll(async () => await imagesPage.waitForRowToExists(fullName, 15_000), { timeout: 0 })
      .toBeTruthy();
  });

  test('Registry removal verification', async ({ page, navigationBar }) => {
    await navigationBar.openSettings();
    const settingsBar = new SettingsBar(page);
    const registryPage = await settingsBar.openTabPage(RegistriesPage);
    await playExpect(registryPage.heading).toBeVisible();

    await registryPage.removeRegistry(registryName);
    const registryBox = registryPage.registriesTable.getByLabel(registryName);
    const username = registryBox.getByText(registryUsername);
    await playExpect(username).toBeHidden();
  });
});
