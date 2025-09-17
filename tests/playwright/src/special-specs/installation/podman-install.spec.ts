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

import fs from 'node:fs';
import path from 'node:path';

import { NavigationBar } from '../..';
import { expect as playExpect, test } from '../../utility/fixtures';
import { isCI, isLinux, isMac, isWindows } from '../../utility/platform';

test.skip(isLinux, 'Podman installation is not supported on Linux');

test.beforeAll(async ({ page, runner, welcomePage }) => {
  runner.setVideoAndTraceName('podman-install-e2e');
  const updateAvailableDialog = page.getByRole('dialog', { name: 'Update Available now' });
  try {
    await playExpect(updateAvailableDialog).toBeVisible({ timeout: 20_000 });
    const cancelButton = updateAvailableDialog.getByRole('button', { name: 'Cancel' });
    await playExpect(cancelButton).toBeVisible();
    await cancelButton.click();
    await playExpect(updateAvailableDialog).not.toBeVisible();
  } catch (error) {
    console.log('No update dialog shown, continuing with the test');
  }
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Podman installer integration in Podman Desktop', { tag: '@update-install' }, () => {
  test('Dashboard Podman provider card assets check', async ({ page }) => {
    test.skip(
      !isCI || process.env.GITHUB_ACTIONS !== 'true' || isLinux,
      'Only run on macOS and Windows in GitHub Actions',
    );
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
  test('Podman installer artifacts are present in local assets storage', async ({ runner }) => {
    const fileFormatRegexp = isWindows ? 'exe' : 'pkg';
    // x64 = amd64 for both windows and mac, arm64 = arm64 for win, and aarch64 for mac
    const archPart = process.arch === 'x64' ? 'amd64' : process.arch === 'arm64' ? (isMac ? 'aarch64' : 'arm64') : null;
    playExpect(archPart, { message: `Unsupported architecture: ${process.arch}` }).not.toBeNull();
    const podmanInstallerFilePrefix = `podman-${isWindows ? '.*' : 'installer-macos'}`;
    console.log(
      `Trying to find podman installer artifact: ${podmanInstallerFilePrefix}-${archPart}.${fileFormatRegexp}`,
    );
    const electronBinary = await runner.getElectronApp().evaluate(async ({ app }) => {
      return app.getPath('exe');
    });
    const electronResourcesPath = isWindows
      ? path.join(electronBinary, '..', 'resources')
      : path.join(electronBinary, '..', '..', 'Resources');
    const podmanAssetsPath = path.join(
      electronResourcesPath,
      'extensions',
      'podman',
      'packages',
      'extension',
      'assets',
    );
    playExpect(fs.existsSync(podmanAssetsPath), {
      message: `Did not find a podman assets path: ${podmanAssetsPath}`,
    }).toBeTruthy();
    const files = await fs.promises.readdir(podmanAssetsPath);
    const findFiles = files.filter(file => new RegExp(`^${podmanInstallerFilePrefix}.*$`).exec(file));
    console.log(`Files found: ${findFiles}`);
    // windows file check: "podman-installer-windows-arch.exe" or podman-5.6.1-setup.exe,
    // on mac: "podman-installer-macos-(universal|arch-*.pkg"
    const architecturePattern = isMac ? `(universal|${archPart})-.*` : `(setup|installer-windows-${archPart}).*`;
    playExpect(findFiles[0]).toMatch(
      new RegExp(`${podmanInstallerFilePrefix}-${architecturePattern}\\.${fileFormatRegexp}`),
    );
  });
});
