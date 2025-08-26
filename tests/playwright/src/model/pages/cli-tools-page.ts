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

import test, { expect as playExpect } from '@playwright/test';
import type { Locator, Page } from 'playwright';

import { handleConfirmationDialog } from '../../utility/operations';
import { SettingsPage } from './settings-page';

export class CLIToolsPage extends SettingsPage {
  readonly main: Locator;
  readonly header: Locator;
  readonly content: Locator;
  readonly heading: Locator;
  readonly toolsTable: Locator;
  readonly dropDownDialog: Locator;
  readonly versionInputField: Locator;

  constructor(page: Page) {
    super(page, 'CLI Tools');
    this.main = page.getByRole('region', { name: 'CLI Tools' }); //check name
    this.header = this.main.getByRole('region', { name: 'Header' });
    this.heading = this.header.getByRole('heading', { name: 'CLI Tools', exact: true });
    this.content = this.main.getByRole('region', { name: 'Content' });
    this.toolsTable = this.content.getByRole('table', { name: 'cli-tools' });
    this.dropDownDialog = page.getByRole('dialog', { name: 'drop-down-dialog' });
    this.versionInputField = this.dropDownDialog.getByRole('textbox');
  }

  public getToolRow(toolName: string): Locator {
    return this.toolsTable.getByRole('row', { name: toolName, exact: true });
  }

  public getInstallButton(toolName: string): Locator {
    return this.getToolRow(toolName).getByLabel('Install', { exact: true });
  }

  public getUninstallButton(toolName: string): Locator {
    return this.getToolRow(toolName).getByLabel('Uninstall', { exact: true });
  }

  public getUpdateButton(toolName: string): Locator {
    return this.getToolRow(toolName)
      .getByRole('button')
      .and(this.getToolRow(toolName).getByText('Update available', { exact: true }));
  }

  public getDowngradeButton(toolName: string): Locator {
    return this.getToolRow(toolName)
      .getByRole('button')
      .and(this.getToolRow(toolName).getByText('Upgrade/Downgrade', { exact: true }));
  }

  public getVersionSelectionButton(version: string): Locator {
    return this.dropDownDialog.getByRole('button', { name: version });
  }

  public async getCurrentToolVersion(toolName: string): Promise<string> {
    return test.step(`Get current version of ${toolName}`, async () => {
      if ((await this.getToolRow(toolName).getByLabel('no-cli-version', { exact: true }).count()) > 0) {
        return '';
      }

      if ((await this.getToolRow(toolName).getByLabel('cli-version', { exact: true }).count()) === 0) {
        return '';
      }

      try {
        return await this.getToolRow(toolName).getByLabel('cli-version', { exact: true }).innerText();
      } catch (e) {
        console.log(`Could not get version for ${toolName}: ${e}`);
        return '';
      }
    });
  }

  public async installTool(toolName: string, timeout = 60_000): Promise<this> {
    return test.step(`Install ${toolName}`, async () => {
      await playExpect(this.getInstallButton(toolName)).toBeEnabled();
      await this.getInstallButton(toolName).click();

      const confirmationDialog = this.page.getByRole('dialog', { name: toolName });
      try {
        await playExpect(confirmationDialog).toBeVisible();
        await handleConfirmationDialog(this.page, toolName);
      } catch {
        console.log(`Dialog for tool ${toolName} was not visible. Proceeding.`);
      }

      await playExpect.poll(async () => await this.getCurrentToolVersion(toolName), { timeout: timeout }).toBeTruthy();
      return this;
    });
  }

  public async uninstallTool(toolName: string, timeout = 60_000): Promise<this> {
    return test.step(`Uninstall ${toolName}`, async () => {
      if ((await this.getUninstallButton(toolName).count()) === 0) {
        console.log(`Tool ${toolName} is not installed`);
        return this;
      }

      await playExpect(this.getUninstallButton(toolName)).toBeEnabled();
      await this.getUninstallButton(toolName).click();
      await handleConfirmationDialog(this.page, 'Uninstall');

      await playExpect.poll(async () => await this.getCurrentToolVersion(toolName), { timeout: timeout }).toBeFalsy();
      return this;
    });
  }

  public async downgradeTool(toolName: string, version: string = '', timeout = 60_000): Promise<this> {
    return test.step(`Downgrade ${toolName}`, async () => {
      const currentVersion = await this.getCurrentToolVersion(toolName);
      if (!currentVersion) {
        throw new Error(`Tool ${toolName} is not installed`);
      }

      if ((await this.getDowngradeButton(toolName).count()) === 0) {
        console.log(`Tool ${toolName} is already in a downgraded version`);
        return this;
      }

      await playExpect(this.getDowngradeButton(toolName)).toBeEnabled();
      await this.getDowngradeButton(toolName).click();
      await playExpect(this.dropDownDialog).toBeVisible();

      if (!version) {
        version = await this.getFirstVersionFromList();
      }

      await playExpect(this.getVersionSelectionButton(version)).toBeEnabled();
      await this.getVersionSelectionButton(version).click();

      await playExpect
        .poll(async () => await this.getCurrentToolVersion(toolName), { timeout: timeout })
        .toContain(version);
      return this;
    });
  }

  public async updateTool(toolName: string, timeout = 60_000): Promise<this> {
    return test.step(`Update ${toolName}`, async () => {
      const currentVersion = await this.getCurrentToolVersion(toolName);
      if (!currentVersion) {
        throw new Error(`Tool ${toolName} is not installed`);
      }

      if ((await this.getUpdateButton(toolName).count()) === 0) {
        console.log(`Tool ${toolName} is already on latest`);
        return this;
      }

      await playExpect(this.getUpdateButton(toolName)).toBeEnabled();
      await this.getUpdateButton(toolName).click();
      await playExpect
        .poll(async () => await this.getCurrentToolVersion(toolName), { timeout: timeout })
        .not.toContain(currentVersion);

      return this;
    });
  }

  private async getFirstVersionFromList(): Promise<string> {
    return await this.dropDownDialog.getByRole('button').first().innerText();
  }
}
