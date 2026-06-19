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

import { CommandPalette } from '/@/model/pages/command-palette';
import { ImagesPage } from '/@/model/pages/images-page';
import { canTestInsecureRegistry, setupInsecureRegistry } from '/@/setupFiles/setup-registry';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  createRegistryAndVerify,
  deleteImage,
  deleteRegistry,
  ensureNoImagesPresentCLI,
  pushImageExpectFailure,
} from '/@/utility/operations';
import { isLinux } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const sourceImage = 'ghcr.io/podmandesktop-ci/hello';
let registryUrl: string;
let registryUsername: string;
let registryPassword: string;
let fullImageName: string;

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('insecure-registry-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  await ensureNoImagesPresentCLI(page);

  [registryUrl, registryUsername, registryPassword] = setupInsecureRegistry();
});

test.afterAll(async ({ runner, page }) => {
  try {
    await deleteImage(page, sourceImage).catch((error: unknown) => {
      console.log('Failed to delete source image:', error);
    });
    if (fullImageName) {
      await deleteImage(page, fullImageName).catch((error: unknown) => {
        console.log('Failed to delete tagged image:', error);
      });
    }
    await deleteRegistry(page, registryUrl).catch((error: unknown) => {
      console.log('Failed to delete insecure registry:', error);
    });
  } finally {
    await runner.close();
  }
});

test.skip(!canTestInsecureRegistry(), 'Insecure registry tests are disabled (env vars not set)');

test.describe
  .serial('Push image to insecure registry with self-signed certificate', { tag: '@smoke' }, () => {
    test('Add insecure registry', async ({ page }) => {
      await createRegistryAndVerify(page, registryUrl, registryUsername, registryPassword, registryUrl, true);
    });

    test('Pull source image', async ({ navigationBar }) => {
      let imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const pullImagePage = await imagesPage.openPullImage();
      imagesPage = await pullImagePage.pullImage(sourceImage);
      await playExpect(imagesPage.heading).toBeVisible();

      await imagesPage.waitForRowToExists(sourceImage, 30_000);
    });

    test('Tag image for insecure registry', async ({ page }) => {
      let imagesPage = new ImagesPage(page);
      await playExpect(imagesPage.heading).toBeVisible();

      fullImageName = `${registryUrl}/${registryUsername}/test-image`;

      imagesPage = await imagesPage.renameImage(sourceImage, fullImageName, 'latest');
      await playExpect(imagesPage.heading).toBeVisible();

      await imagesPage.waitForRowToExists(fullImageName, 30_000);
    });

    test('Push image to insecure registry', async ({ navigationBar, page }) => {
      const imagesPage = new ImagesPage(page);
      await playExpect(imagesPage.heading).toBeVisible();

      const imageDetailsPage = await imagesPage.openImageDetails(fullImageName);
      await playExpect(imageDetailsPage.heading).toBeVisible();

      if (isLinux) {
        await imageDetailsPage.pushImage();
      } else {
        const errorText = (await pushImageExpectFailure(page, imageDetailsPage.pushButton)).toLowerCase();
        playExpect(
          errorText.includes('x509') || errorText.includes('certificate') || errorText.includes('tls'),
          `Expected TLS/certificate error in push output, got: ${errorText.substring(0, 200)}`,
        ).toBeTruthy();

        const commandPalette = new CommandPalette(page);
        await commandPalette.executeCommand('Podman: Synchronize certificates to all VMs');

        // TODO: replace with readiness polling (e.g. podman info) once basic flow is validated.
        await page.waitForTimeout(15_000);

        const imagesPageAfterSync = await navigationBar.openImages();
        const imageDetailsAfterSync = await imagesPageAfterSync.openImageDetails(fullImageName);
        await playExpect(imageDetailsAfterSync.heading).toBeVisible();
        await imageDetailsAfterSync.pushImage();
      }
    });

    test('Verify push by re-pulling from insecure registry', async ({ navigationBar }) => {
      let imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const imageDetailPage = await imagesPage.openImageDetails(fullImageName);
      await playExpect(imageDetailPage.heading).toBeVisible();

      imagesPage = await imageDetailPage.deleteImage();
      await playExpect(imagesPage.heading).toBeVisible({ timeout: 30_000 });

      await imagesPage.waitForRowToBeDelete(fullImageName, 60_000);

      const pullImagePage = await imagesPage.openPullImage();
      imagesPage = await pullImagePage.pullImage(fullImageName, 'latest');
      await playExpect(imagesPage.heading).toBeVisible();

      await imagesPage.waitForRowToExists(fullImageName, 30_000);
    });

    test('Remove insecure registry', async ({ page }) => {
      await deleteRegistry(page, registryUrl);
    });
  });
