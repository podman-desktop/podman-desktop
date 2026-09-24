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

import { MachineCreationForm } from './forms/machine-creation-form';
import { ResourcesPage } from './resources-page';

export class PodmanMachineDetails extends ResourcesPage {
  readonly podmanMachineName: Locator;
  readonly podmanMachineStatus: Locator;
  readonly podmanMachineConnectionActions: Locator;
  readonly podmanMachineStartButton: Locator;
  readonly podmanMachineRestartButton: Locator;
  readonly podmanMachineStopButton: Locator;
  readonly podmanMachineDeleteButton: Locator;
  readonly podmanMachineUpdateButton: Locator;
  readonly podmanMachineGoBackToResourcesButton: Locator;

  readonly tabs: Locator;
  readonly summaryTab: Locator;
  readonly logsTab: Locator;
  readonly terminalTab: Locator;
  readonly tabContent: Locator;
  readonly terminalInput: Locator;
  readonly terminalContent: Locator;

  constructor(page: Page, podmanMachineName: string) {
    super(page);
    this.podmanMachineName = page.getByRole('heading', { name: podmanMachineName });
    this.podmanMachineStatus = page.getByLabel('Connection Status Label');
    this.podmanMachineConnectionActions = page.getByRole('group', { name: 'Connection Actions' });
    this.podmanMachineStartButton = this.podmanMachineConnectionActions.getByRole('button', {
      name: 'Start',
      exact: true,
    });
    this.podmanMachineRestartButton = this.podmanMachineConnectionActions.getByRole('button', { name: 'Restart' });
    this.podmanMachineStopButton = this.podmanMachineConnectionActions.getByRole('button', { name: 'Stop' });
    this.podmanMachineDeleteButton = this.podmanMachineConnectionActions.getByRole('button', { name: 'Delete' });
    this.podmanMachineUpdateButton = page
      .getByRole('form', { name: 'Properties Information' })
      .getByRole('button', { name: 'Update' });
    this.podmanMachineGoBackToResourcesButton = page.getByRole('button', { name: 'Go back to resources' });

    this.tabs = page.getByRole('region', { name: 'Tabs' });
    this.summaryTab = this.tabs.getByText('Summary');
    this.logsTab = this.tabs.getByText('Logs');
    this.terminalTab = this.tabs.getByText('Terminal', { exact: true });
    this.tabContent = page.getByRole('region', { name: 'Tab Content' });
    this.terminalInput = this.tabContent.getByLabel('Terminal input');
    this.terminalContent = this.tabContent.locator('.xterm-rows');
  }

  // Edits the Memory slider on the machine edit form (reusing MachineCreationForm, whose
  // submit button is named 'Create' and therefore cannot be used to submit an edit) and
  // submits it, then waits for the update (including the machine stop/start cycle it
  // triggers) to finish and navigates back to the Resources page.
  async editMachineMemory(): Promise<void> {
    return test.step('Edit Podman Machine memory', async () => {
      const machineCreationForm = new MachineCreationForm(this.page);
      await playExpect(machineCreationForm.podmanMachineMemory).toBeVisible({ timeout: 10_000 });

      const currentValue = await machineCreationForm.podmanMachineMemory.inputValue();
      const min = await machineCreationForm.podmanMachineMemory.getAttribute('min');
      const max = await machineCreationForm.podmanMachineMemory.getAttribute('max');
      const step = await machineCreationForm.podmanMachineMemory.getAttribute('step');

      const current = Number(currentValue);
      const stepValue = Number(step) || 500_000_000;
      const maxValue = Number(max);
      const minValue = Number(min);
      const increasedValue = current + stepValue;
      const newValue = increasedValue <= maxValue ? increasedValue : Math.max(minValue, current - stepValue);

      await machineCreationForm.podmanMachineMemory.fill(newValue.toString());
      await playExpect(machineCreationForm.podmanMachineMemory).toHaveValue(newValue.toString());

      await playExpect(this.podmanMachineUpdateButton).toBeEnabled();
      await this.podmanMachineUpdateButton.click();

      await playExpect(this.podmanMachineGoBackToResourcesButton).toBeEnabled({ timeout: 180_000 });
      await this.podmanMachineGoBackToResourcesButton.click();
    });
  }
}
