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

import { TaskState } from '/@/model/core/states';
import { CommandPalette } from '/@/model/pages/command-palette';
import { TasksPage } from '/@/model/pages/tasks-page';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { isCI, isLinux, isWindows } from '/@/utility/platform';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const syncCertificatesCommand = 'Podman: Synchronize certificates to all VMs';
const SYNC_TIMEOUT = 180_000;
const POLL_INTERVAL = 2_000;

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('certificate-sync-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe
  .serial('Certificate synchronization to Podman VMs', { tag: ['@smoke'] }, () => {
    test.skip(isLinux, 'Certificate sync targets Podman virtual machines — not applicable on native Linux');
    test.skip(isWindows && isCI, 'Certificate sync via podman machine ssh hangs on Windows CI runners');

    test('Synchronize certificates completes successfully', async ({ page, statusBar }) => {
      test.setTimeout(SYNC_TIMEOUT + 60_000);

      const tasksPage = await statusBar.openTasksPage();
      await playExpect(tasksPage.heading).toBeVisible();

      const commandPalette = new CommandPalette(page);
      await commandPalette.executeCommand(syncCertificatesCommand);

      await playExpect
        .poll(
          async () => {
            try {
              const status = await tasksPage.getStatusForLatestTask();
              if (status && !status.includes(TaskState.Success)) {
                console.log(`Poll: current task status = "${status}"`);
              }
              return status;
            } catch (error: unknown) {
              console.log('Poll: task status not yet available —', error instanceof Error ? error.message : error);
              return '';
            }
          },
          { timeout: SYNC_TIMEOUT, intervals: [POLL_INTERVAL] },
        )
        .toContain(TaskState.Success);
    });

    test('Clear certificate sync tasks', async ({ page }) => {
      const tasksPage = new TasksPage(page);
      await playExpect(tasksPage.heading).toBeVisible();
      await tasksPage.clearAllTasks();
      await playExpect(tasksPage.taskList).toHaveCount(0);
    });
  });
