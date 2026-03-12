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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { KubernetesResourceState } from '/@/model/core/states';
import { KubernetesResources } from '/@/model/core/types';
import { createKindCluster, deleteCluster } from '/@/utility/cluster-operations';
import { expect as playExpect, test } from '/@/utility/fixtures';
import {
  checkKubernetesResourceState,
  configurePortForwarding,
  createKubernetesResource,
  deleteKubernetesResource,
  getFirstPodFromDeployment,
  monitorPodStatusInClusterContainer,
  verifyLocalPortResponse,
  verifyPortForwardingConfiguration,
} from '/@/utility/kubernetes';
import { deleteContainer, deleteImage, ensureCliInstalled } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const CLUSTER_NAME: string = 'kind-cluster';
const CLUSTER_CREATION_TIMEOUT: number = 300_000;
const KIND_NODE: string = `${CLUSTER_NAME}-control-plane`;
const RESOURCE_NAME: string = 'kind';

const DEPLOYMENT_NAME: string = 'test-deployment-resource';
const SERVICE_NAME: string = 'test-service-resource';
const INGRESS_NAME: string = 'test-ingress-resource';

const IMAGE_NAME: string = 'ghcr.io/podmandesktop-ci/nginx';
const CONTAINER_NAME: string = 'nginx-container';

const INGRESS_CONTROLLER_COMMAND: string = 'kubectl get pods -n projectcontour';
const REMOTE_PORT: number = 80;
const LOCAL_PORT: number = 50000;
const SECOND_LOCAL_PORT: number = 50001;
const THIRD_LOCAL_PORT: number = 50002;
const SERVICE_REMOTE_PORT: number = 8080;
const DEPLOYMENT_REMOTE_PORT: number = 80;
const PORT_FORWARDING_ADDRESS: string = `http://localhost:${LOCAL_PORT}/`;
const SERVICE_PORT_ADDRESS: string = `http://localhost:${SECOND_LOCAL_PORT}/`;
const DEPLOYMENT_PORT_ADDRESS: string = `http://localhost:${THIRD_LOCAL_PORT}/`;
const SERVICE_ADDRESS: string = 'http://localhost:9090/';
const RESPONSE_MESSAGE: string = 'Welcome to nginx!';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEPLOYMENT_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${DEPLOYMENT_NAME}.yaml`,
);
const SERVICE_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${SERVICE_NAME}.yaml`,
);
const INGRESS_YAML_PATH: string = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'kubernetes',
  `${INGRESS_NAME}.yaml`,
);

const skipKindInstallation = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

let firstPodName: string;

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(350_000);
  runner.setVideoAndTraceName('kubernetes-networking');

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
    useIngressController: true,
  });
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90_000);
  try {
    await deleteContainer(page, CONTAINER_NAME);
    await deleteImage(page, IMAGE_NAME);
    await deleteCluster(page, RESOURCE_NAME, KIND_NODE, CLUSTER_NAME);
  } finally {
    await runner.close();
  }
});

test.describe
  .serial('Kubernetes networking E2E test', { tag: '@k8s_e2e' }, () => {
    test('Apply deployment, service, and ingress resources to the cluster', async ({ page }) => {
      test.setTimeout(80_000);
      await createKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, DEPLOYMENT_YAML_PATH);
      await createKubernetesResource(page, KubernetesResources.Services, SERVICE_NAME, SERVICE_YAML_PATH);
      await createKubernetesResource(page, KubernetesResources.IngeressesRoutes, INGRESS_NAME, INGRESS_YAML_PATH);
      await checkKubernetesResourceState(
        page,
        KubernetesResources.Deployments,
        DEPLOYMENT_NAME,
        KubernetesResourceState.Running,
        80_000,
      );
      await checkKubernetesResourceState(
        page,
        KubernetesResources.Services,
        SERVICE_NAME,
        KubernetesResourceState.Running,
        10_000,
      );
      await checkKubernetesResourceState(
        page,
        KubernetesResources.IngeressesRoutes,
        INGRESS_NAME,
        KubernetesResourceState.Running,
        10_000,
      );
      // Get the first pod from the deployment
      firstPodName = await getFirstPodFromDeployment(page, DEPLOYMENT_NAME);
    });

    test.describe('Ingress routing workflow verification', () => {
      test('Verify Ingress controller pods are running', async ({ page }) => {
        test.setTimeout(160_000);
        await monitorPodStatusInClusterContainer(page, KIND_NODE, INGRESS_CONTROLLER_COMMAND);
      });

      test(`Verify the availability of the ${SERVICE_NAME} service.`, async () => {
        await verifyLocalPortResponse(SERVICE_ADDRESS, RESPONSE_MESSAGE);
      });
    });

    test.describe('Port forwarding workflow verification', () => {
      test('Create port forwarding configurations for pod, service, and deployment', async ({ page }) => {
        await configurePortForwarding(page, KubernetesResources.Pods, firstPodName);
        await configurePortForwarding(page, KubernetesResources.Services, SERVICE_NAME);
        await configurePortForwarding(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
      });

      test('Verify port forwarding configurations display correctly', async ({ page }) => {
        await verifyPortForwardingConfiguration(page, firstPodName, LOCAL_PORT, REMOTE_PORT);
        await verifyPortForwardingConfiguration(page, SERVICE_NAME, SECOND_LOCAL_PORT, SERVICE_REMOTE_PORT);
        await verifyPortForwardingConfiguration(page, DEPLOYMENT_NAME, THIRD_LOCAL_PORT, DEPLOYMENT_REMOTE_PORT);
      });

      test('Verify forwarded ports respond correctly', async () => {
        await verifyLocalPortResponse(PORT_FORWARDING_ADDRESS, RESPONSE_MESSAGE);
        await verifyLocalPortResponse(SERVICE_PORT_ADDRESS, RESPONSE_MESSAGE);
        await verifyLocalPortResponse(DEPLOYMENT_PORT_ADDRESS, RESPONSE_MESSAGE);
      });

      test('Delete configuration', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.PortForwarding, firstPodName);
        await deleteKubernetesResource(page, KubernetesResources.PortForwarding, SERVICE_NAME);
        await deleteKubernetesResource(page, KubernetesResources.PortForwarding, DEPLOYMENT_NAME);
      });

      test('Verify UI components after removal', async ({ page, navigationBar }) => {
        //Verify Kubernetes port forwarding page
        const noForwardingsMessage = page.getByText('No port forwarding configured');
        await playExpect(noForwardingsMessage).toBeVisible();

        //Verify Pod details page
        const kubernetesBar = await navigationBar.openKubernetes();
        const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
        await playExpect
          .poll(async () => kubernetesPodsPage.getRowByName(firstPodName), {
            timeout: 15_000,
          })
          .toBeTruthy();
        const podDetailPage = await kubernetesPodsPage.openResourceDetails(firstPodName, KubernetesResources.Pods);
        await podDetailPage.activateTab('Summary');
        const forwardButton = page.getByRole('button', { name: 'Forward...' });
        await playExpect(forwardButton).toBeVisible();
      });

      test('Verify forwarded port responses after configuration removal', async () => {
        await verifyLocalPortResponse(PORT_FORWARDING_ADDRESS, RESPONSE_MESSAGE); // expect to contain to pass until #16529 is resolved
        await verifyLocalPortResponse(SERVICE_PORT_ADDRESS, RESPONSE_MESSAGE); // expect to contain to pass until #16529 is resolved
        await verifyLocalPortResponse(DEPLOYMENT_PORT_ADDRESS, RESPONSE_MESSAGE); // expect to contain to pass until #16529 is resolved
      });

      test('Delete Kubernetes resources', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.IngeressesRoutes, INGRESS_NAME);
        await deleteKubernetesResource(page, KubernetesResources.Services, SERVICE_NAME);
        await deleteKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
      });
    });
  });
