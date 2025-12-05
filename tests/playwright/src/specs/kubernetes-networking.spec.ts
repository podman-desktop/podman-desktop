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
  deployContainerToCluster,
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
const KUBERNETES_CONTEXT: string = `kind-${CLUSTER_NAME}`;

const DEPLOYMENT_NAME: string = 'test-deployment-resource';
const SERVICE_NAME: string = 'test-service-resource';
const INGRESS_NAME: string = 'test-ingress-resource';

const IMAGE_NAME: string = 'ghcr.io/podmandesktop-ci/nginx';
const PULL_IMAGE_NAME: string = `${IMAGE_NAME}:latest`;
const CONTAINER_NAME: string = 'nginx-container';
const POD_NAME: string = CONTAINER_NAME;

const INGRESS_CONTROLLER_COMMAND: string = 'kubectl get pods -n projectcontour';
const REMOTE_PORT: number = 80;
const LOCAL_PORT: number = 50000;
const PORT_FORWARDING_ADDRESS: string = `http://localhost:${LOCAL_PORT}/`;
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

test.describe('Kubernetes networking E2E test', { tag: '@k8s_e2e' }, () => {
  test.describe
    .serial('Ingress routing workflow verification', () => {
      test('Check Ingress controller pods status', async ({ page }) => {
        test.setTimeout(160_000);
        await monitorPodStatusInClusterContainer(page, KIND_NODE, INGRESS_CONTROLLER_COMMAND);
      });

      test('Create and verify a running Kubernetes deployment', async ({ page }) => {
        test.setTimeout(80_000);
        await createKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME, DEPLOYMENT_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Deployments,
          DEPLOYMENT_NAME,
          KubernetesResourceState.Running,
          80_000,
        );
      });
      test('Create and verify a running Kubernetes service', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.Services, SERVICE_NAME, SERVICE_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Services,
          SERVICE_NAME,
          KubernetesResourceState.Running,
          10_000,
        );
      });
      test('Create and verify a running Kubernetes ingress', async ({ page }) => {
        await createKubernetesResource(page, KubernetesResources.IngeressesRoutes, INGRESS_NAME, INGRESS_YAML_PATH);
        await checkKubernetesResourceState(
          page,
          KubernetesResources.IngeressesRoutes,
          INGRESS_NAME,
          KubernetesResourceState.Running,
          10_000,
        );
      });
      test(`Verify the availability of the ${SERVICE_NAME} service.`, async () => {
        await verifyLocalPortResponse(SERVICE_ADDRESS, RESPONSE_MESSAGE);
      });
      test('Delete Kubernetes resources', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.IngeressesRoutes, INGRESS_NAME);
        await deleteKubernetesResource(page, KubernetesResources.Services, SERVICE_NAME);
        await deleteKubernetesResource(page, KubernetesResources.Deployments, DEPLOYMENT_NAME);
      });
    });

  test.describe.serial('Port forwarding workflow verification', { tag: '@k8s_e2e' }, () => {
    test('Prepare deployment on the cluster', async ({ page, navigationBar }) => {
      test.setTimeout(120_000);
      //Pull image
      let imagesPage = await navigationBar.openImages();
      const pullImagePage = await imagesPage.openPullImage();
      imagesPage = await pullImagePage.pullImage(PULL_IMAGE_NAME);
      await playExpect.poll(async () => imagesPage.waitForImageExists(IMAGE_NAME, 10_000)).toBeTruthy();

      //Push image to the cluster
      const imageDetailPage = await imagesPage.openImageDetails(IMAGE_NAME);
      await imageDetailPage.pushImageToKindCluster();

      //Create container
      imagesPage = await navigationBar.openImages();
      await imagesPage.startContainerWithImage(IMAGE_NAME, CONTAINER_NAME);
      const containersPage = await navigationBar.openContainers();
      await playExpect
        .poll(async () => containersPage.containerExists(CONTAINER_NAME), { timeout: 15_000 })
        .toBeTruthy();
      await containersPage.openContainersDetails(CONTAINER_NAME);

      //Deploy pod to the cluster
      await deployContainerToCluster(page, CONTAINER_NAME, KUBERNETES_CONTEXT, POD_NAME);
    });

    test('Create port forwarding configuration', async ({ page }) => {
      //Open pod details and create port forwarding configuration
      await configurePortForwarding(page, KubernetesResources.Pods, POD_NAME);
    });

    test('Verify Kubernetes port forwarding page', async ({ page }) => {
      await verifyPortForwardingConfiguration(page, CONTAINER_NAME, LOCAL_PORT, REMOTE_PORT);
    });

    test('Verify new local port response', async () => {
      await verifyLocalPortResponse(PORT_FORWARDING_ADDRESS, RESPONSE_MESSAGE);
    });

    test('Delete configuration', async ({ page }) => {
      await deleteKubernetesResource(page, KubernetesResources.PortForwarding, CONTAINER_NAME);
    });

    test('Verify UI components after removal', async ({ page, navigationBar }) => {
      //Verify Kubernetes port forwarding page
      const noForwardingsMessage = page.getByText('No port forwarding configured');
      await playExpect(noForwardingsMessage).toBeVisible();

      //Verify Pod details page
      const kubernetesBar = await navigationBar.openKubernetes();
      const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
      await playExpect.poll(async () => kubernetesPodsPage.getRowByName(POD_NAME), { timeout: 15_000 }).toBeTruthy();
      const podDetailPage = await kubernetesPodsPage.openResourceDetails(POD_NAME, KubernetesResources.Pods);
      await podDetailPage.activateTab('Summary');
      const forwardButton = page.getByRole('button', { name: 'Forward...' });
      await playExpect(forwardButton).toBeVisible();
    });

    test('Verify link response after removal', async () => {
      await verifyLocalPortResponse(PORT_FORWARDING_ADDRESS, RESPONSE_MESSAGE); //expect to contain to pass until #11210 is resolved
    });
  });
});
