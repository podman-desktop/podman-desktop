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

import test, { expect as playExpect, type Locator, type Page } from '@playwright/test';

import type { KindClusterOptions } from '/@/model/core/types';
import { fillTextbox } from '/@/utility/operations';

import { CreateClusterBasePage } from './cluster-creation-base-page';

export class CreateKindClusterPage extends CreateClusterBasePage {
  readonly clusterNameField: Locator;
  readonly controllerCheckbox: Locator;
  readonly providerType: Locator;
  readonly httpPort: Locator;
  readonly httpsPort: Locator;
  readonly containerImage: Locator;
  readonly configFileInput: Locator;
  readonly warning: Locator;

  constructor(page: Page) {
    super(page);
    this.clusterNameField = this.clusterPropertiesInformation.getByRole('textbox', { name: 'Name', exact: true });
    // Locator for the parent element of the ingress controller checkbox, used to change its value
    this.controllerCheckbox = this.clusterPropertiesInformation
      .getByRole('checkbox', {
        name: 'Setup an ingress controller',
      })
      .locator('..');
    this.providerType = this.clusterPropertiesInformation.getByLabel('Provider Type');
    this.httpPort = this.clusterPropertiesInformation.getByLabel('HTTP Port');
    this.httpsPort = this.clusterPropertiesInformation.getByLabel('HTTPS Port');
    this.containerImage = this.clusterPropertiesInformation.getByPlaceholder('Leave empty for using latest.');
    this.configFileInput = this.clusterPropertiesInformation.getByRole('textbox', {
      name: 'Custom path to Kind config file (Default is blank)',
      exact: true,
    });
    this.warning = this.page.getByRole('alert', { name: 'warning' });
  }

  private async validateKindClusterDefaultSettings(): Promise<void> {
    return test.step('Validate kind cluster default settings', async () => {
      await playExpect(this.configFileInput).toBeEmpty();
      await playExpect(this.clusterNameField).toHaveValue('kind-cluster');
      await playExpect(this.providerType).toHaveText('podman');
      await playExpect(this.httpPort).toHaveValue('9090');
      await playExpect(this.httpsPort).toHaveValue('9443');
      await playExpect(this.controllerCheckbox).toBeChecked();
      await playExpect(this.containerImage).toBeEmpty();
    });
  }

  public async createKindCluster(
    clusterName = 'kind-cluster',
    { configFilePath, providerType, httpPort, httpsPort, useIngressController, containerImage }: KindClusterOptions = {
      useIngressController: true,
    },
    timeout?: number,
  ): Promise<void> {
    return test.step('Create kind cluster', async () => {
      await this.validateKindClusterDefaultSettings();

      // Use the default cluster name if a custom config file is used; the default cluster name should be ignored in this case.
      if (configFilePath) {
        await this.configFileInput.evaluate(node => node.removeAttribute('readonly'));
        await this.configFileInput.fill(configFilePath);
        await playExpect(this.warning).toBeVisible();
        await playExpect(this.warning).toContainText(
          'By specifying a config file, all other options will be ignored except for ingress controller deployment.',
        );
      } else {
        await fillTextbox(this.clusterNameField, clusterName);
      }

      if (providerType && providerType !== 'podman') {
        await this.providerType.click();
        const providerTypeButton = this.clusterPropertiesInformation.getByRole('button', {
          name: providerType,
          exact: true,
        });
        await playExpect(providerTypeButton).toBeEnabled();
        await providerTypeButton.click();
        await playExpect(this.providerType).toHaveText(providerType);
      }

      if (httpPort) {
        await fillTextbox(this.httpPort, httpPort);
        await playExpect(this.httpPort).toHaveText(httpPort);
      }
      if (httpsPort) {
        await fillTextbox(this.httpsPort, httpsPort);
        await playExpect(this.httpsPort).toHaveText(httpsPort);
      }

      await playExpect(this.controllerCheckbox).toBeEnabled();
      if (!useIngressController) {
        await this.controllerCheckbox.uncheck();
        await playExpect(this.controllerCheckbox).not.toBeChecked();
      } else {
        await this.controllerCheckbox.check();
        await playExpect(this.controllerCheckbox).toBeChecked();
      }

      if (containerImage) {
        await fillTextbox(this.containerImage, containerImage);
        await playExpect(this.containerImage).toHaveText(containerImage);
      }
      await this.createCluster(timeout);
    });
  }
}
