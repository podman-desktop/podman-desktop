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
import path from 'node:path';

import type { ExtensionContext, InstallCheck, RunError, TelemetryLogger } from '@podman-desktop/api';
import { process as processAPI, ProgressLocation, window } from '@podman-desktop/api';

import { OrCheck, SequenceCheck } from '../checks/base-check';
import { HyperVCheck } from '../checks/hyperv-check';
import { VirtualMachinePlatformCheck } from '../checks/virtual-machine-platform-check';
import { WinBitCheck } from '../checks/win-bit-check';
import { WinMemoryCheck } from '../checks/win-memory-check';
import { WinVersionCheck } from '../checks/win-version-check';
import { WSLVersionCheck } from '../checks/wsl-version-check';
import { WSL2Check } from '../checks/wsl2-check';
import { getBundledPodmanVersion } from '../utils/podman-bundled';
import { getAssetsFolder } from '../utils/util';
import { BaseInstaller } from './base-installer';

export class WinInstaller extends BaseInstaller {
  constructor(
    private extensionContext: ExtensionContext,
    private telemetryLogger: TelemetryLogger,
  ) {
    super();
  }

  getUpdatePreflightChecks(): InstallCheck[] {
    return [];
  }

  getPreflightChecks(): InstallCheck[] {
    return [
      new WinBitCheck(),
      new WinVersionCheck(),
      new WinMemoryCheck(),
      new OrCheck(
        'Windows virtualization',
        new SequenceCheck('WSL platform', [
          new VirtualMachinePlatformCheck(this.telemetryLogger),
          new WSLVersionCheck(),
          new WSL2Check(this.telemetryLogger, this.extensionContext),
        ]),
        new HyperVCheck(this.telemetryLogger, true),
      ),
    ];
  }

  update(): Promise<boolean> {
    return this.install();
  }

  install(): Promise<boolean> {
    return window.withProgress({ location: ProgressLocation.APP_ICON }, async progress => {
      progress.report({ increment: 5 });
      const setupPath = path.resolve(getAssetsFolder(), `podman-${getBundledPodmanVersion()}-setup.exe`);
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
