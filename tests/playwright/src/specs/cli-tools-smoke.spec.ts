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

import { CLIToolsPage } from '/@/model/pages/cli-tools-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isLinux, isMac } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

let settingsBar: SettingsBar;
let cliToolsPage: CLIToolsPage;
const tools = process.env.CLI_TOOLS;
const allTools = ['Kind', 'Compose', 'kubectl'];
const toolsToTest = tools === 'all' ? allTools : tools ? tools.split(',') : ['Kind'];

test.skip(!!isLinux || !!isMac, 'Tests suite should not run on Linux or Mac platform');

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('cli-tools-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

toolsToTest.forEach(tool => {
  test.describe
    .serial('CLI tools tests', () => {
      test.beforeAll(async ({ navigationBar, page }) => {
        settingsBar = await navigationBar.openSettings();
        await settingsBar.cliToolsTab.click();

        cliToolsPage = new CLIToolsPage(page);
        await playExpect(cliToolsPage.toolsTable).toBeVisible({ timeout: 10_000 });
        await playExpect.poll(async () => await cliToolsPage.toolsTable.count()).toBeGreaterThan(0);
        await cliToolsPage.uninstallTool(tool);
        await playExpect
          .poll(async () => await cliToolsPage.getCurrentToolVersion(tool), { timeout: 60_000 })
          .toBeFalsy();
      });

      test.beforeEach(async () => {
        if (cliToolsPage.wasRateLimitReached()) {
          test.info().annotations.push({ type: 'skip', description: 'Rate limit exceeded for current environment' });
          test.skip(true, 'Rate limit exceeded; skipping remaining CLI tools checks');
        }
      });

      test(`Install ${tool} -> downgrade -> upgrade -> uninstall`, async () => {
        test.setTimeout(180_000);

        await cliToolsPage.installTool(tool);
        await cliToolsPage.downgradeTool(tool);
        await cliToolsPage.updateTool(tool);
        await cliToolsPage.uninstallTool(tool);
        await playExpect
          .poll(async () => await cliToolsPage.getCurrentToolVersion(tool), { timeout: 90_000 })
          .toBeFalsy();
      });
    });
});
