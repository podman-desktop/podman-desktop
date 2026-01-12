/*********************************************************************
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
 ********************************************************************/
import { promisify } from 'node:util';

import {
  commands,
  type Disposable,
  process as processAPI,
  ProgressLocation,
  TelemetryLogger,
  window,
} from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import type { Registry } from 'winreg';
import WinReg from 'winreg';

import { UNINSTALL_LEGACY_INSTALLER_COMMAND } from '/@/constants';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';

// Registry key / item used by the legacy installer
export const LEGACY_PODMAN_REGISTRY_KEY = '\\SOFTWARE\\Red Hat\\Podman';
export const LEGACY_PODMAN_REGISTRY_ITEM_NAME = 'InstallDir';

// Uninstall
export const UNINSTALL_REGISTRY_PATH = '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall';
export const UNINSTALL_REGISTRY_DISPLAY_NAME_KEY = 'DisplayName';
export const UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING_KEY = 'QuietUninstallString';

@injectable()
export class PodmanWindowsLegacyInstaller implements Disposable {
  #disposables: Disposable[] = [];

  constructor(
    @inject(TelemetryLoggerSymbol)
    readonly telemetryLogger: TelemetryLogger,
  ) {}

  @preDestroy()
  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
  }

  @postConstruct()
  init(): void {
    this.#disposables.push(commands.registerCommand(UNINSTALL_LEGACY_INSTALLER_COMMAND, this.uninstall.bind(this)));
  }

  async isInstalled(): Promise<boolean> {
    const legacyRegistry: Registry = new WinReg({
      hive: WinReg.HKLM,
      key: LEGACY_PODMAN_REGISTRY_KEY,
    });

    return await promisify(legacyRegistry.valueExists).bind(legacyRegistry)(LEGACY_PODMAN_REGISTRY_ITEM_NAME);
  }

  public async uninstall(): Promise<void> {
    return window.withProgress(
      {
        location: ProgressLocation.TASK_WIDGET,
        title: 'Uninstalling legacy Podman Installer',
      },
      async ({ report }) => {
        report({ message: 'Uninstalling legacy Podman Installer' });

        const start = performance.now();
        const telemetry: Record<string, unknown> = {};

        try {
          const uninstallString = await this.getUninstallCMD();

          await processAPI.exec('cmd.exe', ['/s', '/c', `"${uninstallString}"`], {
            logger: {
              error: console.error,
              log: console.log,
              warn: console.warn,
            },
            isAdmin: true,
          });
        } catch (err: unknown) {
          console.error('Something went wrong while trying to uninstall legacy Podman Installer', err);
          telemetry['error'] = err;
          throw err;
        } finally {
          telemetry['duration'] = performance.now() - start;
          this.telemetryLogger.logUsage('podman.uninstallLegacy', telemetry);
        }
      },
    );
  }

  protected async isPodmanUninstallRegistry(registry: Registry): Promise<boolean> {
    const valueExists = promisify(registry.valueExists).bind(registry);
    const exists = await valueExists(UNINSTALL_REGISTRY_DISPLAY_NAME_KEY);
    if (!exists) return false;

    const item = await promisify(registry.get).bind(registry)(UNINSTALL_REGISTRY_DISPLAY_NAME_KEY);

    if (item.value.trim().toLowerCase() !== 'podman') return false;

    return valueExists(UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING_KEY);
  }

  protected async getUninstallCMD(): Promise<string> {
    const uninstallRegistry: Registry = new WinReg({
      hive: WinReg.HKLM,
      key: UNINSTALL_REGISTRY_PATH,
    });

    const registries: Registry[] = await promisify(uninstallRegistry.keys).bind(uninstallRegistry)();
    for (const registry of registries) {
      if (await this.isPodmanUninstallRegistry(registry)) {
        const uninstallItem = await promisify(registry.get).bind(registry)(
          UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING_KEY,
        );
        return uninstallItem.value;
      }
    }

    throw new Error('cannot find the uninstall command for the Podman legacy installer');
  }
}
