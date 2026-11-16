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
import { expect as playExpect } from '@playwright/test';

import { ElectronRunner } from '/@/runner/electron-runner';
import { RunnerFactory } from '/@/runner/runner-factory';

type TestGlobal = typeof globalThis & {
  __capturedContextMenu?: Electron.Menu;
  __origMenuPopup?: Electron.Menu['popup'];
};

export interface ContextMenuEntry {
  label: string;
  type: string;
  checked: boolean;
  enabled: boolean;
}

async function getElectronApp(): Promise<ElectronApplication> {
  const runner = await RunnerFactory.getInstance();
  if (runner instanceof ElectronRunner) {
    return (runner as ElectronRunner).getElectronApp();
  }
  throw new Error('ChromeDevToolsProtocol does not support evaluating main process...');
}

/**
 * A native context menu that was built by the main process but not shown,
 * so its entries can be read and triggered from the test.
 */
export class CapturedContextMenu {
  constructor(private readonly electronApp: ElectronApplication) {}

  async getEntries(): Promise<ContextMenuEntry[]> {
    return this.electronApp.evaluate(() => {
      const menu = (globalThis as TestGlobal).__capturedContextMenu;
      if (!menu) {
        throw new Error('No context menu was captured');
      }
      return menu.items
        .filter(item => item.type !== 'separator')
        .map(item => ({ label: item.label, type: item.type, checked: item.checked, enabled: item.enabled }));
    });
  }

  async getLabels(): Promise<string[]> {
    return (await this.getEntries()).map(entry => entry.label);
  }

  /** Runs the click handler of the entry, like selecting it in the native menu would. */
  async clickEntry(label: string): Promise<void> {
    await this.electronApp.evaluate((_electron, entryLabel) => {
      const menu = (globalThis as TestGlobal).__capturedContextMenu;
      const item = menu?.items.find(i => i.label === entryLabel);
      if (!item) {
        throw new Error(`Context menu entry '${entryLabel}' not found`);
      }
      (item.click as () => void)();
    }, label);
  }
}

/**
 * Replaces `Menu.popup` with a stub that records the menu instead of showing it,
 * runs `openMenu` (e.g. a right click), hands the captured menu to `action`,
 * and restores the original in a `finally` block.
 */
export async function withCapturedContextMenu(
  openMenu: () => Promise<void>,
  action: (menu: CapturedContextMenu) => Promise<void>,
): Promise<void> {
  const electronApp = await getElectronApp();
  await electronApp.evaluate(({ Menu }) => {
    const g = globalThis as TestGlobal;
    g.__capturedContextMenu = undefined;
    g.__origMenuPopup = Menu.prototype.popup;
    Menu.prototype.popup = function (this: Electron.Menu): void {
      g.__capturedContextMenu = this;
    };
  });
  try {
    await openMenu();
    await playExpect
      .poll(() => electronApp.evaluate(() => (globalThis as TestGlobal).__capturedContextMenu !== undefined), {
        message: 'Expected a context menu to be built',
      })
      .toBeTruthy();
    await action(new CapturedContextMenu(electronApp));
  } finally {
    await electronApp.evaluate(({ Menu }) => {
      const g = globalThis as TestGlobal;
      if (g.__origMenuPopup) {
        Menu.prototype.popup = g.__origMenuPopup;
      }
      delete g.__origMenuPopup;
      delete g.__capturedContextMenu;
    });
  }
}
