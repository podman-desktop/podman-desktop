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

import { KubernetesResources } from '../model/core/types';
import { KubernetesResourcePage } from '../model/pages/kubernetes-resource-page';
import { canRunKindTests } from '../setupFiles/setup-kind';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import {
  configurePortForwarding,
  verifyLocalPortResponse,
  verifyPortForwardingConfiguration,
} from '../utility/kubernetes';
import { deleteContainer, deleteImage, ensureCliInstalled, handleConfirmationDialog } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const clusterName: string = 'kind-cluster';
const kindNode: string = `${clusterName}-control-plane`;
const clusterContext: string = `kind-${clusterName}`;
const skipKindInstall = process.env.SKIP_KIND_INSTALL === 'true';
const providerTypeGHA = process.env.KIND_PROVIDER_GHA ?? '';

const imageName: string = 'ghcr.io/podmandesktop-ci/nginx';
const pullImageName: string = `${imageName}:latest`;
const containerName: string = 'nginx-container';
const podName: string = containerName;

const remotePort: number = 80;
const localPort: number = 50000;
const forwardAddress: string = `http://localhost:${localPort}/`;
const responseMessage: string = 'Welcome to nginx!';

test.skip(!canRunKindTests, `This test can't run on a windows rootless machine`);

test.beforeAll(async ({ runner, welcomePage, page, navigationBar }) => {
  test.setTimeout(200_000);
  runner.setVideoAndTraceName('kubernetes-port-forwarding');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);

  if (!skipKindInstall) {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.cliToolsTab.click();
    await ensureCliInstalled(page, 'Kind');
  }

  if (process.env.GITHUB_ACTIONS && process.env.RUNNER_OS === 'Linux') {
    await createKindCluster(page, clusterName, false, 300_000, {
      providerType: providerTypeGHA,
      useIngressController: false,
    });
  } else {
    await createKindCluster(page, clusterName, true, 300_000);
  }
});

test.afterAll(async ({ runner, page }) => {
  test.setTimeout(100_000);
  try {
    await deleteContainer(page, containerName);
    await deleteImage(page, imageName);
    await deleteCluster(page, 'kind', kindNode, clusterName);
  } finally {
    await runner.close();
  }
});

test.describe.serial('Port forwarding workflow verification', { tag: '@k8s_e2e' }, () => {
  test('Prepare deployment on the cluster', async ({ navigationBar }) => {
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
    await playExpect.poll(async () => containersPage.containerExists(containerName), { timeout: 15_000 }).toBeTruthy();
    const containerDetailPage = await containersPage.openContainersDetails(containerName);

    //Deploy pod to the cluster
    const deployToKubernetesPage = await containerDetailPage.openDeployToKubernetesPage();
    await deployToKubernetesPage.deployPod(
      containerName,
      { useKubernetesServices: true, useKubernetesIngress: false },
      clusterContext,
    );
    await playExpect(deployToKubernetesPage.doneButton).toBeVisible({ timeout: 45_000 });
    await deployToKubernetesPage.doneButton.click();

    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
    await playExpect
      .poll(async () => kubernetesPodsPage.getResourceRowByName(podName), { timeout: 15_000 })
      .toBeTruthy();
  });

  test('Create port forwarding configuration', async ({ page }) => {
    //Open pod details and create port forwarding configuration
    await configurePortForwarding(page, KubernetesResources.Pods, podName);
  });

  test('Verify new local port response', async () => {
    await verifyLocalPortResponse(forwardAddress, responseMessage);
  });

  test('Verify Kubernetes port forwarding page', async ({ page }) => {
    await verifyPortForwardingConfiguration(page, containerName, localPort, remotePort);
  });

  test('Delete configuration', async ({ page }) => {
    const portForwardingPage = new KubernetesResourcePage(page, KubernetesResources.PortForwarding);
    await portForwardingPage.deleteKubernetesResource(containerName);

    await handleConfirmationDialog(page);
  });

  test('Verify UI components after removal', async ({ page, navigationBar }) => {
    //Verify Kubernetes port forwarding page
    const portForwardingPage = new KubernetesResourcePage(page, KubernetesResources.PortForwarding);
    const configurationRow = portForwardingPage.getResourceRowByName(containerName);
    await playExpect(configurationRow).toBeHidden();
    const noForwardingsMessage = page.getByText('No port forwarding configured');
    await playExpect(noForwardingsMessage).toBeVisible();

    //Verify Pod details page
    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
    await playExpect
      .poll(async () => kubernetesPodsPage.getResourceRowByName(podName), { timeout: 15_000 })
      .toBeTruthy();
    const podDetailPage = await kubernetesPodsPage.openResourceDetails(podName, KubernetesResources.Pods);
    await podDetailPage.activateTab('Summary');
    const forwardButton = page.getByRole('button', { name: `Forward...` });
    await playExpect(forwardButton).toBeVisible();
  });

  test('Verify link response after removal', async () => {
    await verifyLocalPortResponse(forwardAddress, responseMessage); //expect to contain to pass until #11210 is resolved
  });
});
