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
import { expect as playExpect, test } from '../../utility/fixtures';
import { isLinux } from '../../utility/platform';
import { waitForPodmanMachineStartup } from '../../utility/wait';

const numberOfObjects = Number(process.env.OBJECT_NUM) || 100;
console.log(`numberOfObjects => ${numberOfObjects}`);

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('ui-stress-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  test.setTimeout(120_000);
  await runner.close();
});

test.describe.serial('Verification of UI handling lots of objects', { tag: ['@ui-stress'] }, () => {
  test(`Verification of ${numberOfObjects + 2} images`, async ({ navigationBar }) => {
    test.setTimeout(300_000);

    const images = await navigationBar.openImages();
    await playExpect(images.heading).toBeVisible({ timeout: 10_000 });
    //count images => 1 original image + (1 tagged * numberOfObjects) + 1 localhost/podman-pause from pods (only ubuntu!) = numberOfObjects + 2
    const expectedImages = isLinux ? numberOfObjects + 2 : numberOfObjects + 1;
    await playExpect.poll(async () => await images.countRowsFromTable(), { timeout: 10_000 }).toBe(expectedImages);
    for (let imgNum = 1; imgNum <= numberOfObjects; imgNum++) {
      await playExpect
        .poll(async () => await images.waitForRowToExists(`localhost/my-image-${imgNum}`), { timeout: 0 })
        .toBeTruthy();
      const imgRowLocator = await images.getRowByName(`localhost/my-image-${imgNum}`);
      await imgRowLocator?.scrollIntoViewIfNeeded();
    }
  });

  test(`Verification of  ${3 * numberOfObjects} containers`, async ({ navigationBar }) => {
    test.setTimeout(300_000);

    const containers = await navigationBar.openContainers();
    await playExpect(containers.heading).toBeVisible({ timeout: 10_000 });
    //count containers => (1 manually created + 2 from creating pods) * numberOfObjects = 3 * numberOfObjects
    await playExpect
      .poll(async () => await containers.countRowsFromTable(), { timeout: 10_000 })
      .toBe(3 * numberOfObjects);
    for (let containerNum = 1; containerNum <= numberOfObjects; containerNum++) {
      await playExpect
        .poll(async () => await containers.waitForRowToExists(`my-container-${containerNum}`), { timeout: 0 })
        .toBeTruthy();
      const containerRowLocator = await containers.getRowByName(`my-container-${containerNum}`);
      await containerRowLocator?.scrollIntoViewIfNeeded();
    }
  });

  test(`Verification of ${numberOfObjects} pods`, async ({ navigationBar }) => {
    test.setTimeout(300_000);

    const pods = await navigationBar.openPods();
    await playExpect(pods.heading).toBeVisible({ timeout: 10_000 });
    //count pods => 1 manually created * numberOfObjects = numberOfObjects
    await playExpect.poll(async () => await pods.countRowsFromTable(), { timeout: 10_000 }).toBe(numberOfObjects);
    for (let podNum = 1; podNum <= numberOfObjects; podNum++) {
      await playExpect.poll(async () => await pods.waitForRowToExists(`my-pod-${podNum}`), { timeout: 0 }).toBeTruthy();
      const podRowLocator = await pods.getRowByName(`my-pod-${podNum}`);
      await podRowLocator?.scrollIntoViewIfNeeded();
    }
  });
});
