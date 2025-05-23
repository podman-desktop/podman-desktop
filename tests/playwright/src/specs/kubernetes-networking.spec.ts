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

import { PlayYamlRuntime } from '../model/core/operations';
import { KubernetesResourceState } from '../model/core/states';
import { KubernetesResources } from '../model/core/types';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  checkKubernetesResourceState,
  configurePortForwarding,
  createKubernetesResource,
  deleteKubernetesResource,
  deployContainerToCluster,
  monitorPodStatusInClusterContainer,
  verifyLocalPortResponse,
  verifyPortForwardingConfiguration,
} from '../utility/kubernetes';
import { deleteContainer, deleteImage, ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const clusterName: string = 'kind-cluster';
const clusterCreationTimeout: number = 300_000;
const kindNode: string = `${clusterName}-control-plane`;
const resourceName: string = 'kind';
const kubernetesContext: string = `kind-${clusterName}`;
const kubernetesNamespace: string = 'default';

const deploymentName: string = 'test-deployment-resource';
const serviceName: string = 'test-service-resource';
const ingerssName: string = 'test-ingress-resource';
const kubernetesRuntime = {
  runtime: PlayYamlRuntime.Kubernetes,
  kubernetesContext: kubernetesContext,
  kubernetesNamespace: kubernetesNamespace,
};
const imageName: string = 'ghcr.io/podmandesktop-ci/nginx';
const pullImageName: string = `${imageName}:latest`;
const containerName: string = 'nginx-container';
const podName: string = containerName;

const ingressControllerCommand: string = 'kubectl get pods -n projectcontour';
const remotePort: number = 80;
const localPort: number = 50000;
const portForwardingAddress: string = `http://localhost:${localPort}/`;
const serviceAddress: string = `http://localhost:9090/`;
const responseMessage: string = 'Welcome to nginx!';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const deploymentYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${deploymentName}.yaml`);
const serviceYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${serviceName}.yaml`);
const ingressYamlPath = path.resolve(__dirname, '..', '..', 'resources', 'kubernetes', `${ingerssName}.yaml`);

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
  }

  if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
    await createKindCluster(page, clusterName, false, clusterCreationTimeout, {
      providerType: providerTypeGHA,
      useIngressController: true,
    });
  } else {
    await createKindCluster(page, clusterName, true, clusterCreationTimeout);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(90_000);
  try {
    await deleteContainer(page, containerName);
    await deleteImage(page, imageName);
    await deleteCluster(page, resourceName, kindNode, clusterName);
  } finally {
    await runner.close();
  }
});

test.describe('Kubernetes newtworking E2E test', { tag: '@k8s_e2e' }, () => {
  test.describe.serial('Port forwarding workflow verification', { tag: '@k8s_e2e' }, () => {
    test('Prepare deployment on the cluster', async ({ page, navigationBar }) => {
      test.setTimeout(120_000);
      //Pull image
      let imagesPage = await navigationBar.openImages();
      const pullImagePage = await imagesPage.openPullImage();
      imagesPage = await pullImagePage.pullImage(pullImageName);
      await playExpect.poll(async () => imagesPage.waitForImageExists(imageName, 10_000)).toBeTruthy();

      //Push image to the cluster
      const imageDetailPage = await imagesPage.openImageDetails(imageName);
      await imageDetailPage.pushImageToKindCluster();

      //Create container
      imagesPage = await navigationBar.openImages();
      await imagesPage.startContainerWithImage(imageName, containerName);
      const containersPage = await navigationBar.openContainers();
      await playExpect
        .poll(async () => containersPage.containerExists(containerName), { timeout: 15_000 })
        .toBeTruthy();
      await containersPage.openContainersDetails(containerName);

      //Deploy pod to the cluster
      await deployContainerToCluster(page, containerName, kubernetesContext, podName);
    });

    test('Create port forwarding configuration', async ({ page }) => {
      //Open pod details and create port forwarding configuration
      await configurePortForwarding(page, KubernetesResources.Pods, podName);
    });

    test('Verify new local port response', async () => {
      await verifyLocalPortResponse(portForwardingAddress, responseMessage);
    });

    test('Verify Kubernetes port forwarding page', async ({ page }) => {
      await verifyPortForwardingConfiguration(page, containerName, localPort, remotePort);
    });

    test('Delete configuration', async ({ page }) => {
      await deleteKubernetesResource(page, KubernetesResources.PortForwarding, containerName);
    });

    test('Verify UI components after removal', async ({ page, navigationBar }) => {
      //Verify Kubernetes port forwarding page
      const noForwardingsMessage = page.getByText('No port forwarding configured');
      await playExpect(noForwardingsMessage).toBeVisible();

      //Verify Pod details page
      const kubernetesBar = await navigationBar.openKubernetes();
      const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
      await playExpect.poll(async () => kubernetesPodsPage.getRowByName(podName), { timeout: 15_000 }).toBeTruthy();
      const podDetailPage = await kubernetesPodsPage.openResourceDetails(podName, KubernetesResources.Pods);
      await podDetailPage.activateTab('Summary');
      const forwardButton = page.getByRole('button', { name: `Forward...` });
      await playExpect(forwardButton).toBeVisible();
    });

    test('Verify link response after removal', async () => {
      await verifyLocalPortResponse(portForwardingAddress, responseMessage); //expect to contain to pass until #11210 is resolved
    });
  });
  test.describe
    .serial('Ingress routing workflow verification', () => {
      test('Check Ingress controller pods status', async ({ page }) => {
        test.setTimeout(160_000);
        await monitorPodStatusInClusterContainer(page, kindNode, ingressControllerCommand);
      });

      test('Create and verify a running Kubernetes deployment', async ({ page }) => {
        test.setTimeout(80_000);
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
          80_000,
        );
      });
      test('Create and verify a running Kubernetes service', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.Services,
          serviceName,
          serviceYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.Services,
          serviceName,
          KubernetesResourceState.Running,
          10_000,
        );
      });
      test('Create and verify a running Kubernetes ingress', async ({ page }) => {
        await createKubernetesResource(
          page,
          KubernetesResources.IngeressesRoutes,
          ingerssName,
          ingressYamlPath,
          kubernetesRuntime,
        );
        await checkKubernetesResourceState(
          page,
          KubernetesResources.IngeressesRoutes,
          ingerssName,
          KubernetesResourceState.Running,
          10_000,
        );
      });
      test(`Verify the availability of the ${serviceName} service.`, async () => {
        await verifyLocalPortResponse(serviceAddress, responseMessage);
      });
      test('Delete Kubernetes resources', async ({ page }) => {
        await deleteKubernetesResource(page, KubernetesResources.IngeressesRoutes, ingerssName);
        await deleteKubernetesResource(page, KubernetesResources.Services, serviceName);
        await deleteKubernetesResource(page, KubernetesResources.Deployments, deploymentName);
      });
    });
});
