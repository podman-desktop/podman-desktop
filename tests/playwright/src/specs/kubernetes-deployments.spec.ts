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
import { KubernetesResourceState } from '../model/core/states';
import { KubernetesResources } from '../model/core/types';
import { canRunKindTests } from '../setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  checkDeploymentReplicasInfo,
  checkKubernetesResourceState,
  createKubernetesResource,
  deleteKubernetesResource,
  editDeploymentYamlFile,
} from '../utility/kubernetes';
import { ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const CLUSTER_NAME: string = 'kind-cluster';
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const RESOURCE_NAME: string = 'kind';
const KUBERNETES_CONTEXT = `kind-${CLUSTER_NAME}`;
const KUBERNETES_NAMESPACE = 'default';
const DEPLOYMENT_NAME = 'test-deployment-resource';
const KUBERNETES_RUNTIME = {
  runtime: PlayYamlRuntime.Kubernetes,
  kubernetesContext: KUBERNETES_CONTEXT,
  kubernetesNamespace: KUBERNETES_NAMESPACE,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEPLOYMENT_YAML_PATH = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${DEPLOYMENT_NAME}.yaml`);

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(350_000);
  runner.setVideoAndTraceName('kubernetes-edit-yaml');

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
    if (!canRunKindTests)
      //This test can't run on a windows rootless machine
      await createKindCluster(page, CLUSTER_NAME, true, CLUSTER_CREATION_TIMEOUT);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90_000);
  try {
    await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Kubernetes deployment resource E2E Test', { tag: '@k8s_e2e' }, () => {
  test.skip(!canRunKindTests, `This test can't run on a windows rootless machine`);
  test('Kubernetes Pods page should be empty', async ({ navigationBar }) => {
    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);

    await playExpect.poll(async () => kubernetesPodsPage.content.textContent()).toContain('No pods');
  });
  test('Create a Kubernetes deployment resource', async ({ page }) => {
    test.setTimeout(80_000);
    await createKubernetesResource(
      page,
      KubernetesResources.Deployments,
      DEPLOYMENT_NAME,
      DEPLOYMENT_YAML_PATH,
      KUBERNETES_RUNTIME,
    );
    await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, 3);
    await checkKubernetesResourceState(
      page,
      KubernetesResources.Deployments,
      DEPLOYMENT_NAME,
      KubernetesResourceState.Running,
      80_000,
    );
  });
  test('Edit the Kubernetes deployment YAML file', async ({ page }) => {
    test.setTimeout(120_000);
    await editDeploymentYamlFile(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
    await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, 5);
    await checkKubernetesResourceState(
      page,
      KubernetesResources.Deployments,
      DEPLOYMENT_NAME,
      KubernetesResourceState.Running,
      80_000,
    );
  });
  test('Delete the Kubernetes deployment resource', async ({ page }) => {
    await deleteKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
  });
});
