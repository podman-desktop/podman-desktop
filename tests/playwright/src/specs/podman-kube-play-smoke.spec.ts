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

import { ImageState, PodState } from '/@/model/core/states';
import { PodmanKubePlayOptions } from '/@/model/core/types';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteImage, deletePod } from '/@/utility/operations';
import { isCI, isLinux } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const POD_NAME_FROM_SCRATCH: string = 'podman-kube-play-test';
const POD_NAME_BUILD_OPTION: string = 'podman-kube-play-build-test';
const LOCAL_IMAGE_NAME: string = 'localhost/foobar';
const NGINX_IMAGE: string = 'ghcr.io/podmandesktop-ci/nginx:latest';
const NGINX_IMAGE_NAME: string = 'ghcr.io/podmandesktop-ci/nginx';
const JSON_RESOURCE_DEFINITION = `{"apiVersion":"v1","kind":"Pod","metadata":{"name":"${POD_NAME_FROM_SCRATCH}"},"spec":{"containers":[{"name":"my-container","image":"${NGINX_IMAGE}","ports":[{"containerPort":80,"hostPort":8080}]}]}}`;
const CONTAINER_IMAGE: string = `${LOCAL_IMAGE_NAME}:latest`;
const CONTAINER_NAME: string = `${POD_NAME_BUILD_OPTION}-container`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POD_BUILD_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'podman-kube-play',
  'podman-kube-play-build-test.yaml',
);

test.describe.serial('Podman Kube Play Yaml - Create Pod from Scratch', { tag: '@smoke' }, () => {
  test.beforeAll(async ({ runner, page, welcomePage }) => {
    runner.setVideoAndTraceName('podman-kube-play-from-scratch-smoke');
    await welcomePage.handleWelcomePage(true);
    await waitForPodmanMachineStartup(page);
  });

  test.afterAll(async ({ page, runner }) => {
    try {
      await deletePod(page, POD_NAME_FROM_SCRATCH);
      await deleteImage(page, NGINX_IMAGE_NAME);
    } finally {
      await runner.close(); // closes the app
    }
  });

  test('Create pod and verify it is running ', async ({ page, navigationBar }) => {
    test.setTimeout(180_000);

    const podsPage = await navigationBar.openPods();
    const podmanKubePlayPage = await podsPage.openPodmanKubePlay();
    await podmanKubePlayPage.playYaml({
      podmanKubePlayOption: PodmanKubePlayOptions.CreateYamlFileFromScratch,
      jsonResourceDefinition: JSON_RESOURCE_DEFINITION,
    });
    await playExpect
      .poll(async () => await podsPage.podExists(POD_NAME_FROM_SCRATCH), { timeout: 15_000 })
      .toBeTruthy();
    const podDetails = await podsPage.openPodDetails(POD_NAME_FROM_SCRATCH);
    await playExpect.poll(async () => await podDetails.getState(), { timeout: 30_000 }).toBe(PodState.Running);

    await deletePod(page, POD_NAME_FROM_SCRATCH);
    const imagesPage = await navigationBar.openImages();
    await playExpect
      .poll(async () => await imagesPage.getCurrentStatusOfImage(NGINX_IMAGE_NAME))
      .toEqual(ImageState.Unused);
  });
});

test.describe.serial('Podman Kube Play Yaml - with Build flag', { tag: '@smoke' }, () => {
  test.skip(!!isCI && isLinux, 'Skipping E2E test on GitHub Actions due to an outdated Podman version');

  //restarting the app between suites due to issue: https://github.com/podman-desktop/podman-desktop/issues/14273
  test.beforeAll(async ({ runner, page, welcomePage }) => {
    runner.setVideoAndTraceName('podman-kube-play-build-smoke');
    await welcomePage.handleWelcomePage(true);
    await waitForPodmanMachineStartup(page);
  });

  test.afterAll(async ({ page, runner }) => {
    try {
      await deletePod(page, POD_NAME_BUILD_OPTION);
      await deleteImage(page, LOCAL_IMAGE_NAME);
      await deleteImage(page, NGINX_IMAGE_NAME);
    } finally {
      await runner.close();
    }
  });
  test('Create pod and verify it is running', async ({ navigationBar }) => {
    test.setTimeout(180_000);

    const podsPage = await navigationBar.openPods();
    await playExpect(podsPage.heading).toBeVisible();
    const podmanKubePlayPage = await podsPage.openPodmanKubePlay();
    await playExpect(podmanKubePlayPage.heading).toBeVisible();

    await podmanKubePlayPage.playYaml(
      { podmanKubePlayOption: PodmanKubePlayOptions.SelectYamlFile, pathToYaml: POD_BUILD_YAML_PATH },
      true,
    );
    await playExpect(podsPage.heading).toBeVisible();
    await playExpect
      .poll(async () => await podsPage.podExists(POD_NAME_BUILD_OPTION), { timeout: 40_000 })
      .toBeTruthy();
    const podDetails = await podsPage.openPodDetails(POD_NAME_BUILD_OPTION);
    await playExpect(podDetails.heading).toBeVisible();
    await playExpect.poll(async () => await podDetails.getState(), { timeout: 15_000 }).toBe(PodState.Running);
  });
  test('Verify created pod uses localhost image', async ({ page, navigationBar }) => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();
    await playExpect
      .poll(async () => await imagesPage.waitForImageExists(LOCAL_IMAGE_NAME), { timeout: 40_000 })
      .toBeTruthy();
    await playExpect
      .poll(async () => await imagesPage.getCurrentStatusOfImage(LOCAL_IMAGE_NAME), { timeout: 15_000 })
      .toBe(ImageState.Used);

    const containersPage = await navigationBar.openContainers();
    await playExpect(containersPage.heading).toBeVisible();
    await playExpect.poll(async () => containersPage.getContainerImage(CONTAINER_NAME)).toBe(CONTAINER_IMAGE);

    // delete applied pod, check the images now have unused state
    await deletePod(page, POD_NAME_BUILD_OPTION);
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
