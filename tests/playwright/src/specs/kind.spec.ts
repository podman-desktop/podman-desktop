/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { ResourceElementActions } from '../model/core/operations';
import { ContainerState, ResourceElementState } from '../model/core/states';
import type { ContainerInteractiveParams } from '../model/core/types';
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
import { deployContainerToCluster } from '../utility/kubernetes';
import { deleteContainer, deleteImage, ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const resourceName: string = 'kind';
const extensionLabel: string = 'podman-desktop.kind';
const clusterName: string = 'kind-cluster';
const kindContainer: string = `${clusterName}-control-plane`;
const customConfigClusterName: string = 'test-cluster';
const cusotmConfigKindContainer: string = `${customConfigClusterName}-control-plane`;
const clusterCreationTimeout: number = 300_000;
const kubernetesContext: string = `kind-${clusterName}`;

const imageToPull: string = 'ghcr.io/linuxcontainers/alpine';
const imageTag: string = 'latest';
const containerName: string = 'alpine-container';
const deployedPodName: string = containerName;
const containerStartParams: ContainerInteractiveParams = {
  attachTerminal: false,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CUSTOM_CONFIG_FILE_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  'test-kind-config-file.yaml',
);

let resourcesPage: ResourcesPage;
let kindResourceCard: ResourceConnectionCardPage;

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.skip(!canRunKindTests(), `This test can't run on a windows rootless machine`);

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('kind-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  resourcesPage = new ResourcesPage(page);
  kindResourceCard = new ResourceConnectionCardPage(page, resourceName);
});

test.afterAll(async ({ runner, page }) => {
  try {
    await deleteContainer(page, containerName);
    await deleteImage(page, imageToPull);
    await deleteCluster(page, resourceName, kindContainer, clusterName);
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
        const kindExtension = await extensionsPage.getInstalledExtension('Kind extension', extensionLabel);
        await playExpect
          .poll(async () => await extensionsPage.extensionIsInstalled(extensionLabel), { timeout: 10000 })
          .toBeTruthy();
        await playExpect(kindExtension.status).toHaveText('ACTIVE');
        await kindExtension.disableExtension();
        await navigationBar.openSettings();
        await playExpect.poll(async () => resourcesPage.resourceCardIsVisible(resourceName)).toBeFalsy();
        await navigationBar.openExtensions();
        await kindExtension.enableExtension();
        await navigationBar.openSettings();
        await playExpect.poll(async () => resourcesPage.resourceCardIsVisible(resourceName)).toBeTruthy();
      });
    });
  test.describe('Kind cluster validation tests', () => {
    test('Create a Kind cluster', async ({ page }) => {
      test.setTimeout(clusterCreationTimeout);
      if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
        await createKindCluster(page, clusterName, false, clusterCreationTimeout, {
          providerType: providerTypeGHA,
          useIngressController: false,
        });
      } else {
        await createKindCluster(page, clusterName, true, clusterCreationTimeout);
      }
    });

    test('Check resources added with the Kind cluster', async ({ page }) => {
      await checkClusterResources(page, kindContainer);
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
      await deleteCluster(page, resourceName, kindContainer, clusterName);
    });
  });
  test.describe('Kind cluster operations - Details', () => {
    test('Create a Kind cluster', async ({ page }) => {
      test.setTimeout(clusterCreationTimeout);
      if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
        await createKindCluster(page, clusterName, false, clusterCreationTimeout, {
          providerType: providerTypeGHA,
          useIngressController: false,
        });
      } else {
        await createKindCluster(page, clusterName, true, clusterCreationTimeout);
      }
    });

    test('Deploy a container to the Kind cluster', async ({ page, navigationBar }) => {
      const imagesPage = await navigationBar.openImages();
      const pullImagePage = await imagesPage.openPullImage();
      await pullImagePage.pullImage(imageToPull, imageTag);
      await playExpect.poll(async () => imagesPage.waitForImageExists(imageToPull, 10_000)).toBeTruthy();
      const containersPage = await imagesPage.startContainerWithImage(imageToPull, containerName, containerStartParams);
      await playExpect
        .poll(async () => containersPage.containerExists(containerName), {
          timeout: 15_000,
        })
        .toBeTruthy();
      const containerDetails = await containersPage.openContainersDetails(containerName);
      await playExpect(containerDetails.heading).toBeVisible();
      await playExpect.poll(async () => containerDetails.getState()).toBe(ContainerState.Running);
      await deployContainerToCluster(page, containerName, kubernetesContext, deployedPodName);
    });

    test('Kind cluster operations details - STOP', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        clusterName,
        ResourceElementActions.Stop,
        ResourceElementState.Off,
      );
    });

    test('Kind cluster operations details - START', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        clusterName,
        ResourceElementActions.Start,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations details - RESTART', async ({ page }) => {
      await resourceConnectionActionDetails(
        page,
        kindResourceCard,
        clusterName,
        ResourceElementActions.Restart,
        ResourceElementState.Running,
      );
    });

    test('Kind cluster operations details - DELETE', async ({ page }) => {
      await deleteClusterFromDetails(page, resourceName, kindContainer, clusterName);
    });
  });
  test.describe('Kind cluster creation with custom config file', () => {
    test('Create a Kind cluster using the custom config file', async ({ page }) => {
      test.setTimeout(clusterCreationTimeout);
      if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
        await createKindCluster(page, customConfigClusterName, false, clusterCreationTimeout, {
          configFilePath: CUSTOM_CONFIG_FILE_PATH,
          providerType: providerTypeGHA,
          useIngressController: false,
        });
      } else {
        await createKindCluster(page, customConfigClusterName, false, clusterCreationTimeout, {
          configFilePath: CUSTOM_CONFIG_FILE_PATH,
        });
      }
      await checkClusterResources(page, cusotmConfigKindContainer);
    });
    test('Delete the Kind cluster', async ({ page }) => {
      await deleteClusterFromDetails(page, resourceName, cusotmConfigKindContainer, customConfigClusterName);
    });
  });
});
