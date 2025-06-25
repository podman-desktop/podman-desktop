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

import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import { ExtensionCardPage } from './extension-card-page';
import type { ExtensionDetailsPage } from './extension-details-page';

export class ExtensionsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly header: Locator;
  readonly content: Locator;
  readonly additionalActions: Locator;
  readonly installedTab: Locator;
  readonly catalogTab: Locator;
  readonly installExtensionFromOCIImageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('region', { name: 'header' });
    this.content = page.getByRole('region', { name: 'content' });
    this.heading = this.header.getByRole('heading', { name: 'extensions' });
    this.additionalActions = this.header.getByRole('group', {
      name: 'additionalActions',
    });
    this.installedTab = this.page.getByRole('button', { name: 'Installed' });
    this.catalogTab = this.page.getByRole('button', { name: 'Catalog', exact: true });
    this.installExtensionFromOCIImageButton = this.additionalActions.getByLabel('Install custom');
  }

  public async installExtensionFromOCIImage(extension: string, timeout = 100_000): Promise<ExtensionsPage> {
    return test.step(`Install extension from OCI image: ${extension}`, async () => {
      // open button to install extension from OCI image
      await playExpect(this.installExtensionFromOCIImageButton).toBeEnabled();
      await this.installExtensionFromOCIImageButton.click();

      const dialog = this.page.getByRole('dialog', {
        name: 'Install Custom Extension',
        exact: true,
      });
      await playExpect(dialog).toBeVisible();
      const imageInput = dialog.getByRole('textbox', {
        name: 'Image name to install custom extension',
      });
      // check visibility of the input
      await playExpect(imageInput).toBeVisible();

      await imageInput.fill(extension);

      const installButton = dialog.getByRole('button', {
        name: 'Install',
        exact: true,
      });
      await playExpect(installButton).toBeEnabled();

      await installButton.click();

      const doneButton = dialog.getByRole('button', {
        name: 'Done',
        exact: true,
      });
      await playExpect(doneButton).toBeEnabled({ timeout: timeout });
      await doneButton.click();

      return this;
    });
  }

  public async openInstalledTab(): Promise<void> {
    await playExpect(this.installedTab).toBeVisible({ timeout: 10_000 });
    await this.installedTab.click({ force: true });
  }

  public async openCatalogTab(): Promise<void> {
    await this.catalogTab.click();
  }

  public async openExtensionDetails(name: string, label: string, heading: string): Promise<ExtensionDetailsPage> {
    const extensionCard = await this.getInstalledExtension(name, label);
    return await extensionCard.openExtensionDetails(heading);
  }

  public async getInstalledExtension(name: string, label: string): Promise<ExtensionCardPage> {
    await this.openInstalledTab();
    const extensionCard = new ExtensionCardPage(this.page, name, label);
    await playExpect(extensionCard.card).toBeVisible();
    return extensionCard;
  }

  public async extensionIsInstalled(label: string): Promise<boolean> {
    await this.openInstalledTab();
    const extension = this.content.getByRole('region', { name: label, exact: true });
    return (await extension.count()) > 0;
  }

  public async getInstalledExtensionVersion(name: string, label: string): Promise<string | undefined> {
    const extensionCard = await this.getInstalledExtension(name, label);
    const version = extensionCard.rightActions.getByLabel('Version');
    if ((await version.count()) === 0) {
      return undefined;
    }

    try {
      return await version.innerText();
    } catch (error) {
      console.log(`Could not get ${label} extension version:`, error);
      return undefined;
    }
  }
}
