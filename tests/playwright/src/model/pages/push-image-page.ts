/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { BasePage } from './base-page';
import { ImagesPage } from './images-page';

export class PushImagePage extends BasePage {
  readonly heading: Locator;
  readonly pushImageButton: Locator;
  readonly cancelButton: Locator;
  readonly backToImagesLink: Locator;
  readonly manageRegistriesButton: Locator;
  readonly imageNameInput: Locator;
  readonly tabContent: Locator;
  readonly searchResultsTable: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: 'Push image to a registry',
    });
    this.pushImageButton = page.getByRole('button', { name: 'Push image' });
    this.cancelButton = page.getByRole('link', { name: 'Close' });
    this.backToImagesLink = page.getByRole('link', {
      name: 'Go back to Images',
    });
    this.manageRegistriesButton = page.getByRole('button', {
      name: 'Manage registries',
    });
    this.imageNameInput = page.getByLabel('Image to Pull');
    this.tabContent = page.getByRole('region', {
      name: 'Tab Content',
      exact: true,
    });
    this.searchResultsTable = this.tabContent.getByRole('row');
    this.doneButton = page.getByRole('button', { name: 'Done', exact: true });
  }

  async pushImage(timeout = 60_000): Promise<ImagesPage> {
    return test.step(`Pushing image`, async () => {
      await playExpect(this.pushImageButton).toBeEnabled();
      await this.pushImageButton.click();

      await playExpect(this.doneButton).toBeEnabled({ timeout: timeout });
      await this.doneButton.click();
      return new ImagesPage(this.page);
    });
  }
}
