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

import test, { expect as playExpect, type Locator, type Page } from '@playwright/test';

import { ResourceElementActions } from '/@/model/core/operations';
import { DetailsPage } from '/@/model/pages/details-page';
import { handleConfirmationDialog } from '/@/utility/operations';

export class ResourceDetailsPage extends DetailsPage {
  readonly resourceStatus: Locator;

  constructor(page: Page, title: string) {
    super(page, title);
    this.resourceStatus = this.header.getByLabel('Connection Status Label');
  }

  public async performConnectionActionDetails(operation: ResourceElementActions, timeout = 25_000): Promise<void> {
    return test.step(`Perform connection action '${operation}' on resource element '${this.resourceName}' from details page`, async () => {
      const button = this.controlActions.getByRole('button', {
        name: operation,
        exact: true,
      });
      await playExpect(button).toBeEnabled({ timeout: timeout });
      await button.click();

      // A confirmation dialog is displayed for deletion
      if (operation === ResourceElementActions.Delete) {
        await handleConfirmationDialog(this.page);
      }
    });
  }
}
