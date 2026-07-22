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

import { bootcExtension, minikubeExtension } from '/@/model/core/extensions';
import { expect as playExpect, test } from '/@/utility/fixtures';

const MATCHING_EXTENSION_NAME_1 = minikubeExtension.extensionName;
const MATCHING_EXTENSION_NAME_2 = bootcExtension.extensionName;
const NONEXISTENT_FILTER = 'no-such-ext';
const CATALOG_LOAD_TIMEOUT = 60_000;
const ASSERT_TIMEOUT = 10_000;

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('extension-catalog-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Extensions Catalog filter', { tag: ['@smoke'] }, () => {
  test.describe.configure({ mode: 'serial' });

  test('Filter box updates Catalog extension list', async ({ navigationBar }) => {
    const extensionsPage = await navigationBar.openExtensions();
    await playExpect(extensionsPage.heading).toBeVisible();

    await extensionsPage.openCatalogTab();
    await playExpect(extensionsPage.catalogExtensions).toBeVisible({ timeout: CATALOG_LOAD_TIMEOUT });

    const matchingExtension1 = await extensionsPage.getCatalogExtension(
      MATCHING_EXTENSION_NAME_1,
      CATALOG_LOAD_TIMEOUT,
    );
    const matchingExtension2 = await extensionsPage.getCatalogExtension(
      MATCHING_EXTENSION_NAME_2,
      CATALOG_LOAD_TIMEOUT,
    );

    const unfilteredCount = await extensionsPage.countCatalogExtensions();
    playExpect(unfilteredCount).toBeGreaterThanOrEqual(2);

    await test.step('Filter by known extension name shows only matching cards', async () => {
      await extensionsPage.filterByName(MATCHING_EXTENSION_NAME_1);

      await playExpect(matchingExtension1.parent).toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect(matchingExtension2.parent).not.toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect
        .poll(async () => await extensionsPage.countCatalogExtensions(), { timeout: ASSERT_TIMEOUT })
        .toBe(1);
    });

    await test.step('Filter with no matches shows empty state', async () => {
      await extensionsPage.filterByName(NONEXISTENT_FILTER);

      await playExpect(matchingExtension1.parent).not.toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect(matchingExtension2.parent).not.toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect
        .poll(async () => await extensionsPage.countCatalogExtensions(), { timeout: ASSERT_TIMEOUT })
        .toBe(0);
      await playExpect(extensionsPage.clearFilterButton).toBeVisible({ timeout: ASSERT_TIMEOUT });
    });

    await test.step('Clearing filter restores full Catalog list', async () => {
      await extensionsPage.clearFilterByName();

      await playExpect(matchingExtension1.parent).toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect(matchingExtension2.parent).toBeVisible({ timeout: ASSERT_TIMEOUT });
      await playExpect
        .poll(async () => await extensionsPage.countCatalogExtensions(), { timeout: ASSERT_TIMEOUT })
        .toBe(unfilteredCount);
      await playExpect(extensionsPage.clearFilterButton).not.toBeVisible();
    });
  });
});
