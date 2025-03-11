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

import { ArchitectureType } from '../model/core/platforms';
import type { ImagesPage } from '../model/pages/images-page';
import { expect as playExpect, test } from '../utility/fixtures';
import { deleteImageManifest } from '../utility/operations';
import { isWindows } from '../utility/platform';
import { getProviderLabel } from '../utility/provider';
import { waitForPodmanMachineStartup } from '../utility/wait';

const architectures: string[] = [ArchitectureType.AMD64, ArchitectureType.ARM64];
const imageNameSimple: string = 'manifest-test-simple';
const imageNameComplex: string = 'manifest-test-complex';
const manifestNameSimple: string = `localhost/${imageNameSimple} (manifest)`;
const manifestNameComplex: string = `localhost/${imageNameComplex} (manifest)`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let imagesPage: ImagesPage;
let skipTests: boolean = false;

let provider: string | undefined;

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName('image-manifest-smoke-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  provider = await getProviderLabel(page);

  imagesPage = await navigationBar.openImages();
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Image Manifest E2E Validation', { tag: '@smoke' }, () => {
  test.describe
    .serial('Image Manifest Validation - Simple Containerfile', () => {
      test('Build the image using cross-arch build (simple )', async () => {
        await playExpect(imagesPage.heading).toBeVisible();

        const buildImagePage = await imagesPage.openBuildImage();
        await playExpect(buildImagePage.heading).toBeVisible();
        const dockerfilePath = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
        const contextDirectory = path.resolve(__dirname, '..', '..', 'resources');

        imagesPage = await buildImagePage.buildImage(imageNameSimple, dockerfilePath, contextDirectory, architectures);
        await playExpect.poll(async () => await imagesPage.waitForImageExists(manifestNameSimple)).toBeTruthy();
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(4);
        await imagesPage.toggleImageManifest(manifestNameSimple);
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(2);
      });
      test('Check Manifest details', async () => {
        const imageDetailsPage = await imagesPage.openImageDetails(manifestNameSimple);

        await Promise.all(
          architectures.map(async architecture => {
            await playExpect(imageDetailsPage.tabContent).toContainText(architecture);
          }),
        );
        await playExpect(imageDetailsPage.backLink).toBeVisible();
        await imageDetailsPage.backLink.click();
      });
      test('Delete Manifest', async ({ page }) => {
        await deleteImageManifest(page, manifestNameSimple);
      });
    });
  test.describe
    .serial('Image Manifest Validation - Complex Containerfile', () => {
      test('Build the image using cross-arch build (complex)', async ({ page }) => {
        await playExpect(imagesPage.heading).toBeVisible();

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
            imageNameComplex,
            dockerfilePath,
            contextDirectory,
            architectures,
          );
        } catch (error) {
          skipTests = true;
          await deleteImageManifest(page, manifestNameComplex);
          if (isWindows && provider === 'Wsl') {
            console.log('Building cross-architecture images with the WSL hypervisor is not working yet');
            test.fail();
          } else {
            throw error;
          }
        }

        await playExpect.poll(async () => await imagesPage.waitForImageExists(manifestNameComplex)).toBeTruthy();
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(4);
        await imagesPage.toggleImageManifest(manifestNameComplex);
        await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(2);
      });
      test('Check Manifest details', async () => {
        test.skip(skipTests, 'Build manifest failed, manifest should be already deleted, skipping the test');

        const imageDetailsPage = await imagesPage.openImageDetails(manifestNameComplex);
        await Promise.all(
          architectures.map(async architecture => {
            await playExpect(imageDetailsPage.tabContent).toContainText(architecture);
          }),
        );
        await playExpect(imageDetailsPage.backLink).toBeVisible();
        await imageDetailsPage.backLink.click();
      });
      test('Delete Manifest', async ({ page }) => {
        test.skip(skipTests, 'Build manifest failed, manifest should be already deleted, skipping the test');

        await deleteImageManifest(page, manifestNameComplex);
      });
    });
});
