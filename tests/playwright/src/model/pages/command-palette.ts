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
import { expect as playExpect, test } from '@playwright/test';

import { BasePage } from './base-page';
import { ContainersPage } from './containers-page';
import { ImagesPage } from './images-page';
import { NetworksPage } from './networks-page';
import { PodsPage } from './pods-page';
import { VolumesPage } from './volumes-page';

export class CommandPalette extends BasePage {
  readonly commandPaletteInputField: Locator;
  readonly searchButton: Locator;
  readonly allTab: Locator;
  readonly commandsTab: Locator;
  readonly documentationTab: Locator;
  readonly goToTab: Locator;
  readonly noResultsMessage: Locator;
  readonly clearButton: Locator;
  readonly selectedItem: Locator;
  readonly resultItems: Locator;

  constructor(page: Page) {
    super(page);
    this.commandPaletteInputField = this.page.getByLabel('Command palette command input', { exact: true });
    this.searchButton = this.page.getByTitle('Search');
    this.allTab = this.page.getByRole('button', { name: /\bAll$/ });
    this.commandsTab = this.page.getByRole('button', { name: /\bCommands$/ });
    this.documentationTab = this.page.getByRole('button', { name: /\bDocumentation$/ });
    this.goToTab = this.page.getByRole('button', { name: /\bGo to$/ });
    this.noResultsMessage = this.page.getByText(/No results matching .+ found/);
    this.clearButton = this.page.getByLabel('clear', { exact: true });
    this.selectedItem = this.page.locator('li > button.selected');
    this.resultItems = this.page.locator('li > button');
  }

  async openWithF1(): Promise<void> {
    return test.step('Open command palette with F1', async () => {
      await this.page.keyboard.press('F1');
      await playExpect(this.commandPaletteInputField).toBeVisible();
    });
  }

  async openViaSearchButton(): Promise<void> {
    return test.step('Open command palette via search button', async () => {
      await this.searchButton.click();
      await playExpect(this.commandPaletteInputField).toBeVisible();
    });
  }

  async close(): Promise<void> {
    return test.step('Close command palette with Escape', async () => {
      await this.page.keyboard.press('Escape');
      await playExpect(this.commandPaletteInputField).not.toBeVisible();
    });
  }

  async closeByClickingOutside(): Promise<void> {
    return test.step('Close command palette by clicking outside', async () => {
      const viewport = this.page.viewportSize();
      const height = viewport?.height ?? (await this.page.evaluate(() => window.innerHeight));
      await this.page.mouse.click(10, height - 10);
      await playExpect(this.commandPaletteInputField).not.toBeVisible();
    });
  }

  async typeSearch(text: string): Promise<void> {
    return test.step(`Type in search bar: ${text}`, async () => {
      await this.commandPaletteInputField.clear();
      await this.commandPaletteInputField.pressSequentially(text, { delay: 25 });
    });
  }

  async clearSearch(): Promise<void> {
    return test.step('Clear search input', async () => {
      await this.clearButton.click();
    });
  }

  async executeCommand(command: string): Promise<void> {
    return test.step(`Execute command: ${command}`, async () => {
      if (!command) {
        throw new Error('Command is required');
      }

      if (!(await this.commandPaletteInputField.isVisible())) {
        await this.page.keyboard.press('F1');
      }

      await playExpect(this.commandPaletteInputField).toBeVisible();
      await this.commandPaletteInputField.pressSequentially(command, { delay: 25 });
      await this.commandPaletteInputField.press('Enter');
    });
  }

  /**
   * Navigate to a screen using the command palette "Go to" tab.
   *
   * Use the **plural** page name (e.g. `"Containers"`, `"Images"`) so the
   * filter matches only the list-page entry (`"Containers (N)"`) and not
   * individual resource entries (`"Container: name"`).
   */
  async navigateTo(screenName: string): Promise<void> {
    return test.step(`Navigate to ${screenName} via search bar`, async () => {
      if (!(await this.commandPaletteInputField.isVisible())) {
        await this.openViaSearchButton();
      }

      await this.goToTab.click();
      await this.commandPaletteInputField.clear();
      await this.commandPaletteInputField.pressSequentially(screenName, { delay: 25 });

      await playExpect(this.selectedItem).toBeVisible({ timeout: 5_000 });
      await this.commandPaletteInputField.press('Enter');
      await playExpect(this.commandPaletteInputField).not.toBeVisible();
    });
  }

  async openContainers(): Promise<ContainersPage> {
    return test.step('Open Containers page via search bar', async () => {
      await this.navigateTo('Containers');
      return new ContainersPage(this.page);
    });
  }

  async openImages(): Promise<ImagesPage> {
    return test.step('Open Images page via search bar', async () => {
      await this.navigateTo('Images');
      return new ImagesPage(this.page);
    });
  }

  async openPods(): Promise<PodsPage> {
    return test.step('Open Pods page via search bar', async () => {
      await this.navigateTo('Pods');
      return new PodsPage(this.page);
    });
  }

  async openVolumes(): Promise<VolumesPage> {
    return test.step('Open Volumes page via search bar', async () => {
      await this.navigateTo('Volumes');
      return new VolumesPage(this.page);
    });
  }

  async openNetworks(): Promise<NetworksPage> {
    return test.step('Open Networks page via search bar', async () => {
      await this.navigateTo('Networks');
      return new NetworksPage(this.page);
    });
  }
}
