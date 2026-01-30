/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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
import { PodmanMachinePrivileges } from '/@/model/core/types';
import { handleConfirmationDialog } from '/@/utility/operations';

import { ResourceCardPage } from './resource-card-page';

export class ResourceConnectionCardPage extends ResourceCardPage {
  readonly resourceElement: Locator;
  readonly resourceElementDetailsButton: Locator;
  readonly resourceElementConnectionStatus: Locator;
  readonly resourceElementConnectionActions: Locator;
  readonly createButton: Locator;
  readonly connectionType: Locator;
  readonly machinePrivileges: Locator;

  constructor(page: Page, resourceName: string, resourceElementVisibleName?: string) {
    super(page, resourceName);
    this.resourceElement = this.providerConnections.getByRole('region', {
      name: resourceElementVisibleName,
      exact: true,
    });
    this.resourceElementDetailsButton = this.resourceElement.getByRole('button', { name: 'details' });
    this.resourceElementConnectionStatus = this.resourceElement.getByLabel('Connection Status Label');
    this.resourceElementConnectionActions = this.resourceElement.getByRole('group', { name: 'Connection Actions' });
    this.createButton = this.providerSetup.getByRole('button', {
      name: 'Create',
    });
    this.connectionType = this.resourceElement.getByLabel('Connection Type');
    this.machinePrivileges = this.resourceElement.getByLabel('Machine with root privileges:');
  }

  public async doesResourceElementExist(): Promise<boolean> {
    return (await this.resourceElement.count()) > 0;
  }

  public async performConnectionAction(operation: ResourceElementActions, timeout = 25000): Promise<void> {
    return test.step(`Perform connection action '${operation}' on resource element '${this.resourceElement}'`, async () => {
      const button = this.resourceElementConnectionActions.getByRole('button', {
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

  public async getConnectionInfoByLabel(label: string): Promise<string> {
    return (await this.card.getByLabel(label, { exact: true }).textContent()) ?? '';
  }

  public async toggleMachinePrivileges(targetPrivilege: PodmanMachinePrivileges, timeout = 120_000): Promise<void> {
    return test.step(`Toggle machine privileges to '${targetPrivilege}'`, async () => {
      const editForm = this.page.getByRole('form', { name: 'Properties Information' });
      const rootPrivilegesCheckbox = editForm.getByRole('checkbox', {
        name: 'Machine with root privileges',
      });
      const updateButton = editForm.getByRole('button', { name: 'Update' });
      const goBackButton = this.page.getByRole('button', { name: 'Go back to resources' });

      const desiredState = targetPrivilege === PodmanMachinePrivileges.Rootful;
      const currentState = await rootPrivilegesCheckbox.isChecked();

      if (desiredState !== currentState) {
        await rootPrivilegesCheckbox.locator('..').click();
        await playExpect
          .poll(async () => await rootPrivilegesCheckbox.isChecked(), { timeout: 10_000 })
          .toBe(desiredState);
      }

      await playExpect(updateButton).toBeEnabled();
      await updateButton.click();

      await playExpect(goBackButton).toBeEnabled({ timeout: timeout });
      await goBackButton.click();
    });
  }
}
