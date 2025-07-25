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

import { ImageState, PodState } from '../model/core/states';
import { expect as playExpect, test } from '../utility/fixtures';
import { deleteImage, deletePod } from '../utility/operations';
import { isCI, isLinux } from '../utility/platform';
import { waitForPodmanMachineStartup } from '../utility/wait';

const POD_NAME: string = 'play-yaml-build-test';
const LOCAL_IMAGE_NAME: string = 'localhost/foobar';
const NGINX_IMAGE_NAME: string = 'docker.io/library/nginx';
const CONTAINER_IMAGE: string = `${LOCAL_IMAGE_NAME}:latest`;
const CONTAINER_NAME: string = `${POD_NAME}-container`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POD_YAML_PATH: string = path.resolve(__dirname, '..', '..', 'resources', 'kube', 'play-yaml-build-test.yaml');

test.skip(!!isCI && isLinux, 'Skipping E2E test on GitHub Actions due to an outdated Podman version');

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('play-yaml-build-smoke');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ page, runner }) => {
  try {
    await deletePod(page, POD_NAME);
    await deleteImage(page, LOCAL_IMAGE_NAME);
    await deleteImage(page, NGINX_IMAGE_NAME);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Deploy pod via Play YAML using locally built image', { tag: '@smoke' }, () => {
  test('Deploy pod from YAML using build option and verify it is running', async ({ navigationBar }) => {
    const podsPage = await navigationBar.openPods();
    await playExpect(podsPage.heading).toBeVisible();
    const playYamlPage = await podsPage.openPlayKubeYaml();
    await playExpect(playYamlPage.heading).toBeVisible();

    await playYamlPage.playYaml(POD_YAML_PATH, true);
    await playExpect(podsPage.heading).toBeVisible();
    const podDetails = await podsPage.openPodDetails(POD_NAME);
    await playExpect(podDetails.heading).toBeVisible();
    await playExpect.poll(async () => await podDetails.getState(), { timeout: 15_000 }).toBe(PodState.Running);
  });
  test('Verify that the deployed pod container uses the localhost image', async ({ page, navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();
    await playExpect.poll(async () => await imagesPage.getCurrentStatusOfImage(LOCAL_IMAGE_NAME)).toBe('USED');

    const containersPage = await navigationBar.openContainers();
    await playExpect(containersPage.heading).toBeVisible();
    await playExpect.poll(async () => containersPage.getContainerImage(CONTAINER_NAME)).toBe(CONTAINER_IMAGE);

    // delete applied pod, check the images now have unused state
    await deletePod(page, POD_NAME);
    await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();
    await playExpect
      .poll(async () => await imagesPage.getCurrentStatusOfImage(LOCAL_IMAGE_NAME))
      .toEqual(ImageState.Unused);
    await playExpect
      .poll(async () => await imagesPage.getCurrentStatusOfImage(NGINX_IMAGE_NAME))
      .toEqual(ImageState.Unused);
  });
});
