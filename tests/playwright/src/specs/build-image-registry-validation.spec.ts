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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { RegistriesPage } from '/@/model/pages/registries-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isLinux } from '/@/utility/platform';
import {
  backupAuthFile,
  injectInvalidCredentials,
  removeRegistryCredentials,
  restoreAuthFile,
} from '/@/utility/registry-auth-config';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

// Linux CI only: ensure auth.json exists before Electron starts.
// registry-setup.ts sets up fs.watchFile only if auth.json exists at extension activation time,
// so credential changes go undetected without it. macOS/Windows are not affected — Podman
// creates auth.json under os.homedir() during installation.
if (isLinux) {
  const xdgRuntimeDir = process.env.XDG_RUNTIME_DIR;
  if (xdgRuntimeDir) {
    const containersDir = path.join(xdgRuntimeDir, 'containers');
    const authJsonPath = path.join(containersDir, 'auth.json');
    fs.mkdirSync(containersDir, { recursive: true });
    if (!fs.existsSync(authJsonPath)) {
      fs.writeFileSync(authJsonPath, JSON.stringify({ auths: {} }, null, 2), 'utf8');
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRC-style registry: unreachable, and its base64 auth token contains '+' which is illegal
// in Podman's URL-safe X-Registry-Config decoding → HTTP 400 → build fails without validation.
// With validation enabled the unreachable registry is excluded from X-Registry-Config → build succeeds.
const TEST_REGISTRY_URL = 'default-route-openshift-image-registry.apps-crc.testing';
const INVALID_USERNAME = 'kubeadmin';
const INVALID_PASSWORD = 'sha256~fakeTokenForTestingPurposesOnly';

const CONTAINERFILE_PATH = path.resolve(__dirname, '..', '..', 'resources', 'test-containerfile');
const CONTEXT_DIR = path.resolve(__dirname, '..', '..', 'resources');

let authBackupPath: string | undefined;

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('build-image-registry-validation-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  authBackupPath = await backupAuthFile();
});

test.afterAll(async ({ runner }) => {
  try {
    await removeRegistryCredentials(TEST_REGISTRY_URL).catch((error: unknown) => {
      console.log('Failed to remove invalid credentials:', error);
    });
    if (authBackupPath) {
      await restoreAuthFile(authBackupPath).catch((error: unknown) => {
        console.log('Failed to restore auth file backup:', error);
      });
    }
  } finally {
    await runner.close();
  }
});

test.describe
  .serial('Build image registry validation verification', () => {
    test.afterEach(async () => {
      await removeRegistryCredentials(TEST_REGISTRY_URL).catch((error: unknown) => {
        console.log('afterEach cleanup: No credentials to remove or cleanup failed:', error);
      });
    });

    test('Verify registry validation checkbox is enabled by default', async ({ navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeVisible();
      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();
    });

    test('Build succeeds with valid registry and validation enabled', async ({ navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();

      const updatedImagesPage = await buildImagePage.buildImage(
        'valid-registry-build-test',
        CONTAINERFILE_PATH,
        CONTEXT_DIR,
      );

      playExpect(
        await updatedImagesPage.waitForImageExists('docker.io/library/valid-registry-build-test', 30_000),
      ).toBeTruthy();

      await test.step('Clean up test image', async () => {
        const imageDetailsPage = await updatedImagesPage.openImageDetails(
          'docker.io/library/valid-registry-build-test',
        );
        await playExpect(imageDetailsPage.heading).toBeVisible();
        const finalImagesPage = await imageDetailsPage.deleteImage();
        playExpect(
          await finalImagesPage.waitForImageDelete('docker.io/library/valid-registry-build-test', 30_000),
        ).toBeTruthy();
      });
    });

    test('Build succeeds with valid registry and validation disabled', async ({ navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await buildImagePage.toggleRegistryValidation(false);
      await playExpect.poll(async () => await buildImagePage.isRegistryValidationEnabled()).toBe(false);

      const updatedImagesPage = await buildImagePage.buildImage(
        'valid-registry-no-validation-test',
        CONTAINERFILE_PATH,
        CONTEXT_DIR,
      );

      playExpect(
        await updatedImagesPage.waitForImageExists('docker.io/library/valid-registry-no-validation-test', 30_000),
      ).toBeTruthy();

      await test.step('Clean up test image', async () => {
        const imageDetailsPage = await updatedImagesPage.openImageDetails(
          'docker.io/library/valid-registry-no-validation-test',
        );
        await playExpect(imageDetailsPage.heading).toBeVisible();
        const finalImagesPage = await imageDetailsPage.deleteImage();
        playExpect(
          await finalImagesPage.waitForImageDelete('docker.io/library/valid-registry-no-validation-test', 30_000),
        ).toBeTruthy();
      });
    });

    test('Toggle registry validation checkbox', async ({ navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const buildImagePage = await imagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeVisible();

      await playExpect(buildImagePage.registryValidationCheckbox).toBeChecked();

      await buildImagePage.toggleRegistryValidation(false);
      await playExpect.poll(async () => await buildImagePage.isRegistryValidationEnabled()).toBe(false);

      await buildImagePage.toggleRegistryValidation(true);
      await playExpect.poll(async () => await buildImagePage.isRegistryValidationEnabled()).toBe(true);
    });

    test('Build with invalid registry credentials and validation enabled succeeds', async ({ navigationBar }) => {
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

      // Validation silently excludes the unreachable registry from X-Registry-Config;
      // the public base image is pulled anonymously and the build succeeds.
      const updatedImagesPage = await buildImagePage.buildImage(
        'invalid-creds-validation-enabled-test',
        CONTAINERFILE_PATH,
        CONTEXT_DIR,
      );

      await test.step('Verify build succeeded despite invalid credentials', async () => {
        playExpect(
          await updatedImagesPage.waitForImageExists('docker.io/library/invalid-creds-validation-enabled-test', 30_000),
        ).toBeTruthy();
      });

      await test.step('Clean up test image', async () => {
        const imageDetailsPage = await updatedImagesPage.openImageDetails(
          'docker.io/library/invalid-creds-validation-enabled-test',
        );
        await playExpect(imageDetailsPage.heading).toBeVisible();
        const finalImagesPage = await imageDetailsPage.deleteImage();
        playExpect(
          await finalImagesPage.waitForImageDelete('docker.io/library/invalid-creds-validation-enabled-test', 30_000),
        ).toBeTruthy();
      });
    });

    test('Build with invalid registry credentials and validation disabled fails without pre-validation', async ({
      navigationBar,
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

      let currentImagesPage = imagesPage;
      await test.step('Delete cached base image to force registry pull', async () => {
        const baseImageRow = await currentImagesPage.getImageRowByName('ghcr.io/linuxcontainers/alpine');
        if (baseImageRow !== undefined) {
          const imageDetailsPage = await currentImagesPage.openImageDetails('ghcr.io/linuxcontainers/alpine');
          currentImagesPage = await imageDetailsPage.deleteImage();
        }
      });

      const buildImagePage = await currentImagesPage.openBuildImage();
      await playExpect(buildImagePage.heading).toBeVisible();

      await buildImagePage.toggleRegistryValidation(false);
      await playExpect.poll(async () => await buildImagePage.isRegistryValidationEnabled()).toBe(false);

      const updatedImagesPage = await buildImagePage.buildImage(
        'invalid-creds-validation-disabled-test',
        CONTAINERFILE_PATH,
        CONTEXT_DIR,
        { timeout: 40_000, errorExpected: true, errorText: 'failed to parse "X-Registry-Config" header' },
      );

      await test.step('Verify build failed and image was not created', async () => {
        await playExpect
          .poll(
            async () =>
              await updatedImagesPage.getImageRowByName('docker.io/library/invalid-creds-validation-disabled-test'),
          )
          .toBeUndefined();
      });
    });
  });
