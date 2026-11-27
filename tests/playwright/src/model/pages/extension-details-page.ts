/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import { ExtensionState } from '/@/model/core/states';

import { BasePage } from './base-page';
import { ExtensionsPage } from './extensions-page';

export class ExtensionDetailsPage extends BasePage {
  readonly header: Locator;
  readonly tabs: Locator;
  readonly tabContent: Locator;
  readonly enableButton: Locator;
  readonly disableButton: Locator;
  readonly removeExtensionButton: Locator;
  readonly status: Locator;
  readonly heading: Locator;
  readonly errorStackTrace: Locator;
  readonly autoUpdateRegion: Locator;
  readonly autoUpdateEnabledLabel: Locator;
  readonly autoUpdateDisabledLabel: Locator;
  readonly autoUpdateEnableButton: Locator;
  readonly autoUpdateDisableButton: Locator;

  constructor(
    page: Page,
    public readonly extensionName: string,
  ) {
    super(page);
    this.header = page.getByRole('region', { name: 'Header' });
    this.tabs = page.getByRole('region', { name: 'Tabs' });
    this.tabContent = page.getByRole('region', { name: 'Tab Content' });
    this.heading = this.header.getByRole('heading', { name: extensionName });
    this.enableButton = this.header.getByRole('button', { name: 'Start' });
    this.disableButton = this.header.getByRole('button', { name: 'Stop' });
    this.removeExtensionButton = this.header.getByRole('button', {
      name: 'Delete',
    });
    this.status = this.header
      .getByRole('status', { name: 'Extension status' })
      .or(this.header.getByLabel('Extension status Label'))
      .first();
    this.errorStackTrace = this.tabContent.getByRole('group', {
      name: 'Stack Trace',
      exact: true,
    });
    this.autoUpdateRegion = page.getByRole('region', { name: 'Auto-update', exact: true });
    this.autoUpdateEnabledLabel = this.autoUpdateRegion.getByText('Enabled', { exact: true });
    this.autoUpdateDisabledLabel = this.autoUpdateRegion.getByText('Disabled', { exact: true });
    this.autoUpdateEnableButton = this.autoUpdateRegion.getByRole('button', { name: 'Enable', exact: true });
    this.autoUpdateDisableButton = this.autoUpdateRegion.getByRole('button', { name: 'Disable', exact: true });
  }

  async disableAutoUpdate(): Promise<this> {
    return test.step(`Disable automatic updates of extension: ${this.extensionName}`, async () => {
      await playExpect(this.autoUpdateDisableButton).toBeVisible();
      await this.autoUpdateDisableButton.click();
      await playExpect(this.autoUpdateDisabledLabel).toBeVisible();
      await playExpect(this.autoUpdateEnableButton).toBeVisible();
      return this;
    });
  }

  async enableAutoUpdate(): Promise<this> {
    return test.step(`Enable automatic updates of extension: ${this.extensionName}`, async () => {
      await playExpect(this.autoUpdateEnableButton).toBeVisible();
      await this.autoUpdateEnableButton.click();
      await playExpect(this.autoUpdateEnabledLabel).toBeVisible();
      await playExpect(this.autoUpdateDisableButton).toBeVisible();
      return this;
    });
  }

  async disableExtension(): Promise<this> {
    return test.step(`Disable extension: ${this.extensionName}`, async () => {
      if ((await this.status.innerText()).toLowerCase() === 'disabled') return this;

      await this.disableButton.click();
      await playExpect(this.status).toHaveText('Disabled', { timeout: 30000, ignoreCase: true });
      return this;
    });
  }

  async enableExtension(): Promise<this> {
    return test.step(`Enable extension: ${this.extensionName}`, async () => {
      const isActiveRegexp = new RegExp(`${ExtensionState.Installed}|Active`, 'i');
      const status = (await this.status.innerText()).toLowerCase();
      if (status === 'installed' || status === 'active') return this;

      await this.enableButton.click();
      await playExpect.poll(() => this.status.innerText(), { timeout: 30_000 }).toMatch(isActiveRegexp);
      return this;
    });
  }

  async removeExtension(disableBeforeRemove = true): Promise<ExtensionsPage> {
    return test.step(`Remove extension: ${this.extensionName}`, async () => {
      if (disableBeforeRemove) {
        await this.disableExtension();
      }

      await playExpect(this.removeExtensionButton).toBeVisible();
      await this.removeExtensionButton.click();
      await playExpect(this.removeExtensionButton).not.toBeVisible({ timeout: 30_000 });
      return new ExtensionsPage(this.page);
    });
  }

  async activateTab(tabName: string): Promise<this> {
    return test.step(`Activate tab: ${tabName}`, async () => {
      const tabItem = this.tabs.getByRole('button', {
        name: tabName,
        exact: true,
      });
      await playExpect(tabItem).toBeVisible();
      await tabItem.click();
      return this;
    });
  }
}
