/*********************************************************************
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
 ********************************************************************/

import fs from 'node:fs';
import { arch } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import {
  commands as commandsAPI,
  ExtensionContext,
  InstallCheck,
  process as processAPI,
  ProgressLocation,
  RunError,
  TelemetryLogger,
  window,
} from '@podman-desktop/api';
import { inject, injectable, postConstruct } from 'inversify';
import WinReg from 'winreg';

import { LegacyInstallerCheck } from '/@/checks/windows/legacy-installer-check';
import { ExtensionContextSymbol, TelemetryLoggerSymbol } from '/@/inject/symbols';
import { WinPlatform } from '/@/platforms/win-platform';

import podman5Json from '../podman5.json';
import { getAssetsFolder } from '../utils/util';
import { BaseInstaller } from './base-installer';

// Uninstall
export const UNINSTALL_REGISTRY_KEY = '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall';
export const UNINSTALL_REGISTRY_DISPLAY_NAME = 'DisplayName';
export const UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING = 'QuietUninstallString';

export const UNINSTALL_LEGACY_INSTALLER_COMMAND = 'podman.uninstallLegacyPodmanInstaller';

@injectable()
export class WinInstaller extends BaseInstaller {
  constructor(
    @inject(ExtensionContextSymbol)
    readonly extensionContext: ExtensionContext,
    @inject(TelemetryLoggerSymbol)
    readonly telemetryLogger: TelemetryLogger,
    @inject(WinPlatform)
    readonly winPlatform: WinPlatform,
    @inject(LegacyInstallerCheck)
    readonly legacyInstallerCheck: LegacyInstallerCheck,
  ) {
    super();
  }

  @postConstruct()
  init(): void {
    commandsAPI.registerCommand(UNINSTALL_LEGACY_INSTALLER_COMMAND, this.uninstallLegacy.bind(this));
  }

  getUpdatePreflightChecks(): InstallCheck[] {
    return [];
  }

  getPreflightChecks(): InstallCheck[] {
    return this.winPlatform.getPreflightChecks();
  }

  update(): Promise<boolean> {
    return this.install();
  }

  protected async isPodmanUninstallRegistry(registry: WinReg.Registry): Promise<boolean> {
    const valueExists = promisify(registry.valueExists).bind(registry);
    const exists = await valueExists(UNINSTALL_REGISTRY_DISPLAY_NAME);
    if (!exists) return false;

    const item = await promisify(registry.get).bind(registry)(UNINSTALL_REGISTRY_DISPLAY_NAME);

    if (item.value.trim().toLowerCase() !== 'podman') return false;

    return valueExists(UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING);
  }

  protected async findPodmanUninstall(): Promise<WinReg.Registry | undefined> {
    const uninstallRegistry = new WinReg({
      hive: WinReg.HKLM,
      key: UNINSTALL_REGISTRY_KEY,
    });

    const values = await promisify(uninstallRegistry.keys).bind(uninstallRegistry)();

    const results = await Promise.all(values.map(this.isPodmanUninstallRegistry.bind(this)));
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        return values[i];
      }
    }
  }

  protected async uninstallLegacy(): Promise<boolean> {
    return window.withProgress(
      {
        location: ProgressLocation.TASK_WIDGET,
        title: 'Uninstalling legacy Podman Installer',
      },
      async progress => {
        progress.report({ message: 'Uninstalling legacy Podman Installer' });

        const registry = await this.findPodmanUninstall();
        if (!registry) throw new Error('Cannot locate uninstall instruction for podman installer');

        const uninstallString = await promisify(registry.get).bind(registry)(UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING);

        await processAPI.exec('cmd.exe', ['/s', '/c', `"${uninstallString.value}"`], {
          logger: {
            error: console.error,
            log: console.log,
            warn: console.warn,
          },
          isAdmin: true,
        });
        return Promise.resolve(true);
      },
    );
  }

  install(): Promise<boolean> {
    return window.withProgress({ location: ProgressLocation.APP_ICON }, async progress => {
      progress.report({ increment: 5 });
      const fileName =
        arch() === 'arm64'
          ? podman5Json.platform.win32.arch.arm64.fileName
          : podman5Json.platform.win32.arch.x64.fileName;
      const setupPath = path.resolve(getAssetsFolder(), fileName);
      try {
        if (fs.existsSync(setupPath)) {
          try {
            const legacyInstallerResult = await this.legacyInstallerCheck.execute();
            if (!legacyInstallerResult.successful) {
              await this.uninstallLegacy();
            }

            progress.report({ message: `Installing ${fileName}` });
            await processAPI.exec('msiexec', ['/package', setupPath]);
            progress.report({ increment: 80 });
            window.showNotification({ body: 'Podman is successfully installed.' });
          } catch (err) {
            //check if user cancelled installation see https://learn.microsoft.com/en-us/previous-versions//aa368542(v=vs.85)
            const runError = err as RunError;
            if (runError && runError.exitCode !== 1602 && runError.exitCode !== 0) {
              throw new Error(runError.message);
            }
          }
          return true;
        } else {
          throw new Error(`Can't find Podman setup package! Path: ${setupPath} doesn't exists.`);
        }
      } catch (err) {
        console.error('Error during install!');
        console.error(err);
        await window.showErrorMessage('Unexpected error, during Podman installation: ' + err, 'OK');
        return false;
      } finally {
        progress.report({ increment: -1 });
      }
    });
  }
}
