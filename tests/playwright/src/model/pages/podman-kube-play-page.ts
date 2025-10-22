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
import type { Locator, Page } from '@playwright/test';
import test, { expect as playExpect } from '@playwright/test';

import type { PlayYamlOptions } from '../core/types';
import { PodmanKubePlayOptions } from '../core/types';
import { BasePage } from './base-page';
import { PodsPage } from './pods-page';

export class PodmanKubePlayPage extends BasePage {
  readonly heading: Locator;
  readonly yamlPathInput: Locator;
  readonly playButton: Locator;
  readonly doneButton: Locator;
  readonly selectYamlButton: Locator;
  readonly createYamlFromScratchButton: Locator;
  readonly customYamlEditor: Locator;
  readonly alertMessage: Locator;
  readonly buildCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: 'Create pods from a Kubernetes YAML file',
    });
    this.yamlPathInput = page.getByPlaceholder('Select a .yaml file to play');
    this.selectYamlButton = page.getByRole('button', {
      name: 'Podman Container Engine Runtime',
    });
    this.createYamlFromScratchButton = page.getByRole('button', { name: 'Create file from scratch' });
    this.customYamlEditor = page.locator('#custom-yaml-editor');
    this.playButton = page.getByRole('button', { name: 'Play' });
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.alertMessage = this.page.getByLabel('Error Message Content');
    this.buildCheckbox = page.getByRole('checkbox', { name: 'Enable build' }).locator('..');
  }

  private async enableBuildFlag(): Promise<void> {
    await playExpect(this.buildCheckbox).not.toBeChecked();
    await playExpect(this.buildCheckbox).toBeEnabled();
    await this.buildCheckbox.check();
    await playExpect(this.buildCheckbox).toBeChecked();
  }

  private async createFromScratch(jsonResourceDefinition: string): Promise<void> {
    await playExpect(this.createYamlFromScratchButton).toBeEnabled();
    await this.createYamlFromScratchButton.click();
    await playExpect(this.createYamlFromScratchButton).toHaveAttribute('aria-pressed', 'true');
    await playExpect(this.customYamlEditor).toBeVisible();
    const codeSection = this.customYamlEditor.getByRole('code');
    await playExpect(codeSection).toBeVisible();
    await codeSection.click();
    // Workaround: Insert YAML into the Monaco editor using keyboard.type()
    // because Playwright's fill() method does not work with it
    await this.page.keyboard.type(jsonResourceDefinition);
  }

  private async selectYamlFile(pathToYaml: string): Promise<void> {
    if (!pathToYaml) {
      throw Error(`Path to Yaml file is incorrect or not provided!`);
    }
    await playExpect(this.selectYamlButton).toBeEnabled();
    await this.selectYamlButton.click();
    await playExpect(this.selectYamlButton).toHaveAttribute('aria-pressed', 'true');
    // TODO: evaluate() is required due to noninteractivity of fields currently, once https://github.com/containers/podman-desktop/issues/5479 is done they will no longer be needed
    await this.yamlPathInput.evaluate(node => node.removeAttribute('readonly'));
    await this.playButton.evaluate(node => node.removeAttribute('disabled'));
    await this.yamlPathInput.fill(pathToYaml);
  }

  async playYaml(options: PlayYamlOptions, buildImage: boolean = false, timeout: number = 120_000): Promise<PodsPage> {
    return test.step('Podman Kube Play', async () => {
      const podmanKubePlayOption = options.podmanKubePlayOption;
      switch (podmanKubePlayOption) {
        case PodmanKubePlayOptions.SelectYamlFile:
          await this.selectYamlFile(options.pathToYaml);
          break;
        case PodmanKubePlayOptions.CreateYamlFileFromScratch:
          await this.createFromScratch(options.jsonResourceDefinition);
          break;
      }

      if (buildImage) {
        await this.enableBuildFlag();
      }

      await this.playButton.click();
      await playExpect(this.doneButton.or(this.alertMessage).first()).toBeVisible({ timeout: timeout });

      if (await this.alertMessage.isVisible()) {
        const errorMessage = await this.alertMessage.textContent();
        throw Error(`Error while playing Kubernetes YAML: ${errorMessage}`);
      }

      await playExpect(this.doneButton).toBeEnabled();
      await this.doneButton.click();
      return new PodsPage(this.page);
    });
  }
}
