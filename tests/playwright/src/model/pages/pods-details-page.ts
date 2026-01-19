/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { PodState } from '/@/model/core/states';
import { handleConfirmationDialog } from '/@/utility/operations';

import { DetailsPage } from './details-page';
import { PodsPage } from './pods-page';

export class PodDetailsPage extends DetailsPage {
  readonly startButton: Locator;
  readonly stopButton: Locator;
  readonly restartButton: Locator;
  readonly deleteButton: Locator;
  readonly findInLogsInput: Locator;
  readonly searchResults: Locator;

  static readonly SUMMARY_TAB = 'Summary';
  static readonly LOGS_TAB = 'Logs';
  static readonly INSPECT_TAB = 'Inspect';
  static readonly KUBE_TAB = 'Kube';

  constructor(page: Page, name: string) {
    super(page, name);
    this.startButton = this.controlActions.getByRole('button').and(this.page.getByLabel('Start Pod', { exact: true }));
    this.stopButton = this.controlActions.getByRole('button').and(this.page.getByLabel('Stop Pod', { exact: true }));
    this.restartButton = this.controlActions
      .getByRole('button')
      .and(this.page.getByLabel('Restart Pod', { exact: true }));
    this.deleteButton = this.controlActions
      .getByRole('button')
      .and(this.page.getByLabel('Delete Pod', { exact: true }));
    this.findInLogsInput = this.tabContent.getByLabel('Find');
    this.searchResults = this.tabContent.locator('div.xterm-selection > div');
  }

  async getState(): Promise<string> {
    return test.step('Get Pod State', async () => {
      const currentState = await this.header.getByRole('status').getAttribute('title');
      for (const state of Object.values(PodState)) {
        if (currentState === state) return state;
      }

      return PodState.Unknown;
    });
  }

  async startPod(): Promise<void> {
    return test.step('Start Pod', async () => {
      await playExpect(this.startButton).toBeEnabled({ timeout: 10_000 });
      await this.startButton.click();
    });
  }

  async stopPod(): Promise<void> {
    return test.step('Stop Pod', async () => {
      await playExpect(this.stopButton).toBeEnabled({ timeout: 10_000 });
      await this.stopButton.click();
    });
  }

  async restartPod(): Promise<void> {
    return test.step('Restart Pod', async () => {
      await playExpect(this.restartButton).toBeEnabled({ timeout: 20_000 });
      await this.restartButton.click();
    });
  }

  async deletePod(): Promise<PodsPage> {
    return test.step('Delete Pod', async () => {
      await playExpect(this.deleteButton).toBeEnabled({ timeout: 10_000 });
      await this.deleteButton.click();
      await handleConfirmationDialog(this.page);
      return new PodsPage(this.page);
    });
  }

  async findInLogs(text: string): Promise<void> {
    return test.step('Find text in logs', async () => {
      await this.activateTab(PodDetailsPage.LOGS_TAB);
      await playExpect(this.findInLogsInput).toBeVisible();
      await this.findInLogsInput.clear();
      await playExpect(this.findInLogsInput).toHaveValue('');

      await this.findInLogsInput.fill(text);
      await playExpect(this.findInLogsInput).toHaveValue(text);
    });
  }

  async getCountOfSearchResults(): Promise<number> {
    return test.step('Get count of search results', async () => {
      await this.activateTab(PodDetailsPage.LOGS_TAB);
      await playExpect(this.findInLogsInput).toBeVisible();

      return await this.searchResults.count();
    });
  }
}
