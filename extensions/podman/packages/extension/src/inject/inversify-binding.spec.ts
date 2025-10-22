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
import { env } from '@podman-desktop/api';
import type { Container as InversifyContainer } from 'inversify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { MacOSInstaller } from '/@/installer/mac-os-installer';
import { WinInstaller } from '/@/installer/win-installer';

import { InversifyBinding } from './inversify-binding';
import { ExtensionContextSymbol, InstallerSymbol, TelemetryLoggerSymbol } from './symbols';

vi.mock(import('/@/installer/win-installer'));
vi.mock(import('/@/installer/mac-os-installer'));

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

    vi.mocked(env).isWindows = false;
    vi.mocked(env).isMac = false;
    vi.mocked(env).isLinux = false;
  });

  test('should initialize bindings correctly', async () => {
    // Initialize bindings
    const container: InversifyContainer = await inversifyBinding.init();

    expect(container.get(ExtensionContextSymbol)).toBe(extensionContextMock);
    expect(container.get(TelemetryLoggerSymbol)).toBe(telemetryLoggerMock);
  });

  test('InversifyBinding#init should bind WinInstaller for InstallerSymbol on windows', async () => {
    vi.mocked(env).isWindows = true;

    const container = await inversifyBinding.init();

    const value = container.get(InstallerSymbol);
    expect(value).not.toBeUndefined();

    expect(WinInstaller).toHaveBeenCalledOnce();
    expect(MacOSInstaller).not.toHaveBeenCalled();
  });

  test('InversifyBinding#init should bind MacOSInstaller for InstallerSymbol on macos', async () => {
    vi.mocked(env).isMac = true;

    const container = await inversifyBinding.init();

    const value = container.get(InstallerSymbol);
    expect(value).not.toBeUndefined();

    expect(WinInstaller).not.toHaveBeenCalled();
    expect(MacOSInstaller).toHaveBeenCalled();
  });

  test('InversifyBinding#init should bind undefined on InstallerSymbol on linux', async () => {
    vi.mocked(env).isLinux = true;

    const container = await inversifyBinding.init();

    const value = container.get(InstallerSymbol);
    expect(value).toBeUndefined();

    expect(WinInstaller).not.toHaveBeenCalled();
    expect(MacOSInstaller).not.toHaveBeenCalled();
  });
});
