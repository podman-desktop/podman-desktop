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
import { test } from '../utility/fixtures';
import {
  applyYamlFileToCluster,
  checkDeploymentReplicasInfo,
  checkKubernetesResourceState,
  createKubernetesResource,
  deleteKubernetesResource,
  editDeploymentYamlFile,
} from '../utility/kubernetes';
import { deletePod, ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const clusterName: string = 'kind-cluster';
const clusterCreationTimeout: number = 300_000;
const kindNode: string = `${clusterName}-control-plane`;
const resourceName: string = 'kind';
const kubernetesContext = `kind-${clusterName}`;
const kubernetesNamespace = 'default';
const pvcName = 'test-pvc-resource';
const pvcPodName = 'test-pod-pvcs';
const configMapName = 'test-configmap-resource';
const secretName = 'test-secret-resource';
const secretPodName = 'test-pod-configmaps-secrets';
const deploymentName = 'test-deployment-resource';
const cronJobName = 'test-cronjob-resource';

const kubernetesRuntime = {
  runtime: PlayYamlRuntime.Kubernetes,
  kubernetesContext: kubernetesContext,
  kubernetesNamespace: kubernetesNamespace,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pvcYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${pvcName}.yaml`);
const pvcPodYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${pvcPodName}.yaml`);
const configMapYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${configMapName}.yaml`);
const secretYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${secretName}.yaml`);
const secretPodYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${secretPodName}.yaml`);
const deploymentYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${deploymentName}.yaml`);
const cronJobYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${cronJobName}.yaml`);

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

test.skip(!canRunKindTests(), `This test can't run on a windows rootless machine`);

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
    await createKindCluster(page, clusterName, false, clusterCreationTimeout, {
      providerType: providerTypeGHA,
      useIngressController: false,
    });
  } else {
    await createKindCluster(page, clusterName, true, clusterCreationTimeout);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90000);
  try {
    await deleteCluster(page, resourceName, kindNode, clusterName);
  } finally {
    await runner.close();
  }
});

test.describe('Kubernetes resources End-to-End test', { tag: '@k8s_e2e' }, () => {
  test('Kubernetes Nodes test', async ({ page }) => {
    await checkKubernetesResourceState(page, KubernetesResources.Nodes, kindNode, KubernetesResourceState.Running);
  });
  test.describe
    .serial('PVC lifecycle test', () => {
      test('Create a new PVC resource', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.PVCs, pvcName, pvcYamlPath, kubernetesRuntime);
        await checkKubernetesResourceState(page, KubernetesResources.PVCs, pvcName, KubernetesResourceState.Stopped);
      });
      test('Bind the PVC to a pod', async ({ page }) => {
        await applyYamlFileToCluster(page, pvcPodYamlPath, kubernetesRuntime);
        await checkKubernetesResourceState(page, KubernetesResources.Pods, pvcPodName, KubernetesResourceState.Running);
      });
      test('Delete the PVC resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Pods, pvcPodName);
        await deleteKubernetesResource(page, KubernetesResources.PVCs, pvcName);
      });
    });
  test.describe
    .serial('ConfigMaps and Secrets lifecycle test', () => {
      test('Create ConfigMap resource', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.ConfigMapsSecrets,
          configMapName,
          configMapYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          configMapName,
          KubernetesResourceState.Running,
        );
      });
      test('Create Secret resource', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.ConfigMapsSecrets,
          secretName,
          secretYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          secretName,
          KubernetesResourceState.Running,
        );
      });
      test('Can load config and secrets via env. var in pod', async ({ page }) => {
        test.setTimeout(120_000);

        await applyYamlFileToCluster(page, secretPodYamlPath, kubernetesRuntime);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Pods,
          secretPodName,
          KubernetesResourceState.Running,
        );
      });
      test('Delete the ConfigMap and Secret resources', async ({ page }) => {
        await deletePod(page, secretPodName);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, secretName);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, configMapName);
      });
    });

  test.describe
    .serial('Deployment lifecycle test', () => {
      test('Create a Kubernetes deployment resource', async ({ page }) => {
        test.setTimeout(90_000);
        await createKubernetesResource(
          page,
          KubernetesResources.Deployments,
          deploymentName,
          deploymentYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Deployments,
          deploymentName,
          KubernetesResourceState.Running,
        );
        await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, deploymentName, 3);
      });
      test('Edit the Kubernetes deployment YAML file', async ({ page }) => {
        test.setTimeout(90_000);
        await editDeploymentYamlFile(page, KubernetesResources.Deployments, deploymentName);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Deployments,
          deploymentName,
          KubernetesResourceState.Running,
        );
        await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, deploymentName, 5);
      });
      test('Delete the Kubernetes deployment resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Deployments, deploymentName);
      });
    });

  test.describe
    .serial('Cronjobs lifecycle test', () => {
      test('Create and verify a running Kubernetes cronjob', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.Cronjobs,
          cronJobName,
          cronJobYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Cronjobs,
          cronJobName,
          KubernetesResourceState.Running,
        );
      });
      test('Validate Job and Pod execution from CronJob', async ({ page }) => {
        test.setTimeout(80_000);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Jobs,
          cronJobName,
          KubernetesResourceState.Running,
          70_000,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Pods,
          cronJobName,
          KubernetesResourceState.Succeeded,
          70_000,
        );
      });
      test('Delete CronJob resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Cronjobs, cronJobName);
      });
    });
});
