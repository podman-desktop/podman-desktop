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

import type { Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import type { KubernetesResourceState } from '../model/core/states';
import type { KubernetesResources, PlayKubernetesOptions } from '../model/core/types';
import { ContainerDetailsPage } from '../model/pages/container-details-page';
import type { PodsPage } from '../model/pages/pods-page';
import { NavigationBar } from '../model/workbench/navigation';
import { handleConfirmationDialog } from './operations';

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

    const podsPage = await navigationBar.openPods();
    await playExpect
      .poll(async () => podsPage.deployedPodExists(deployedPodName, 'kubernetes'), { timeout: 15_000 })
      .toBeTruthy();
  });
}

export async function createKubernetesResource(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  resourceYamlPath: string,
  kubernetesRuntime: PlayKubernetesOptions,
): Promise<void> {
  return test.step(`Create ${resourceType} kubernetes resource: ${resourceName}`, async () => {
    const navigationBar = new NavigationBar(page);

    await applyYamlFileToCluster(page, resourceYamlPath, kubernetesRuntime);
    const kubernetesBar = await navigationBar.openKubernetes();
    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    await playExpect(kubernetesResourcePage.heading).toBeVisible();
    await playExpect(kubernetesResourcePage.getResourceRowByName(resourceName)).toBeVisible();
  });
}

export async function deleteKubernetesResource(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
): Promise<void> {
  return test.step(`Delete ${resourceType} kubernetes resource: ${resourceName}`, async () => {
    const navigationBar = new NavigationBar(page);

    const kubernetesBar = await navigationBar.openKubernetes();
    const pvcsPage = await kubernetesBar.openTabPage(resourceType);
    await pvcsPage.deleteKubernetesResource(resourceName);
    await handleConfirmationDialog(page);
    await playExpect(pvcsPage.getResourceRowByName(resourceName)).not.toBeVisible({ timeout: 30_000 });
  });
}

export async function checkDeploymentReplicasInfo(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  expectedReplicaCount: number,
  timeout: number = 80_000,
): Promise<void> {
  const navigationBar = new NavigationBar(page);
  const kubernetesBar = await navigationBar.openKubernetes();

  const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
  const kubernetesResourceDetails = await kubernetesResourcePage.openResourceDetails(resourceName, resourceType);
  await playExpect(kubernetesResourceDetails.heading).toBeVisible();
  await playExpect(kubernetesResourceDetails.tabContent).toContainText(
    `Desired: ${expectedReplicaCount}, Updated: ${expectedReplicaCount}, Total: ${expectedReplicaCount}, Available: ${expectedReplicaCount}, Unavailable: N/A`,
    { timeout: timeout },
  );
}

export async function checkKubernetesResourceState(
  page: Page,
  resourceType: KubernetesResources,
  resourceName: string,
  expectedResourceState: KubernetesResourceState,
  timeout: number = 50_000,
): Promise<void> {
  return test.step(`Check ${resourceType} kubernetes resource state, should be ${expectedResourceState}`, async () => {
    const navigationBar = new NavigationBar(page);
    const kubernetesBar = await navigationBar.openKubernetes();

    const kubernetesResourcePage = await kubernetesBar.openTabPage(resourceType);
    const kubernetesResourceDetails = await kubernetesResourcePage.openResourceDetails(resourceName, resourceType);
    await playExpect(kubernetesResourceDetails.heading).toBeVisible();
    await playExpect
      .poll(async () => kubernetesResourceDetails.getState(), { timeout: timeout })
      .toEqual(expectedResourceState);
  });
}

export async function applyYamlFileToCluster(
  page: Page,
  resourceYamlPath: string,
  kubernetesRuntime: PlayKubernetesOptions,
): Promise<PodsPage> {
  return test.step(`Apply YAML file to Kubernetes cluster`, async () => {
    const navigationBar = new NavigationBar(page);
    const podsPage = await navigationBar.openPods();

    await playExpect(podsPage.heading).toBeVisible();
    const playYamlPage = await podsPage.openPlayKubeYaml();
    await playExpect(playYamlPage.heading).toBeVisible();
    return await playYamlPage.playYaml(resourceYamlPath, kubernetesRuntime);
  });
}

export async function editDeploymentYamlFile(
  page: Page,
  resourceType: KubernetesResources,
  deploymentName: string,
  currentReplicaCount: number = 3,
  updatedReplicaCount: number = 5,
): Promise<void> {
  return test.step(`Change deployment kubernetes cluster resource`, async () => {
    const navigationBar = new NavigationBar(page);
    const podsPage = await navigationBar.openPods();
    await playExpect
      .poll(async () => await podsPage.countPodReplicas(deploymentName), {
        timeout: 60_000,
      })
      .toBe(currentReplicaCount);

    const kubernetesBar = await navigationBar.openKubernetes();
    const deploymentsPage = await kubernetesBar.openTabPage(resourceType);
    await playExpect(deploymentsPage.heading).toBeVisible();
    await playExpect(deploymentsPage.getResourceRowByName(deploymentName)).toBeVisible();
    const deploymentDetails = await deploymentsPage.openResourceDetails(deploymentName, resourceType);
    await playExpect(deploymentDetails.heading).toBeVisible();
    await deploymentDetails.editKubernetsYamlFile(
      `replicas: ${currentReplicaCount}`,
      `replicas: ${updatedReplicaCount}`,
    );

    await navigationBar.openPods();
    await playExpect
      .poll(async () => await podsPage.countPodReplicas(deploymentName), {
        timeout: 60_000,
      })
      .toBe(updatedReplicaCount);
  });
}
