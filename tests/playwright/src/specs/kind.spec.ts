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

import { ResourceElementActions } from '../model/core/operations';
import { ResourceElementState } from '../model/core/states';
import { ResourceConnectionCardPage } from '../model/pages/resource-connection-card-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { canRunKindTests } from '../setupFiles/setup-kind';
import {
  checkClusterResources,
  createKindCluster,
  deleteCluster,
  deleteClusterFromDetails,
  resourceConnectionAction,
  resourceConnectionActionDetails,
} from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import { ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const RESOURCE_NAME: string = 'kind';
const EXTENSION_LABEL: string = 'podman-desktop.kind';
const CLUSTER_NAME: string = 'kind-cluster';
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
let resourcesPage: ResourcesPage;

let kindResourceCard: ResourceConnectionCardPage;

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('kind-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  resourcesPage = new ResourcesPage(page);
  kindResourceCard = new ResourceConnectionCardPage(page, RESOURCE_NAME);
});

test.afterAll(async ({ runner, page }) => {
  try {
    if (!canRunKindTests)
      //This is not needed on a windows rootless machine
      await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Kind End-to-End Tests', { tag: '@k8s_e2e' }, () => {
  test.describe
    .serial('Kind installation', () => {
      test('Install Kind CLI', async ({ page, navigationBar }) => {
        test.skip(!!skipKindInstallation, 'Skipping Kind cluster installation');
        const settingsBar = await navigationBar.openSettings();
        await settingsBar.cliToolsTab.click();

        await ensureCliInstalled(page, 'Kind');
      });

      test('Kind extension lifecycle', async ({ navigationBar }) => {
        const extensionsPage = await navigationBar.openExtensions();
        const kindExtension = await extensionsPage.getInstalledExtension('Kind extension', EXTENSION_LABEL);
        await playExpect
          .poll(async () => await extensionsPage.extensionIsInstalled(EXTENSION_LABEL), { timeout: 10000 })
          .toBeTruthy();
        await playExpect(kindExtension.status).toHaveText('ACTIVE');
        await kindExtension.disableExtension();
        await navigationBar.openSettings();
        await playExpect.poll(async () => resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeFalsy();
        await navigationBar.openExtensions();
        await kindExtension.enableExtension();
        await navigationBar.openSettings();
        await playExpect.poll(async () => resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();
      });
    });
  test.describe('Kind cluster validation tests', () => {
    test.skip(!canRunKindTests, "This test can't run on a windows rootless machine");
    test('Create a Kind cluster', async ({ page }) => {
      test.setTimeout(CLUSTER_CREATION_TIMEOUT);
      if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
        await createKindCluster(page, CLUSTER_NAME, false, CLUSTER_CREATION_TIMEOUT, {
          providerType: providerTypeGHA,
          useIngressController: false,
        });
      } else {
        await createKindCluster(page, CLUSTER_NAME, true, CLUSTER_CREATION_TIMEOUT);
      }
    });

    test('Check resources added with the Kind cluster', async ({ page }) => {
      await checkClusterResources(page, KIND_NODE);
    });

    test('Kind cluster operations - STOP', async ({ page }) => {
      await resourceConnectionAction(page, kindResourceCard, ResourceElementActions.Stop, ResourceElementState.Off);
    });

    test('Kind cluster operations - START', async ({ page }) => {
      await resourceConnectionAction(
        page,
        kindResourceCard,
        ResourceElementActions.Start,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations - RESTART', async ({ page }) => {
      await resourceConnectionAction(
        page,
        kindResourceCard,
        ResourceElementActions.Restart,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations - DELETE', async ({ page }) => {
      await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
    });
  });
  test.describe('Kind cluster operations - Details', () => {
    test.skip(!canRunKindTests, "This test can't run on a windows rootless machine");
    test('Create a Kind cluster', async ({ page }) => {
      test.setTimeout(CLUSTER_CREATION_TIMEOUT);
      if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
        await createKindCluster(page, CLUSTER_NAME, false, CLUSTER_CREATION_TIMEOUT, {
          providerType: providerTypeGHA,
          useIngressController: false,
        });
      } else {
        await createKindCluster(page, CLUSTER_NAME, true, CLUSTER_CREATION_TIMEOUT);
      }
    });

    test('Kind cluster operations details - STOP', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        CLUSTER_NAME,
        ResourceElementActions.Stop,
        ResourceElementState.Off,
      );
    });

    test('Kind cluster operations details - START', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        CLUSTER_NAME,
        ResourceElementActions.Start,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations details - RESTART', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        CLUSTER_NAME,
        ResourceElementActions.Restart,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations details - DELETE', async ({ page }) => {
      await deleteClusterFromDetails(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
    });
  });
});
