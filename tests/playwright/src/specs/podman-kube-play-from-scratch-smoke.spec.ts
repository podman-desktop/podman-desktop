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

import { ImageState, PodState } from '../model/core/states';
import { PodmanKubePlayOptions } from '../model/core/types';
import { expect as playExpect, test } from '../utility/fixtures';
import { deleteImage, deletePod } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const POD_NAME: string = 'podman-kube-play-test';
const NGINX_IMAGE_NAME: string = 'docker.io/library/nginx';

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('podman-kube-play-from-scratch-smoke');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ page, runner }) => {
  try {
    await deletePod(page, POD_NAME);
    await deleteImage(page, NGINX_IMAGE_NAME);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Podman Kube Play - Create Pod from Scratch', { tag: '@smoke' }, () => {
  test('Deploy pod from YAML and verify it is running ', async ({ page, navigationBar }) => {
    test.setTimeout(60_000);

    const podsPage = await navigationBar.openPods();
    const podmanKubePlayPage = await podsPage.openPodmanKubePlay();
    await podmanKubePlayPage.playYaml(PodmanKubePlayOptions.CreateYamlFileFromScratch);

    await playExpect.poll(async () => await podsPage.podExists(POD_NAME), { timeout: 15_000 }).toBeTruthy();
    const podDetails = await podsPage.openPodDetails(POD_NAME);
    await playExpect.poll(async () => await podDetails.getState(), { timeout: 30_000 }).toBe(PodState.Running);

    await deletePod(page, POD_NAME);
    const imagesPage = await navigationBar.openImages();
    await playExpect
      .poll(async () => await imagesPage.getCurrentStatusOfImage(NGINX_IMAGE_NAME))
      .toEqual(ImageState.Unused);
  });
});
