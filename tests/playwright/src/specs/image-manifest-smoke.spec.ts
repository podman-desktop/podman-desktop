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
import { waitForPodmanMachineStartup } from '../utility/wait';

const architectures: string[] = [ArchitectureType.AMD64, ArchitectureType.ARM64];
const manifestName: string = 'localhost/build-image-test (manifest)';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let imagesPage: ImagesPage;

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  runner.setVideoAndTraceName('pull-image-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  imagesPage = await navigationBar.openImages();
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Image Manifest E2E Validation', { tag: '@smoke' }, () => {
  test('Build the image using cross-arch build', async () => {
    await playExpect(imagesPage.heading).toBeVisible();

    const buildImagePage = await imagesPage.openBuildImage();
    await playExpect(buildImagePage.heading).toBeVisible();
    const dockerfilePath = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
    const contextDirectory = path.resolve(__dirname, '..', '..', 'resources');

    imagesPage = await buildImagePage.buildImage('build-image-test', dockerfilePath, contextDirectory, architectures);
    await playExpect.poll(async () => await imagesPage.waitForImageExists(manifestName)).toBeTruthy();
    await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(4);

    await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(4);
    await imagesPage.toggleImageManifest(manifestName);
    await playExpect.poll(async () => await imagesPage.countRowsFromTable()).toBe(2);
  });
  test('Check Manifest details', async () => {
    const imageDetailsPage = await imagesPage.openImageDetails(manifestName);
    for (const architecture of architectures) {
      await playExpect(imageDetailsPage.tabContent).toContainText(architecture);
    }
    await playExpect(imageDetailsPage.backLink).toBeVisible();
    await imageDetailsPage.backLink.click();
  });
  test('Delete Manifest', async () => {
    await imagesPage.deleteImageManifest(manifestName);
    await playExpect.poll(async () => await imagesPage.waitForImageDelete(manifestName)).toBeTruthy();
    await imagesPage.deleteAllUnusedImages();
    await playExpect.poll(async () => await imagesPage.countRowsFromTable(), { timeout: 10_000 }).toBe(0);
  });
});
