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

import { PreferencesPage } from '/@/model/pages/preferences-page';
import { expect as playExpect, test } from '/@/utility/fixtures';

const preferencesTestString = 'this text should persist through page change';

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('preferences-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Preferences text persistence validation', () => {
    test('Check preferences text persistence', async ({ page, navigationBar }) => {
      //Open Settings/Preferences page
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.preferencesTab.click();

      //Change kubeconfig path
      const preferencesPage = new PreferencesPage(page);
      await playExpect(preferencesPage.heading).toBeVisible();
      await preferencesPage.kubePathInput.scrollIntoViewIfNeeded();
      await preferencesPage.selectKubeFile(preferencesTestString);
      await playExpect(preferencesPage.kubePathInput).toHaveValue(preferencesTestString);

      //Change page and check new kubeconfig path persists
      await settingsBar.resourcesTab.click();
      await settingsBar.preferencesTab.click();
      await playExpect(preferencesPage.heading).toBeVisible();
      await playExpect(preferencesPage.kubePathInput).toHaveValue(preferencesTestString);
    });
  });
