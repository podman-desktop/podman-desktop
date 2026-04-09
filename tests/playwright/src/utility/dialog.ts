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

import type { ElectronApplication } from '@playwright/test';

import { ElectronRunner } from '/@/runner/electron-runner';
import { RunnerFactory } from '/@/runner/runner-factory';

async function getElectronApp(): Promise<ElectronApplication> {
  const runner = await RunnerFactory.getInstance();
  if (runner instanceof ElectronRunner) {
    return (runner as ElectronRunner).getElectronApp();
  }
  throw new Error('ChromeDevToolsProtocol does not support evaluating main process...');
}

/**
 * Replaces `dialog.showOpenDialog` with a stub that resolves to the given paths,
 * executes the supplied action, and restores the original in a `finally` block.
 */
export async function withMockedOpenFileDialog(filePaths: string[], action: () => Promise<void>): Promise<void> {
  const electronApp = await getElectronApp();
  await electronApp.evaluate(({ dialog }, paths) => {
    const d = dialog as unknown as Record<string, unknown>;
    d._origShowOpenDialog = dialog.showOpenDialog;
    dialog.showOpenDialog = (() =>
      Promise.resolve({ canceled: false, filePaths: paths })) as typeof dialog.showOpenDialog;
  }, filePaths);
  try {
    await action();
  } finally {
    await electronApp.evaluate(({ dialog }) => {
      const d = dialog as unknown as Record<string, unknown>;
      if (d._origShowOpenDialog) {
        dialog.showOpenDialog = d._origShowOpenDialog as typeof dialog.showOpenDialog;
        delete d._origShowOpenDialog;
      }
    });
  }
}

/**
 * Replaces `dialog.showSaveDialog` with a stub that resolves to the given path,
 * executes the supplied action, and restores the original in a `finally` block.
 */
export async function withMockedSaveFileDialog(savePath: string, action: () => Promise<void>): Promise<void> {
  const electronApp = await getElectronApp();
  await electronApp.evaluate(({ dialog }, path) => {
    const d = dialog as unknown as Record<string, unknown>;
    d._origShowSaveDialog = dialog.showSaveDialog;
    dialog.showSaveDialog = (() =>
      Promise.resolve({ canceled: false, filePath: path })) as typeof dialog.showSaveDialog;
  }, savePath);
  try {
    await action();
  } finally {
    await electronApp.evaluate(({ dialog }) => {
      const d = dialog as unknown as Record<string, unknown>;
      if (d._origShowSaveDialog) {
        dialog.showSaveDialog = d._origShowSaveDialog as typeof dialog.showSaveDialog;
        delete d._origShowSaveDialog;
      }
    });
  }
}
