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

import { expect as playExpect, type Locator, type Page, test } from '@playwright/test';

import { getDefaultVirtualizationProvider } from '/@/utility/provider';

import type { PodmanVirtualizationProviders } from '../core/types';
import { MachineCreationForm } from './forms/machine-creation-form';
import { OnboardingPage } from './onboarding-page';

export class PodmanOnboardingPage extends OnboardingPage {
  readonly podmanAutostartToggle: Locator;
  readonly createMachinePageTitle: Locator;
  readonly machineCreationForm: MachineCreationForm;
  readonly podmanMachineShowLogsButton: Locator;
  readonly goBackButton: Locator;

  constructor(page: Page) {
    super(page);
    this.podmanAutostartToggle = this.mainPage.getByRole('checkbox', {
      name: 'Autostart Podman engine when launching Podman Desktop',
    });
    this.createMachinePageTitle = this.onboardingComponent.getByLabel('title');
    this.machineCreationForm = new MachineCreationForm(this.page);
    this.podmanMachineShowLogsButton = this.mainPage.getByRole('button', { name: 'Show Logs' });
    this.goBackButton = this.page.getByRole('button', { name: 'Go back to resources' });
  }

  public async specifyVirtualizationProvider(
    virtualizationProvider: PodmanVirtualizationProviders | undefined,
  ): Promise<void> {
    return test.step(`Set Podman Provider to be ${virtualizationProvider}`, async () => {
      if (virtualizationProvider && virtualizationProvider !== getDefaultVirtualizationProvider()) {
        await playExpect(this.machineCreationForm.providerTypeDiv).toBeVisible({ timeout: 10_000 });
        await playExpect(this.machineCreationForm.providerTypeDiv).toContainText(getDefaultVirtualizationProvider(), {
          ignoreCase: true,
        });
        await this.machineCreationForm.providerTypeDiv.scrollIntoViewIfNeeded();
        await this.machineCreationForm.providerTypeDiv.click();
        await playExpect(this.machineCreationForm.providerTypeDropdownOption).toBeVisible({ timeout: 10_000 });
        await this.machineCreationForm.providerTypeDropdownOption.click();
        await playExpect(this.machineCreationForm.providerTypeDiv).toContainText(virtualizationProvider, {
          ignoreCase: true,
        });
      }
    });
  }
}
