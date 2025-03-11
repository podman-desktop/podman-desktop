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

import type { Page } from '@playwright/test';
import { expect as playExpect } from '@playwright/test';

import { ResourceConnectionCardPage } from '../model/pages/resource-connection-card-page';
import { ResourcesPage } from '../model/pages/resources-page';
import { NavigationBar } from '../model/workbench/navigation';
import { isLinux } from './platform';

export async function getProviderLabel(page: Page): Promise<string | undefined> {
  if (isLinux) return undefined;
  const navigationBar = new NavigationBar(page);
  const settingsBar = await navigationBar.openSettings();
  await settingsBar.resourcesTab.click();
  const resourcesPage = new ResourcesPage(page);
  await playExpect(resourcesPage.heading).toBeVisible();
  await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible('podman')).toBeTruthy();
  const resourcesPodmanConnections = new ResourceConnectionCardPage(page, 'podman');
  const provider =
    (await resourcesPodmanConnections.card.getByLabel('Connection Type', { exact: true }).textContent()) ?? '';
  return provider;
}
