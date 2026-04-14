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
import { deleteContainer } from '/@/utility/operations';
import { isMac } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const testContainerName = 'nav-history-test-container';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('navigation-history-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, page }) => {
  try {
    await deleteContainer(page, testContainerName);
  } catch (error) {
    // Container may not exist, ignore error
  } finally {
    await runner.close();
  }
});

const SHORTCUTS = isMac
  ? ['Meta+BracketLeft', 'Meta+BracketRight', 'Meta+ArrowLeft', 'Meta+ArrowRight']
  : ['Alt+ArrowRight', 'Alt+ArrowLeft'];

test.describe
  .serial('Navigation History Comprehensive Tests', { tag: ['@smoke'] }, () => {
    test.describe.configure({ retries: 1 });

    SHORTCUTS.forEach(element => {
      test(`${element} shortcut navigates correctly`, async ({ navigationBar, page }) => {
        const containersPage = await navigationBar.openContainers();
        await playExpect(containersPage.heading).toBeVisible();
        const imagesPage = await navigationBar.openImages();
        await playExpect(imagesPage.heading).toBeVisible();
        // test back
        if (element.toLocaleLowerCase().includes('left')) {
          // press the shortcut
          await page.keyboard.press(element);
          await playExpect(containersPage.heading).toBeVisible();
        } else if (element.toLocaleLowerCase().includes('right')) {
          await navigationBar.goBack();
          await playExpect(containersPage.heading).toBeVisible();
          await page.keyboard.press(element);
          await playExpect(imagesPage.heading).toBeVisible();
        } else {
          throw new Error(`Do not recognize the direction of ${element} shortcut`);
        }
      });
    });

    test('Mouse button 3 (back) navigates backward', async ({ navigationBar, page }) => {
      // Navigate through pages
      await navigationBar.openDashboard();
      const containersPage = await navigationBar.openContainers();
      await navigationBar.openImages();

      // Simulate mouse button 3 click (back button)
      await page.evaluate(() => {
        const event = new MouseEvent('mouseup', {
          button: 3, // button 3 = back
          bubbles: true,
        });
        document.body.dispatchEvent(event);
      });

      // Verify on Containers page
      await playExpect(containersPage.heading).toBeVisible({ timeout: 5_000 });
    });

    test('Trackpad swipe left navigates to previous page', async ({ navigationBar, page }) => {
      // Navigate: Dashboard → Containers → Images
      await navigationBar.openDashboard();
      const containersPage = await navigationBar.openContainers();
      await navigationBar.openImages();

      // Simulate trackpad swipe right (deltaX < -30 for back)
      await page.evaluate(() => {
        const event = new WheelEvent('wheel', {
          deltaX: -50, // < -30 threshold for back navigation
          deltaY: 0,
          bubbles: true,
        });
        document.body.dispatchEvent(event);
      });

      // Verify navigation occurred to Containers
      await playExpect(containersPage.heading).toBeVisible({ timeout: 5_000 });
    });

    test('Trackpad swipe right navigates forward', async ({ navigationBar, page }) => {
      // Setup: Navigate and go back to have forward available
      await navigationBar.openDashboard();
      const containerPage = await navigationBar.openContainers();
      const imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible({ timeout: 5_000 });
      await navigationBar.goBack(); // Now on Containers with forward available
      await playExpect(containerPage.heading).toBeVisible({ timeout: 5_000 });

      const forwardButton = page.getByRole('button', { name: 'Forward (hold for history)' });
      await playExpect(forwardButton).toBeEnabled({ timeout: 5_000 });

      // The app has a 500ms swipe cooldown (NavigationButtons.handleWheel) that may
      // still be active from the previous trackpad-swipe-left test. Poll the dispatch
      // so the event is retried once the cooldown expires.
      await playExpect
        .poll(
          async () => {
            await page.evaluate(() => {
              document.body.dispatchEvent(new WheelEvent('wheel', { deltaX: 50, deltaY: 0, bubbles: true }));
            });
            return imagesPage.heading.isVisible();
          },
          { timeout: 5_000 },
        )
        .toBeTruthy();
    });

    test('Navigation shortcuts blocked when focus in input field', async ({ navigationBar, page }) => {
      await navigationBar.openDashboard();
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      // Find and focus on search input (if available)
      const searchInput = page.getByPlaceholder(/search/i).first();
      await playExpect(searchInput).toBeVisible();
      const searchExists = await searchInput.count();

      if (searchExists > 0) {
        await searchInput.click();

        // Try keyboard shortcut
        const shortcut = isMac ? 'Meta+ArrowLeft' : 'Alt+ArrowLeft';
        await page.keyboard.press(shortcut);

        // Verify still on Containers page (no navigation occurred)
        await playExpect(containersPage.heading).toBeVisible();
      }
    });

    test('Vertical scroll does not trigger navigation', async ({ navigationBar, page }) => {
      await navigationBar.openDashboard();
      const containersPage = await navigationBar.openContainers();
      await playExpect(containersPage.heading).toBeVisible();

      // Simulate vertical scroll (deltaY only)
      await page.evaluate(() => {
        const event = new WheelEvent('wheel', {
          deltaX: 0,
          deltaY: 100, // Vertical scroll only
          bubbles: true,
        });
        document.body.dispatchEvent(event);
      });

      // Verify still on Containers page (no navigation)
      await playExpect(containersPage.heading).toBeVisible();
    });

    test('Can go to Kubernetes and back, regression check for #15636', async () => {
      // Context exists: skip this test scenario
      test.skip(true, 'Requires K8s context set');
    });

    test('Kubernetes submenu navigation', async () => {
      // Context exists: skip this test scenario
      test.skip(true, 'Requires K8s context set');
    });

    test('Navigating back to deleted container shows error placeholder', async ({ navigationBar, page }) => {
      // Pull alpine image (minimal image for testing)
      const imageName = 'ghcr.io/linuxcontainers/alpine';
      const imagesPage = await navigationBar.openImages();
      const pullImagePage = await imagesPage.openPullImage();
      const updatedImages = await pullImagePage.pullImage(imageName, 'latest');

      // Wait for image to be pulled
      await playExpect
        .poll(async () => await updatedImages.waitForImageExists(imageName), { timeout: 30_000 })
        .toBeTruthy();

      // Create and start container
      const imageDetails = await imagesPage.openImageDetails(imageName);
      const runImage = await imageDetails.openRunImage();
      await runImage.startContainer(testContainerName, { attachTerminal: false });

      // Navigate to container details
      const containersPage = await navigationBar.openContainers();
      await playExpect
        .poll(async () => await containersPage.containerExists(testContainerName), { timeout: 30_000 })
        .toBeTruthy();

      await containersPage.openContainersDetails(testContainerName);

      // Navigate away to Images
      await navigationBar.openImages();

      // Delete the container. it opens containers page
      await deleteContainer(page, testContainerName);
      // when container is deleted, it shows Containers Page
      await playExpect(containersPage.heading).toBeVisible();

      // Navigate back, should open images
      await navigationBar.goBack();
      await playExpect(imagesPage.heading).toBeVisible();

      // Navigate back, will open empty page for deleted container
      await navigationBar.goBack();

      // App shows empty page, navigation bar, contentinfo and header.
      await playExpect(imagesPage.heading).not.toBeVisible();
      await playExpect(containersPage.heading).not.toBeVisible();
      await playExpect(imagesPage.header).not.toBeVisible();
      await playExpect(imagesPage.content).not.toBeVisible();
    });

    test('Navigating to stopped Podman machine shows current state', async () => {
      // This test is complex and requires machine management
      // Skipping for now as it requires specific machine state setup
      test.skip(true, 'Machine state testing requires complex setup');
    });

    test('Navigating in the extension webView', async () => {
      // advanced test case
      test.skip(true, 'Machine state testing requires complex setup');
    });

    test('Navigating back from containers details with tty attached, regression #15994', async () => {
      // Test will be implemented later based on bug fix
      test.skip(true, 'Implement later when #15994 is resolved');
    });
  });
