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

import test, { expect as playExpect, type Locator, type Page } from '@playwright/test';

import { fillTextbox } from '/@/utility/operations';

import { CreateClusterBasePage } from './cluster-creation-base-page';

/**
 * Creation page for the Dummy Resources extension Kubernetes cluster form.
 * The Dummy Resources provider shows both a container and a Kubernetes factory
 * on the same page, so the Kubernetes form is scoped by the "Cluster name" field.
 */
export class CreateDummyK8sClusterPage extends CreateClusterBasePage {
  readonly k8sClusterForm: Locator;
  readonly clusterNameField: Locator;
  readonly createK8sClusterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.k8sClusterForm = this.page
      .getByRole('form', { name: 'Properties Information' })
      .filter({ has: this.page.getByRole('textbox', { name: 'Cluster name' }) });
    this.clusterNameField = this.k8sClusterForm.getByRole('textbox', { name: 'Cluster name' });
    this.createK8sClusterButton = this.k8sClusterForm.getByRole('button', { name: 'Create', exact: true });
  }

  async createDummyK8sCluster(clusterName = 'dummy-cluster', timeout = 30_000): Promise<void> {
    return test.step(`Create dummy Kubernetes cluster: ${clusterName}`, async () => {
      await playExpect(this.clusterNameField).toBeVisible();
      await fillTextbox(this.clusterNameField, clusterName);
      await playExpect(this.createK8sClusterButton).toBeEnabled();
      await this.createK8sClusterButton.click();
      await playExpect(this.goBackButton).toBeVisible({ timeout });
      await this.goBackButton.click();
    });
  }
}
