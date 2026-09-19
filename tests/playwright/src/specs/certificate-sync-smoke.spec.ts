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

import { MachineCreationForm } from '/@/model/pages/forms/machine-creation-form';
import { ResourcesPage } from '/@/model/pages/resources-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isLinux } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const RESOURCE_NAME = 'podman';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('certificate-sync-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe('Certificate import option on Podman machine creation', { tag: ['@smoke'] }, () => {
  test.describe.configure({ mode: 'serial' });
  test.skip(isLinux, 'Certificate import targets Podman virtual machines — not applicable on native Linux');

  test('Import native CA checkbox is visible and checked by default', async ({ page, navigationBar }) => {
    const settingsBar = await navigationBar.openSettings();
    await settingsBar.resourcesTab.click();

    const resourcesPage = new ResourcesPage(page);
    await playExpect.poll(async () => await resourcesPage.resourceCardIsVisible(RESOURCE_NAME)).toBeTruthy();

    await resourcesPage.goToCreateNewResourcePage(RESOURCE_NAME);

    const machineCreationForm = new MachineCreationForm(page);
    await playExpect(machineCreationForm.podmanMachineConfiguration).toBeVisible({ timeout: 10_000 });

    await playExpect(machineCreationForm.importNativeCACheckbox).toBeVisible();
    await playExpect(machineCreationForm.importNativeCACheckbox).toBeChecked();
  });

  test('Import native CA checkbox can be toggled', async ({ page }) => {
    const machineCreationForm = new MachineCreationForm(page);

    await machineCreationForm.ensureCheckboxState(false, machineCreationForm.importNativeCACheckbox);
    await playExpect(machineCreationForm.importNativeCACheckbox).not.toBeChecked();

    await machineCreationForm.ensureCheckboxState(true, machineCreationForm.importNativeCACheckbox);
    await playExpect(machineCreationForm.importNativeCACheckbox).toBeChecked();
  });

  test('Navigate back to Resources page', async ({ page }) => {
    const closePageButton = page.getByRole('button', { name: 'Close page' });
    await closePageButton.click();

    const resourcesPage = new ResourcesPage(page);
    await playExpect(resourcesPage.heading).toBeVisible({ timeout: 10_000 });
  });
});
