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

import { CommandPalette } from '/@/model/pages/command-palette';
import { DashboardPage } from '/@/model/pages/dashboard-page';
import { ImagesPage } from '/@/model/pages/images-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('navigation-history-smoke-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Navigation History Smoke Tests', { tag: '@smoke' }, () => {
    test('TC-001: Back button navigates to previous page', async ({ navigationBar }) => {
      // Navigate through pages: Dashboard → Containers → Images
      await navigationBar.openDashboard();
      const containersPage = await navigationBar.openContainers();
      await navigationBar.openImages();

      // Click back button
      await navigationBar.goBack();

      // Verify on Containers page
      await playExpect(containersPage.heading).toBeVisible();

      // Verify button states
      await playExpect(navigationBar.backButton).toBeEnabled();
      await playExpect(navigationBar.forwardButton).toBeEnabled();
    });

    test('TC-002: Forward button navigates to next page', async ({ navigationBar, page }) => {
      // Continue from TC-001 state (on Containers, can go forward to Images)
      const imagesPage = new ImagesPage(page);

      // Click forward button
      await navigationBar.goForward();

      // Verify on Images page
      await playExpect(imagesPage.heading).toBeVisible();

      // Verify forward button disabled (at end of history)
      await playExpect(navigationBar.forwardButton).toBeDisabled();
    });

    test('TC-003: Buttons disabled when navigation not possible', async ({ navigationBar, page }) => {
      // Navigate to Dashboard (fresh start for this test)
      await page.reload();
      await playExpect(navigationBar.backButton).toBeDisabled();
      await playExpect(navigationBar.forwardButton).toBeDisabled();

      const dashboardPage = new DashboardPage(page);
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      await navigationBar.goBack();
      await playExpect(dashboardPage.heading).toBeVisible();

      await playExpect(navigationBar.forwardButton).toBeEnabled();
      await playExpect(navigationBar.backButton).toBeDisabled();

      // After one navigation, back should be enabled, forward disabled
      await navigationBar.goForward();
      await playExpect(navigationBar.backButton).toBeEnabled();
      await playExpect(navigationBar.forwardButton).toBeDisabled();
    });

    test('TC-004: Command palette Go Back navigates to previous page', async ({ navigationBar, page }) => {
      // Navigate: Dashboard → Containers
      await navigationBar.openDashboard();
      await navigationBar.openContainers();

      // Open command palette and execute Go Back
      const commandPalette = new CommandPalette(page);
      await commandPalette.executeCommand('Go Back');

      // Verify on Dashboard
      const dashboardPage = new DashboardPage(page);
      await playExpect(dashboardPage.heading).toBeVisible({ timeout: 5_000 });
    });

    test('TC-005: Command palette Go Forward navigates forward', async ({ navigationBar, page }) => {
      // Setup: Navigate and go back
      await navigationBar.openDashboard();
      await navigationBar.openContainers();
      await navigationBar.openImages();
      await navigationBar.goBack(); // Now on Containers

      // Open command palette and execute Go Forward
      const commandPalette = new CommandPalette(page);
      await commandPalette.executeCommand('Go Forward');

      // Verify on Images page
      const imagesPage = new ImagesPage(page);
      await playExpect(imagesPage.heading).toBeVisible({ timeout: 5_000 });
    });

    test('TC-006: History truncated when navigating to new page from middle of stack', async ({ navigationBar }) => {
      // Navigate: Dashboard → Containers → Images → Volumes
      await navigationBar.openDashboard();
      await navigationBar.openContainers();
      await navigationBar.openImages();
      await navigationBar.openVolumes();

      // Go back twice (now at Containers)
      await navigationBar.goBack();
      await navigationBar.goBack();

      // Navigate to Pods (should truncate forward history)
      const podsPage = await navigationBar.openPods();
      await playExpect(podsPage.heading).toBeVisible();

      // Forward button should be disabled (history truncated)
      await playExpect(navigationBar.forwardButton).toBeDisabled();
    });

    test('TC-007: Clicking same navigation link does not add duplicate', async ({ navigationBar, page }) => {
      await navigationBar.openDashboard();
      await navigationBar.openContainers();

      // Click Containers again
      await navigationBar.openContainers();

      // Go back - should go to Dashboard, not Containers
      await navigationBar.goBack();

      const dashboardPage = new DashboardPage(page);
      await playExpect(dashboardPage.heading).toBeVisible({ timeout: 5_000 });
    });
  });
