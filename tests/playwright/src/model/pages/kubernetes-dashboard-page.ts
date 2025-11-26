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

import { KubernetesResources } from '/@/model/core/types';

import { MainPage } from './main-page';

export class KubernetesDashboardPage extends MainPage {
  readonly namespaceLocator: Locator;
  readonly namespaceDropdownButton: Locator;
  readonly currentNamespace: Locator;

  readonly nodesMetricsButton: Locator;
  readonly podsMetricsButton: Locator;
  readonly deploymentsMetricsButton: Locator;
  readonly servicesMetricsButton: Locator;
  readonly ingressesMetricsButton: Locator;
  readonly pvcsMetricsButton: Locator;
  readonly configMapsMetricsButton: Locator;
  readonly jobsMetricsButton: Locator;
  readonly cronJobsMetricsButton: Locator;

  constructor(page: Page) {
    super(page, 'Dashboard');
    this.namespaceLocator = this.page.getByLabel('Kubernetes Namespace', { exact: true });
    this.namespaceDropdownButton = this.namespaceLocator.getByRole('button', { name: 'Namespace' });
    this.currentNamespace = this.namespaceLocator.getByLabel('hidden input', { exact: true });

    this.nodesMetricsButton = this.metricsLocatorByName(KubernetesResources.Nodes);
    this.podsMetricsButton = this.metricsLocatorByName(KubernetesResources.Pods);
    this.deploymentsMetricsButton = this.metricsLocatorByName(KubernetesResources.Deployments);
    this.servicesMetricsButton = this.metricsLocatorByName(KubernetesResources.Services);
    this.ingressesMetricsButton = this.metricsLocatorByName(KubernetesResources.IngeressesRoutes);
    this.pvcsMetricsButton = this.metricsLocatorByName(KubernetesResources.PVCs);
    this.configMapsMetricsButton = this.metricsLocatorByName(KubernetesResources.ConfigMapsSecrets);
    this.jobsMetricsButton = this.metricsLocatorByName(KubernetesResources.Jobs);
    this.cronJobsMetricsButton = this.metricsLocatorByName(KubernetesResources.Cronjobs);
  }

  async changeNamespace(name: string): Promise<void> {
    await playExpect(this.currentNamespace).not.toHaveValue(name, { timeout: 10_000 });
    await this.selectNamespaceByName(name);
    await playExpect(this.currentNamespace).toHaveValue(name, { timeout: 10_000 });
  }

  async selectNamespaceByName(name: string): Promise<void> {
    await playExpect(this.namespaceDropdownButton).toBeVisible();
    await this.namespaceDropdownButton.click();

    const namespaceLocator = this.namespaceLocatorByName(name);
    await playExpect(namespaceLocator).toBeVisible({ timeout: 10_000 });
    await namespaceLocator.click();
  }

  async getCurrentTotalCountForResource(name: KubernetesResources): Promise<number> {
    return this.getCountByType(name);
  }

  async getCurrentActiveCountForResource(name: KubernetesResources): Promise<number> {
    return this.getCountByType(name, 'active');
  }

  private namespaceLocatorByName(name: string): Locator {
    return this.namespaceLocator.getByRole('button', { name, exact: true });
  }

  private metricsLocatorByName(name: KubernetesResources): Locator {
    return this.page.getByRole('button').filter({ hasText: name });
  }

  private async getCountByType(name: KubernetesResources, type = ''): Promise<number> {
    const currentResource = this.metricsLocatorByName(name);
    const label = type ? `${name} ${type} count` : `${name} count`;
    const countLocator = currentResource.getByLabel(label, { exact: true });

    if ((await countLocator.count()) === 0) {
      throw new Error(`No ${label} locator found for resource: ${name}`);
    }

    const countText = await countLocator.textContent();
    return countText ? Number.parseInt(countText, 10) : 0;
  }
}
