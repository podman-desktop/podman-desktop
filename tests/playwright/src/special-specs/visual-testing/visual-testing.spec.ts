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
import { expect as playExpect, test } from '/@/utility/fixtures';
import { handleConfirmationDialog } from '/@/utility/operations';

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('screenshots');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner, navigationBar }) => {
  test.setTimeout(180_000);

  // Go to containers page
  const containersPage = await navigationBar.openContainers();
  await playExpect(containersPage.heading).toBeVisible();

  // Select all containers through the checkbox
  const toggleAll = containersPage.page.getByRole('checkbox', { name: 'Toggle all' });
  await playExpect(toggleAll).toBeVisible();
  await toggleAll.click();

  // Get the bulk delete button
  const bulkDelete = containersPage.page.getByRole('button', { name: 'Delete selected containers and pods' });
  await playExpect(bulkDelete).toBeVisible();
  await bulkDelete.click();

  await handleConfirmationDialog(containersPage.page, 'Delete Containers?', true, 'Delete');

  // Wait until none are remaining
  await playExpect.poll(async () => await containersPage.getAllTableRows()).toHaveLength(0);

  await runner.close(45_000);
});

test.describe
  .serial('Podman Desktop visual testing', { tag: [] }, () => {
    test.skip(
      !process.env.PLAYWRIGHT_SCREENSHOTS_PATH,
      'Skipping screenshots if PLAYWRIGHT_SCREENSHOTS_PATH is not set.',
    );

    test('dashboard screenshot', async ({ navigationBar }) => {
      const dashboardPage = await navigationBar.openDashboard();
      await playExpect(dashboardPage.heading).toBeVisible();

      // focus on the content
      await dashboardPage.content.focus();

      await dashboardPage.screenshot({
        name: 'dashboard',
      });
    });

    /**
     * Containers
     */
    test.describe
      .serial('containers', () => {
        test('containers empty', async ({ navigationBar }) => {
          const containersPage = await navigationBar.openContainers();
          await playExpect(containersPage.heading).toBeVisible();

          // Screenshot empty containers list
          await containersPage.screenshot({
            name: 'containers-empty',
          });
        });
      });
  });
