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

import { ContainerState } from '/@/model/core/states';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteContainer, deleteImage, deleteSecret, isPodmanCliVersionAtLeast } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const testSecretMountName = 'e2e-secret-mount';
const testSecretMountData = 'mount-secret-data';
const testSecretEnvName = 'e2e-secret-env';
const testSecretEnvData = 'env-secret-data';
const testContainerName = 'e2e-secret-test-container';
const testImageName = 'ghcr.io/linuxcontainers/alpine';
const secretMountPath = '/run/secrets/e2e-secret-mount';
const secretEnvVarName = 'SECRET_ENV_VAR';

test.skip(
  !isPodmanCliVersionAtLeast('5.7.0'),
  'Skipping secret smoke tests since Podman CLI version is less than 5.7.0 or not available',
);

test.describe
  .serial('Secret smoke tests', { tag: ['@smoke'] }, () => {
    test.beforeAll(async ({ runner, welcomePage, page }) => {
      runner.setVideoAndTraceName('secret-smoke');
      await welcomePage.handleWelcomePage(true);
      await waitForPodmanMachineStartup(page);
    });

    test.afterAll(async ({ runner, page }) => {
      try {
        await deleteContainer(page, testContainerName);
        await deleteSecret(page, testSecretMountName);
        await deleteSecret(page, testSecretEnvName);
        await deleteImage(page, testImageName);
      } finally {
        await runner.close();
      }
    });

    test('Create mount secret and verify it exists', async ({ navigationBar }) => {
      const secretsPage = await navigationBar.openSecrets();
      await playExpect(secretsPage.heading).toBeVisible();

      await secretsPage.createSecret(testSecretMountName, testSecretMountData);

      await playExpect
        .poll(async () => await secretsPage.getSecretRowByName(testSecretMountName), { timeout: 30_000 })
        .toBeTruthy();
    });

    test('Create env secret and verify it exists', async ({ navigationBar }) => {
      const secretsPage = await navigationBar.openSecrets();
      await playExpect(secretsPage.heading).toBeVisible();

      await secretsPage.createSecret(testSecretEnvName, testSecretEnvData);

      await playExpect
        .poll(async () => await secretsPage.getSecretRowByName(testSecretEnvName), { timeout: 30_000 })
        .toBeTruthy();
    });

    test('Pull image for secret container test', async ({ navigationBar }) => {
      test.setTimeout(90_000);

      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      await imagesPage.pullImage(testImageName);

      await playExpect
        .poll(async () => await imagesPage.waitForImageExists(testImageName, 60_000), { timeout: 0 })
        .toBeTruthy();
    });

    test('Start container with secret mappings', async ({ navigationBar }) => {
      test.setTimeout(90_000);

      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();

      const imageDetails = await imagesPage.openImageDetails(testImageName);
      await playExpect(imageDetails.heading).toBeVisible();

      const runImagePage = await imageDetails.openRunImage();
      await playExpect(runImagePage.heading).toBeVisible();

      await runImagePage.activateTab('Basic');
      await playExpect(runImagePage.containerNameInput).toBeVisible();
      await runImagePage.containerNameInput.fill(testContainerName);

      await playExpect(runImagePage.containerEntryPointInput).toBeVisible();
      await runImagePage.containerEntryPointInput.fill('/bin/sh');

      await playExpect(runImagePage.containerComamndInput).toBeVisible();
      await runImagePage.containerComamndInput.fill(`-c "cat ${secretMountPath} && echo \\$${secretEnvVarName}"`);

      await runImagePage.addSecretMapping(testSecretMountName, 'mount', secretMountPath);
      await runImagePage.addSecretMapping(testSecretEnvName, 'env', secretEnvVarName);

      await runImagePage.startContainer(testContainerName);

      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await containersPage.getContainerRowByName(testContainerName), { timeout: 60_000 })
        .toBeTruthy();
    });

    test('Verify container inspect shows secrets', async ({ navigationBar }) => {
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      const containerDetails = await containersPage.openContainersDetails(testContainerName);
      await playExpect(containerDetails.heading).toContainText(testContainerName);

      await playExpect
        .poll(async () => await containerDetails.searchInInspectEditor(testSecretMountName), { timeout: 10_000 })
        .toBeTruthy();
    });

    test('Delete the secret container', async ({ navigationBar }) => {
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      const containerDetails = await containersPage.openContainersDetails(testContainerName);
      await playExpect(containerDetails.heading).toContainText(testContainerName);

      const state = await containerDetails.getState();
      if (state === ContainerState.Running) {
        await containerDetails.stopContainer();
        const regexp = new RegExp(`${ContainerState.Stopped}|${ContainerState.Exited}`);
        await playExpect.poll(async () => await containerDetails.getState(), { timeout: 30_000 }).toMatch(regexp);
      }

      const updatedContainersPage = await containerDetails.deleteContainer();
      await playExpect(updatedContainersPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await updatedContainersPage.getContainerRowByName(testContainerName), { timeout: 30_000 })
        .toBeFalsy();
    });

    test('Delete secret from secrets list page and verify it was removed', async ({ navigationBar }) => {
      const secretsPage = await navigationBar.openSecrets();
      await playExpect(secretsPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await secretsPage.getSecretRowByName(testSecretMountName), { timeout: 30_000 })
        .toBeTruthy();

      await secretsPage.deleteSecret(testSecretMountName);
      await playExpect
        .poll(async () => await secretsPage.getSecretRowByName(testSecretMountName), { timeout: 30_000 })
        .toBeFalsy();
    });

    test('Delete secret from details page and verify it was removed', async ({ navigationBar }) => {
      const secretsPage = await navigationBar.openSecrets();
      await playExpect(secretsPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await secretsPage.getSecretRowByName(testSecretEnvName), { timeout: 30_000 })
        .toBeTruthy();

      const secretDetails = await secretsPage.openSecretDetails(testSecretEnvName);
      await playExpect(secretDetails.heading).toBeVisible({ timeout: 30_000 });

      const updatedSecretsPage = await secretDetails.deleteSecret();
      await playExpect(updatedSecretsPage.heading).toBeVisible();

      await playExpect
        .poll(async () => await updatedSecretsPage.getSecretRowByName(testSecretEnvName), { timeout: 30_000 })
        .toBeFalsy();
    });
  });
