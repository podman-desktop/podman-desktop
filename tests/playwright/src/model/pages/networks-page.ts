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

import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { handleConfirmationDialog, handleEditNetworkDialog } from '/@/utility/operations';

import { CreateNetworkPage } from './create-network-page';
import { MainPage } from './main-page';
import { NetworkDetailsPage } from './network-details-page';

export class NetworksPage extends MainPage {
  readonly createNetworkButton: Locator;
  readonly deleteSelectedButton: Locator;

  constructor(page: Page) {
    super(page, 'networks');
    this.createNetworkButton = this.additionalActions.getByRole('button', { name: 'Create' });
    this.deleteSelectedButton = this.bottomAdditionalActions.getByRole('button', { name: 'Delete' });
  }

  async getNetworkRowByName(name: string): Promise<Locator | undefined> {
    return this.getRowByName(name);
  }

  async networkExists(name: string): Promise<boolean> {
    return test.step(`Check if network: ${name} exists`, async () => {
      const result = await this.getNetworkRowByName(name);
      return result !== undefined;
    });
  }

  async countNetworksFromTable(): Promise<number> {
    return this.countRowsFromTable();
  }

  async deleteNetwork(networkName: string): Promise<NetworksPage> {
    return test.step(`Delete network: ${networkName}`, async () => {
      const networkDeleteButton = await this.getDeleteNetworkRowButton(networkName);
      await playExpect(networkDeleteButton).toBeEnabled();
      await networkDeleteButton.click();
      await handleConfirmationDialog(this.page);
      return this;
    });
  }

  async updateNetwork(
    networkName: string,
    options?: {
      dnsServersToAdd?: string;
      dnsServersToRemove?: string;
      action?: 'Cancel' | 'Update';
    },
  ): Promise<NetworksPage> {
    return test.step(`Update network: ${networkName}`, async () => {
      const networkUpdateButton = await this.getUpdateNetworkRowButton(networkName);
      await playExpect(networkUpdateButton).toBeEnabled();
      await networkUpdateButton.click();
      await handleEditNetworkDialog(this.page, networkName, options);
      return this;
    });
  }

  async deleteSelectedNetworks(): Promise<NetworksPage> {
    return test.step('Delete selected networks', async () => {
      await playExpect(this.deleteSelectedButton).toBeEnabled();
      await this.deleteSelectedButton.click();
      await handleConfirmationDialog(this.page);
      return this;
    });
  }

  async createNetwork(name: string, subnet: string): Promise<NetworksPage> {
    return test.step(`Create network: ${name}`, async () => {
      await playExpect(this.createNetworkButton).toBeEnabled();
      await this.createNetworkButton.click();
      const createNetworkPage = new CreateNetworkPage(this.page);
      await playExpect(createNetworkPage.heading).toBeVisible();
      return createNetworkPage.createNetwork(name, subnet);
    });
  }

  async openNetworkDetails(networkName: string): Promise<NetworkDetailsPage> {
    return test.step('Open Network Details Page', async () => {
      const networkRow = await this.getNetworkRowByName(networkName);
      if (networkRow === undefined) {
        throw Error(`Network: ${networkName} does not exist`);
      }
      const networkRowNameCell = networkRow.getByRole('cell').nth(3);
      await playExpect(networkRowNameCell).toBeEnabled();
      await networkRowNameCell.click();

      return new NetworkDetailsPage(this.page, networkName);
    });
  }

  private async getNetworkRowButton(networkName: string, buttonName: string): Promise<Locator> {
    const networkRow = await this.getNetworkRowByName(networkName);
    if (networkRow === undefined) {
      throw Error(`Network: ${networkName} does not exist`);
    }
    return networkRow.getByRole('button', { name: buttonName });
  }

  private async getDeleteNetworkRowButton(networkName: string): Promise<Locator> {
    return this.getNetworkRowButton(networkName, 'Delete Network');
  }
  private async getUpdateNetworkRowButton(networkName: string): Promise<Locator> {
    return this.getNetworkRowButton(networkName, 'Update Network');
  }
}
