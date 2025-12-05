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

import { ProxyTypes } from '/@/model/core/types';
import { ProxyPage } from '/@/model/pages/proxy-page';
import { expect as playExpect, test } from '/@/utility/fixtures';

const invalidProxyUrl = 'invalid-proxy-url';
const httpProxyUrl = 'http://http.proxy:8080';
const httpsProxyUrl = 'https://http.proxy:8443';
const hostsDomains = 'localhost';

let proxyPage: ProxyPage;

test.beforeAll(async ({ page, runner, welcomePage }) => {
  runner.setVideoAndTraceName('proxy-e2e');
  await welcomePage.handleWelcomePage(true);
  proxyPage = new ProxyPage(page);
});

test.afterAll(async ({ navigationBar, runner }) => {
  await navigationBar.openDashboard();
  const settingsBar = await navigationBar.openSettings();
  await settingsBar.proxyTab.click();
  await playExpect(proxyPage.heading).toBeVisible();
  await proxyPage.selectProxy(ProxyTypes.System);
  await proxyPage.updateProxySettings();
  await runner.close();
});

test.describe.serial('Proxy settings ', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ navigationBar }) => {
    await navigationBar.openDashboard();
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.proxyTab.click();
    await playExpect(proxyPage.heading).toBeVisible();
  });

  test('Proxy page assets and System proxy setup', async () => {
    await playExpect(proxyPage.toggleProxyButton).toBeVisible();
    await playExpect(proxyPage.toggleProxyButton).toHaveText(ProxyTypes.System);
    await playExpect(proxyPage.httpProxy).not.toBeEnabled();
    await playExpect(proxyPage.httpsProxy).not.toBeEnabled();
    await playExpect(proxyPage.noProxy).not.toBeEnabled();
    await playExpect(proxyPage.updateButton).toBeEnabled();
  });

  test('Manual proxy setup, validation and update', async () => {
    await proxyPage.selectProxy(ProxyTypes.Manual);
    await playExpect(proxyPage.httpProxy).toBeEnabled();
    await playExpect(proxyPage.httpsProxy).toBeEnabled();
    await playExpect(proxyPage.noProxy).toBeEnabled();
    // validation for http proxy input
    await proxyPage.fillHttpProxy(invalidProxyUrl);
    await playExpect(proxyPage.proxyAlert).toBeVisible();
    await playExpect(proxyPage.proxyAlert).toContainText(`value ${invalidProxyUrl} should be an URL`, {
      ignoreCase: true,
    });
    await proxyPage.fillHttpProxy(httpProxyUrl);
    await playExpect(proxyPage.proxyAlert).not.toBeVisible();
    // validation for https proxy input
    await proxyPage.fillHttpsProxy(invalidProxyUrl);
    await playExpect(proxyPage.proxyAlert).toBeVisible();
    await playExpect(proxyPage.proxyAlert).toContainText(`value ${invalidProxyUrl} should be an URL`, {
      ignoreCase: true,
    });
    await proxyPage.fillHttpsProxy(httpsProxyUrl);
    await playExpect(proxyPage.proxyAlert).not.toBeVisible();
    // check domains for no proxy
    await proxyPage.fillNoProxy(hostsDomains);
    await proxyPage.updateProxySettings();
  });

  test('Proxy settings persists when proxy page is switched', async () => {
    // given that we always switch to dashboard and back to the proxy page in before each hook
    // we should check previous test setup - manual proxy
    await playExpect(proxyPage.toggleProxyButton).toBeVisible();
    await playExpect(proxyPage.toggleProxyButton).toHaveText(ProxyTypes.Manual);
    await playExpect(proxyPage.httpProxy).toBeEnabled();
    await playExpect(proxyPage.httpProxy).toHaveValue(httpProxyUrl);
    await playExpect(proxyPage.httpsProxy).toBeEnabled();
    await playExpect(proxyPage.httpsProxy).toHaveValue(httpsProxyUrl);
    await playExpect(proxyPage.noProxy).toBeEnabled();
    await playExpect(proxyPage.noProxy).toHaveValue(hostsDomains);
  });

  test('Disabled proxy setup', async () => {
    await proxyPage.selectProxy(ProxyTypes.Disabled);
    await playExpect(proxyPage.httpProxy).not.toBeEnabled();
    await playExpect(proxyPage.httpsProxy).not.toBeEnabled();
    await playExpect(proxyPage.noProxy).not.toBeEnabled();
    await playExpect(proxyPage.updateButton).toBeEnabled();
    await proxyPage.updateProxySettings();
  });

  test('Re-enabled Manual proxy settings persisted', async () => {
    await proxyPage.selectProxy(ProxyTypes.Disabled);
    await playExpect(proxyPage.httpProxy).not.toBeEnabled();
    await playExpect(proxyPage.httpsProxy).not.toBeEnabled();
    await playExpect(proxyPage.noProxy).not.toBeEnabled();

    await proxyPage.selectProxy(ProxyTypes.Manual);
    await playExpect(proxyPage.httpProxy).toBeEnabled();
    await playExpect(proxyPage.httpProxy).toHaveValue(httpProxyUrl);
    await playExpect(proxyPage.httpsProxy).toBeEnabled();
    await playExpect(proxyPage.httpsProxy).toHaveValue(httpsProxyUrl);
    await playExpect(proxyPage.noProxy).toBeEnabled();
    await playExpect(proxyPage.noProxy).toHaveValue(hostsDomains);
  });

  test('System proxy resets the values', async ({ navigationBar }) => {
    await proxyPage.selectProxy(ProxyTypes.System);
    await proxyPage.updateProxySettings();
    await playExpect(proxyPage.toggleProxyButton).toHaveText(ProxyTypes.System);
    await playExpect(proxyPage.httpProxy).not.toBeEnabled();
    await playExpect(proxyPage.httpsProxy).not.toBeEnabled();
    await playExpect(proxyPage.noProxy).not.toBeEnabled();
    await navigationBar.openDashboard();
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.proxyTab.click();
    await playExpect(proxyPage.heading).toBeVisible();
    await playExpect(proxyPage.httpProxy).not.toHaveValue(httpProxyUrl);
    await playExpect(proxyPage.httpsProxy).not.toHaveValue(httpsProxyUrl);
    await playExpect(proxyPage.noProxy).not.toHaveValue(hostsDomains);
  });
});
