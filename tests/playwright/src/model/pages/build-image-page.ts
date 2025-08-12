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

import { archType } from '../../utility/platform';
import { ArchitectureType } from '../core/platforms';
import { BasePage } from './base-page';
import { ImagesPage } from './images-page';

export class BuildImagePage extends BasePage {
  readonly heading: Locator;
  readonly containerFilePathInput: Locator;
  readonly buildContextDirectoryInput: Locator;
  readonly imageNameInput: Locator;
  readonly buildButton: Locator;
  readonly doneButton: Locator;
  readonly cancelBuildButton: Locator;
  readonly containerFilePathButton: Locator;
  readonly platformRegion: Locator;
  readonly arm64Button: Locator;
  readonly amd64Button: Locator;
  readonly arm64checkbox: Locator;
  readonly amd64checkbox: Locator;
  readonly archMoreOptionsButton: Locator;
  readonly archLessOptionsButton: Locator;
  readonly terminalContent: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: 'Build Image from Containerfile',
    });
    this.containerFilePathInput = page.getByPlaceholder('Containerfile to build');
    this.buildContextDirectoryInput = page.getByPlaceholder('Directory to build in');
    this.imageNameInput = page.getByPlaceholder('my-custom-image');
    this.buildButton = page.getByRole('button', { name: 'Build', exact: true });
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.cancelBuildButton = page.getByRole('button', { name: 'Cancel' });
    this.containerFilePathButton = page.getByRole('button', { name: 'Browse...' }).first();
    this.platformRegion = page.getByRole('region', {
      name: 'Build Platform Options',
    });
    this.arm64Button = this.platformRegion.getByLabel('linux/arm64');
    this.amd64Button = this.platformRegion.getByLabel('linux/amd64');
    this.arm64checkbox = this.platformRegion.getByLabel('ARM® aarch64 systems');
    this.amd64checkbox = this.platformRegion.getByLabel('Intel and AMD x86_64 systems');
    this.archMoreOptionsButton = this.platformRegion.getByRole('button', { name: 'Show more options' });
    this.archLessOptionsButton = this.platformRegion.getByRole('button', { name: 'Show less options' });
    this.terminalContent = page.locator('.xterm-rows');
  }

  async buildImage(
    imageName: string,
    containerFilePath: string,
    contextDirectory: string,
    archType: string[] = [ArchitectureType.Default],
    timeout = 120000,
  ): Promise<ImagesPage> {
    return test.step(`Building image ${imageName} from ${containerFilePath} in ${contextDirectory} with ${archType} architecture`, async () => {
      await this.fillBuildImageForm(imageName, containerFilePath, contextDirectory, archType);

      await playExpect(this.doneButton).toBeEnabled({ timeout: timeout });
      await this.validateBuildLogs();
      await this.doneButton.scrollIntoViewIfNeeded();
      await this.doneButton.click();
      console.log(`Image ${imageName} has been built successfully!`);

      return new ImagesPage(this.page);
    });
  }

  async cancelBuild(
    imageName: string,
    containerFilePath: string,
    contextDirectory: string,
    archType: string[] = [ArchitectureType.Default],
    cancelAfterTimeout = 200,
  ): Promise<void> {
    return test.step(`Starting and canceling build for image ${imageName}`, async () => {
      await this.fillBuildImageForm(imageName, containerFilePath, contextDirectory, archType);

      await playExpect(this.cancelBuildButton).toBeEnabled();
      await this.cancelBuildButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(cancelAfterTimeout);

      await playExpect(this.cancelBuildButton).toBeVisible();
      await this.cancelBuildButton.click();

      await playExpect(this.doneButton).toBeEnabled({ timeout: 30_000 });
    });
  }

  async uncheckedAllCheckboxes(): Promise<void> {
    return test.step('Uncheck all checkboxes', async () => {
      await this.showAllArchOptions();
      for (const button of await this.platformRegion.getByRole('button').all()) {
        const buttonText = (await button.textContent()) ?? '';
        if (buttonText.trim() === 'New platform' || buttonText.trim() === 'Less Options...') {
          continue;
        }
        const checkbox = button.getByRole('checkbox');
        try {
          await playExpect(checkbox).toBeVisible();
          await playExpect(checkbox).toBeChecked();
          await playExpect(button).toBeEnabled();
          await button.click();
          await playExpect(checkbox).not.toBeChecked();
        } catch {
          console.log(`Checkbox for button "${buttonText.trim()}" is already unchecked.`);
        }
      }
    });
  }

  private async checkArchCheckbox(archType: string): Promise<void> {
    return test.step(`Check ${archType} checkbox`, async () => {
      const archTypeButton = this.platformRegion.getByLabel('linux/' + archType);
      await playExpect(archTypeButton).toBeEnabled();
      await archTypeButton.click();
      const checkbox = archTypeButton.getByRole('checkbox');
      await playExpect(checkbox).toBeChecked();
    });
  }

  async uncheckDefaultCheckbox(): Promise<void> {
    return test.step('Uncheck default checkbox', async () => {
      if (archType === 'arm64') {
        await playExpect(this.arm64checkbox).toBeChecked();
        await this.arm64Button.click();
        await playExpect(this.arm64checkbox).not.toBeChecked();
      } else {
        await playExpect(this.amd64checkbox).toBeChecked();
        await this.amd64Button.click();
        await playExpect(this.amd64checkbox).not.toBeChecked();
      }
    });
  }

  private async showAllArchOptions(): Promise<void> {
    if ((await this.archMoreOptionsButton.count()) > 0) {
      await playExpect(this.archMoreOptionsButton).toBeEnabled();
      await this.archMoreOptionsButton.click();
    } else {
      await playExpect(this.archLessOptionsButton).toBeEnabled();
    }
  }

  async validateBuildLogs(): Promise<void> {
    const logs = this.page.locator('.xterm-rows');
    await playExpect(logs).toBeVisible();
    const logRows = await logs.locator('div:has(span)').all();

    await Promise.all(
      logRows.map(async logRow => {
        await playExpect.poll(async () => logRow.textContent()).not.toContain('Error');
      }),
    );
  }

  private async fillBuildImageForm(
    imageName: string,
    containerFilePath: string,
    contextDirectory: string,
    archType: string[] = [ArchitectureType.Default],
  ): Promise<void> {
    if (!containerFilePath) {
      throw Error(`Path to containerfile is incorrect or not provided!`);
    }

    await this.containerFilePathInput.fill(containerFilePath);

    if (contextDirectory) await this.buildContextDirectoryInput.fill(contextDirectory);
    if (imageName) {
      await this.imageNameInput.clear();
      await this.imageNameInput.pressSequentially(imageName, { delay: 50 });
    }

    if (!archType.includes(ArchitectureType.Default)) {
      await this.uncheckDefaultCheckbox();
      await this.showAllArchOptions();

      for (const architecture of archType) {
        await this.checkArchCheckbox(architecture);
      }
    }

    await playExpect(this.buildButton).toBeEnabled();
    await this.buildButton.scrollIntoViewIfNeeded();
    await this.buildButton.click();
  }
}
