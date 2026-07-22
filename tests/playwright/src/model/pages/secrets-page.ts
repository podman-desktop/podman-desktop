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

import { handleConfirmationDialog } from '/@/utility/operations';

import { CreateSecretPage } from './create-secret-page';
import { MainPage } from './main-page';
import { SecretDetailsPage } from './secret-details-page';

export class SecretsPage extends MainPage {
  readonly createSecretButton: Locator;
  readonly deleteSelectedButton: Locator;

  constructor(page: Page) {
    super(page, 'secrets');
    this.createSecretButton = this.additionalActions.getByRole('button', { name: 'Create' });
    this.deleteSelectedButton = this.bottomAdditionalActions.getByRole('button', { name: 'Delete' });
  }

  async getSecretRowByName(name: string): Promise<Locator | undefined> {
    return this.getRowByName(name);
  }

  async secretExists(name: string): Promise<boolean> {
    return test.step(`Check if secret: ${name} exists`, async () => {
      const result = await this.getSecretRowByName(name);
      return result !== undefined;
    });
  }

  async createSecret(name: string, data: string): Promise<SecretsPage> {
    return test.step(`Create secret: ${name}`, async () => {
      await playExpect(this.createSecretButton).toBeEnabled();
      await this.createSecretButton.click();
      const createSecretPage = new CreateSecretPage(this.page);
      await playExpect(createSecretPage.heading).toBeVisible();
      return createSecretPage.createSecret(name, data);
    });
  }

  async deleteSecret(secretName: string): Promise<SecretsPage> {
    return test.step(`Delete secret: ${secretName}`, async () => {
      const secretRow = await this.getSecretRowByName(secretName);
      if (secretRow === undefined) {
        throw Error(`Secret: ${secretName} does not exist`);
      }
      const deleteButton = secretRow.getByRole('button', { name: 'Delete Secret' });
      await playExpect(deleteButton).toBeEnabled();
      await deleteButton.click();
      await handleConfirmationDialog(this.page, 'Delete Secret?', true, 'Delete');
      return this;
    });
  }

  async openSecretDetails(secretName: string): Promise<SecretDetailsPage> {
    return test.step(`Open secret details: ${secretName}`, async () => {
      const secretRow = await this.getSecretRowByName(secretName);
      if (secretRow === undefined) {
        throw Error(`Secret: ${secretName} does not exist`);
      }
      const secretNameButton = secretRow.getByRole('button', { name: secretName });
      await playExpect(secretNameButton).toBeEnabled();
      await secretNameButton.click();
      return new SecretDetailsPage(this.page, secretName);
    });
  }
}
