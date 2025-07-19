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

import { PodmanConnectionTypes } from '../../core/types';
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
  readonly providerTypeDiv: Locator;
  readonly providerTypeWslOption: Locator;
  readonly providerTypeHypervOption: Locator;
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
    this.providerTypeDiv = this.podmanMachineConfiguration.getByLabel('Provider Type');
    this.providerTypeWslOption = this.providerTypeDiv.getByRole('button', { name: 'wsl' });
    this.providerTypeHypervOption = this.providerTypeDiv.getByRole('button', { name: 'hyperv' });

    this.startNowCheckbox = this.podmanMachineConfiguration.getByRole('checkbox', { name: 'Start the machine now' });
    this.createMachineButton = this.podmanMachineConfiguration.getByRole('button', { name: 'Create' });
  }

  async setupAndCreateMachine(
    machineName: string,
    {
      isRootful = true,
      enableUserNet = false,
      startNow = true,
      connectionType,
    }: {
      isRootful?: boolean;
      enableUserNet?: boolean;
      startNow?: boolean;
      connectionType?: PodmanConnectionTypes;
    } = {},
  ): Promise<void> {
    return test.step(`Create Podman Machine '${machineName}' with settings: ${isRootful ? 'rootful' : 'rootless'}, ${enableUserNet ? 'usernet enabled' : 'usernet disabled'}, ${startNow ? 'startnow enabled' : 'startnow disabled'}${connectionType ? ', and ' + connectionType : ''}`, async () => {
      await playExpect(this.podmanMachineConfiguration).toBeVisible({
        timeout: 10_000,
      });
      await this.podmanMachineName.clear();
      await this.podmanMachineName.fill(machineName);

      await this.ensureCheckboxState(isRootful, this.rootPriviledgesCheckbox);

      if (isWindows) {
        await this.ensureCheckboxState(enableUserNet, this.userModeNetworkingCheckbox);
        if (connectionType === PodmanConnectionTypes.HyperV) {
          await playExpect(this.providerTypeWslOption).toBeVisible({ timeout: 10_000 });
          await this.providerTypeWslOption.scrollIntoViewIfNeeded();
          await this.providerTypeWslOption.click();

          await playExpect(this.providerTypeHypervOption).toBeVisible({ timeout: 10_000 });
          await this.providerTypeHypervOption.click();

          await playExpect(this.providerTypeWslOption).not.toBeVisible({ timeout: 10_000 });
          await playExpect(this.providerTypeHypervOption).toBeVisible({ timeout: 10_000 });
        }
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
}
