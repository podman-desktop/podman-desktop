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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect as playExpect, test } from '/@/utility/fixtures';
import { waitForPodmanMachineStartup } from '/@/utility/wait';

const CONTAINERFILE_PATH = fileURLToPath(new URL('../../resources/staged_build.yaml', import.meta.url));
const BUILD_CONTEXT_DIR = path.resolve(path.dirname(CONTAINERFILE_PATH), '..');
const IMAGE_NAME = 'build-options-test';
const BUILD_TARGET = 'stage2';
const BUILD_ARGUMENT = { key: 'TEST_ARG', value: 'test-value' };

test.beforeAll(async ({ runner, welcomePage, page }) => {
  runner.setVideoAndTraceName('build-image-options');
  await welcomePage.handleWelcomePage(true);
  await waitForPodmanMachineStartup(page);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

test('Preserves build settings across tabs', async ({ navigationBar, page }) => {
  const images = await navigationBar.openImages();
  const buildPage = await images.openBuildImage();
  await buildPage.containerFilePathInput.fill(CONTAINERFILE_PATH);
  await buildPage.buildContextDirectoryInput.fill(BUILD_CONTEXT_DIR);
  await buildPage.imageNameInput.fill(IMAGE_NAME);
  await buildPage.uncheckDefaultCheckbox();
  await buildPage.amd64Button.click();
  await buildPage.arm64Button.click();

  await buildPage.advancedTab.click();
  await buildPage.targetDropdownButton.click();
  await page.getByRole('button', { name: BUILD_TARGET, exact: true }).click();
  await buildPage.buildArgKeyInput.fill(BUILD_ARGUMENT.key);
  await buildPage.buildArgValueInput.fill(BUILD_ARGUMENT.value);
  await buildPage.registryValidationCheckbox.uncheck();

  // Return to each tab to detect lost form values.
  await buildPage.basicTab.click();
  await playExpect(buildPage.containerFilePathInput).toBeVisible();
  await playExpect(buildPage.containerFilePathInput).toHaveValue(CONTAINERFILE_PATH);
  await playExpect(buildPage.buildContextDirectoryInput).toHaveValue(BUILD_CONTEXT_DIR);
  await playExpect(buildPage.imageNameInput).toHaveValue(IMAGE_NAME);
  await playExpect(buildPage.amd64checkbox).toBeChecked();
  await playExpect(buildPage.arm64checkbox).toBeChecked();

  await buildPage.advancedTab.click();
  await playExpect(buildPage.targetDropdownButton).toBeVisible();
  await playExpect(buildPage.targetDropdownButton).toHaveText(BUILD_TARGET);
  await playExpect(buildPage.buildArgKeyInput).toHaveValue(BUILD_ARGUMENT.key);
  await playExpect(buildPage.buildArgValueInput).toHaveValue(BUILD_ARGUMENT.value);
  await playExpect(buildPage.registryValidationCheckbox).not.toBeChecked();
});
