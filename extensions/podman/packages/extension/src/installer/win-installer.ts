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

import {
  ExtensionContext,
  InstallCheck,
  process as processAPI,
  ProgressLocation,
  RunError,
  TelemetryLogger,
  window,
} from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { ExtensionContextSymbol, TelemetryLoggerSymbol } from '/@/inject/symbols';
import { WinPlatform } from '/@/platforms/win-platform';
import podman5Json from '/@/podman5.json';
import { getAssetsFolder } from '/@/utils/util';

import { BaseInstaller } from './base-installer';

@injectable()
export class WinInstaller extends BaseInstaller {
  constructor(
    @inject(ExtensionContextSymbol)
    readonly extensionContext: ExtensionContext,
    @inject(TelemetryLoggerSymbol)
    readonly telemetryLogger: TelemetryLogger,
    @inject(WinPlatform)
    readonly winPlatform: WinPlatform,
  ) {
    super();
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
            await processAPI.exec(setupPath, ['/install', '/norestart']);
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
