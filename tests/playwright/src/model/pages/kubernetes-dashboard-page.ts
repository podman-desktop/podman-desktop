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

import { MainPage } from './main-page';

export class KubernetesDashboardPage extends MainPage {
  readonly namespaceLocator: Locator;
  readonly namespaceDropdownButton: Locator;
  readonly currentNamespace: Locator;

  constructor(page: Page) {
    super(page, 'Dashboard');
    this.namespaceLocator = this.page.getByLabel('Kubernetes Namespace', { exact: true });
    this.namespaceDropdownButton = this.namespaceLocator.getByRole('button', { name: 'Namespace' });
    this.currentNamespace = this.namespaceLocator.getByLabel('hidden input', { exact: true });
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

  private namespaceLocatorByName(name: string): Locator {
    return this.namespaceLocator.getByRole('button', { name, exact: true });
  }
}
