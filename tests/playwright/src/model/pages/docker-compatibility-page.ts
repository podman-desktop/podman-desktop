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

import { SettingsPage } from './settings-page';

export class DockerCompatibilityPage extends SettingsPage {
  readonly heading: Locator;
  readonly serverInformationBox: Locator;
  readonly podmanComposeCLICard: Locator;
  readonly dockerCLICard: Locator;
  readonly dockerContextDropdownMenu: Locator;
  readonly podmanListeningLabel: Locator;

  constructor(page: Page) {
    super(page, 'Docker Compatibility');
    this.heading = this.header
      .getByRole('heading', { name: 'Title' })
      .and(this.header.getByText('Docker Compatibility'));
    this.serverInformationBox = this.content.getByRole('status', { name: 'Server information' });
    this.podmanComposeCLICard = this.content.getByRole('list', { name: 'podman-desktop.podman' });
    this.dockerCLICard = this.content.getByRole('list', { name: 'podman-desktop.docker' });
    this.dockerContextDropdownMenu = this.dockerCLICard.getByRole('button', {
      name: 'select-property-docker.cli.context',
    });
    this.podmanListeningLabel = this.content.getByText('podman is listening');
  }

  public async socketIsReachable(): Promise<boolean> {
    try {
      await playExpect(this.podmanListeningLabel).toBeVisible();
      return await this.podmanListeningLabel.isVisible();
    } catch (_error) {
      return false;
    }
  }
}
