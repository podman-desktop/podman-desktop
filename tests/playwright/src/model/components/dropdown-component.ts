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
import test, { expect as playExpect } from '@playwright/test';

/**
 * Reusable dropdown component for consistent dropdown interactions across the test suite.
 * Handles the standard dropdown pattern used in Podman Desktop UI based on the Dropdown.svelte component.
 *
 * This component encapsulates the proper interaction patterns for dropdowns that follow the structure:
 * - Container with aria-label
 * - Button for triggering dropdown open/close
 * - Hidden input that holds the actual selected value
 * - Options list that appears when opened
 */
export class DropdownComponent {
  private readonly page: Page;
  private readonly containerLocator: Locator;
  private readonly triggerButton: Locator;
  private readonly hiddenInput: Locator;
  private readonly ariaLabel: string;

  /**
   * Creates a new DropdownComponent instance
   * @param page - The Playwright page object
   * @param ariaLabel - The aria-label used to identify the dropdown container
   */
  constructor(page: Page, ariaLabel: string) {
    this.page = page;
    this.ariaLabel = ariaLabel;

    // Find the dropdown container by its aria-label
    this.containerLocator = page.getByLabel(ariaLabel, { exact: true });

    // The trigger button is inside the container - first button element
    this.triggerButton = this.containerLocator.getByRole('button').first();

    // The hidden input holds the actual value
    this.hiddenInput = this.containerLocator.getByLabel('hidden input', { exact: true });
  }

  /**
   * Get the currently selected value from the dropdown's hidden input
   * @returns The current value stored in the hidden input
   */
  async getCurrentValue(): Promise<string> {
    return await this.hiddenInput.inputValue();
  }

  /**
   * Get the currently displayed text (what the user sees on the trigger button)
   * @returns The display text shown on the dropdown trigger
   */
  async getCurrentDisplayText(): Promise<string> {
    return await this.triggerButton.innerText();
  }

  /**
   * Select an option from the dropdown
   * @param optionValue - The value to select (used for verification)
   * @param optionText - The text to match when finding the option button (defaults to optionValue)
   * @param exact - Whether to use exact text matching (defaults to false for case-insensitive matching)
   */
  async selectOption(optionValue: string, optionText?: string, exact = false): Promise<void> {
    const displayText = optionText ?? optionValue;

    return test.step(`Select dropdown option: ${displayText}`, async () => {
      // Ensure dropdown container is visible
      await playExpect(this.containerLocator).toBeVisible({ timeout: 10_000 });
      await playExpect(this.triggerButton).toBeVisible({ timeout: 10_000 });

      // Get current value to check if change is needed
      const currentValue = await this.getCurrentValue();

      if (currentValue !== optionValue) {
        // Click to open the dropdown
        await this.triggerButton.scrollIntoViewIfNeeded();
        await this.triggerButton.click();

        // Wait until at least one option (beyond the trigger) is visible
        await playExpect(this.containerLocator.getByRole('button').nth(1)).toBeVisible();

        // Find and click the option button
        // Options appear as buttons within the container when dropdown is open
        const optionButton = this.containerLocator.getByRole('button', {
          name: displayText,
          exact: exact,
        });

        await playExpect(optionButton).toBeVisible({ timeout: 10_000 });
        await optionButton.click();

        // Verify the selection was applied (case-insensitive due to windows options)
        await playExpect
          .poll(
            async () => {
              const actualValue = await this.hiddenInput.inputValue();
              return actualValue.toLowerCase();
            },
            { timeout: 5_000 },
          )
          .toBe(optionValue.toLowerCase());
      }
    });
  }

  /**
   * Check if the dropdown is currently open using ARIA semantics with fallback
   * @returns True if the dropdown options are visible
   */
  async isOpen(): Promise<boolean> {
    const expanded = await this.triggerButton.getAttribute('aria-expanded');
    if (expanded !== null) return expanded === 'true';
    // Fallback: when open, there should be more than one button (trigger + options)
    return (await this.containerLocator.getByRole('button').count()) > 1;
  }

  /**
   * Get all available options from the dropdown
   * Note: This will open and close the dropdown to retrieve options
   * @returns Array of option texts available in the dropdown
   */
  async getAvailableOptions(): Promise<string[]> {
    return test.step('Get available dropdown options', async () => {
      // Open dropdown if not already open
      const wasOpen = await this.isOpen();
      if (!wasOpen) {
        await this.triggerButton.click();
        await playExpect(this.containerLocator.getByRole('button').nth(1)).toBeVisible();
      }

      // Get all button texts (excluding the trigger button)
      const allButtons = this.containerLocator.getByRole('button');
      const buttonTexts = await allButtons.allInnerTexts();

      // Exclude the trigger button (first entry)
      const [, ...options] = buttonTexts;

      // Close dropdown if we opened it
      if (!wasOpen) {
        await this.triggerButton.click();
      }

      return options;
    });
  }

  /**
   * Verify the dropdown is in the expected state
   * @param expectedValue - The expected value in the hidden input
   * @param expectedDisplayText - Optional expected display text on the trigger button
   */
  async verifyState(expectedValue: string, expectedDisplayText?: string): Promise<void> {
    return test.step(`Verify dropdown state: ${expectedValue}`, async () => {
      // Verify the hidden input value (case-insensitive due to windows options)
      await playExpect
        .poll(
          async () => {
            const actualValue = await this.hiddenInput.inputValue();
            return actualValue.toLowerCase();
          },
          { timeout: 5_000 },
        )
        .toBe(expectedValue.toLowerCase());

      if (expectedDisplayText) {
        await playExpect(this.triggerButton).toContainText(expectedDisplayText, {
          ignoreCase: true,
          timeout: 5_000,
        });
      }
    });
  }

  /**
   * Wait for the dropdown to be ready for interaction
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForReady(timeout = 10_000): Promise<void> {
    return test.step(`Wait for dropdown to be ready: ${this.ariaLabel}`, async () => {
      await playExpect(this.containerLocator).toBeVisible({ timeout });
      await playExpect(this.triggerButton).toBeVisible({ timeout });
      await playExpect(this.hiddenInput).toBeAttached({ timeout });
    });
  }

  /**
   * Get the dropdown container locator for advanced operations
   * @returns The container locator for this dropdown
   */
  getContainer(): Locator {
    return this.containerLocator;
  }

  /**
   * Get the trigger button locator for advanced operations
   * @returns The trigger button locator for this dropdown
   */
  getTriggerButton(): Locator {
    return this.triggerButton;
  }

  /**
   * Get the hidden input locator for advanced operations
   * @returns The hidden input locator for this dropdown
   */
  getHiddenInput(): Locator {
    return this.hiddenInput;
  }
}
