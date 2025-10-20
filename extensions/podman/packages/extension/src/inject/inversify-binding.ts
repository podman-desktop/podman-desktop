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

    return this.#inversifyContainer;
  }

  async dispose(): Promise<void> {
    if (this.#inversifyContainer) {
      await this.#inversifyContainer.unbindAll();
      this.#inversifyContainer = undefined;
    }
  }
}
