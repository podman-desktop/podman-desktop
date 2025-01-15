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

import { expect as playExpect, test } from '../utility/fixtures';
import { deleteContainer, deleteImage, runComposeUpFromCLI } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendContainerName = 'backend-1';
const frontendContainerName = 'frontend-1';
const composeContainer = 'resources (compose)';
const backendImageName = 'quay.io/podman-desktop-demo/podify-demo-backend';
const frontendImageName = 'quay.io/podman-desktop-demo/podify-demo-frontend';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('podman-compose-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ page, runner }) => {
  test.setTimeout(180_000);
  try {
    await deleteContainer(page, backendContainerName);
    await deleteContainer(page, frontendContainerName);
    await deleteImage(page, backendImageName);
    await deleteImage(page, frontendImageName);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Compose compose workflow verification', { tag: '@smoke' }, () => {
  test('Check Podman Desktop autorefresh when using podman compose up', async ({ navigationBar }) => {
    test.setTimeout(300_000);

    const composeFilePath = path.resolve(__dirname, '..', '..', 'resources', `compose.yaml`);
    await runComposeUpFromCLI(composeFilePath);

    const containersPage = await navigationBar.openContainers();
    await playExpect(containersPage.heading).toBeVisible();

    await playExpect
      .poll(async () => await containersPage.containerExists(composeContainer), { timeout: 120_000 })
      .toBeTruthy();
    await playExpect
      .poll(async () => await containersPage.containerExists(backendContainerName), { timeout: 120_000 })
      .toBeTruthy();
    await playExpect
      .poll(async () => await containersPage.containerExists(frontendContainerName), { timeout: 120_000 })
      .toBeTruthy();

    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();

    await playExpect.poll(async () => await imagesPage.waitForImageExists(backendImageName)).toBeTruthy();
    await playExpect.poll(async () => await imagesPage.waitForImageExists(frontendImageName)).toBeTruthy();
  });
});
