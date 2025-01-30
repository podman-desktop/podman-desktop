/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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
import type { ImagesPage } from '../model/pages/images-page';
import { NavigationBar } from '../model/workbench/navigation';
import { expect as playExpect, test } from '../utility/fixtures';
import { waitForPodmanMachineStartup, waitWhile } from '../utility/wait';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('stress-test-ui-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  // wait giving a time to podman desktop to load up
  let images: ImagesPage;
  try {
    images = await new NavigationBar(page).openImages();
  } catch (error) {
    await runner.screenshot('error-on-open-images.png');
    throw error;
  }
  await waitWhile(async () => await images.pageIsEmpty(), {
    sendError: false,
    message: 'Images page is empty, there are no images present',
  });
});

test.afterAll(async () => {
  test.setTimeout(90000);
});

test.describe
  .serial('Verification of UI handling lots of objects', () => {
    test(`Verification of images`, async ({ navigationBar }) => {
      test.setTimeout(90_000);
      const images = await navigationBar.openImages();
      for (let imgNum = 1; imgNum <= 10; imgNum++) {
        await playExpect
          .poll(async () => await images.waitForImageExists(`quay.io/my-image-${imgNum}`), { timeout: 10_000 })
          .toBeTruthy();
      }
    });

    test(`Verification of containers`, async ({ navigationBar }) => {
      test.setTimeout(90_000);
      const containers = await navigationBar.openContainers();
      for (let containerNum = 1; containerNum <= 10; containerNum++) {
        await playExpect
          .poll(async () => await containers.containerExists(`my-container-${containerNum}`), { timeout: 10_000 })
          .toBeTruthy();
      }
    });

    test(`Verification of pods`, async ({ navigationBar }) => {
      test.setTimeout(90_000);
      const pods = await navigationBar.openPods();
      for (let podNum = 1; podNum <= 10; podNum++) {
        await playExpect.poll(async () => await pods.podExists(`my-pod-${podNum}`), { timeout: 10_000 }).toBeTruthy();
      }
    });
  });
