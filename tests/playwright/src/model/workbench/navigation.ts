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

import test, { expect as playExpect, type Locator, type Page } from '@playwright/test';

import { ContainersPage } from '/@/model/pages/containers-page';
import { DashboardPage } from '/@/model/pages/dashboard-page';
import { ExtensionsPage } from '/@/model/pages/extensions-page';
import { ImagesPage } from '/@/model/pages/images-page';
import { KubernetesBar } from '/@/model/pages/kubernetes-bar';
import { NetworksPage } from '/@/model/pages/networks-page';
import { PodsPage } from '/@/model/pages/pods-page';
import { SettingsBar } from '/@/model/pages/settings-bar';
import { VolumesPage } from '/@/model/pages/volumes-page';

export class NavigationBar {
  readonly page: Page;
  readonly navigationLocator: Locator;
  readonly imagesLink: Locator;
  readonly containersLink: Locator;
  readonly volumesLink: Locator;
  readonly podsLink: Locator;
  readonly dashboardLink: Locator;
  readonly settingsLink: Locator;
  readonly extensionsLink: Locator;
  readonly kubernetesLink: Locator;
  readonly networksLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationLocator = this.page.getByRole('navigation', {
      name: 'AppNavigation',
    });
    this.imagesLink = this.page.getByRole('link', { name: 'Images' });
    this.containersLink = this.page.getByRole('link', { name: 'Containers' }).nth(0);
    this.podsLink = this.page.getByRole('link', { name: 'Pods', exact: true }).nth(0);
    this.volumesLink = this.page.getByRole('link', { name: 'Volumes' });
    this.dashboardLink = this.page.getByRole('link', { name: 'Dashboard' });
    this.settingsLink = this.page.getByRole('link', { name: 'Settings', exact: true });
    this.extensionsLink = this.navigationLocator.getByRole('link', {
      name: 'Extensions',
      exact: true,
    });
    this.kubernetesLink = this.navigationLocator.getByRole('link', {
      name: 'Kubernetes',
    });
    this.networksLink = this.navigationLocator.getByRole('link', {
      name: 'Networks',
    });
  }

  async openDashboard(): Promise<DashboardPage> {
    return test.step('Open Dashboard page', async () => {
      await playExpect(this.dashboardLink).toBeVisible({ timeout: 10_000 });
      await this.dashboardLink.click({ force: true });
      return new DashboardPage(this.page);
    });
  }

  async openImages(): Promise<ImagesPage> {
    return test.step('Open Images page', async () => {
      await playExpect(this.imagesLink).toBeVisible({ timeout: 10_000 });
      await this.imagesLink.click({ force: true });
      return new ImagesPage(this.page);
    });
  }

  async openContainers(): Promise<ContainersPage> {
    return test.step('Open Containers page', async () => {
      await playExpect(this.containersLink).toBeVisible({ timeout: 10_000 });
      await this.containersLink.click({ force: true });
      return new ContainersPage(this.page);
    });
  }

  async openPods(): Promise<PodsPage> {
    return test.step('Open Pods page', async () => {
      await playExpect(this.podsLink).toBeVisible({ timeout: 10_000 });
      await this.podsLink.click({ force: true });
      return new PodsPage(this.page);
    });
  }

  async openSettings(): Promise<SettingsBar> {
    return test.step('Open Settings Page ', async () => {
      const settingsBar = new SettingsBar(this.page);
      if (!(await settingsBar.settingsNavBar.isVisible())) {
        await playExpect(this.settingsLink).toBeVisible({ timeout: 10_000 });
        await this.settingsLink.click({ force: true });
      }
      return settingsBar;
    });
  }

  async openVolumes(): Promise<VolumesPage> {
    return test.step('Open Volumes page', async () => {
      await playExpect(this.volumesLink).toBeVisible({ timeout: 10_000 });
      await this.volumesLink.click({ force: true });
      return new VolumesPage(this.page);
    });
  }

  async openKubernetes(): Promise<KubernetesBar> {
    return test.step('Open Kubernetes Page ', async () => {
      const kubernetesBar = new KubernetesBar(this.page);
      if (!(await kubernetesBar.kubernetesNavBar.isVisible())) {
        await playExpect(this.kubernetesLink).toBeVisible({ timeout: 10_000 });
        await this.kubernetesLink.click({ force: true });
      }
      return kubernetesBar;
    });
  }

  async openExtensions(): Promise<ExtensionsPage> {
    return test.step('Open Extensions page', async () => {
      await playExpect(this.extensionsLink).toBeVisible({ timeout: 10_000 });
      await this.extensionsLink.click({ force: true });
      return new ExtensionsPage(this.page);
    });
  }

  async openNetworks(): Promise<NetworksPage> {
    return test.step('Open Networks page', async () => {
      await playExpect(this.networksLink).toBeVisible({ timeout: 10_000 });
      await this.networksLink.click({ force: true });
      return new NetworksPage(this.page);
    });
  }
}
