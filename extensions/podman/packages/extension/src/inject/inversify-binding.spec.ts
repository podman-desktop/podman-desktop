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
import type { Container as InversifyContainer } from 'inversify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { InversifyBinding } from './inversify-binding';
import { ExtensionContextSymbol, TelemetryLoggerSymbol } from './symbols';

const extensionContextMock = {} as ExtensionContext;
const telemetryLoggerMock = {} as TelemetryLogger;

vi.mock('@podman-desktop/api', () => {
  return {
    env: {
      isWindows: false,
      isMac: true,
      isLinux: false,
    },
  };
});

describe('inversifyBinding', () => {
  let inversifyBinding: InversifyBinding;

  beforeEach(() => {
    vi.resetAllMocks();
    inversifyBinding = new InversifyBinding(extensionContextMock, telemetryLoggerMock);
  });

  test('should initialize bindings correctly', async () => {
    // Initialize bindings
    const container: InversifyContainer = await inversifyBinding.init();

    expect(container.get(ExtensionContextSymbol)).toBe(extensionContextMock);
    expect(container.get(TelemetryLoggerSymbol)).toBe(telemetryLoggerMock);
  });
});
