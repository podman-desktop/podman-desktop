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

import { unlink } from 'node:fs/promises';
import { win32 } from 'node:path';

import type { InstallCheck, Logger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { SequenceCheck, WarningCheck } from '/@/checks/base-check';
import { HyperVCheck } from '/@/checks/windows/hyper-v-check';
import { HyperVPodmanVersionCheck } from '/@/checks/windows/hyper-v-podman-version-check';
import { VirtualMachinePlatformCheck } from '/@/checks/windows/virtual-machine-platform-check';
import { VirtualizationFirmwareCheck } from '/@/checks/windows/virtualization-firmware-check';
import { WinBitCheck } from '/@/checks/windows/win-bit-check';
import { WinMemoryCheck } from '/@/checks/windows/win-memory-check';
import { WinVersionCheck } from '/@/checks/windows/win-version-check';
import { WSLPodmanVersionCheck } from '/@/checks/windows/wsl-podman-version-check';
import { WSLVersionCheck } from '/@/checks/windows/wsl-version-check';
import { WSL2Check } from '/@/checks/windows/wsl2-check';
import { ExtensionContextSymbol, TelemetryLoggerSymbol } from '/@/inject/symbols';

@injectable()
export class WinPlatform {
  readonly type = 'win';

  private readonly wslCheck: SequenceCheck;
  private readonly hyperVSequenceCheck: SequenceCheck;

  constructor(
    @inject(ExtensionContextSymbol)
    readonly extensionContext: extensionApi.ExtensionContext,
    @inject(TelemetryLoggerSymbol)
    readonly telemetryLogger: extensionApi.TelemetryLogger,
    @inject(WinBitCheck)
    readonly winBitCheck: WinBitCheck,
    @inject(WinVersionCheck)
    readonly winVersionCheck: WinVersionCheck,
    @inject(WinMemoryCheck)
    readonly winMemoryCheck: WinMemoryCheck,
    @inject(HyperVPodmanVersionCheck)
    readonly hyperVPodmanVersionCheck: HyperVPodmanVersionCheck,
    @inject(HyperVCheck)
    readonly hyperVCheck: HyperVCheck,
    @inject(VirtualizationFirmwareCheck)
    readonly virtualizationFirmwareCheck: VirtualizationFirmwareCheck,
    @inject(VirtualMachinePlatformCheck)
    readonly virtualMachinePlatformCheck: VirtualMachinePlatformCheck,
    @inject(WSLVersionCheck)
    readonly wSLVersionCheck: WSLVersionCheck,
    @inject(WSL2Check)
    readonly wSL2Check: WSL2Check,
    @inject(WSLPodmanVersionCheck)
    readonly wslPodmanVersionCheck: WSLPodmanVersionCheck,
  ) {
    this.hyperVSequenceCheck = new SequenceCheck('Hyper-V Platform', [this.hyperVPodmanVersionCheck, this.hyperVCheck]);

    this.wslCheck = new SequenceCheck('WSL platform', [
      this.virtualMachinePlatformCheck,
      this.wSLVersionCheck,
      this.wSL2Check,
    ]);
  }

  getPreflightChecks(): InstallCheck[] {
    return [
      this.winBitCheck,
      this.winVersionCheck,
      this.winMemoryCheck,
      new WarningCheck(this.virtualizationFirmwareCheck),
      new WarningCheck(this.wslCheck),
      new WarningCheck(this.hyperVSequenceCheck),
      new WarningCheck(this.wslPodmanVersionCheck),
    ];
  }

  getUpdatePreflightChecks(): InstallCheck[] {
    return [new WarningCheck(this.wslPodmanVersionCheck)];
  }

  async isWSLEnabled(): Promise<boolean> {
    if (!extensionApi.env.isWindows) {
      return false;
    }
    const wslCheckResult = await this.wslCheck.execute();
    return wslCheckResult.successful;
  }

  async isHyperVEnabled(): Promise<boolean> {
    if (!extensionApi.env.isWindows) {
      return false;
    }
    const hyperVCheckResult = await this.hyperVSequenceCheck.execute();
    return hyperVCheckResult.successful;
  }

  calcPipeName(machineName: string): string {
    const name = machineName.startsWith('podman') ? machineName : 'podman-' + machineName;
    return `//./pipe/${name}`;
  }

  /**
   * Same lookup as podman's runtime dir on Windows: %TEMP%\podman, falling back to %LOCALAPPDATA%\Temp\podman.
   * Returns undefined if neither variable is set, rather than a path relative to the current directory.
   */
  getApiSocketPath(machineName: string): string | undefined {
    const temp = process.env['TEMP'];
    const localAppData = process.env['LOCALAPPDATA'];
    let tmpDir: string;
    if (temp) {
      tmpDir = temp;
    } else if (localAppData) {
      tmpDir = win32.join(localAppData, 'Temp');
    } else {
      return undefined;
    }
    return win32.join(tmpDir, 'podman', `${machineName}-api.sock`);
  }

  /**
   * win-sshproxy (gvisor-tap-vsock >= v0.9.0, shipped with podman 5.8.9 / 6.1.4) no longer removes
   * the API socket file before listening on it. On Windows, the AF_UNIX socket is a real file that
   * is only deleted on a clean `podman machine stop`, so it is left behind when Windows restarts
   * with the machine running. The next `podman machine start` then fails to bind it, which also
   * takes down the named pipes Podman Desktop connects to, while the command still exits 0.
   *
   * Must only be called before starting a machine that is not running.
   * Returns true if a stale socket was removed.
   *
   * https://github.com/podman-desktop/podman-desktop/issues/19939
   * https://github.com/containers/podman/issues/29971
   */
  async removeStaleApiSocket(machineName: string, logger: Logger): Promise<boolean> {
    const socketPath = this.getApiSocketPath(machineName);
    if (!socketPath) {
      logger.warn('Unable to locate the API socket: neither TEMP nor LOCALAPPDATA is set');
      return false;
    }
    try {
      await unlink(socketPath);
    } catch (err: unknown) {
      if (!(err instanceof Error && 'code' in err && err.code === 'ENOENT')) {
        // do not block the start of the machine
        logger.warn(`Unable to remove stale API socket ${socketPath}`, err);
      }
      return false;
    }
    logger.log(`Removed stale API socket ${socketPath}`);
    return true;
  }
}
