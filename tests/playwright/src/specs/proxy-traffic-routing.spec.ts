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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ProxyTypes } from '/@/model/core/types';
import { CLIToolsPage } from '/@/model/pages/cli-tools-page';
import { KubeContextPage } from '/@/model/pages/kubernetes-context-page';
import { PreferencesPage } from '/@/model/pages/preferences-page';
import { ProxyPage } from '/@/model/pages/proxy-page';
import { RegistriesPage } from '/@/model/pages/registries-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { LoggingProxyServer } from '/@/utility/logging-proxy-server';

// This suite verifies that once a proxy is configured, the application actually routes real
// traffic through it (extension catalog fetch, CLI tool version checks, image pulls, Kubernetes
// API connectivity) - as opposed to tests/playwright/src/specs/proxy-smoke.spec.ts, which only
// covers the settings UI itself. The stub proxy below only records hits, it never forwards
// traffic, so every scenario here is expected to fail on the application side - we only assert
// that the request/CONNECT reached the proxy.

const FAKE_KUBECONFIG_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'resources',
  'proxy-fake-kube-config.yaml',
);

const CATALOG_HOST = 'registry.podman-desktop.io';
const GITHUB_API_HOST = 'api.github.com';
const REGISTRY_HOST = 'ghcr.io';
const FAKE_CLUSTER_HOST = 'fake-cluster.proxy-test.invalid';
const FAKE_CONTEXT_NAME = 'proxy-test-context';
const PULL_IMAGE_NAME = 'ghcr.io/linuxcontainers/alpine';
const FAKE_REGISTRY_HOST = 'fake-registry.proxy-test.invalid';

let stubProxy: LoggingProxyServer;
let stubProxyPort: number;
let proxyPage: ProxyPage;

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('proxy-traffic-routing');
  stubProxy = new LoggingProxyServer();
  stubProxyPort = await stubProxy.start();
  await welcomePage.handleWelcomePage(true);
  proxyPage = new ProxyPage(page);
});

test.afterAll(async ({ navigationBar, runner }) => {
  try {
    await navigationBar.openDashboard();
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.proxyTab.click();
    await playExpect(proxyPage.heading).toBeVisible();
    await proxyPage.selectProxy(ProxyTypes.System);
    await proxyPage.updateProxySettings();
  } finally {
    try {
      await stubProxy.stop();
    } finally {
      await runner.close();
    }
  }
});

test.describe
  .serial('Proxied requests hit the configured proxy', () => {
    test('Manual proxy points at the local stub proxy', async ({ navigationBar }) => {
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.proxyTab.click();
      await playExpect(proxyPage.heading).toBeVisible();

      await proxyPage.selectProxy(ProxyTypes.Manual);
      await proxyPage.fillHttpProxy(`http://127.0.0.1:${stubProxyPort}`);
      await proxyPage.fillHttpsProxy(`http://127.0.0.1:${stubProxyPort}`);
      await proxyPage.updateProxySettings();
    });

    test('Extension catalog fetch goes through the proxy', async ({ navigationBar }) => {
      const extensionsPage = await navigationBar.openExtensions();
      await extensionsPage.openCatalogTab();
      // Force a fresh fetch: the catalog is cached for the process lifetime and may already have
      // been fetched (unproxied) at app startup, before this test configured the proxy.
      await extensionsPage.refreshCatalog();
      await stubProxy.waitForHost(CATALOG_HOST);
    });

    test('CLI tool version check goes through the proxy', async ({ navigationBar }) => {
      // the "Settings" nav link isn't a real route (href="#top") - going through Dashboard first
      // avoids relying on it working from an arbitrary previous page, matching proxy-smoke.spec.ts
      await navigationBar.openDashboard();
      const settingsBar = await navigationBar.openSettings();
      const cliToolsPage = await settingsBar.openTabPage(CLIToolsPage);
      await playExpect(cliToolsPage.toolsTable).toBeVisible();

      const updateButton = cliToolsPage.toolsTable.getByText('Update available', { exact: true }).first();
      const downgradeButton = cliToolsPage.toolsTable.getByText('Upgrade/Downgrade', { exact: true }).first();
      if ((await updateButton.count()) > 0) {
        await updateButton.click();
      } else if ((await downgradeButton.count()) > 0) {
        await downgradeButton.click();
      } else {
        test.skip(true, 'No CLI tool exposes an update/downgrade action to verify against the proxy');
      }

      await stubProxy.waitForHost(GITHUB_API_HOST);
    });

    // Bug found via this test: https://github.com/podman-desktop/podman-desktop/issues/19171
    test('Add registry goes through the proxy', async ({ navigationBar }) => {
      test.skip(true, 'Skipped because of bug: https://github.com/podman-desktop/podman-desktop/issues/19171');
      await navigationBar.openDashboard();
      const settingsBar = await navigationBar.openSettings();
      const registriesPage = await settingsBar.openTabPage(RegistriesPage);
      await playExpect(registriesPage.heading).toBeVisible();

      await registriesPage.submitRegistryForm(
        `https://${FAKE_REGISTRY_HOST}`,
        'proxy-test-user',
        'proxy-test-password',
      );
      try {
        await stubProxy.waitForHost(FAKE_REGISTRY_HOST);
      } finally {
        // the credential check can never succeed against a non-forwarding stub proxy - dismiss the dialog
        await registriesPage.cancelDialogButton.click().catch(() => {
          /* dialog may already have closed on its own after the failed check */
        });
      }
    });

    // Will be skipped when https://github.com/podman-desktop/podman-desktop/issues/17249 is addressed.
    test('Image pull goes through the proxy', async ({ navigationBar }) => {
      test.skip(
        true,
        'Test cannot be run unless https://github.com/podman-desktop/podman-desktop/issues/17249 is implemented',
      );
      const imagesPage = await navigationBar.openImages();
      const pullImagePage = await imagesPage.openPullImage();
      await playExpect(pullImagePage.heading).toBeVisible();

      await pullImagePage.startPullOnly(PULL_IMAGE_NAME);
      try {
        await stubProxy.waitForHost(REGISTRY_HOST);
      } finally {
        // the pull can never complete against a non-forwarding stub proxy - clean it up
        await pullImagePage.cancelButton.click().catch(() => {
          /* pull may already have failed on its own */
        });
      }
    });

    // Confirmed via a live run: @kubernetes/client-node's requests fail with a direct DNS lookup
    // error (`getaddrinfo ENOTFOUND ...`) rather than a proxy CONNECT, so they bypass the proxy
    // entirely - there is no proxy wiring anywhere under packages/main/src/plugin/kubernetes/. Left
    // as a documented gap, same as the image-pull scenario above, rather than a product code change.
    test('Kubernetes API connectivity check goes through the proxy', async ({ navigationBar }) => {
      test.skip(
        true,
        'Kubernetes API calls are not routed via proxy, yet: https://github.com/podman-desktop/extension-kubernetes-dashboard/issues/1349',
      );
      await navigationBar.openDashboard();
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.expandPreferencesTab();
      const preferencesPage = await settingsBar.openTabPage(PreferencesPage);
      await playExpect(preferencesPage.heading).toBeVisible();
      await preferencesPage.selectKubeFile(FAKE_KUBECONFIG_PATH);

      const kubeSettingsBar = await navigationBar.openSettings();
      const kubePage = await kubeSettingsBar.openTabPage(KubeContextPage);
      await playExpect(kubePage.heading).toBeVisible();
      await playExpect.poll(async () => await kubePage.pageIsEmpty(), { timeout: 30_000 }).toBeFalsy();

      if (!(await kubePage.isContextDefault(FAKE_CONTEXT_NAME))) {
        await kubePage.setDefaultContext(FAKE_CONTEXT_NAME);
      }

      await stubProxy.waitForHost(FAKE_CLUSTER_HOST);
    });
  });
