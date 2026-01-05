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

import { expect as playExpect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '/@/model/pages/base-page';
import { TasksPage } from '/@/model/pages/tasks-page';
import { handleConfirmationDialog } from '/@/utility/operations';

export class StatusBar extends BasePage {
  readonly content: Locator;
  readonly kindInstallationButton: Locator;
  readonly kubernetesContext: Locator;
  readonly versionButton: Locator;
  readonly updateButtonTitle: Locator;
  readonly shareYourFeedbackButton: Locator;
  readonly troubleshootingButton: Locator;
  readonly tasksButton: Locator;
  readonly helpButton: Locator;
  readonly pinProvidersButton: Locator;
  readonly pinMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.content = page.getByRole('contentinfo', { name: 'Status Bar' });
    this.kindInstallationButton = this.content.getByTitle(
      'Kind not found on your system, click to download and install it',
    );
    this.kubernetesContext = this.content.getByTitle('Current Kubernetes Context');
    this.versionButton = this.content.getByRole('button', { name: /^v\d+\.\d+\.\d+(-\w+)?$/ });
    this.updateButtonTitle = this.content.getByRole('button').and(this.content.getByTitle('Update available'));
    this.shareYourFeedbackButton = this.content.getByRole('button').and(this.content.getByTitle('Share your feedback'));
    this.troubleshootingButton = this.content.getByRole('button').and(this.content.getByTitle('Troubleshooting'));
    this.tasksButton = this.content.getByRole('button').and(this.content.getByTitle('Tasks'));
    this.helpButton = this.content.getByRole('button').and(this.content.getByTitle('Help'));
    this.pinProvidersButton = this.content.getByRole('button', { name: 'Pin' });
    this.pinMenu = this.page.getByTitle('Pin Menu');
  }

  public async installKindCLI(): Promise<void> {
    await playExpect(this.kindInstallationButton).toBeVisible();
    await this.kindInstallationButton.click();
    await handleConfirmationDialog(this.page, 'Kind');
    await handleConfirmationDialog(this.page, 'Kind');
    await handleConfirmationDialog(this.page, 'Kind', true, 'OK');
  }

  public async validateKubernetesContext(context: string): Promise<void> {
    await playExpect(this.kubernetesContext).toBeVisible();
    await playExpect(this.kubernetesContext).toHaveText(context);
  }

  public async kindInstallationButtonIsVisible(): Promise<boolean> {
    return (await this.kindInstallationButton.count()) > 0;
  }

  public async openTasksPage(): Promise<TasksPage> {
    await playExpect(this.tasksButton).toBeVisible();
    await this.tasksButton.click();
    return new TasksPage(this.page);
  }

  public async getProviderButton(providerName: string): Promise<Locator> {
    await playExpect(this.pinProvidersButton, 'status bar providers must be turned on').toBeVisible();
    return this.content.getByRole('button', { name: providerName, exact: true });
  }

  public async pinProvider(providerName: string, pin: boolean): Promise<void> {
    const barProviderButton = await this.getProviderButton(providerName);
    if ((await barProviderButton.isVisible()) === pin) {
      return;
    }

    const pinMenuProviderButton = this.pinMenu.getByRole('button', { name: providerName });
    await playExpect(this.pinMenu).not.toBeVisible({ timeout: 5000 });

    await playExpect(this.pinProvidersButton).toBeVisible();
    await this.pinProvidersButton.click();
    await playExpect(this.pinMenu).toBeVisible({ timeout: 5000 });
    await playExpect(pinMenuProviderButton).toBeVisible();

    await pinMenuProviderButton.click();
    await playExpect.poll(async () => await barProviderButton.isVisible()).toEqual(pin);

    //close the menu
    await this.pinProvidersButton.click();
    await playExpect(this.pinMenu).not.toBeVisible({ timeout: 5000 });
  }

  public async isProviderResourceRunning(providerName: string, resourceName: string): Promise<boolean> {
    const barProviderButton = await this.getProviderButton(providerName);
    await playExpect(barProviderButton).toBeVisible();
    const providerArea = barProviderButton.locator('..').locator('..');
    const providerTooltip = providerArea.getByLabel('tooltip');

    await barProviderButton.hover();
    await playExpect(providerTooltip).toBeVisible();
    return (await providerTooltip.innerText()).includes('Running\n: ' + resourceName);
  }
}
