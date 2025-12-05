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

import { TaskState } from '/@/model/core/states';
import { CommandPalette } from '/@/model/pages/command-palette';
import { ExperimentalPage } from '/@/model/pages/experimental-page';
import { TasksPage } from '/@/model/pages/tasks-page';
import { StatusBar } from '/@/model/workbench/status-bar';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const longRunningTaskName = 'quay.io/fbenoit/long-task-example:v1.0';
const taskName = 'Dummy Long Task';

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('cancelable-task-e2e');

  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
  await page.screenshot();
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test.describe.serial('Cancelable task verification', { tag: ['@smoke', '@windows_sanity'] }, () => {
  test('Enable all experimental features', async ({ navigationBar }) => {
    const settingsBar = await navigationBar.openSettings();

    const experimentalPage = await settingsBar.openTabPage(ExperimentalPage);
    await playExpect(experimentalPage.heading).toBeVisible({ timeout: 10_000 });
    await experimentalPage.enableAllExperimentalFeatures();
  });

  test('Install long running task extension', async ({ navigationBar }) => {
    const extensionsPage = await navigationBar.openExtensions();
    await extensionsPage.installExtensionFromOCIImage(longRunningTaskName);
  });

  test('Cancel long running task', async ({ page }) => {
    const commandPalettePage = new CommandPalette(page);
    await commandPalettePage.executeCommand(taskName);

    const statusBar = new StatusBar(page);
    const tasksPage = await statusBar.openTasksPage();
    await playExpect(tasksPage.heading).toBeVisible();
    await tasksPage.cancelLatestTask();
    await playExpect.poll(async () => await tasksPage.getStatusForLatestTask()).toContain(TaskState.Canceled);
  });

  test('Check that task is finished successfully', async ({ page }) => {
    test.setTimeout(200_000);

    const commandPalettePage = new CommandPalette(page);
    await commandPalettePage.executeCommand(taskName);

    const tasksPage = new TasksPage(page);
    await playExpect(tasksPage.heading).toBeVisible();
    await playExpect
      .poll(async () => await tasksPage.getStatusForLatestTask(), { timeout: 180_000 })
      .toContain(TaskState.Success);
  });

  test('Clear all tasks', async ({ page }) => {
    const tasksPage = new TasksPage(page);
    await playExpect(tasksPage.heading).toBeVisible();
    await tasksPage.clearAllTasks();
    await playExpect(tasksPage.taskList).toHaveCount(0);
  });
});
