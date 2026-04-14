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

import type { KubernetesResources } from '/@/model/core/types';

import { KubernetesDashboardPage } from './kubernetes-dashboard-page';
import { KubernetesResourcePage } from './kubernetes-resource-page';

export class KubernetesBar {
  readonly page: Page;
  readonly kubernetesNavBar: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.kubernetesNavBar = page.getByRole('navigation', { name: 'Kubernetes Navigation Bar' });
    this.title = this.kubernetesNavBar.getByText('Kubernetes');
  }

  public async openTabPage(kubernetesResource: KubernetesResources): Promise<KubernetesResourcePage> {
    const resource = this.kubernetesNavBar.getByRole('link', { name: kubernetesResource, exact: true });
    await resource.click();

    switch (kubernetesResource) {
      case 'Persistent Volume Claims':
        return new KubernetesResourcePage(this.page, 'PVCs');
      case 'ConfigMaps & Secrets':
        return new KubernetesResourcePage(this.page, 'Configmaps and Secrets');
      case 'Ingresses & Routes':
        return new KubernetesResourcePage(this.page, 'ingresses and routes');
      default:
        return new KubernetesResourcePage(this.page, kubernetesResource);
    }
  }

  public async openKubernetesDashboardPage(): Promise<KubernetesDashboardPage> {
    const dashboardLink = this.kubernetesNavBar.getByRole('link', { name: 'Dashboard', exact: true });
    await dashboardLink.click();
    return new KubernetesDashboardPage(this.page);
  }

  public getSettingsNavBarTabLocator(name: string): Locator {
    return this.kubernetesNavBar.getByLabel(name);
  }
}
