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

import { Preferences } from '/@/model/core/settings/preferences';
import { ContainerState } from '/@/model/core/states';
import type { ContainerInteractiveParams } from '/@/model/core/types';
import { PreferencesPage } from '/@/model/pages/preferences-page';
import type { SettingsBar } from '/@/model/pages/settings-bar';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { deleteContainer, deleteImage } from '/@/utility/operations';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const imageToPull = 'ghcr.io/linuxcontainers/alpine';
const imageTag = 'latest';
const containerToRun = 'scrollback-container';
const containerStartParams: ContainerInteractiveParams = { attachTerminal: true, interactive: true };

const scrollbackLines = 150;
const printedLines = 500;

let settingsBar: SettingsBar;
let preferencesPage: PreferencesPage;

const getScrollbackValue = async (): Promise<string> =>
  preferencesPage.getPreferenceNumberInputValue(
    Preferences.Labels.SCROLLBACK,
    Preferences.TERMINAL_SCROLLBACK_INPUT_LABEL,
  );

test.beforeAll(async ({ runner, welcomePage, page }) => {
  test.setTimeout(180_000);

  runner.setVideoAndTraceName('terminal-scrollback-e2e');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner, page, navigationBar }) => {
  test.setTimeout(90_000);

  try {
    await deleteContainer(page, containerToRun);
    await deleteImage(page, imageToPull);

    // restore the default scrollback value
    const settings = await navigationBar.openSettings();
    await settings.preferencesTab.click();
    await new PreferencesPage(page).resetPreference(Preferences.Labels.SCROLLBACK);
  } catch (error) {
    console.log('Error during cleanup:', error);
  } finally {
    await runner.close();
  }
});

test.describe('Terminal scrollback size is applied to the container terminal', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Set the scrollback size to ${scrollbackLines} lines`, async ({ page, navigationBar }) => {
    settingsBar = await navigationBar.openSettings();
    await settingsBar.preferencesTab.click();
    preferencesPage = new PreferencesPage(page);
    await playExpect(preferencesPage.heading).toBeVisible();

    await preferencesPage.setPreferenceNumberInputValue(
      Preferences.Labels.SCROLLBACK,
      Preferences.TERMINAL_SCROLLBACK_INPUT_LABEL,
      String(scrollbackLines),
    );

    // the value is saved after a short debounce, so keep reopening the page until it is read back from the configuration
    await playExpect
      .poll(
        async () => {
          await settingsBar.resourcesTab.click();
          await settingsBar.preferencesTab.click();
          return getScrollbackValue();
        },
        { timeout: 10_000, message: 'Scrollback preference was not persisted' },
      )
      .toBe(String(scrollbackLines));
  });

  test(`Start a container '${containerToRun}' from the '${imageToPull}' image`, async ({ navigationBar }) => {
    test.setTimeout(150_000);

    let images = await navigationBar.openImages();
    const pullImagePage = await images.openPullImage();
    images = await pullImagePage.pullImage(imageToPull, imageTag, 90_000);
    await playExpect.poll(async () => await images.waitForImageExists(imageToPull), { timeout: 10_000 }).toBeTruthy();

    const imageDetails = await images.openImageDetails(imageToPull);
    const runImage = await imageDetails.openRunImage();
    await runImage.startContainer(containerToRun, containerStartParams);

    const containers = await navigationBar.openContainers();
    await playExpect
      .poll(async () => await containers.containerExists(containerToRun), { timeout: 30_000 })
      .toBeTruthy();
    const containerDetails = await containers.openContainersDetails(containerToRun);
    await playExpect
      .poll(async () => await containerDetails.getState(), { timeout: 15_000 })
      .toContain(ContainerState.Running);
  });

  test('Lines beyond the scrollback size are dropped from the terminal', async ({ navigationBar }) => {
    const containers = await navigationBar.openContainers();
    const containerDetails = await containers.openContainersDetails(containerToRun);

    // the echoed command contains '$((', so the 'done' line can only come from the command output
    await containerDetails.executeCommandInTerminal(`seq 1 ${printedLines}; echo done-$((${printedLines}))`);
    await playExpect(containerDetails.terminalContent).toContainText(`done-${printedLines}`, { timeout: 30_000 });

    // the terminal keeps the scrollback lines plus the lines that fit on the screen
    const screenRows = await containerDetails.terminalContent.locator(':scope > div').count();

    // the last lines of the buffer are the number 'printedLines', the 'done' line and the shell prompt
    const oldestKeptNumber = printedLines + 3 - scrollbackLines - screenRows;
    const tolerance = 2;

    const getOldestNumberOnScreen = async (): Promise<number> => {
      const text = await containerDetails.terminalContent.innerText();
      const numbers = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+$/.test(line))
        .map(Number);
      return Math.min(...numbers);
    };

    // scroll up a page at a time; the top of the buffer is reached once the oldest number on screen stops changing
    let previousOldestNumber: number | undefined;
    let unchangedReads = 0;
    await playExpect
      .poll(
        async () => {
          await containerDetails.terminalInput.press('Shift+PageUp');
          const oldestNumber = await getOldestNumberOnScreen();
          unchangedReads =
            Number.isFinite(oldestNumber) && oldestNumber === previousOldestNumber ? unchangedReads + 1 : 0;
          previousOldestNumber = oldestNumber;
          return unchangedReads;
        },
        { intervals: [250], timeout: 30_000, message: 'Could not scroll to the top of the terminal' },
      )
      .toBeGreaterThanOrEqual(3);

    // the top of the buffer must hold the oldest kept number, every number printed before it must have been discarded
    playExpect(previousOldestNumber).toBeGreaterThanOrEqual(oldestKeptNumber - tolerance);
    playExpect(previousOldestNumber).toBeLessThanOrEqual(oldestKeptNumber + tolerance);
  });
});
