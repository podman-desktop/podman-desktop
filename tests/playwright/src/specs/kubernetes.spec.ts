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

import { PlayYamlRuntime } from '../model/core/operations';
import { KubernetesResourceState, PodState } from '../model/core/states';
import { KubernetesResources } from '../model/core/types';
import { canRunKindTests } from '../setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  applyYamlFileToCluster,
  checkKubernetesResourceState,
  createKubernetesResource,
  deleteKubernetesResource,
} from '../utility/kubernetes';
import { deletePod, ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const CLUSTER_NAME: string = 'kind-cluster';
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const RESOURCE_NAME: string = 'kind';
const KUBERNETES_CONTEXT = `kind-${CLUSTER_NAME}`;
const KUBERNETES_NAMESPACE = 'default';
const PVC_NAME = 'test-pvc-resource';
const PVC_POD_NAME = 'test-pod-pvcs';
const CONFIGMAP_NAME = 'test-configmap-resource';
const SECRET_NAME = 'test-secret-resource';
const SECRET_POD_NAME = 'test-pod-configmaps-secrets';
const KUBERNETES_RUNTIME = {
  runtime: PlayYamlRuntime.Kubernetes,
  kubernetesContext: KUBERNETES_CONTEXT,
  kubernetesNamespace: KUBERNETES_NAMESPACE,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PVC_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${PVC_NAME}.yaml`);
const PVC_POD_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${PVC_POD_NAME}.yaml`);
const CONFIGMAP_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${CONFIGMAP_NAME}.yaml`);
const SECRET_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${SECRET_NAME}.yaml`);
const SECRET_POD_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${SECRET_POD_NAME}.yaml`);

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.skip(!canRunKindTests, `This test can't run on a windows rootless machine`);

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(350_000);
  runner.setVideoAndTraceName('kubernetes-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  if (!skipKindInstallation) {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.cliToolsTab.click();

    await ensureCliInstalled(page, 'Kind');
  }

  if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
    await createKindCluster(page, CLUSTER_NAME, false, CLUSTER_CREATION_TIMEOUT, {
      providerType: providerTypeGHA,
      useIngressController: false,
    });
  } else {
    await createKindCluster(page, CLUSTER_NAME, true, CLUSTER_CREATION_TIMEOUT);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90000);
  try {
    await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe('Kubernetes resources End-to-End test', { tag: '@k8s_e2e' }, () => {
  test('Kubernetes Nodes test', async ({ page }) => {
    await checkKubernetesResourceState(page, KubernetesResources.Nodes, KIND_NODE, KubernetesResourceState.Running);
  });
  test.describe
    .serial('PVC lifecycle test', () => {
      test('Create a new PVC resource', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.PVCs, PVC_NAME, PVC_YAML_PATH, KUBERNETES_RUNTIME);
        await checkKubernetesResourceState(page, KubernetesResources.PVCs, PVC_NAME, KubernetesResourceState.Stopped);
      });
      test('Bind the PVC to a pod', async ({ page }) => {
        await applyYamlFileToCluster(page, PVC_POD_YAML_PATH, KUBERNETES_RUNTIME);
        await checkKubernetesResourceState(page, KubernetesResources.PVCs, PVC_NAME, KubernetesResourceState.Running);
      });
      test('Delete the PVC resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Pods, PVC_POD_NAME);
        await deleteKubernetesResource(page, KubernetesResources.PVCs, PVC_NAME);
      });
    });
  test.describe
    .serial('ConfigMaps and Secrets lifecycle test', () => {
      test('Create ConfigMap resource', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.ConfigMapsSecrets,
          CONFIGMAP_NAME,
          CONFIGMAP_YAML_PATH,
          KUBERNETES_RUNTIME,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          CONFIGMAP_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Create Secret resource', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.ConfigMapsSecrets,
          SECRET_NAME,
          SECRET_YAML_PATH,
          KUBERNETES_RUNTIME,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          SECRET_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Can load config and secrets via env. var in pod', async ({ page, navigationBar }) => {
        await applyYamlFileToCluster(page, SECRET_POD_YAML_PATH, KUBERNETES_RUNTIME);

        const kubernetesBar = await navigationBar.openKubernetes();
        const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
        await playExpect
          .poll(async () => kubernetesPodsPage.getResourceRowByName(SECRET_POD_NAME), { timeout: 25_000 })
          .toBeTruthy();

        const podsDetailsPage = await kubernetesPodsPage.openResourceDetails(SECRET_POD_NAME, KubernetesResources.Pods);
        await playExpect(podsDetailsPage.heading).toBeVisible();
        await playExpect.poll(async () => podsDetailsPage.getState(), { timeout: 50_000 }).toEqual(PodState.Running);
      });
      test('Delete the ConfigMap and Secret resources', async ({ page }) => {
        await deletePod(page, SECRET_POD_NAME);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, SECRET_NAME);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, CONFIGMAP_NAME);
      });
    });
});
