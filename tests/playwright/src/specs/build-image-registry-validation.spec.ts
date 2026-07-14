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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { RegistriesPage } from '/@/model/pages/registries-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteImage } from '/@/utility/operations';
import {
  backupAuthFile,
  ensureAuthFileExists,
  injectInvalidCredentials,
  removeRegistryCredentials,
  restoreAuthFile,
} from '/@/utility/registry-auth-config';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

// Workaround for https://github.com/podman-desktop/podman-desktop/issues/17610:
// auth.json must exist before Electron starts, otherwise registry-setup.ts skips
// setting up its file watcher and credentials added later are never detected.
// Must run at module scope — the runner fixture launches Electron during fixture
// resolution, before any beforeAll body executes. Remove when #17610 is fixed.
ensureAuthFileExists();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fake registry: unreachable, with credentials containing '~' (not valid base64).
// With validation enabled the unreachable registry is excluded → build succeeds.
// With validation disabled all credentials are sent but the build still succeeds.
const TEST_REGISTRY_URL = 'registry.unreachable-test.localhost';
const INVALID_USERNAME = 'admin';
const INVALID_PASSWORD = 'sha256~fakeTokenForTestingPurposesOnly';

const CONTAINERFILE_PATH = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
const CONTEXT_DIR = path.resolve(__dirname, '..', '..', 'resources');

const BASE_IMAGE = 'ghcr.io/linuxcontainers/alpine';
const BUILD_IMAGE_TAG = 'registry-validation-test';
const BUILD_IMAGE = 'docker.io/library/registry-validation-test';

let authBackupPath: string | undefined;

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('build-image-registry-validation-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  authBackupPath = await backupAuthFile();
});

test.afterAll(async ({ runner, page }) => {
  try {
    await deleteImage(page, BASE_IMAGE);
  } finally {
    await removeRegistryCredentials(TEST_REGISTRY_URL).catch((error: unknown) => {
      console.log('Failed to remove invalid credentials:', error);
    });
    if (authBackupPath) {
      await restoreAuthFile(authBackupPath).catch((error: unknown) => {
        console.log('Failed to restore auth file backup:', error);
      });
    }
    await runner.close();
  }
});

test.describe
  .serial('Build image registry validation verification', () => {
    test('Registry validation checkbox toggles on and off', async ({ navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();
      await buildImagePage.toggleRegistryValidation(false);
      await playExpect(buildImagePage.registryValidationCheckbox).not.toBeChecked();
      await buildImagePage.toggleRegistryValidation(true);
      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();
    });

    test('Build succeeds with validation enabled and no invalid credentials', async ({ navigationBar, page }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();

      const updatedImagesPage = await buildImagePage.buildImage(BUILD_IMAGE_TAG, CONTAINERFILE_PATH, CONTEXT_DIR);

      await playExpect
        .poll(async () => updatedImagesPage.waitForImageExists(BUILD_IMAGE, 30_000), {
          timeout: 0,
        })
        .toBeTruthy();

      await deleteImage(page, BUILD_IMAGE);
      await deleteImage(page, BASE_IMAGE);
    });

    test('Build succeeds with validation disabled and no invalid credentials', async ({ navigationBar, page }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await buildImagePage.toggleRegistryValidation(false);
      await playExpect(buildImagePage.registryValidationCheckbox).not.toBeChecked();

      const updatedImagesPage = await buildImagePage.buildImage(BUILD_IMAGE_TAG, CONTAINERFILE_PATH, CONTEXT_DIR);

      await playExpect
        .poll(async () => updatedImagesPage.waitForImageExists(BUILD_IMAGE, 30_000), {
          timeout: 0,
        })
        .toBeTruthy();

      await deleteImage(page, BUILD_IMAGE);
      await deleteImage(page, BASE_IMAGE);
    });

    test('Build with invalid registry credentials and validation enabled succeeds', async ({ navigationBar, page }) => {
      await test.step('Inject invalid credentials and wait for Podman Desktop to register them', async () => {
        await injectInvalidCredentials(TEST_REGISTRY_URL, INVALID_USERNAME, INVALID_PASSWORD);
        const settingsBar = await navigationBar.openSettings();
        const registriesPage = await settingsBar.openTabPage(RegistriesPage);
        await playExpect(registriesPage.heading).toBeVisible();
        await playExpect
          .poll(async () => (await registriesPage.getRegistryRowByName(TEST_REGISTRY_URL)).isVisible(), {
            timeout: 30_000,
          })
          .toBe(true);
      });

      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();

      const updatedImagesPage = await buildImagePage.buildImage(BUILD_IMAGE_TAG, CONTAINERFILE_PATH, CONTEXT_DIR);

      await playExpect
        .poll(async () => updatedImagesPage.waitForImageExists(BUILD_IMAGE, 30_000), {
          timeout: 0,
        })
        .toBeTruthy();

      await deleteImage(page, BUILD_IMAGE);
      await deleteImage(page, BASE_IMAGE);
    });

    test('Build with invalid registry credentials and validation disabled succeeds', async ({
      navigationBar,
      page,
    }) => {
      await test.step('Inject invalid credentials and wait for Podman Desktop to register them', async () => {
        await injectInvalidCredentials(TEST_REGISTRY_URL, INVALID_USERNAME, INVALID_PASSWORD);
        const settingsBar = await navigationBar.openSettings();
        const registriesPage = await settingsBar.openTabPage(RegistriesPage);
        await playExpect(registriesPage.heading).toBeVisible();
        await playExpect
          .poll(async () => (await registriesPage.getRegistryRowByName(TEST_REGISTRY_URL)).isVisible(), {
            timeout: 30_000,
          })
          .toBe(true);
      });

      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await buildImagePage.toggleRegistryValidation(false);
      await playExpect(buildImagePage.registryValidationCheckbox).not.toBeChecked();

      const updatedImagesPage = await buildImagePage.buildImage(BUILD_IMAGE_TAG, CONTAINERFILE_PATH, CONTEXT_DIR);

      await playExpect
        .poll(async () => updatedImagesPage.waitForImageExists(BUILD_IMAGE, 30_000), {
          timeout: 0,
        })
        .toBeTruthy();

      await deleteImage(page, BUILD_IMAGE);
      await deleteImage(page, BASE_IMAGE);
    });
  });
