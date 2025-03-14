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

import { test } from '../utility/fixtures';
import { ensureCliInstalled } from '../utility/operations';
import { waitForPodmanMachineStartup } from '../utility/wait';

test.beforeAll(async ({ runner, page, welcomePage }) => {
  runner.setVideoAndTraceName('kind-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Kind installation', () => {
    test('Install Kind CLI', async ({ page, navigationBar }) => {
      const settingsBar = await navigationBar.openSettings();
      await settingsBar.cliToolsTab.click();

      await ensureCliInstalled(page, 'Kind');
    });
  });
