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

import { expect as playExpect } from '@playwright/test';

import { KubernetesResourceState } from '/@/model/core/states';
import { KubernetesResources } from '/@/model/core/types';
import { canRunKindTests } from '/@/setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '/@/utility/cluster-operations';
import { test } from '/@/utility/fixtures';
import {
  checkDeploymentReplicasInfo,
  checkKubernetesResourceState,
  createKubernetesResource,
  deleteKubernetesResource,
  editDeploymentYamlFile,
} from '/@/utility/kubernetes';
import { deletePod, ensureCliInstalled } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const CLUSTER_NAME: string = 'kind-cluster';
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const RESOURCE_NAME: string = 'kind';
const PVC_NAME: string = 'test-pvc-resource';
const PVC_POD_NAME: string = 'test-pod-pvcs';
const CONFIG_MAP_NAME: string = 'test-configmap-resource';
const SECRET_NAME: string = 'test-secret-resource';
const SECRET_POD_NAME: string = 'test-pod-configmaps-secrets';
const DEPLOYMENT_NAME: string = 'test-deployment-resource';
const CRON_JOB_NAME: string = 'test-cronjob-resource';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PVC_YAML_PATH: string = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${PVC_NAME}.yaml`);
const PVC_POD_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${PVC_POD_NAME}.yaml`,
);
const CONFIG_MAP_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${CONFIG_MAP_NAME}.yaml`,
);
const SECRET_YAML_PATH: string = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${SECRET_NAME}.yaml`);
const SECRET_POD_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${SECRET_POD_NAME}.yaml`,
);
const DEPLOYMENT_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${DEPLOYMENT_NAME}.yaml`,
);
const CRON_JOB_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${CRON_JOB_NAME}.yaml`,
);

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
    // Workaround for https://github.com/podman-desktop/podman-desktop/issues/13980
    await ensureCliInstalled(page, 'kubectl');
  }

  await createKindCluster(page, CLUSTER_NAME, CLUSTER_CREATION_TIMEOUT, {
    providerType: providerTypeGHA,
    useIngressController: false,
  });
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90000);
  try {
    await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe('Kubernetes resources End-to-End test', { tag: ['@k8s_e2e', '@k8s_sanity'] }, () => {
  test('Kubernetes Nodes test', async ({ page }) => {
    await checkKubernetesResourceState(page, KubernetesResources.Nodes, KIND_NODE, KubernetesResourceState.Running);
  });

  test('Kubernetes dashboard and namespaces test', async ({ navigationBar }) => {
    const kubernetesBar = await navigationBar.openKubernetes();
    const dashboardPage = await kubernetesBar.openKubernetesDashboardPage();

    await playExpect(dashboardPage.namespaceDropdownButton).toBeVisible({ timeout: 10_000 });
    await playExpect(dashboardPage.currentNamespace).toHaveValue('default');

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.Nodes), { timeout: 10_000 })
      .toBe(1);

    await playExpect
      .poll(async () => dashboardPage.getCurrentActiveCountForResource(KubernetesResources.Nodes), { timeout: 10_000 })
      .toBe(1);

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.Deployments), {
        timeout: 10_000,
      })
      .toBe(0);

    await playExpect
      .poll(async () => dashboardPage.getCurrentActiveCountForResource(KubernetesResources.Deployments), {
        timeout: 10_000,
      })
      .toBe(0);

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.Pods), { timeout: 10_000 })
      .toBe(0);

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.Services), {
        timeout: 10_000,
      })
      .toBe(1);

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.ConfigMapsSecrets), {
        timeout: 10_000,
      })
      .toBe(1);

    await dashboardPage.changeNamespace('kube-public');

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.ConfigMapsSecrets), {
        timeout: 10_000,
      })
      .toBe(2);

    await dashboardPage.changeNamespace('default');

    await playExpect
      .poll(async () => dashboardPage.getCurrentTotalCountForResource(KubernetesResources.ConfigMapsSecrets), {
        timeout: 10_000,
      })
      .toBe(1);
  });

  test.describe
    .serial('PVC lifecycle test', () => {
      test('Create a new PVC resource', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.PVCs, PVC_NAME, PVC_YAML_PATH);
        await checkKubernetesResourceState(page, KubernetesResources.PVCs, PVC_NAME, KubernetesResourceState.Stopped);
      });
      test('Bind the PVC to a pod', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.Pods, PVC_POD_NAME, PVC_POD_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Pods,
          PVC_POD_NAME,
          KubernetesResourceState.Running,
        );
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
          CONFIG_MAP_NAME,
          CONFIG_MAP_YAML_PATH,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          CONFIG_MAP_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Create Secret resource', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, SECRET_NAME, SECRET_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.ConfigMapsSecrets,
          SECRET_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Can load config and secrets via env. var in pod', async ({ page }) => {
        test.setTimeout(120_000);

        await createKubernetesResource(page, KubernetesResources.Pods, SECRET_POD_NAME, SECRET_POD_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Pods,
          SECRET_POD_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Delete the ConfigMap and Secret resources', async ({ page }) => {
        await deletePod(page, SECRET_POD_NAME);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, SECRET_NAME);
        await deleteKubernetesResource(page, KubernetesResources.ConfigMapsSecrets, CONFIG_MAP_NAME);
      });
    });

  test.describe
    .serial('Deployment lifecycle test', () => {
      test('Create a Kubernetes deployment resource', async ({ page }) => {
        test.setTimeout(90_000);
        await createKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, DEPLOYMENT_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Deployments,
          DEPLOYMENT_NAME,
          KubernetesResourceState.Running,
        );
        await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, 3);
      });
      test('Edit the Kubernetes deployment YAML file', async ({ page }) => {
        test.setTimeout(90_000);
        await editDeploymentYamlFile(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Deployments,
          DEPLOYMENT_NAME,
          KubernetesResourceState.Running,
        );
        await checkDeploymentReplicasInfo(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, 5);
      });
      test('Delete the Kubernetes deployment resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
      });
    });

  test.describe
    .serial('Cronjobs lifecycle test', () => {
      test('Create and verify a running Kubernetes cronjob', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.Cronjobs, CRON_JOB_NAME, CRON_JOB_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Cronjobs,
          CRON_JOB_NAME,
          KubernetesResourceState.Running,
        );
      });
      test('Validate Job and Pod execution from CronJob', async ({ page }) => {
        test.setTimeout(80_000);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Jobs,
          CRON_JOB_NAME,
          KubernetesResourceState.Running,
          70_000,
        );

        await checkKubernetesResourceState(
          page,
          KubernetesResources.Jobs,
          CRON_JOB_NAME,
          KubernetesResourceState.None, // Currently there is no 'Completed' state, using None which means the state column is empty
          70_000,
        );

        await checkKubernetesResourceState(
          page,
          KubernetesResources.Pods,
          CRON_JOB_NAME,
          KubernetesResourceState.Succeeded,
          70_000,
        );
      });
      test('Delete CronJob resource', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.Cronjobs, CRON_JOB_NAME);
      });
    });
});
