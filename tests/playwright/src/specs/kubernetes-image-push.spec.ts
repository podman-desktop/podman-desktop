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

import { KubernetesResourceState } from '/@/model/core/states';
import { KubernetesResources } from '/@/model/core/types';
import { canRunKindTests } from '/@/setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '/@/utility/cluster-operations';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  checkKubernetesResourceState,
  createKubernetesResource,
  deleteKubernetesResource,
} from '/@/utility/kubernetes';
import { ensureCliInstalled } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const CLUSTER_NAME: string = 'kind-cluster';
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const RESOURCE_NAME: string = 'kind';
const DEPLOYMENT_NAME = 'test-image-push';
const IMAGE_NAME = 'ghcr.io/linuxcontainers/alpine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEPLOYMENT_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${DEPLOYMENT_NAME}.yaml`);

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.skip(!canRunKindTests(), `This test can't run on a windows rootless machine`);

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(350_000);
  runner.setVideoAndTraceName('kubernetes-image-push');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  if (!skipKindInstallation) {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.cliToolsTab.click();

    await ensureCliInstalled(page, 'Kind');
    // workaround for https://github.com/podman-desktop/podman-desktop/issues/13980
    await ensureCliInstalled(page, 'kubectl');
  }

  await createKindCluster(page, CLUSTER_NAME, CLUSTER_CREATION_TIMEOUT, {
    providerType: providerTypeGHA,
    useIngressController: false,
  });
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90_000);
  try {
    await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe.serial(
  'Kubernetes pushing an image to the cluster and reusing it with a pod E2E Test',
  { tag: '@k8s_e2e' },
  () => {
    test('Pull image and push it to the cluster', async ({ navigationBar }) => {
      let imagesPage = await navigationBar.openImages();
      await playExpect(imagesPage.heading).toBeVisible();
      const pullImagePage = await imagesPage.openPullImage();
      await playExpect(pullImagePage.heading).toBeVisible();
      imagesPage = await pullImagePage.pullImage(IMAGE_NAME);
      await playExpect(imagesPage.heading).toBeVisible();
      await playExpect.poll(async () => imagesPage.waitForImageExists(IMAGE_NAME, 30_000), { timeout: 0 }).toBeTruthy();

      const imageDetails = await imagesPage.openImageDetails(IMAGE_NAME);
      await playExpect(imageDetails.heading).toBeVisible();
      await imageDetails.pushImageToKindCluster();
    });
    test('Kubernetes Pods page should be empty', async ({ navigationBar }) => {
      const kubernetesBar = await navigationBar.openKubernetes();
      const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
      await playExpect(kubernetesPodsPage.heading).toBeVisible();

      await playExpect.poll(async () => kubernetesPodsPage.content.textContent()).toContain('No pods');
    });
    test('Create a Kubernetes deployment resource', async ({ page }) => {
      test.setTimeout(80_000);
      await createKubernetesResource(page, KubernetesResources.Pods, DEPLOYMENT_NAME + '-pod', DEPLOYMENT_YAML_PATH);

      await checkKubernetesResourceState(
        page,
        KubernetesResources.Pods,
        DEPLOYMENT_NAME + '-pod',
        KubernetesResourceState.Running,
        80_000,
      );
    });

    test('Delete the Kubernetes pod', async ({ page }) => {
      await deleteKubernetesResource(page, KubernetesResources.Pods, DEPLOYMENT_NAME);
    });
  },
);
