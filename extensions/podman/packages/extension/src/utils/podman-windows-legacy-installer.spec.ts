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

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Registry, RegistryItem } from 'winreg';
import WinReg from 'winreg';

import { UNINSTALL_LEGACY_INSTALLER_COMMAND } from '/@/constants';
import {
  LEGACY_PODMAN_REGISTRY_ITEM_NAME,
  LEGACY_PODMAN_REGISTRY_KEY,
  PodmanWindowsLegacyInstaller,
  UNINSTALL_REGISTRY_DISPLAY_NAME_KEY,
  UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING_KEY,
} from '/@/utils/podman-windows-legacy-installer';

vi.mock(import('winreg'));
vi.mock(
  import('@podman-desktop/api'),
  () =>
    ({
      window: {
        withProgress: vi.fn(),
      },
      commands: {
        registerCommand: vi.fn(),
      },
      process: {
        exec: vi.fn(),
      },
      ProgressLocation: {
        TASK_WIDGET: 2,
      },
    }) as unknown as typeof extensionApi,
);

const TELEMETRY_LOGGER_MOCK = {
  logUsage: vi.fn(),
} as unknown as extensionApi.TelemetryLogger;
const CANCELLATION_TOKEN_MOCK: extensionApi.CancellationToken = {
  isCancellationRequested: false,
  onCancellationRequested: vi.fn(),
};

let podmanWindowsLegacyInstaller: PodmanWindowsLegacyInstaller;

beforeEach(() => {
  vi.resetAllMocks();

  podmanWindowsLegacyInstaller = new PodmanWindowsLegacyInstaller(TELEMETRY_LOGGER_MOCK);

  vi.mocked(extensionApi.window.withProgress).mockImplementation(
    (
      _: extensionApi.ProgressOptions,
      task: (
        progress: extensionApi.Progress<{ message?: string; increment?: number }>,
        token: extensionApi.CancellationToken,
      ) => Promise<unknown>,
    ) => {
      return task({ report: vi.fn() }, CANCELLATION_TOKEN_MOCK);
    },
  );
});

describe('init', () => {
  test('expect uninstall command to be registered', async () => {
    podmanWindowsLegacyInstaller.init();

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledExactlyOnceWith(
      UNINSTALL_LEGACY_INSTALLER_COMMAND,
      expect.any(Function),
    );
  });
});

describe('dispose', () => {
  test('expect register command disposable to be disposed', async () => {
    const disposable: extensionApi.Disposable = {
      dispose: vi.fn(),
    };
    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue(disposable);

    podmanWindowsLegacyInstaller.init();
    podmanWindowsLegacyInstaller.dispose();

    expect(disposable.dispose).toHaveBeenCalledOnce();
  });
});

describe('isInstalled', () => {
  test('expect true if ', async () => {
    vi.mocked(WinReg.prototype.valueExists).mockImplementation(function (
      this: Registry,
      _: string,
      cb: (err: Error | undefined, exists: boolean) => void,
    ): Registry {
      cb(undefined, true);
      return this;
    });

    const result = await podmanWindowsLegacyInstaller.isInstalled();
    expect(result).toBeTruthy();

    expect(WinReg).toHaveBeenCalledExactlyOnceWith({
      hive: WinReg.HKLM,
      key: LEGACY_PODMAN_REGISTRY_KEY,
    });
    expect(WinReg.prototype.valueExists).toHaveBeenCalledExactlyOnceWith(
      LEGACY_PODMAN_REGISTRY_ITEM_NAME,
      expect.any(Function),
    );
  });

  test('should return failure if legacy podman installer detected', async () => {
    vi.mocked(WinReg.prototype.valueExists).mockImplementation(function (
      this: Registry,
      _: string,
      cb: (err: Error | undefined, exists: boolean) => void,
    ): Registry {
      cb(undefined, false);
      return this;
    });

    const result = await podmanWindowsLegacyInstaller.isInstalled();
    expect(result).toBeFalsy();
  });
});

describe('uninstall', () => {
  const UNINSTALL_CMD_MOCK = 'uninstall.exe /a /b /c';

  const PODMAN_UNINSTALL_REGISTRY: Registry = {
    valueExists: vi.fn(),
    get: vi.fn(),
  } as unknown as Registry;

  beforeEach(() => {
    vi.mocked(WinReg.prototype.keys).mockImplementation(function (
      this: Registry,
      cb: (err: Error | undefined, result: Registry[]) => void,
    ): Registry {
      cb(undefined, [PODMAN_UNINSTALL_REGISTRY]);
      return this;
    });

    vi.mocked(PODMAN_UNINSTALL_REGISTRY.valueExists).mockImplementation(function (
      this: Registry,
      name: string,
      cb: (err: Error, exists: boolean) => void,
    ): Registry {
      cb(undefined as unknown as Error, true);
      return this;
    });

    vi.mocked(PODMAN_UNINSTALL_REGISTRY.get).mockImplementation(function (
      this: Registry,
      name: string,
      cb: (err: Error, result: RegistryItem) => void,
    ): Registry {
      switch (name) {
        case UNINSTALL_REGISTRY_DISPLAY_NAME_KEY:
          cb(
            undefined as unknown as Error,
            {
              value: 'podman',
            } as RegistryItem,
          );
          break;
        case UNINSTALL_REGISTRY_QUIT_UNINSTALL_STRING_KEY:
          cb(
            undefined as unknown as Error,
            {
              value: UNINSTALL_CMD_MOCK,
            } as RegistryItem,
          );
          break;
        default:
          throw new Error(`unknown key ${name}`);
      }
      return this;
    });
  });

  test('should execute expected uninstall cmd in shell', async () => {
    await podmanWindowsLegacyInstaller.uninstall();

    expect(extensionApi.process.exec).toHaveBeenCalledWith('cmd.exe', ['/s', '/c', `"${UNINSTALL_CMD_MOCK}"`], {
      isAdmin: true,
      logger: expect.anything(),
    });
  });

  test('expect telemetry usage to be provided for uninstall legacy', async () => {
    await podmanWindowsLegacyInstaller.uninstall();

    expect(TELEMETRY_LOGGER_MOCK.logUsage).toHaveBeenCalledWith('podman.uninstallLegacy', {
      duration: expect.any(Number),
    });
  });

  test('expect error raised during uninstall to be logged in telemetry', async () => {
    const error = new Error('Dummy Foo Bar');
    vi.mocked(WinReg.prototype.keys).mockImplementation(function (
      this: Registry,
      cb: (err: Error | undefined, result: Registry[]) => void,
    ): Registry {
      cb(error, []);
      return this;
    });

    await expect(async () => {
      return await podmanWindowsLegacyInstaller.uninstall();
    }).rejects.toThrowError(error);

    expect(TELEMETRY_LOGGER_MOCK.logUsage).toHaveBeenCalledWith(
      'podman.uninstallLegacy',
      expect.objectContaining({
        error: error,
      }),
    );
  });
});
