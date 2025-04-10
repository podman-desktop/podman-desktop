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
import { expect as playExpect } from '@playwright/test';

import { BasePage } from './base-page';

export class TroubleshootingPage extends BasePage {
  readonly heading: Locator;
  readonly header: Locator;
  readonly tabs: Locator;
  readonly tabContent: Locator;
  readonly containerConnectionsStatus: Locator;
  readonly storesStatus: Locator;
  readonly logsText: Locator;
  readonly logsList: Locator;
  readonly storesList: Locator;
  readonly gatherLogsText: Locator;
  readonly reconnectProvidersButton: Locator;
  readonly reconnectProvidersStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.header = this.page.getByRole('region', { name: 'Header' });
    this.heading = this.header.getByRole('heading', { name: 'Troubleshooting' });
    this.tabs = this.page.getByRole('region', { name: 'Tabs' });
    this.tabContent = this.page.getByRole('region', { name: 'Tab Content' });
    // only available when specific tab is opened
    this.containerConnectionsStatus = this.tabContent.getByRole('status', { name: 'Container Connections' });
    this.storesStatus = this.tabContent.getByRole('status', { name: 'stores' });
    this.logsText = this.tabContent.getByText('Logs', { exact: true });
    this.gatherLogsText = this.tabContent.getByText('Gather Log Files');
    this.logsList = this.tabContent.getByRole('list', { name: 'logs', exact: true });
    this.storesList = this.tabContent.getByRole('list', { name: 'stores' });
    this.reconnectProvidersButton = this.tabContent.getByRole('button', { name: 'Reconnect providers' });
    this.reconnectProvidersStatus = this.tabContent.getByRole('status', { name: 'Reconnect Providers' });
  }

  public async openRepairConnections(): Promise<void> {
    await this.openTab('Repair & Connections');
    await playExpect(this.containerConnectionsStatus).toBeVisible();
  }

  public async openStores(): Promise<void> {
    await this.openTab('Stores');
    await playExpect(this.storesStatus).toBeVisible();
  }

  public async openLogs(): Promise<void> {
    await this.openTab('Logs');
    await playExpect(this.logsText).toBeVisible();
  }

  public async openGatherLogs(): Promise<void> {
    await this.openTab('Gather Logs');
    await playExpect(this.gatherLogsText).toBeVisible();
  }

  private async openTab(tabName: string): Promise<void> {
    const link = this.tabs.getByRole('link', { name: tabName, exact: true });
    await playExpect(link, `Tab Link ${tabName} is not visible`).toBeVisible();
    await link.click();
  }

  // return locator for better processing in playwright assertions
  public async getLogs(): Promise<Locator> {
    await this.openLogs();
    await playExpect(this.logsList).toBeVisible();
    return this.logsList;
  }

  public async refreshStore(storeName: string): Promise<void> {
    await this.openStores();
    const store = this.storesList.getByRole('listitem', { name: storeName });
    await playExpect(store).toBeVisible();
    await store.scrollIntoViewIfNeeded();
    const refreshButton = store.getByRole('button', { name: 'Refresh' });
    await playExpect(refreshButton).toBeEnabled();
    await refreshButton.click();
  }

  public async getContainerConnectionsStatus(): Promise<string> {
    await this.openRepairConnections();
    await playExpect(this.containerConnectionsStatus).toBeVisible();
    return await this.containerConnectionsStatus.innerText();
  }

  public async reconnectProviders(): Promise<string> {
    await this.openRepairConnections();
    await playExpect(this.reconnectProvidersButton).toBeEnabled();
    await this.reconnectProvidersButton.click();
    await playExpect(this.reconnectProvidersStatus).toBeVisible();
    return await this.reconnectProvidersStatus.innerText();
  }
}
