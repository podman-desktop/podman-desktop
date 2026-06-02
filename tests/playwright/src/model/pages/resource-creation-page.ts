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

import { BasePage } from './base-page';
import { ResourcesPage } from './resources-page';

/**
 * Represents the provider resource creation page (FormPage layout)
 * accessible from Settings > Resources > Create new {provider}.
 *
 * Captures the breadcrumb navigation and close button shared across
 * all provider creation pages (Podman machine, Kind cluster, etc.).
 */
export class ResourceCreationPage extends BasePage {
  readonly breadcrumb: Locator;
  readonly backLink: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumb = this.page.getByRole('navigation', { name: 'Breadcrumb' });
    this.backLink = this.breadcrumb.getByRole('link', { name: 'Back' });
    this.closeButton = this.breadcrumb.getByRole('button', { name: 'Close' });
  }

  async navigateToResourcesViaBreadcrumb(timeout = 10_000): Promise<ResourcesPage> {
    return test.step('Navigate back to Resources via breadcrumb link', async () => {
      await playExpect(this.backLink).toBeVisible();
      await this.backLink.click();
      const resourcesPage = new ResourcesPage(this.page);
      await playExpect(resourcesPage.heading).toBeVisible({ timeout });
      return resourcesPage;
    });
  }

  async navigateToResourcesViaCloseButton(timeout = 10_000): Promise<ResourcesPage> {
    return test.step('Navigate back to Resources via close button', async () => {
      await playExpect(this.closeButton).toBeVisible();
      await this.closeButton.click();
      const resourcesPage = new ResourcesPage(this.page);
      await playExpect(resourcesPage.heading).toBeVisible({ timeout });
      return resourcesPage;
    });
  }
}
