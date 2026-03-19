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

import { ProxyPage } from '/@/model/pages/proxy-page';
import { RunnerOptions } from '/@/runner/runner-options';
import { test } from '/@/utility/fixtures';

let proxyPage: ProxyPage;

test.use({
  runnerOptions: new RunnerOptions({
    customFolder: 'managed-configuration',
  }),
});

test.beforeAll(async ({ runner, welcomePage, navigationBar }) => {
  test.setTimeout(60_000);
  runner.setVideoAndTraceName('managed-configuration-proxy-e2e');
  await welcomePage.handleWelcomePage(true);
  const settingsBar = await navigationBar.openSettings();
  proxyPage = await settingsBar.openTabPage(ProxyPage);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Managed Configuration - proxy', { tag: '@managed-configuration' }, () => {
    test.describe
      .serial('Locked setting: Proxy Configuration dropdown', () => {
        test('Dropdown is managed', async () => {
          await playExpect(proxyPage.heading).toBeVisible();

          const isManaged = await proxyPage.isProxyConfigurationManaged();
          playExpect(isManaged).toBeTruthy();
        });

        test('Dropdown is disabled when locked', async () => {
          await playExpect(proxyPage.toggleProxyButton).toBeDisabled();
        });
      });

    test.describe
      .serial('Defaults + Locked setting: Web Proxy (HTTP)', () => {
        test('Expected settings value from managed configuration', async () => {
          await playExpect(proxyPage.httpProxy).toBeVisible();

          const isManaged = await proxyPage.isHttpProxyManaged();
          playExpect(isManaged).toBeTruthy();

          await playExpect(proxyPage.httpProxy).toHaveValue('http://managed-proxy.example.com:8080');
        });

        test('Field is disabled when locked', async () => {
          await playExpect(proxyPage.httpProxy).toBeDisabled();
        });
      });

    test.describe
      .serial('Defaults + Locked setting: Secure Web Proxy (HTTPS)', () => {
        test('Expected settings value from managed configuration', async () => {
          await playExpect(proxyPage.httpsProxy).toBeVisible();

          const isManaged = await proxyPage.isHttpsProxyManaged();
          playExpect(isManaged).toBeTruthy();

          await playExpect(proxyPage.httpsProxy).toHaveValue('https://managed-proxy.example.com:8443');
        });

        test('Field is disabled when locked', async () => {
          await playExpect(proxyPage.httpsProxy).toBeDisabled();
        });
      });

    test.describe
      .serial('Defaults setting: Bypass proxy (No Proxy)', () => {
        test('Field is not managed (not locked)', async () => {
          await playExpect(proxyPage.noProxy).toBeVisible();

          const isManaged = await proxyPage.isNoProxyManaged();
          playExpect(isManaged).toBeFalsy();
        });
      });
  });
