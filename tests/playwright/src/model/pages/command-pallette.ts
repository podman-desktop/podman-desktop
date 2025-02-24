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

import { BasePage } from './base-page';

export class CommandPalette extends BasePage {
  readonly commandPaletteInputField: Locator;
  constructor(page: Page) {
    super(page);
    this.commandPaletteInputField = this.page.getByLabel('Command palette command input', { exact: true });
  }

  async executeCommand(command: string): Promise<void> {
    if (!command) {
      throw new Error('Command is required');
    }

    if (!(await this.commandPaletteInputField.isVisible())) {
      await this.page.keyboard.press('F1');
    }

    await playExpect(this.commandPaletteInputField).toBeVisible();
    await this.commandPaletteInputField.pressSequentially(command, { delay: 25 });
    await this.commandPaletteInputField.press('Enter');
  }
}
