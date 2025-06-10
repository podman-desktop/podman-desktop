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

import test, { expect as playExpect } from '@playwright/test';
import type { Locator, Page } from 'playwright';

import type { PodmanVirtualizationProviders } from '../core/types';
import { ResourceConnectionCardPage } from './resource-connection-card-page';
import { SettingsPage } from './settings-page';

export class ResourcesPage extends SettingsPage {
  readonly heading: Locator;
  readonly featuredProviderResources: Locator;

  constructor(page: Page) {
    super(page, 'Resources');
    this.heading = this.header.getByRole('heading', { name: 'Title' }).and(this.header.getByText('Resources'));
    this.featuredProviderResources = this.content.getByRole('region', { name: 'Featured Provider Resources' });
  }

  public async resourceCardIsVisible(resourceCardAriaLabel: string): Promise<boolean> {
    return (await this.resourceCardLocatorGenerator(resourceCardAriaLabel).count()) > 0;
  }

  public async goToCreateNewResourcePage(resourceCardAriaLabel: string, newResourceName = ''): Promise<void> {
    if (!(await this.resourceCardIsVisible(resourceCardAriaLabel))) {
      throw new Error(`Resource card with label "${resourceCardAriaLabel}" is not available`);
    }

    const buttonName = newResourceName || resourceCardAriaLabel;
    await this.resourceCardLocatorGenerator(resourceCardAriaLabel)
      .getByRole('button', { name: `Create new ${buttonName}` })
      .click();
  }

  private resourceCardLocatorGenerator(resourceCardAriaLabel: string): Locator {
    return this.content.getByRole('region', { name: resourceCardAriaLabel, exact: true });
  }

  /**
   * Verifies that a Podman machine has the specified virtualization provider type.
   * This method checks that the machine card exists and displays the correct connection type.
   *
   * @param machineName - The name of the machine to verify
   * @param virtualizationProvider - The expected virtualization provider type (e.g., PodmanVirtualizationProviders.WSL, PodmanVirtualizationProviders.QEMU, PodmanVirtualizationProviders.HyperV)
   * @returns A Promise that resolves when the verification is complete
   * @throws Will throw an error if the expected virtualization provider is not found or doesn't match
   */
  public async verifyVirtualizationProvider(
    machineName: string,
    virtualizationProvider: PodmanVirtualizationProviders,
  ): Promise<void> {
    return test.step(`Verify Podman Provider is ${virtualizationProvider}`, async () => {
      await playExpect(this.heading).toBeVisible();
      const machineCard = new ResourceConnectionCardPage(this.page, 'podman', machineName);
      await playExpect.poll(async () => await machineCard.doesResourceElementExist(), { timeout: 15_000 }).toBeTruthy();
      await playExpect(machineCard.card.getByLabel(machineName).getByLabel('Connection Type')).toContainText(
        virtualizationProvider,
      );
    });
  }
}
