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

import { expect as playExpect } from '@playwright/test';

import { bootcExtension } from '/@/model/core/extensions';
import { CLIToolsPage } from '/@/model/pages/cli-tools-page';
import { ExtensionCatalogCardPage } from '/@/model/pages/extension-catalog-card-page';
import { ProxyPage } from '/@/model/pages/proxy-page';
import { RunnerOptions } from '/@/runner/runner-options';
import { canTestSquidProxy, getSquidAccessLogLineCount, setupSquidProxy } from '/@/setupFiles/setup-squid-proxy';
import { test } from '/@/utility/fixtures';

const { httpsProxyUrl, containerName } = setupSquidProxy();

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'proxy-certificate',
    customSettings: {
      'proxy.enabled': 1,
      'proxy.https': httpsProxyUrl,
    },
  }),
});

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('proxy-certificate-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Proxy with custom certificate', { tag: '@proxy-certificate' }, () => {
    test.skip(
      !canTestSquidProxy(),
      'SQUID_HTTPS_PROXY_URL not set; start the squid proxy and set the env var to run this suite',
    );

    test('Proxy settings reflect HTTPS proxy configuration', async ({ navigationBar }) => {
      const settingsBar = await navigationBar.openSettings();
      const proxyPage = await settingsBar.openTabPage(ProxyPage);
      await playExpect(proxyPage.heading).toBeVisible();
      await playExpect(proxyPage.httpsProxy).toHaveValue(httpsProxyUrl);
    });

    test('Extension catalog loads through proxy', async ({ page, navigationBar }) => {
      const linesBefore = getSquidAccessLogLineCount(containerName);

      const extensionsPage = await navigationBar.openExtensions();
      await playExpect(extensionsPage.heading).toBeVisible();
      await extensionsPage.openCatalogTab();

      const extensionCard = new ExtensionCatalogCardPage(page, bootcExtension.extensionName);
      await playExpect(extensionCard.parent).toBeVisible({ timeout: 30_000 });

      const linesAfter = getSquidAccessLogLineCount(containerName);
      playExpect(linesAfter).toBeGreaterThan(linesBefore);
    });

    test('Kind CLI binary downloads through proxy', async ({ navigationBar }) => {
      const settingsBar = await navigationBar.openSettings();
      const cliToolsPage = await settingsBar.openTabPage(CLIToolsPage);
      await playExpect(cliToolsPage.heading).toBeVisible();

      const linesBefore = getSquidAccessLogLineCount(containerName);
      await cliToolsPage.installTool('Kind', 180_000);
      const linesAfter = getSquidAccessLogLineCount(containerName);
      playExpect(linesAfter).toBeGreaterThan(linesBefore);
    });

    test('Install extension from catalog through proxy', async ({ page, navigationBar }) => {
      // Skipped: https://github.com/podman-desktop/podman-desktop/issues/18356
      // Extension installation from catalog fails through a custom-cert HTTPS proxy
      test.skip(true, 'Blocked by https://github.com/podman-desktop/podman-desktop/issues/18356');

      const extensionsPage = await navigationBar.openExtensions();
      await playExpect(extensionsPage.heading).toBeVisible();
      await extensionsPage.openCatalogTab();

      const extensionCard = new ExtensionCatalogCardPage(page, bootcExtension.extensionName);
      await playExpect(extensionCard.parent).toBeVisible();
      await extensionCard.install(180_000);

      await extensionsPage.openInstalledTab();
      await playExpect
        .poll(async () => extensionsPage.extensionIsInstalled(bootcExtension.extensionFullLabel), { timeout: 15_000 })
        .toBeTruthy();
    });
  });
