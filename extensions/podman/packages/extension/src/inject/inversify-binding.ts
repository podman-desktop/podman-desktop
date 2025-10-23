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

import type { ExtensionContext, TelemetryLogger } from '@podman-desktop/api';
import { Container as InversifyContainer } from 'inversify';

import { HyperVCheck } from '/@/checks/windows/hyperv-check';
import { HyperVPodmanVersionCheck } from '/@/checks/windows/hyperv-podman-version-check';
import { VirtualMachinePlatformCheck } from '/@/checks/windows/virtual-machine-platform-check';
import { WinBitCheck } from '/@/checks/windows/win-bit-check';
import { WinMemoryCheck } from '/@/checks/windows/win-memory-check';
import { WinVersionCheck } from '/@/checks/windows/win-version-check';
import { WSLVersionCheck } from '/@/checks/windows/wsl-version-check';
import { WSL2Check } from '/@/checks/windows/wsl2-check';
import { PodmanInstall } from '/@/installer/podman-install';
import { WinPlatform } from '/@/platforms/win-platform';

import { ExtensionContextSymbol, TelemetryLoggerSymbol } from './symbols';

export class InversifyBinding {
  #inversifyContainer: InversifyContainer | undefined;

  readonly #extensionContext: ExtensionContext;
  readonly #telemetryLogger: TelemetryLogger;

  constructor(extensionContext: ExtensionContext, telemetryLogger: TelemetryLogger) {
    this.#extensionContext = extensionContext;
    this.#telemetryLogger = telemetryLogger;
  }

  public async init(): Promise<InversifyContainer> {
    this.#inversifyContainer = new InversifyContainer();

    this.#inversifyContainer.bind(ExtensionContextSymbol).toConstantValue(this.#extensionContext);
    this.#inversifyContainer.bind(TelemetryLoggerSymbol).toConstantValue(this.#telemetryLogger);
    this.#inversifyContainer.bind(PodmanInstall).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(WinPlatform).toSelf().inSingletonScope();

    this.#inversifyContainer.bind(WinBitCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(WinVersionCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(WinMemoryCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(HyperVPodmanVersionCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(HyperVCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(VirtualMachinePlatformCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(WSLVersionCheck).toSelf().inSingletonScope();
    this.#inversifyContainer.bind(WSL2Check).toSelf().inSingletonScope();

    return this.#inversifyContainer;
  }

  async dispose(): Promise<void> {
    if (this.#inversifyContainer) {
      await this.#inversifyContainer.unbindAll();
      this.#inversifyContainer = undefined;
    }
  }
}
