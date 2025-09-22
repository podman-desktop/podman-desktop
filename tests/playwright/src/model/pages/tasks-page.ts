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

import { type Locator, type Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

import { handleConfirmationDialog } from '../../utility/operations';
import { BasePage } from './base-page';

export class TasksPage extends BasePage {
  readonly heading: Locator;
  readonly taskList: Locator;
  readonly clearAllButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: 'Tasks',
    });
    this.taskList = page.getByRole('rowgroup').nth(1);
    this.clearAllButton = page.getByRole('button', { name: 'Clear All' });
  }

  async cancelLatestTask(): Promise<void> {
    const cancelButton = this.taskList.getByRole('button').and(this.taskList.getByLabel('Cancel task')).first();
    await playExpect(cancelButton).toBeEnabled();
    await cancelButton.click();
    await handleConfirmationDialog(this.page);
    await handleConfirmationDialog(this.page, 'Long task example', true, 'OK');
  }

  async getStatusForLatestTask(): Promise<string> {
    return (await this.taskList.getByRole('status').first().textContent()) ?? '';
  }

  async clearAllTasks(): Promise<void> {
    await playExpect(this.clearAllButton).toBeEnabled({ timeout: 10_000 });
    await this.clearAllButton.click();
  }
}
