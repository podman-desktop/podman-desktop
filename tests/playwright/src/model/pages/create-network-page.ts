/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { BasePage } from './base-page';
import { NetworksPage } from './networks-page';

export class CreateNetworkPage extends BasePage {
  readonly heading: Locator;
  readonly networkNameBox: Locator;
  readonly subnetBox: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.page.getByRole('heading', { name: 'Create a network' });
    this.networkNameBox = this.page.getByRole('textbox', { name: 'Name' });
    this.subnetBox = this.page.getByRole('textbox', { name: 'Subnet' });
    this.createButton = this.page.getByRole('button', { name: 'Create' });
    this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  }

  async createNetwork(name: string, subnet: string): Promise<NetworksPage> {
    return test.step(`Create network ${name} with subnet ${subnet}`, async () => {
      await playExpect(this.networkNameBox).toBeVisible();
      await this.networkNameBox.clear();
      await playExpect(this.networkNameBox).toHaveValue('');
      await this.networkNameBox.fill(name);
      await playExpect(this.networkNameBox).toHaveValue(name);

      await playExpect(this.subnetBox).toBeVisible();
      await this.subnetBox.clear();
      await playExpect(this.subnetBox).toHaveValue('');
      await this.subnetBox.fill(subnet);
      await playExpect(this.subnetBox).toHaveValue(subnet);

      await playExpect(this.createButton).toBeEnabled();
      await this.createButton.click();
      return new NetworksPage(this.page);
    });
  }

  async cancel(): Promise<NetworksPage> {
    return test.step('Cancel network creation', async () => {
      await playExpect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();
      return new NetworksPage(this.page);
    });
  }
}
