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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Page } from '@playwright/test';

import { ArchitectureType } from '/@/model/core/platforms';
import type { ImagesPage } from '/@/model/pages/images-page';
import { RegistriesPage } from '/@/model/pages/registries-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { SettingsBar } from '/@/model/pages/settings-bar';
import { NavigationBar } from '/@/model/workbench/navigation';
import { canTestRegistry, setupRegistry } from '/@/setupFiles/setup-registry';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isWindows } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const architectures: string[] = [ArchitectureType.AMD64, ArchitectureType.ARM64];
const imageNameSimple: string = 'manifest-test-simple';
const imageNameComplex: string = 'manifest-test-complex';
const manifestLabelSimple: string = `localhost/${imageNameSimple}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let imagesPage: ImagesPage;
let skipTests = false;

let provider: string | undefined;

let registryUrl: string;
let registryUsername: string;
let registryPswdSecret: string;
let manifestLabelComplex: string;

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName('image-manifest-smoke-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  const settingsBar = await navigationBar.openSettings();
  await settingsBar.openTabPage(ResourcesPage);

  const podmanResourceCard = new ResourceConnectionCardPage(page, 'podman');
  provider = await podmanResourceCard.getConnectionInfoByLabel('Connection Type');
  console.log('Detected provider type is: ', provider);

  [registryUrl, registryUsername, registryPswdSecret] = setupRegistry();

  // Determine manifest name based on whether registry tests are enabled
  // If registry tests are enabled, use the full registry path; otherwise use localhost
  if (canTestRegistry()) {
    manifestLabelComplex = `${registryUrl}/${registryUsername}/${imageNameComplex}`;
  } else {
    manifestLabelComplex = `localhost/${imageNameComplex}`;
  }

  imagesPage = await navigationBar.openImages();
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Image Manifest E2E Validation', { tag: '@smoke' }, () => {
  test.describe
    .serial('Image Manifest Validation - Simple Containerfile', () => {
      test('Build the image using cross-arch build (simple )', async () => {
        test.setTimeout(120_000);

        await playExpect(imagesPage.heading).toBeVisible();

        await playExpect(imagesPage.rowTable).toBeVisible();
        const alreadyPresentImagesCount = await imagesPage.countRowsFromTable();

        const buildImagePage = await imagesPage.openBuildImage();
        await playExpect(buildImagePage.heading).toBeVisible();
        const dockerfilePath = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
        const contextDirectory = path.resolve(__dirname, '..', '..', 'resources');

        imagesPage = await buildImagePage.buildImage(imageNameSimple, dockerfilePath, contextDirectory, architectures);
        await playExpect
          .poll(async () => imagesPage.waitForImageExists(manifestLabelSimple, 60_000), { timeout: 0 })
          .toBeTruthy();
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(alreadyPresentImagesCount + 4);
        await imagesPage.toggleImageManifest(manifestLabelSimple);
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(alreadyPresentImagesCount + 2);
      });

      test('Check Manifest details', async () => {
        const imageDetailsPage = await imagesPage.openImageDetails(manifestLabelSimple);

        await Promise.all(
          architectures.map(async architecture => {
            await playExpect(imageDetailsPage.tabContent).toContainText(architecture);
          }),
        );
        await playExpect(imageDetailsPage.backLink).toBeVisible();
        await imageDetailsPage.backLink.click();
      });
      test('Delete Manifest', async ({ page }) => {
        await deleteImageManifest(page, manifestLabelSimple);
      });
    });
  test.describe
    .serial('Image Manifest Validation - Complex Containerfile', () => {
      test('Add registry for manifest push', async ({ navigationBar, page }) => {
        test.skip(!canTestRegistry(), 'Registry tests are disabled');

        await navigationBar.openSettings();
        const settingsBar = new SettingsBar(page);
        const registryPage = await settingsBar.openTabPage(RegistriesPage);
        await playExpect(registryPage.heading).toBeVisible();

        await registryPage.createRegistry(registryUrl, registryUsername, registryPswdSecret);

        const registryBox = registryPage.registriesTable.getByLabel('GitHub');
        const username = registryBox.getByText(registryUsername);
        await playExpect(username).toBeVisible();
      });

      test('Build the image using cross-arch build (complex)', async ({ page, navigationBar }) => {
        test.setTimeout(120_000);

        imagesPage = await navigationBar.openImages();
        await playExpect(imagesPage.heading).toBeVisible();

        await playExpect(imagesPage.rowTable).toBeVisible();
        const alreadyPresentImagesCount = await imagesPage.countRowsFromTable();

        const buildImagePage = await imagesPage.openBuildImage();
        await playExpect(buildImagePage.heading).toBeVisible();
        const dockerfilePath = path.resolve(
          __dirname,
          '..',
          '..',
          'resources',
          'alphine-hello',
          'alphine-hello.containerfile',
        );
        const contextDirectory = path.resolve(__dirname, '..', '..', 'resources', 'alphine-hello');

        try {
          imagesPage = await buildImagePage.buildImage(
            manifestLabelComplex,
            dockerfilePath,
            contextDirectory,
            architectures,
          );
        } catch (error) {
          skipTests = true;
          await deleteImageManifest(page, manifestLabelComplex);
          if (!!isWindows && provider?.toLocaleLowerCase().trim() === 'wsl') {
            test.skip(true, 'Building cross-architecture images with the WSL hypervisor is not working yet');
          }
          throw error;
        }

        await playExpect
          .poll(async () => await imagesPage.waitForImageExists(manifestLabelComplex, 60_000), { timeout: 0 })
          .toBeTruthy();
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(alreadyPresentImagesCount + 4);
        await imagesPage.toggleImageManifest(manifestLabelComplex);
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(alreadyPresentImagesCount + 2);
      });

      test('Check Manifest details', async ({ navigationBar }) => {
        test.skip(skipTests, 'Build manifest failed, manifest should be already deleted, skipping the test');

        imagesPage = await navigationBar.openImages();
        await playExpect(imagesPage.heading).toBeVisible();

        const imageDetailsPage = await imagesPage.openImageDetails(manifestLabelComplex);
        await Promise.all(
          architectures.map(async architecture => {
            await playExpect(imageDetailsPage.tabContent).toContainText(architecture);
          }),
        );
        await playExpect(imageDetailsPage.backLink).toBeVisible();
        await imageDetailsPage.backLink.click();
      });

      test('Push manifest to registry', async ({ navigationBar }) => {
        test.skip(!canTestRegistry(), 'Registry tests are disabled');
        test.skip(skipTests, 'Build manifest failed, skipping the test');
        test.setTimeout(150_000);

        imagesPage = await navigationBar.openImages();
        await playExpect(imagesPage.heading).toBeVisible();

        await imagesPage.pushManifest(manifestLabelComplex);
      });

      test('Remove registry after manifest push', async ({ page, navigationBar }) => {
        test.skip(!canTestRegistry(), 'Registry tests are disabled');

        await navigationBar.openSettings();
        const settingsBar = new SettingsBar(page);
        const registryPage = await settingsBar.openTabPage(RegistriesPage);
        await playExpect(registryPage.heading).toBeVisible();

        await registryPage.removeRegistry('GitHub');
        const registryBox = registryPage.registriesTable.getByLabel('GitHub');
        const username = registryBox.getByText(registryUsername);
        await playExpect(username).toBeHidden();
      });

      test('Delete Manifest', async ({ page }) => {
        test.skip(skipTests, 'Build manifest failed, manifest should be already deleted, skipping the test');
        await deleteImageManifest(page, manifestLabelComplex);
      });
    });
});

async function deleteImageManifest(page: Page, manifestName: string): Promise<void> {
  const navigationBar = new NavigationBar(page);
  await navigationBar.openImages();

  await imagesPage.deleteImageManifest(manifestName);
  await playExpect
    .poll(async () => await imagesPage.waitForImageDelete(manifestName, 30_000), { timeout: 0 })
    .toBeTruthy();
  await imagesPage.deleteAllUnusedImages();
  await playExpect.poll(async () => await imagesPage.countRowsFromTable(), { timeout: 30_000 }).toBe(0);
}
