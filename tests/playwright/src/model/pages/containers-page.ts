/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { ContainerState } from '/@/model/core/states';
import { handleConfirmationDialog } from '/@/utility/operations';

import { BuildImagePage } from './build-image-page';
import { ContainerDetailsPage } from './container-details-page';
import { CreatePodsPage } from './create-pod-page';
import { MainPage } from './main-page';
import { SelectImagePage } from './select-image-page';

export class ContainersPage extends MainPage {
  readonly pruneContainersButton: Locator;
  readonly createContainerButton: Locator;
  readonly pruneConfirmationButton: Locator;
  readonly runAllContainersButton: Locator;
  readonly createDialog: Locator;
  readonly createDialogCloseButton: Locator;
  readonly createDialogContainerOrDockerfileButton: Locator;
  readonly createDialogExistingImageButton: Locator;

  constructor(page: Page) {
    super(page, 'containers');
    this.pruneContainersButton = this.additionalActions.getByRole('button', {
      name: 'Prune',
    });
    this.createContainerButton = this.additionalActions.getByRole('button', {
      name: 'Create',
    });
    this.pruneConfirmationButton = this.page.getByRole('button', {
      name: 'Yes',
    });
    this.runAllContainersButton = this.page.getByLabel('Run selected containers and pods');
    this.createDialog = this.page.getByRole('dialog', {
      name: 'Create a new container',
      exact: true,
    });
    this.createDialogCloseButton = this.createDialog.getByLabel('Close');
    this.createDialogContainerOrDockerfileButton = this.createDialog.getByRole('button', {
      name: 'Containerfile or Dockerfile',
    });
    this.createDialogExistingImageButton = this.createDialog.getByRole('button', {
      name: 'Existing image',
    });
  }

  async openContainersDetails(name: string): Promise<ContainerDetailsPage> {
    return test.step(`Open Container: ${name} details`, async () => {
      const containerRow = await this.getContainerRowByName(name);
      if (containerRow === undefined) {
        throw Error(`Container: '${name}' does not exist`);
      }
      const containerRowName = containerRow.getByRole('cell').nth(3);
      await containerRowName.click();
      return new ContainerDetailsPage(this.page, name);
    });
  }

  async startContainer(containerName: string): Promise<ContainersPage> {
    return test.step(`Start Container: ${containerName}`, async () => {
      const containerRow = await this.getContainerRowByName(containerName);
      if (containerRow === undefined) {
        throw Error(`Container: '${containerName}' does not exist`);
      }
      const containerRowStartButton = containerRow.getByRole('button', {
        name: 'Start Container',
      });
      await playExpect(containerRowStartButton).toBeVisible();
      await containerRowStartButton.click();
      return this;
    });
  }

  async stopContainer(containerName: string): Promise<ContainersPage> {
    return test.step(`Stop Container: ${containerName}`, async () => {
      const containerRow = await this.getContainerRowByName(containerName);
      if (containerRow === undefined) {
        throw Error(`Container: '${containerName}' does not exist`);
      }
      const containerRowStopButton = containerRow.getByRole('button', {
        name: 'Stop Container',
      });
      await playExpect(containerRowStopButton).toBeVisible();
      await containerRowStopButton.click();
      return this;
    });
  }

  async deleteContainer(containerName: string): Promise<ContainersPage> {
    return test.step(`Delete Container: ${containerName}`, async () => {
      const containerRow = await this.getContainerRowByName(containerName);
      if (containerRow === undefined) {
        throw Error(`Container: '${containerName}' does not exist`);
      }
      const containerRowDeleteButton = containerRow.getByRole('button', {
        name: 'Delete Container',
      });
      await playExpect(containerRowDeleteButton).toBeVisible();
      await playExpect(containerRowDeleteButton).toBeEnabled();
      await containerRowDeleteButton.click();
      await handleConfirmationDialog(this.page);
      return new ContainersPage(this.page);
    });
  }

  async stopContainerFromDetails(container: string): Promise<ContainerDetailsPage> {
    return test.step(`Stop Container ${container} from details page`, async () => {
      const containerDetailsPage = await this.openContainersDetails(container);
      await playExpect(containerDetailsPage.heading).toBeVisible();
      await playExpect(containerDetailsPage.heading).toContainText(container);
      playExpect(await containerDetailsPage.getState()).toContain(ContainerState.Running);
      await containerDetailsPage.stopContainer();
      return containerDetailsPage;
    });
  }

  async getContainerRowByName(name: string): Promise<Locator | undefined> {
    return this.getRowByName(name);
  }

  async containerExists(name: string): Promise<boolean> {
    return (await this.getContainerRowByName(name)) !== undefined;
  }

  async openCreatePodPage(names: string[]): Promise<CreatePodsPage> {
    return test.step(`Open Create Pod page for containers: ${names}`, async () => {
      for (const containerName of names) {
        const row = await this.getContainerRowByName(containerName);
        if (row === undefined) {
          throw Error('Container cannot be podified');
        }
        await row.getByRole('cell').nth(1).click();
      }
      await this.page.getByRole('button', { name: 'Create Pod' }).click();
      return new CreatePodsPage(this.page);
    });
  }

  async pruneContainers(): Promise<ContainersPage> {
    return test.step('Prune Containers', async () => {
      await this.pruneContainersButton.click();
      await handleConfirmationDialog(this.page, 'Prune');
      return this;
    });
  }

  async getContainerImage(name: string): Promise<string> {
    const container = await this.getContainerRowByName(name);
    const image = await container?.getByRole('cell').nth(5).textContent();
    if (image) {
      return image;
    }
    return '';
  }

  async startAllContainers(): Promise<ContainersPage> {
    return test.step('Start all containers', async () => {
      await this.checkAllRows();
      await this.runAllContainersButton.click();
      return this;
    });
  }

  async openCreateDialog(): Promise<ContainersPage> {
    return test.step('Open Create dialog', async () => {
      await playExpect(this.createContainerButton).toBeEnabled();
      await this.createContainerButton.click();
      await playExpect(this.createDialog).toBeVisible();
      return this;
    });
  }

  async closeCreateDialog(): Promise<ContainersPage> {
    return test.step('Close Create dialog', async () => {
      await playExpect(this.createDialogCloseButton).toBeVisible();
      await this.createDialogCloseButton.click();
      await playExpect(this.createDialog).not.toBeVisible();
      return this;
    });
  }

  async openBuildImageFromDialog(): Promise<BuildImagePage> {
    return test.step('Open Build Image page from Create dialog', async () => {
      await this.openCreateDialog();
      await playExpect(this.createDialogContainerOrDockerfileButton).toBeEnabled({ timeout: 10_000 });
      await this.createDialogContainerOrDockerfileButton.click();
      await playExpect(this.createDialog).not.toBeVisible({ timeout: 10_000 });
      return new BuildImagePage(this.page);
    });
  }

  async openSelectImageFromDialog(): Promise<SelectImagePage> {
    return test.step('Open Select Image page from Create dialog', async () => {
      await this.openCreateDialog();
      await playExpect(this.createDialogExistingImageButton).toBeEnabled({ timeout: 10_000 });
      await this.createDialogExistingImageButton.click();
      await playExpect(this.createDialog).not.toBeVisible({ timeout: 10_000 });
      return new SelectImagePage(this.page);
    });
  }

  async getContainerEnvironment(name: string): Promise<string> {
    return test.step(`Get Container: ${name} environment`, async () => {
      const containerRow = await this.getContainerRowByName(name);
      if (containerRow === undefined) {
        throw Error(`Container: '${name}' does not exist`);
      }
      const environmentElement = containerRow.getByTestId('tooltip-trigger');
      const environment = await environmentElement.textContent();
      return environment ?? '';
    });
  }
}
