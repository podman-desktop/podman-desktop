/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { ResourceElementActions } from '/@/model/core/operations';
import { ContainerState, ResourceElementState } from '/@/model/core/states';
import type { KindClusterOptions } from '/@/model/core/types';
import { CreateKindClusterPage } from '/@/model/pages/create-kind-cluster-page';
import { ResourceConnectionCardPage } from '/@/model/pages/resource-connection-card-page';
import { ResourceDetailsPage } from '/@/model/pages/resource-details-page';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { VolumesPage } from '/@/model/pages/volumes-page';
import { NavigationBar } from '/@/model/workbench/navigation';
import { StatusBar } from '/@/model/workbench/status-bar';
import { getVolumeNameForContainer } from '/@/utility/operations';

export async function createKindCluster(
  page: Page,
  clusterName: string,
  timeout = 300_000,
  { configFilePath, providerType, httpPort, httpsPort, useIngressController, containerImage }: KindClusterOptions = {},
): Promise<void> {
  return test.step(`Create Kind cluster with settings: configFilePath=${configFilePath}, 
    providerType=${providerType}, httpPort=${httpPort},
    httpsPort=${httpsPort}, ingressController=${useIngressController}`, async () => {
    const navigationBar = new NavigationBar(page);
    const statusBar = new StatusBar(page);
    const kindResourceCard = new ResourceConnectionCardPage(page, 'kind', clusterName);
    const createKindClusterPage = new CreateKindClusterPage(page);

    const settingsPage = await navigationBar.openSettings();
    const resourcesPage = await settingsPage.openTabPage(ResourcesPage);
    await playExpect(resourcesPage.heading).toBeVisible({ timeout: 10_000 });
    await playExpect.poll(async () => resourcesPage.resourceCardIsVisible('kind')).toBeTruthy();
    await playExpect(kindResourceCard.createButton).toBeVisible();

    if (await kindResourceCard.doesResourceElementExist()) {
      if ((await kindResourceCard.resourceElementConnectionStatus.textContent()) !== ResourceElementState.Running) {
        console.log(`Kind cluster [${clusterName}] already present, but not running. Delete the cluster...`);
        await deleteCluster(page);
      } else {
        console.log(`Kind cluster [${clusterName}] already present, skipping creation.`);
        return;
      }
    }

    await kindResourceCard.createButton.click();
    await createKindClusterPage.createKindCluster(
      clusterName,
      {
        configFilePath: configFilePath,
        providerType: providerType,
        httpPort: httpPort,
        httpsPort: httpsPort,
        useIngressController: useIngressController,
        containerImage: containerImage,
      },
      timeout,
    );
    await playExpect(kindResourceCard.resourceElement).toBeVisible();
    await playExpect(kindResourceCard.resourceElementConnectionStatus).toHaveText(ResourceElementState.Running, {
      timeout: 15_000,
    });
    await statusBar.validateKubernetesContext(`kind-${clusterName}`);
  });
}

export async function deleteCluster(
  page: Page,
  resourceName = 'kind',
  containerName = 'kind-cluster-control-plane',
  clusterName = 'kind-cluster',
  timeout = 50_000,
): Promise<void> {
  return test.step(`Delete ${resourceName} cluster`, async () => {
    const volumeName = await getVolumeNameForContainer(page, containerName);
    const navigationBar = new NavigationBar(page);
    const resourceCard = new ResourceConnectionCardPage(page, resourceName, clusterName);

    await navigationBar.openSettings();
    const resourcesPage = new ResourcesPage(page);
    await playExpect(resourcesPage.heading).toBeVisible({ timeout: 10_000 });
    if (!(await resourceCard.doesResourceElementExist())) {
      console.log(`Kind cluster [${clusterName}] not present, skipping deletion.`);
      return;
    }

    await resourceCard.performConnectionAction(ResourceElementActions.Stop);
    await playExpect(resourceCard.resourceElementConnectionStatus).toHaveText(ResourceElementState.Off, {
      timeout: timeout,
    });
    await resourceCard.performConnectionAction(ResourceElementActions.Delete);
    await playExpect(resourceCard.markdownContent).toBeVisible({
      timeout: timeout,
    });
    await validateClusterResourcesDeletion(page, clusterName, containerName, volumeName);
  });
}

export async function checkClusterResources(page: Page, containerName: string): Promise<void> {
  return test.step(`Check container '${containerName}' and volume cluster resources.`, async () => {
    const navigationBar = new NavigationBar(page);
    const containersPage = await navigationBar.openContainers();
    await playExpect.poll(async () => containersPage.containerExists(containerName)).toBeTruthy();
    const containerDetailsPage = await containersPage.openContainersDetails(containerName);
    await playExpect.poll(async () => await containerDetailsPage.getState()).toEqual(ContainerState.Running);

    const volumesPage = new VolumesPage(page);
    const volumeName = await getVolumeNameForContainer(page, containerName);
    if (!volumeName) {
      throw new Error(`Volume name for container "${containerName}" is not defined.`);
    }
    const volumeDetailsPage = await volumesPage.openVolumeDetails(volumeName);
    await playExpect.poll(async () => await volumeDetailsPage.isUsed()).toBeTruthy();
  });
}

export async function resourceConnectionAction(
  page: Page,
  resourceCard: ResourceConnectionCardPage,
  resourceConnectionAction: ResourceElementActions,
  expectedResourceState: ResourceElementState,
  timeout = 30_000,
): Promise<void> {
  return test.step(`Performs "${resourceConnectionAction}" action, expects "${expectedResourceState}" state.`, async () => {
    const navigationBar = new NavigationBar(page);
    await navigationBar.openSettings();
    await resourceCard.performConnectionAction(resourceConnectionAction);
    if (resourceConnectionAction === ResourceElementActions.Restart) {
      const stopButton = resourceCard.resourceElementConnectionActions.getByRole('button', {
        name: ResourceElementActions.Stop,
        exact: true,
      });
      await playExpect(stopButton).toBeEnabled({ timeout: timeout });
    }
    await playExpect(resourceCard.resourceElementConnectionStatus).toHaveText(expectedResourceState, {
      timeout: timeout,
    });
  });
}

export async function resourceConnectionActionDetails(
  page: Page,
  resourceCard: ResourceConnectionCardPage,
  resourceName: string,
  resourceConnectionAction: ResourceElementActions,
  expectedResourceState: ResourceElementState,
  timeout = 30_000,
): Promise<void> {
  return test.step(`Performs a connection action '${resourceConnectionAction}' on the resource from the details page, verifies the expected resource state '${expectedResourceState}'`, async () => {
    const navigationBar = new NavigationBar(page);
    const resourceDetailsPage = new ResourceDetailsPage(page, resourceName);

    try {
      await playExpect(resourceDetailsPage.heading).toBeVisible();
    } catch {
      const settingsBar = await navigationBar.openSettings();
      const resourcesPage = await settingsBar.openTabPage(ResourcesPage);
      await playExpect(resourcesPage.heading).toBeVisible({ timeout: 10_000 });
      await playExpect(resourceCard.resourceElementDetailsButton).toBeEnabled();
      await resourceCard.resourceElementDetailsButton.click();
    }

    await resourceDetailsPage.performConnectionActionDetails(resourceConnectionAction);
    if (resourceConnectionAction === ResourceElementActions.Restart) {
      const stopButton = resourceDetailsPage.controlActions.getByRole('button', {
        name: ResourceElementActions.Stop,
        exact: true,
      });
      await playExpect(stopButton).toBeEnabled({ timeout: timeout });
    }
    await playExpect(resourceDetailsPage.resourceStatus).toHaveText(expectedResourceState, {
      timeout: timeout,
    });
  });
}

export async function deleteClusterFromDetails(
  page: Page,
  resourceName = 'kind',
  containerName = 'kind-cluster-control-plane',
  clusterName = 'kind-cluster',
  timeout = 30_000,
): Promise<void> {
  return test.step(`Deletes the '${clusterName}' cluster from the details page`, async () => {
    const navigationBar = new NavigationBar(page);
    const volumeName = await getVolumeNameForContainer(page, containerName);

    const settingsBar = await navigationBar.openSettings();
    const resourcesPage = await settingsBar.openTabPage(ResourcesPage);
    const resourceCard = new ResourceConnectionCardPage(page, resourceName, clusterName);
    await playExpect(resourcesPage.heading).toBeVisible({ timeout: 10_000 });
    if (!(await resourceCard.doesResourceElementExist())) {
      console.log(`Cluster [${clusterName}] not present, skipping deletion.`);
      return;
    }
    await playExpect(resourceCard.resourceElementDetailsButton).toBeEnabled();
    await resourceCard.resourceElementDetailsButton.click();

    const resourceDetails = new ResourceDetailsPage(page, clusterName);
    await playExpect(resourceDetails.heading).toBeVisible();
    await resourceDetails.performConnectionActionDetails(ResourceElementActions.Stop);
    await playExpect(resourceDetails.resourceStatus).toHaveText(ResourceElementState.Off, {
      timeout: timeout,
    });
    await resourceDetails.performConnectionActionDetails(ResourceElementActions.Delete);

    await validateClusterResourcesDeletion(page, clusterName, containerName, volumeName);
  });
}

export async function validateClusterResourcesDeletion(
  page: Page,
  clusterName: string,
  containerName: string,
  volumeName: string,
  timeout = 20_000,
): Promise<void> {
  return test.step(`Validates that resources associated with the deleted '${clusterName}' cluster are removed`, async () => {
    const navigationBar = new NavigationBar(page);
    const containersPage = await navigationBar.openContainers();

    await playExpect(containersPage.heading).toBeVisible();
    await playExpect
      .poll(async () => containersPage.containerExists(containerName), {
        timeout: timeout,
      })
      .toBeFalsy();

    const volumePage = await navigationBar.openVolumes();
    await playExpect(volumePage.heading).toBeVisible();
    await playExpect
      .poll(async () => await volumePage.waitForVolumeDelete(volumeName), {
        timeout: timeout,
      })
      .toBeTruthy();
  });
}
