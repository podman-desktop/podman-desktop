/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import { SecretsPage } from './secrets-page';

export class CreateSecretPage extends BasePage {
  readonly heading: Locator;
  readonly secretNameInput: Locator;
  readonly secretDataInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.page.getByRole('heading', { name: 'Create a secret' });
    this.secretNameInput = this.page.getByPlaceholder('Secret name');
    this.secretDataInput = this.page.getByPlaceholder('Secret data');
    this.createButton = this.page.getByRole('button', { name: 'Create' });
    this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  }

  async createSecret(name: string, data: string): Promise<SecretsPage> {
    return test.step(`Create secret: ${name}`, async () => {
      await playExpect(this.secretNameInput).toBeVisible();
      await this.secretNameInput.clear();
      await playExpect(this.secretNameInput).toHaveValue('');
      await this.secretNameInput.fill(name);
      await playExpect(this.secretNameInput).toHaveValue(name);

      await playExpect(this.secretDataInput).toBeVisible();
      await this.secretDataInput.clear();
      await playExpect(this.secretDataInput).toHaveValue('');
      await this.secretDataInput.fill(data);

      await playExpect(this.createButton).toBeEnabled();
      await this.createButton.click();
      return new SecretsPage(this.page);
    });
  }

  async cancel(): Promise<SecretsPage> {
    return test.step('Cancel secret creation', async () => {
      await playExpect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();
      return new SecretsPage(this.page);
    });
  }
}
