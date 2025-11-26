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

import { DetailsPage } from './details-page';
import { NetworksPage } from './networks-page';

export class NetworkDetailsPage extends DetailsPage {
  readonly updateButton: Locator;
  readonly deleteButton: Locator;

  static readonly SUMMARY_TAB = 'Summary';
  static readonly INSPECT_TAB = 'Inspect';

  constructor(page: Page, name: string) {
    super(page, name);
    this.updateButton = this.controlActions.getByRole('button', {
      name: 'Update Network',
    });
    this.deleteButton = this.controlActions.getByRole('button', {
      name: 'Delete Network',
    });
  }

  async updateNetwork(options?: {
    dnsServersToAdd?: string;
    dnsServersToRemove?: string;
    action?: 'Cancel' | 'Update';
  }): Promise<NetworkDetailsPage> {
    return test.step('Update network from details page', async () => {
      await playExpect(this.updateButton).toBeEnabled();
      await this.updateButton.click();
      await handleEditNetworkDialog(this.page, this.resourceName, options);
      return this;
    });
  }

  async deleteNetwork(): Promise<NetworksPage> {
    return test.step('Delete network from details page', async () => {
      await playExpect(this.deleteButton).toBeEnabled();
      await this.deleteButton.click();
      await handleConfirmationDialog(this.page);
      return new NetworksPage(this.page);
    });
  }
}
