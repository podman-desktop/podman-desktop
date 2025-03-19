/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { CLIToolsPage } from '../model/pages/cli-tools-page';
import type { SettingsBar } from '../model/pages/settings-bar';
import { expect as playExpect, test } from '../utility/fixtures';
import { isMac } from '../utility/platform';
import { waitForPodmanMachineStartup } from '../utility/wait';

let settingsBar: SettingsBar;
let cliToolsPage: CLIToolsPage;

test.skip(!!isMac, 'Admin permission request prompt is displayed on macOS');

test.beforeAll(async ({ runner, page, welcomePage, navigationBar }) => {
  runner.setVideoAndTraceName('cli-tools-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);

  settingsBar = await navigationBar.openSettings();
  await settingsBar.cliToolsTab.click();

  cliToolsPage = new CLIToolsPage(page);
  await playExpect(cliToolsPage.toolsTable).toBeVisible({ timeout: 10_000 });
  await playExpect.poll(async () => await cliToolsPage.toolsTable.count()).toBeGreaterThan(0);
  await cliToolsPage.uninstallTool('Kind');
  await playExpect.poll(async () => await cliToolsPage.getCurrentToolVersion('Kind')).toBeFalsy();
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('CLI tools tests', () => {
    test('Install -> downgrade -> uninstall', async () => {
      await cliToolsPage.installTool('Kind');
      await cliToolsPage.downgradeTool('Kind');
      await cliToolsPage.uninstallTool('Kind');
      await playExpect.poll(async () => await cliToolsPage.getCurrentToolVersion('Kind')).toBeFalsy();
    });

    test('Install old version -> upgrade -> uninstall', async () => {
      await cliToolsPage.installToolWithSecondLatestVersion('Kind');
      await cliToolsPage.updateTool('Kind');
      await cliToolsPage.uninstallTool('Kind');
      await playExpect.poll(async () => await cliToolsPage.getCurrentToolVersion('Kind')).toBeFalsy();
    });
  });
