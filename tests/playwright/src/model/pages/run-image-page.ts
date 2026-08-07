/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import test, { expect as playExpect, type Locator, type Page } from '@playwright/test';

import type { ContainerInteractiveParams } from '/@/model/core/types';
import { waitWhile } from '/@/utility/wait';

import { BasePage } from './base-page';
import { ContainerDetailsPage } from './container-details-page';
import { ContainersPage } from './containers-page';

export class RunImagePage extends BasePage {
  readonly name: Locator;
  readonly heading: Locator;
  readonly closeLink: Locator;
  readonly backToImageDetailsLink: Locator;
  readonly imageName: string;
  readonly startContainerButton: Locator;
  readonly errorAlert: Locator;
  readonly containerNameInput: Locator;
  readonly containerEntryPointInput: Locator;
  readonly containerComamndInput: Locator;
  readonly containerAddCustomPortMappingButton: Locator;
  readonly addSecretMappingButton: Locator;
  readonly volumeNameInput: Locator;
  readonly volumeContainerPath: Locator;

  constructor(page: Page, name: string) {
    super(page);
    this.imageName = name;
    this.name = page.getByLabel('name').and(page.getByText('Run Image'));
    this.heading = page.getByRole('heading', { name: this.imageName });
    this.closeLink = page.getByRole('link', { name: 'Close' });
    this.errorAlert = page.getByRole('alert', {
      name: 'Error Message Content',
    });
    this.backToImageDetailsLink = page.getByRole('link', {
      name: 'Go back to Image Details',
    });
    this.startContainerButton = page.getByLabel('Start Container', {
      exact: true,
    });
    this.containerNameInput = page.getByLabel('Container Name');
    this.containerEntryPointInput = page.getByLabel('Entrypoint');
    this.containerComamndInput = page.getByLabel('Command');
    this.containerAddCustomPortMappingButton = page.getByLabel('Add custom port mapping', { exact: true });
    this.addSecretMappingButton = page.getByRole('button', { name: 'Add secret mapping' });
    this.volumeNameInput = page.getByPlaceholder('Path on the host');
    this.volumeContainerPath = page.getByPlaceholder('Path inside the container');
  }

  async activateTab(name: string): Promise<void> {
    return test.step(`Activate tab: ${name}`, async () => {
      const tabactive = this.page.getByRole('link', { name: name, exact: true }).and(this.page.getByText(name));
      await tabactive.click();
    });
  }

  // If the container has a defined exposed port, the mapping offers only one part of the input box, host port
  // Example of the placeholder: 'Enter value for port 80/tcp' : settable value
  async setHostPortToExposedContainerPort(exposedPort: string, port: string): Promise<void> {
    return test.step('Set host port to exposed container port', async () => {
      await this.activateTab('Basic');
      const portMapping = this.page
        .getByRole('textbox')
        .and(this.page.getByPlaceholder(`Enter value for port ${exposedPort}/tcp`));
      await portMapping.waitFor({ state: 'visible' });
      await portMapping.fill(port);
    });
  }

  async startInteractiveContainer(customName = ''): Promise<ContainerDetailsPage> {
    return test.step(`Start interactive container from image: ${this.imageName}`, async () => {
      await this.startContainer(customName, {
        attachTerminal: true,
        interactive: true,
      } as ContainerInteractiveParams);
      const detailsPageLocator = this.page.getByLabel('name').and(this.page.getByText('Container Details'));
      await playExpect(detailsPageLocator).toBeVisible(); // we are sure to get into details page
      const heading = this.page.getByRole('heading');
      const containerName = customName ? customName : await heading.innerText();
      console.log(`Heading and container name: ${await heading.innerText()}`);
      return new ContainerDetailsPage(this.page, containerName);
    });
  }

  async startContainer(customName = '', optionalParams?: ContainerInteractiveParams): Promise<ContainersPage> {
    return test.step(`Start container from image: ${this.imageName}`, async () => {
      if (customName !== '') {
        await this.activateTab('Basic');
        await playExpect(this.containerNameInput).toBeVisible();
        await this.containerNameInput.fill(customName);
        await playExpect(this.containerNameInput).toHaveValue(customName);
      }

      if (optionalParams?.attachVolumeName !== undefined && optionalParams?.attachVolumePath !== undefined) {
        await this.activateTab('Basic');

        await playExpect(this.volumeNameInput).toBeVisible();
        await this.volumeNameInput.pressSequentially(optionalParams.attachVolumeName, { delay: 10 });
        await playExpect(this.volumeNameInput).toHaveValue(optionalParams.attachVolumeName);

        await playExpect(this.volumeContainerPath).toBeVisible();
        await this.volumeContainerPath.pressSequentially(optionalParams.attachVolumePath, { delay: 10 });
        await playExpect(this.volumeContainerPath).toHaveValue(optionalParams.attachVolumePath);
      }

      if (optionalParams?.attachTerminal !== undefined) {
        // disable the checkbox in advanced tab
        await this.activateTab('Advanced');
        const checkbox = this.page.getByRole('checkbox', {
          name: 'Attach a pseudo terminal',
        });
        if (optionalParams.attachTerminal) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
        await playExpect(checkbox).toBeChecked({
          checked: optionalParams.attachTerminal,
        });
      }

      if (optionalParams?.interactive !== undefined) {
        // disable the checkbox in advanced tab
        await this.activateTab('Advanced');
        const checkbox = this.page.getByRole('checkbox', {
          name: 'Use interactive',
        });
        if (optionalParams.interactive) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
        await playExpect(checkbox).toBeChecked({
          checked: optionalParams.interactive,
        });
      }

      await this.activateTab('Basic');
      await playExpect(this.startContainerButton).toBeEnabled();
      await this.startContainerButton.click();
      // After clicking on the button there seems to be four possible outcomes
      // 1. Opening particular container's details page with tty tab opened
      // 2. Opening Containers page with new container on it
      // 3. staying on the run image page with an error
      // 4. Starting a container without entrypoint or command creates a container, but it stays on Run Image Page without error
      await waitWhile(
        async () => {
          return await this.name.isVisible();
        },
        { sendError: false },
      );

      const errorCount = await this.errorAlert.count();
      if (errorCount > 0) {
        const runImagePageActive = await this.name.isVisible();
        const message = runImagePageActive ? 'threw an ' : 'redirected to another page with an ';
        throw Error(`Starting the container ${message} error: ${await this.errorAlert.innerText()}`);
      }
      return new ContainersPage(this.page);
    });
  }

  async setCustomPortMapping(customPortMapping: string): Promise<void> {
    return test.step(`Set custom port mapping: ${customPortMapping}`, async () => {
      // add port mapping
      await this.activateTab('Basic');
      await playExpect(this.containerAddCustomPortMappingButton).toBeVisible();
      await this.containerAddCustomPortMappingButton.click();
      const hostPort = this.page.getByLabel('host port');
      const containerPort = this.page.getByLabel('container port');
      await hostPort.fill(customPortMapping.split(':')[0]);
      await containerPort.fill(customPortMapping.split(':')[1]);
    });
  }

  async addSecretMapping(secretName: string, type: 'mount' | 'env', target: string): Promise<void> {
    return test.step(`Add secret mapping: ${secretName} as ${type} -> ${target}`, async () => {
      await this.activateTab('Basic');

      await playExpect(this.addSecretMappingButton).toBeEnabled();
      await this.addSecretMappingButton.click();

      // Each Dropdown renders a hidden <input aria-label="hidden input">.
      // The last 2 hidden inputs belong to the newly added mapping (name + type dropdowns).
      const allHiddenInputs = this.page.locator('input[aria-label="hidden input"]');
      const totalCount = await allHiddenInputs.count();
      const nameHiddenInput = allHiddenInputs.nth(totalCount - 2);
      const typeHiddenInput = allHiddenInputs.nth(totalCount - 1);

      const currentName = await nameHiddenInput.inputValue();
      if (currentName !== secretName) {
        const nameContainer = nameHiddenInput.locator('..');
        const nameTrigger = nameContainer.getByRole('button').first();
        await nameTrigger.click();
        const nameOption = nameContainer.getByRole('button', { name: secretName, exact: true });
        await playExpect(nameOption).toBeVisible();
        await nameOption.click();
      }

      if (type === 'env') {
        const typeContainer = typeHiddenInput.locator('..');
        const typeTrigger = typeContainer.getByRole('button').first();
        await typeTrigger.click();
        const envOption = typeContainer.getByRole('button', { name: 'Env' });
        await playExpect(envOption).toBeVisible();
        await envOption.click();
      }

      const placeholder = type === 'mount' ? 'Path inside the container' : 'Name of the environment variable';
      const targetInput = this.page.getByPlaceholder(placeholder).last();
      await playExpect(targetInput).toBeVisible();
      await targetInput.fill(target);
      await playExpect(targetInput).toHaveValue(target);
    });
  }

  async selectUserDefinedNetwork(networkName: string): Promise<void> {
    return test.step(`Select user-defined network: ${networkName}`, async () => {
      await this.activateTab('Networking');
      // Open the Mode dropdown (shows current selection as button text) and pick User-defined network
      const modeButton = this.page.getByRole('button', { name: /Creates a network stack/ });
      await playExpect(modeButton).toBeVisible();
      await modeButton.click();
      await this.page.getByRole('button', { name: 'User-defined network' }).click();
      // Open the Network dropdown and select the specific network
      const networkDropdown = this.page.getByRole('button', { name: /\(used by \d+ containers\)/ }).first();
      await playExpect(networkDropdown).toBeVisible();
      await networkDropdown.click();
      await this.page
        .getByRole('button', { name: new RegExp(`^${networkName} \\(used by \\d+ containers\\)$`) })
        .click();
    });
  }
}
