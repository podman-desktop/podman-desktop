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

import { NavigationBar } from '/@/model/workbench/navigation';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { handleConfirmationDialog } from '/@/utility/operations';
import { isCI, isLinux } from '/@/utility/platform';

test.skip(isLinux, 'Podman installation is not supported on Linux');

test.beforeAll(async ({ page, runner, welcomePage }) => {
  runner.setVideoAndTraceName('podman-install-e2e');
  const dialogTitle = new RegExp('Update .*Podman Desktop.*');
  try {
    await handleConfirmationDialog({ page, dialogTitle, buttonName: 'Close' });
  } catch (err) {
    console.log(
      `Update dialog handler threw an error: ${(err as Error).message}, might be that dialog did not appear.`,
    );
  }
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  test.setTimeout(120_000);
  await runner.close(45_000);
});

test.describe('Podman installation UI in Podman Desktop', { tag: '@update-install' }, () => {
  test.describe.configure({ mode: 'serial', retries: 1 });
  test('Dashboard offers Podman installation when Podman is not installed', async ({ page }) => {
    test.skip(!isCI || process.env.GITHUB_ACTIONS !== 'true', 'Only run on macOS and Windows in GitHub Actions');
    const dashboardPage = await new NavigationBar(page).openDashboard();
    await playExpect(dashboardPage.heading).toBeVisible();
    await playExpect(dashboardPage.podmanProvider).toBeVisible({ timeout: 25_000 });
    await playExpect(dashboardPage.podmanStatusLabel).toBeVisible({ timeout: 5_000 });
    await playExpect(dashboardPage.podmanStatusLabel).toContainText('NOT-INSTALLED', { timeout: 5_000 });
    const installButton = dashboardPage.podmanProvider.getByRole('button', { name: 'Install', exact: true });
    const detectionCheckButton = dashboardPage.podmanProvider.getByRole('button', { name: 'View detection checks' });
    const podmanCliNotFoundText = dashboardPage.podmanProvider.getByText(/podman.*not found/i);
    await playExpect(installButton).toBeVisible();
    await playExpect(detectionCheckButton).toBeVisible();
    await detectionCheckButton.click();
    await playExpect(podmanCliNotFoundText).toBeVisible();
  });
});
