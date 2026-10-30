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

/**
 * Reusable component for the ListOrganizer.svelte layout editor (toggle/reorder/reset items in a dropdown).
 */
export class ListOrganizerComponent {
  private readonly page: Page;
  readonly toggleButton: Locator;
  readonly container: Locator;
  readonly items: Locator;
  readonly resetButton: Locator;

  /**
   * @param page - The Playwright page object
   * @param scope - Locator containing the organizer (e.g. a page header)
   * @param title - The title/aria-label of the organizer toggle button
   * @param resetButtonLabel - The label of the reset button
   */
  constructor(page: Page, scope: Locator, title: string, resetButtonLabel: string) {
    this.page = page;
    this.toggleButton = scope.getByRole('button', { name: title, exact: true });
    this.container = this.toggleButton.locator('..');
    this.items = this.container.locator('[data-item-id]');
    this.resetButton = this.container.getByRole('button', { name: resetButtonLabel, exact: true });
  }

  getItem(label: string): Locator {
    return this.container.getByRole('button', { name: label, exact: true });
  }

  getGrip(label: string): Locator {
    return this.getItem(label).getByTitle('Use arrow keys to reorder, or drag with mouse', { exact: true });
  }

  async isOpen(): Promise<boolean> {
    return (await this.toggleButton.getAttribute('aria-expanded')) === 'true';
  }

  async open(): Promise<void> {
    return test.step('Open list organizer', async () => {
      if (!(await this.isOpen())) {
        await playExpect(this.toggleButton).toBeVisible({ timeout: 10_000 });
        await this.toggleButton.click();
      }
      await playExpect(this.toggleButton).toHaveAttribute('aria-expanded', 'true');
      await playExpect(this.items.first()).toBeVisible();
    });
  }

  async close(): Promise<void> {
    return test.step('Close list organizer', async () => {
      if (await this.isOpen()) {
        await this.page.keyboard.press('Escape');
      }
      await playExpect(this.toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  }

  async getItemLabels(): Promise<string[]> {
    return test.step('Get list organizer item labels', async () => {
      await this.open();
      const labels = await this.items.evaluateAll(elements =>
        elements.map(element => element.getAttribute('aria-label') ?? ''),
      );
      return labels;
    });
  }

  async isItemEnabled(label: string): Promise<boolean> {
    return test.step(`Check if item '${label}' is enabled`, async () => {
      await this.open();
      return (await this.getItem(label).getAttribute('aria-pressed')) === 'true';
    });
  }

  async toggleItem(label: string, enabled: boolean): Promise<void> {
    return test.step(`${enabled ? 'Enable' : 'Disable'} item '${label}'`, async () => {
      await this.open();
      const item = this.getItem(label);
      await playExpect(item).toBeVisible();
      if ((await item.getAttribute('aria-pressed')) !== String(enabled)) {
        await item.click();
      }
      await playExpect(item).toHaveAttribute('aria-pressed', String(enabled));
    });
  }

  async moveItemWithKeyboard(label: string, direction: 'up' | 'down', steps = 1): Promise<void> {
    return test.step(`Move item '${label}' ${direction} by ${steps} using keyboard`, async () => {
      await this.open();
      const key = direction === 'up' ? 'ArrowUp' : 'ArrowDown';
      for (let i = 0; i < steps; i++) {
        const grip = this.getGrip(label);
        const index = Number(await grip.getAttribute('data-grip-index'));
        const expectedIndex = direction === 'up' ? index - 1 : index + 1;
        await grip.focus();
        await grip.press(key);
        await playExpect(grip).toHaveAttribute('data-grip-index', String(expectedIndex));
      }
    });
  }

  async dragItem(label: string, targetLabel: string): Promise<void> {
    return test.step(`Drag item '${label}' to the position of '${targetLabel}'`, async () => {
      await this.open();
      const grip = this.getGrip(label);
      const target = this.getItem(targetLabel);
      const expectedIndex = await this.getGrip(targetLabel).getAttribute('data-grip-index');

      const gripBox = await grip.boundingBox();
      const targetBox = await target.boundingBox();
      if (!gripBox || !targetBox) {
        throw new Error(`Unable to get bounding boxes for '${label}' or '${targetLabel}'`);
      }

      await this.page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
        steps: 10,
      });
      await this.page.mouse.up();

      await playExpect(grip).toHaveAttribute('data-grip-index', expectedIndex ?? '');
    });
  }

  async reset(): Promise<void> {
    return test.step('Reset list organizer layout', async () => {
      await this.open();
      if (await this.resetButton.isEnabled()) {
        await this.resetButton.click();
      }
      await playExpect(this.resetButton).toBeDisabled();
    });
  }
}
