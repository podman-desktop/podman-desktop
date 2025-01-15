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
import { PodsPage } from '../model/pages/pods-page';
import { createKindCluster, deleteCluster } from '../utility/cluster-operations';
import { expect as playExpect, test } from '../utility/fixtures';
import { deleteContainer, deleteImage, ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

const clusterName: string = 'kind-cluster';
const kindNode: string = `${clusterName}-control-plane`;
const clusterContext: string = `kind-${clusterName}`;
const skipKindInstall = process.env.SKIP_KIND_INSTALL === 'true';

const imageName: string = 'docker.io/library/httpd'; //TODO non-docker image ideally ghcr.io
const containerName: string = 'httpd-container';
const podName: string = `${containerName} ${kindNode} default`;

const remotePort: number = 80;
const localPort: number = 50000;
const forwardAddress: string = `http://localhost:${localPort}/`;
const responseMessage: string = 'It works!';

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
    await createKindCluster(page, clusterName, false, 300_000, { useIngressController: false });
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

test.describe.serial('Port forwarding workflow verification', { tag: '@smoke' }, () => {
  test('Prepare deployment on the cluster', async ({ navigationBar }) => {
    //Pull image
    let imagesPage = await navigationBar.openImages();
    const pullImagePage = await imagesPage.openPullImage();
    imagesPage = await pullImagePage.pullImage(imageName);
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
    await deployToKubernetesPage.doneButton.click(); //openPod button is bugged
    const podsPage = await navigationBar.openPods();
    await playExpect.poll(async () => podsPage.deployedPodExists(podName, 'kubernetes')).toBeTruthy();
  });

  test('Create port forwarding configuration', async ({ page }) => {
    //Open pod details and create port forwarding configuration
    const podsPage = new PodsPage(page);
    const podDetailPage = await podsPage.openPodDetails(podName);
    await podDetailPage.activateTab('Summary');
    const forwardButton = page.getByRole('button', { name: `Forward...` });
    await playExpect(forwardButton).toBeVisible();
    await forwardButton.click();

    const openInBrowserButton = page.getByRole('button', { name: 'Open in browser' });
    const removeConfigurationButton = page.getByRole('button', { name: 'Remove' });
    await playExpect(openInBrowserButton).toBeVisible({ timeout: 10_000 });
    await playExpect(removeConfigurationButton).toBeVisible();
  });

  test('Verify new local port response', async () => {
    const response: Response = await fetch(forwardAddress);
    const blob: Blob = await response.blob();
    const text: string = await blob.text();
    playExpect(text).toContain(responseMessage);
  });

  test('Verify Kubernetes port forwarding page', async ({ navigationBar }) => {
    const kubernetesBar = await navigationBar.openKubernetes();
    const portForwardingPage = await kubernetesBar.openTabPage(KubernetesResources.PortForwarding);
    await playExpect(portForwardingPage.heading).toBeVisible();
    const configurationRow = portForwardingPage.getResourceRowByName(containerName);
    await playExpect(configurationRow).toBeVisible();

    const localPortCell = configurationRow.getByRole('cell').nth(4);
    const remotePortCell = configurationRow.getByRole('cell').nth(5);
    playExpect(Number(localPortCell.textContent())).toEqual(localPort);
    playExpect(Number(remotePortCell.textContent())).toEqual(remotePort);
  });

  test('Delete configuration', async ({ page }) => {
    const portForwardingPage = new KubernetesResourcePage(page, KubernetesResources.PortForwarding);
    await portForwardingPage.deleteKubernetesResource(containerName);

    const confirmationDialog = page.getByRole('dialog', { name: 'Confirmation' });
    await playExpect(confirmationDialog).toBeVisible({ timeout: 10_000 });
    const yesButton = confirmationDialog.getByRole('button', { name: 'Yes' });
    await yesButton.click();
  });

  test('Verify UI components after removal', async ({ page, navigationBar }) => {
    //Verify Kubernetes port forwarding page
    const portForwardingPage = new KubernetesResourcePage(page, KubernetesResources.PortForwarding);
    const configurationRow = portForwardingPage.getResourceRowByName(containerName);
    await playExpect(configurationRow).toBeHidden();
    const noForwardingsMessage = page.getByText('No port forwarding configured');
    await playExpect(noForwardingsMessage).toBeVisible();

    //Verify Pod details page
    const podsPage = await navigationBar.openPods();
    const podDetailPage = await podsPage.openPodDetails(podName);
    await podDetailPage.activateTab('Summary');
    const forwardButton = page.getByRole('button', { name: `Forward port ${remotePort}` });
    await playExpect(forwardButton).toBeVisible();
  });

  test('Verify link response after removal', async () => {
    const response: Response = await fetch(forwardAddress);
    const blob: Blob = await response.blob();
    const text: string = await blob.text();
    playExpect(text).not.toContain(responseMessage);
  });
});
