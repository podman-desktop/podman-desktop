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

import { execSync } from 'node:child_process';

import type { Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import type { KubernetesResourceState } from '/@/model/core/states';
import { KubernetesResources } from '/@/model/core/types';
import { ContainerDetailsPage } from '/@/model/pages/container-details-page';
import { NavigationBar } from '/@/model/workbench/navigation';
import { handleConfirmationDialog } from '/@/utility/operations';

export async function deployContainerToCluster(
  page: Page,
  containerName: string,
  kubernetesContext: string,
  deployedPodName: string,
): Promise<void> {
  return test.step(`Deploy '${containerName}' and verify pod '${deployedPodName}' appears in the Kubernetes environment`, async () => {
    const containerDetailsPage = new ContainerDetailsPage(page, containerName);
    const navigationBar = new NavigationBar(page);

    await playExpect(containerDetailsPage.heading).toBeVisible();
    const deployToKubernetesPage = await containerDetailsPage.openDeployToKubernetesPage();
    await deployToKubernetesPage.deployPod(containerName, { useKubernetesServices: true }, kubernetesContext);

    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);
    await playExpect
      .poll(async () => kubernetesPodsPage.getRowByName(deployedPodName), { timeout: 15_000 })
      .toBeTruthy();
  });
}

export async function createKubernetesResource(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  resourceYamlPath: string,
): Promise<void> {
  return test.step(`Create ${resourceType} kubernetes resource: ${resourceName}`, async () => {
    const navigationBar = new NavigationBar(page);

    // workaround for missing option to deploy kube yaml into cluster via UI
    // test kubectl is present
    try {
      // eslint-disable-next-line sonarjs/no-os-command-from-path
      const version = execSync('kubectl version').toString();
      console.log(`Kubectl version stdout: ${version}`);
    } catch (error) {
      throw new Error(`Kubectl is not installed: ${error}`);
    }
    try {
      // eslint-disable-next-line sonarjs/os-command
      const kubectlApply = execSync(`kubectl apply -f ${resourceYamlPath}`).toString();
      console.log(`Kube yaml ${resourceYamlPath} applied successfully via cli: ${kubectlApply}`);
    } catch (error) {
      throw new Error(`Error encountered when trying to apply kube yaml: ${error}`);
    }
    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    await playExpect(kubernetesResourcePage.heading).toBeVisible();
    await playExpect.poll(async () => kubernetesResourcePage.getRowByName(resourceName)).toBeTruthy();
  });
}

export async function deleteKubernetesResource(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  timeout = 30_000,
): Promise<void> {
  return test.step(`Delete ${resourceType} kubernetes resource: ${resourceName}`, async () => {
    const navigationBar = new NavigationBar(page);

    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    await kubernetesResourcePage.deleteKubernetesResource(resourceName);
    await handleConfirmationDialog(page);
    await playExpect
      .poll(async () => await kubernetesResourcePage.getRowByName(resourceName), { timeout: timeout })
      .not.toBeTruthy();
  });
}

export async function checkDeploymentReplicasInfo(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  expectedReplicaCount: number,
): Promise<void> {
  const navigationBar = new NavigationBar(page);
  const kubernetesBar = await navigationBar.openKubernetes();

  const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
  const kubernetesResourceDetails = await kubernetesResourcePage.openResourceDetails(resourceName, resourceType);
  await playExpect(kubernetesResourceDetails.heading).toBeVisible();
  const summaryTab = await kubernetesResourceDetails.activateTab('Summary');
  await playExpect(summaryTab.tabContent).toContainText(
    `Desired: ${expectedReplicaCount}, Updated: ${expectedReplicaCount}, Total: ${expectedReplicaCount}, Available: ${expectedReplicaCount}, Unavailable: N/A`,
  );
}

export async function checkKubernetesResourceState(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  expectedResourceState: KubernetesResourceState,
  timeout = 90_000,
): Promise<void> {
  return test.step(`Check ${resourceType} kubernetes resource state, should be ${expectedResourceState}`, async () => {
    const navigationBar = new NavigationBar(page);
    const kubernetesBar = await navigationBar.openKubernetes();

    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    const kubernetesResourceDetails = await kubernetesResourcePage.openResourceDetails(
      resourceName,
      resourceType,
      timeout,
    );
    await playExpect(kubernetesResourceDetails.heading).toBeVisible();
    await playExpect
      .poll(async () => kubernetesResourceDetails.getState(), { timeout: timeout })
      .toBe(expectedResourceState);
  });
}

export async function editDeploymentYamlFile(
  page: Page,
  resourceType: KubernetesResources,
  deploymentName: string,
  currentReplicaCount = 3,
  updatedReplicaCount = 5,
): Promise<void> {
  return test.step('Change deployment kubernetes cluster resource', async () => {
    const navigationBar = new NavigationBar(page);
    const kubernetesBar = await navigationBar.openKubernetes();
    await playExpect
      .poll(async () => await countKubernetesPodReplicas(page, deploymentName), {
        timeout: 60_000,
      })
      .toBe(currentReplicaCount);

    const deploymentsPage = await kubernetesBar.openTabPage(resourceType);
    await playExpect(deploymentsPage.heading).toBeVisible();
    const deploymentDetails = await deploymentsPage.openResourceDetails(deploymentName, resourceType);
    await playExpect(deploymentDetails.heading).toBeVisible();
    await deploymentDetails.editKubernetsYamlFile(
      `replicas: ${currentReplicaCount}`,
      `replicas: ${updatedReplicaCount}`,
    );

    await playExpect
      .poll(async () => await countKubernetesPodReplicas(page, deploymentName), {
        timeout: 60_000,
      })
      .toBe(updatedReplicaCount);
  });
}

export async function countKubernetesPodReplicas(page: Page, expectedPodName: string): Promise<number> {
  return test.step(`Count pod replicas: ${expectedPodName}`, async () => {
    const navigationBar = new NavigationBar(page);
    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesPodsPage = await kubernetesBar.openTabPage(KubernetesResources.Pods);

    let counter = 0;
    const rows = await kubernetesPodsPage.getAllTableRows();
    for (let i = rows.length - 1; i > 0; i--) {
      const podName = await rows[i].getByRole('cell').nth(3).getByRole('button').textContent();
      if (podName?.includes(expectedPodName)) {
        counter += 1;
      }
    }
    return counter;
  });
}

export async function configurePortForwarding(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
): Promise<void> {
  return test.step(`Configure port forwarding for ${resourceName} ${resourceType} k8s resource`, async () => {
    const navigationBar = new NavigationBar(page);

    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    const kubernetesResourceDetailsPage = await kubernetesResourcePage.openResourceDetails(resourceName, resourceType);
    await kubernetesResourceDetailsPage.activateTab('Summary');
    const forwardButton = page.getByRole('button', { name: 'Forward...' });
    await playExpect(forwardButton).toBeVisible();
    await forwardButton.click();

    const openInBrowserButton = page.getByRole('button', { name: 'Open', exact: true });
    const removeConfigurationButton = page.getByRole('button', { name: 'Remove' });
    await playExpect(openInBrowserButton).toBeVisible({ timeout: 10_000 });
    await playExpect(removeConfigurationButton).toBeVisible();
  });
}

export async function verifyPortForwardingConfiguration(
  page: Page,
  configurationName: string,
  localPort: number,
  remotePort: number,
): Promise<void> {
  return test.step(`Verify port forwarding for ${configurationName} configuration: local port ${localPort}, remote port ${remotePort}`, async () => {
    const navigationBar = new NavigationBar(page);
    const kubernetesBar = await navigationBar.openKubernetes();
    const portForwardingPage = await kubernetesBar.openTabPage(KubernetesResources.PortForwarding);
    await playExpect(portForwardingPage.heading).toBeVisible();
    const configurationRow = await portForwardingPage.fetchKubernetesResource(configurationName);

    const localPortCell = await portForwardingPage.geAttributeByRow(
      configurationRow,
      'Local Port',
      KubernetesResources.PortForwarding,
    );
    const remotePortCell = await portForwardingPage.geAttributeByRow(
      configurationRow,
      'Remote Port',
      KubernetesResources.PortForwarding,
    );
    playExpect(Number(await localPortCell.textContent())).toBe(localPort);
    playExpect(Number(await remotePortCell.textContent())).toBe(remotePort);
  });
}

export async function verifyLocalPortResponse(forwardAddress: string, responseMessage: string): Promise<void> {
  return test.step('Verify local port response', async () => {
    playExpect.poll(
      async () => {
        const response: Response = await fetch(forwardAddress, { cache: 'no-store' });
        const blob: Blob = await response.blob();
        const text: string = await blob.text();
        playExpect(text).toContain(responseMessage);
      },
      { timeout: 20_000, intervals: [1_000, 3_000, 5_000, 15_000] },
    );
  });
}

export async function monitorPodStatusInClusterContainer(
  page: Page,
  containerName: string,
  command: string,
  timeout = 160_000,
): Promise<void> {
  const navigationBar = new NavigationBar(page);
  const containersPage = await navigationBar.openContainers();
  await playExpect(containersPage.heading).toBeVisible();
  await playExpect.poll(async () => containersPage.getContainerRowByName(containerName)).toBeTruthy();
  const containerDetailsPage = await containersPage.openContainersDetails(containerName);

  await playExpect
    .poll(
      async () => {
        await containerDetailsPage.executeCommandInTerminal(command);
        const result = await checkContourPodsInTerminal(page, containerName);
        await containerDetailsPage.executeCommandInTerminal('clear');
        return result;
      },
      { timeout: timeout },
    )
    .toBeTruthy();
}

async function checkContourPodsInTerminal(page: Page, containerName: string): Promise<boolean> {
  const containerDetailsPage = new ContainerDetailsPage(page, containerName);
  await containerDetailsPage.activateTab('Terminal');
  await playExpect(containerDetailsPage.terminalContent).toBeVisible();
  await page.waitForTimeout(2_000);

  try {
    await playExpect(containerDetailsPage.terminalContent).toContainText(/contour-\S+\s+1\/1\s+Running\s+\d+\s+\S+/);
    await playExpect(containerDetailsPage.terminalContent).toContainText(
      /contour-certgen-\S+\s+0\/1\s+Completed\s+\d+\s+\S+/,
    );
    await playExpect(containerDetailsPage.terminalContent).toContainText(/envoy-\S+\s+2\/2\s+Running\s+\d+\s+\S+/);
    return true;
  } catch {
    return false;
  }
}
