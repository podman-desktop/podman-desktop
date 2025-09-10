/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { isWindows } from '/@/utility/platform';
import { getDefaultVirtualizationProvider } from '/@/utility/provider';

import { DropdownComponent } from '../../components/dropdown-component';
import type { PodmanVirtualizationProviders } from '../../core/types';
import { BasePage } from '../base-page';

export class MachineCreationForm extends BasePage {
  readonly podmanMachineConfiguration: Locator;
  readonly podmanMachineName: Locator;
  readonly imagePathBox: Locator;
  readonly browseImagesButton: Locator;
  readonly podmanMachineCPUs: Locator;
  readonly podmanMachineMemory: Locator;
  readonly podmanMachineDiskSize: Locator;
  readonly rootPriviledgesCheckbox: Locator;
  readonly userModeNetworkingCheckbox: Locator;
  readonly providerTypeDropdown: DropdownComponent;
  readonly startNowCheckbox: Locator;
  readonly createMachineButton: Locator;

  constructor(page: Page) {
    super(page);
    this.podmanMachineConfiguration = this.page.getByRole('form', {
      name: 'Properties Information',
    });
    this.podmanMachineName = this.podmanMachineConfiguration.getByRole('textbox', { name: 'Name' });
    this.imagePathBox = this.podmanMachineConfiguration.getByRole('textbox', {
      name: 'Image Path (Optional) ',
    });
    this.browseImagesButton = this.podmanMachineConfiguration.getByRole('button', {
      name: 'button-Image Path (Optional)',
    });
    this.podmanMachineCPUs = this.podmanMachineConfiguration.getByRole('slider', { name: 'CPU(s)' });
    this.podmanMachineMemory = this.podmanMachineConfiguration.getByRole('slider', { name: 'Memory' });
    this.podmanMachineDiskSize = this.podmanMachineConfiguration.getByRole('slider', { name: 'Disk size' });
    this.rootPriviledgesCheckbox = this.podmanMachineConfiguration.getByRole('checkbox', {
      name: 'Machine with root privileges',
    });
    this.userModeNetworkingCheckbox = this.podmanMachineConfiguration.getByRole('checkbox', {
      name: 'User mode networking',
    });
    this.providerTypeDropdown = new DropdownComponent(page, 'Provider Type');

    this.startNowCheckbox = this.podmanMachineConfiguration.getByRole('checkbox', { name: 'Start the machine now' });
    this.createMachineButton = this.podmanMachineConfiguration.getByRole('button', { name: 'Create' });
  }

  async setupAndCreateMachine(
    machineName: string,
    {
      isRootful = true,
      enableUserNet = false,
      startNow = true,
      virtualizationProvider,
    }: {
      isRootful?: boolean;
      enableUserNet?: boolean;
      startNow?: boolean;
      virtualizationProvider?: PodmanVirtualizationProviders;
    } = {},
  ): Promise<void> {
    return test.step(`Create Podman Machine '${machineName}' with settings: ${isRootful ? 'rootful' : 'rootless'}, ${enableUserNet ? 'usernet enabled' : 'usernet disabled'}, ${startNow ? 'startnow enabled' : 'startnow disabled'}${virtualizationProvider ? ', and ' + virtualizationProvider : ''}`, async () => {
      await playExpect(this.podmanMachineConfiguration).toBeVisible({
        timeout: 10_000,
      });
      await this.podmanMachineName.clear();
      await this.podmanMachineName.fill(machineName);

      await this.ensureCheckboxState(isRootful, this.rootPriviledgesCheckbox);
      if (isWindows) {
        await this.ensureCheckboxState(enableUserNet, this.userModeNetworkingCheckbox);
      }
      if (virtualizationProvider) {
        await this.specifyVirtualizationProvider(virtualizationProvider);
      }
      await this.ensureCheckboxState(startNow, this.startNowCheckbox);

      await playExpect(this.createMachineButton).toBeEnabled();
      await this.createMachineButton.click();
    });
  }

  async ensureCheckboxState(desiredState: boolean, checkbox: Locator): Promise<void> {
    return test.step(`Ensure checkbox is ${desiredState ? 'checked' : 'unchecked'}`, async () => {
      if (desiredState !== (await checkbox.isChecked())) {
        await checkbox.locator('..').click();
        playExpect(await checkbox.isChecked()).toBe(desiredState);
      }
    });
  }

  /**
   * Specifies the virtualization provider for a Podman machine during the creation process.
   * This method selects the specified virtualization provider from the dropdown if it differs from the default.
   * If no provider is specified or it matches the default, no action is taken.
   *
   * @param virtualizationProvider - The virtualization provider to select (e.g., PodmanVirtualizationProviders.WSL, PodmanVirtualizationProviders.HyperV, etc.), or undefined to use default
   * @returns A Promise that resolves when the provider selection is complete
   * @throws Will throw an error if the provider dropdown is not accessible or the specified provider is not available
   */
  async specifyVirtualizationProvider(
    virtualizationProvider: PodmanVirtualizationProviders | undefined,
  ): Promise<void> {
    return test.step(`Set Podman Provider to ${virtualizationProvider ?? getDefaultVirtualizationProvider()}`, async () => {
      if (!virtualizationProvider) return;
      // Only select if the dropdown is actually present/visible
      if (!(await this.providerTypeDropdown.getContainer().isVisible())) return;
      await this.providerTypeDropdown.waitForReady();
      // Compare by the hidden input value (case-insensitive)
      const currentValue = (await this.providerTypeDropdown.getCurrentValue()).toLowerCase();
      if (virtualizationProvider.toLowerCase() !== currentValue) {
        await this.providerTypeDropdown.selectOption(virtualizationProvider, virtualizationProvider, false);
        await this.providerTypeDropdown.verifyState(virtualizationProvider, virtualizationProvider);
      }
    });
  }
}
