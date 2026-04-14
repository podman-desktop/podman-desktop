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

import type { InstallCheck } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { OrCheck, SequenceCheck } from '/@/checks/base-check';
import { HyperVCheck } from '/@/checks/windows/hyper-v-check';
import { HyperVPodmanVersionCheck } from '/@/checks/windows/hyper-v-podman-version-check';
import { VirtualMachinePlatformCheck } from '/@/checks/windows/virtual-machine-platform-check';
import { WinBitCheck } from '/@/checks/windows/win-bit-check';
import { WinMemoryCheck } from '/@/checks/windows/win-memory-check';
import { WinVersionCheck } from '/@/checks/windows/win-version-check';
import { WSLVersionCheck } from '/@/checks/windows/wsl-version-check';
import { WSL2Check } from '/@/checks/windows/wsl2-check';
import { ExtensionContextSymbol, TelemetryLoggerSymbol } from '/@/inject/symbols';

@injectable()
export class WinPlatform {
  readonly type = 'win';

  private readonly windowsVirtualizationCheck: OrCheck;
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
    @inject(VirtualMachinePlatformCheck)
    readonly virtualMachinePlatformCheck: VirtualMachinePlatformCheck,
    @inject(WSLVersionCheck)
    readonly wSLVersionCheck: WSLVersionCheck,
    @inject(WSL2Check)
    readonly wSL2Check: WSL2Check,
  ) {
    this.hyperVSequenceCheck = new SequenceCheck('Hyper-V Platform', [this.hyperVPodmanVersionCheck, this.hyperVCheck]);

    this.wslCheck = new SequenceCheck('WSL platform', [
      this.virtualMachinePlatformCheck,
      this.wSLVersionCheck,
      this.wSL2Check,
    ]);

    this.windowsVirtualizationCheck = new OrCheck('Windows virtualization', this.wslCheck, this.hyperVSequenceCheck);
  }

  getPreflightChecks(): InstallCheck[] {
    return [this.winBitCheck, this.winVersionCheck, this.winMemoryCheck, this.windowsVirtualizationCheck];
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
}
