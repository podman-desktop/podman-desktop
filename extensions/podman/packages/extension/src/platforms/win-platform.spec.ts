/*********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { unlink } from 'node:fs/promises';

import type { CheckResult, ExtensionContext, Logger, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { WarningCheck } from '/@/checks/base-check';
import type { HyperVCheck } from '/@/checks/windows/hyper-v-check';
import type { HyperVPodmanVersionCheck } from '/@/checks/windows/hyper-v-podman-version-check';
import type { VirtualMachinePlatformCheck } from '/@/checks/windows/virtual-machine-platform-check';
import type { VirtualizationFirmwareCheck } from '/@/checks/windows/virtualization-firmware-check';
import type { WinBitCheck } from '/@/checks/windows/win-bit-check';
import type { WinMemoryCheck } from '/@/checks/windows/win-memory-check';
import type { WinVersionCheck } from '/@/checks/windows/win-version-check';
import type { WSLPodmanVersionCheck } from '/@/checks/windows/wsl-podman-version-check';
import type { WSLVersionCheck } from '/@/checks/windows/wsl-version-check';
import type { WSL2Check } from '/@/checks/windows/wsl2-check';

import { WinPlatform } from './win-platform';

vi.mock(import('node:fs/promises'));

const EXTENSION_CONTEXT_MOCK = {} as ExtensionContext;
const TELEMETRY_LOGGER_MOCK = {} as TelemetryLogger;

const WIN_BIT_CHECK_MOCK = { execute: vi.fn() } as unknown as WinBitCheck;
const WIN_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as WinVersionCheck;
const WIN_MEMORY_CHECK_MOCK = { execute: vi.fn() } as unknown as WinMemoryCheck;
const HYPERV_PODMAN_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as HyperVPodmanVersionCheck;
const HYPERV_CHECK_MOCK = { execute: vi.fn() } as unknown as HyperVCheck;
const VIRTUALIZATION_FIRMWARE_CHECK_MOCK = {
  title: 'BIOS Virtualization Enabled',
  execute: vi.fn(),
} as unknown as VirtualizationFirmwareCheck;
const VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK = { execute: vi.fn() } as unknown as VirtualMachinePlatformCheck;
const WSL_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as WSLVersionCheck;
const WSL2_CHECK_MOCK = { execute: vi.fn() } as unknown as WSL2Check;
const WSL_PODMAN_VERSION_CHECK_MOCK = {
  title: 'WSL Version for Podman',
  execute: vi.fn(),
} as unknown as WSLPodmanVersionCheck;

const SUCCESSFUL_CHECK_RESULT: CheckResult = { successful: true };
const FAILED_CHECK_RESULT: CheckResult = { successful: false };

let winPlatform: WinPlatform;

beforeEach(() => {
  winPlatform = new WinPlatform(
    EXTENSION_CONTEXT_MOCK,
    TELEMETRY_LOGGER_MOCK,
    WIN_BIT_CHECK_MOCK,
    WIN_VERSION_CHECK_MOCK,
    WIN_MEMORY_CHECK_MOCK,
    HYPERV_PODMAN_VERSION_CHECK_MOCK,
    HYPERV_CHECK_MOCK,
    VIRTUALIZATION_FIRMWARE_CHECK_MOCK,
    VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK,
    WSL_VERSION_CHECK_MOCK,
    WSL2_CHECK_MOCK,
    WSL_PODMAN_VERSION_CHECK_MOCK,
  );
});

test('getPreflightChecks should include a warning-wrapped BIOS virtualization check', () => {
  const checks = winPlatform.getPreflightChecks();
  expect(checks).toHaveLength(7);
  expect(checks[3]).toBeInstanceOf(WarningCheck);
  expect(checks[3].title).toEqual('BIOS Virtualization Enabled');
});

test('getPreflightChecks should include a warning-wrapped WSL check for the bundled Podman version', async () => {
  vi.mocked(WSL_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);

  const checks = winPlatform.getPreflightChecks();

  expect(checks[6]).toBeInstanceOf(WarningCheck);
  expect(checks[6].title).toEqual('WSL Version for Podman');
  await expect(checks[6].execute()).resolves.toEqual({ successful: false, severity: 'warning' });
});

test('getUpdatePreflightChecks should only include a warning-wrapped WSL check for the bundled Podman version', async () => {
  vi.mocked(WSL_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);

  const checks = winPlatform.getUpdatePreflightChecks();

  expect(checks).toHaveLength(1);
  expect(checks[0]).toBeInstanceOf(WarningCheck);
  expect(checks[0].title).toEqual('WSL Version for Podman');
  await expect(checks[0].execute()).resolves.toEqual({ successful: false, severity: 'warning' });
});

test('isHyperVEnabled should return false if it is not a Windows environment', async () => {
  vi.mocked(extensionApi.env).isWindows = false;

  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeFalsy();
});

test('isHyperVEnabled should return false if Hyper-V check fails', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(HYPERV_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);
  vi.mocked(HYPERV_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);

  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeFalsy();
});

test('isHyperVEnabled should return true if all Hyper-V checks succeed', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(HYPERV_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(HYPERV_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeTruthy();
});

test('isHyperVEnabled is independent of BIOS virtualization firmware check', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VIRTUALIZATION_FIRMWARE_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);
  vi.mocked(HYPERV_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(HYPERV_PODMAN_VERSION_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeTruthy();
  expect(VIRTUALIZATION_FIRMWARE_CHECK_MOCK.execute).not.toHaveBeenCalled();
});

test('isWSLEnabled should return false if not on Windows', async () => {
  vi.mocked(extensionApi.env).isWindows = false;

  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return false if any WSL check fails', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(WSL_VERSION_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);
  vi.mocked(WSL2_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return true if all WSL checks succeed', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(WSL_VERSION_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(WSL2_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeTruthy();
});

test('isWSLEnabled is independent of BIOS virtualization firmware check', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VIRTUALIZATION_FIRMWARE_CHECK_MOCK.execute).mockResolvedValue(FAILED_CHECK_RESULT);
  vi.mocked(VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(WSL_VERSION_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(WSL2_CHECK_MOCK.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeTruthy();
  expect(VIRTUALIZATION_FIRMWARE_CHECK_MOCK.execute).not.toHaveBeenCalled();
});

describe('calcPipeName', () => {
  test.each([
    {
      machineName: 'my-machine',
      expectedPipeName: '//./pipe/podman-my-machine',
      description: 'should prepend "podman-" if machine name does not start with "podman"',
    },
    {
      machineName: 'podman-machine',
      expectedPipeName: '//./pipe/podman-machine',
      description: 'should not prepend "podman-" if machine name already starts with "podman"',
    },
    {
      machineName: 'podman',
      expectedPipeName: '//./pipe/podman',
      description: 'should handle machine name that is just "podman"',
    },
  ])('$description', ({ machineName, expectedPipeName }) => {
    const result = winPlatform.calcPipeName(machineName);
    expect(result).toBe(expectedPipeName);
  });
});

describe('API socket', () => {
  const SOCKET_PATH = 'C:\\Users\\foo\\AppData\\Local\\Temp\\podman\\podman-machine-default-api.sock';
  const loggerMock = { log: vi.fn(), warn: vi.fn() } as unknown as Logger;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('TEMP', 'C:\\Users\\foo\\AppData\\Local\\Temp');
    vi.stubEnv('LOCALAPPDATA', 'C:\\Users\\foo\\AppData\\Local');
  });

  test('getApiSocketPath uses %TEMP%\\podman', () => {
    expect(winPlatform.getApiSocketPath('podman-machine-default')).toBe(SOCKET_PATH);
  });

  test('getApiSocketPath falls back to %LOCALAPPDATA%\\Temp\\podman when TEMP is not set', () => {
    vi.stubEnv('TEMP', undefined);
    expect(winPlatform.getApiSocketPath('podman-machine-default')).toBe(SOCKET_PATH);
  });

  test('getApiSocketPath returns undefined when neither TEMP nor LOCALAPPDATA is set', () => {
    vi.stubEnv('TEMP', undefined);
    vi.stubEnv('LOCALAPPDATA', undefined);
    expect(winPlatform.getApiSocketPath('podman-machine-default')).toBeUndefined();
  });

  test('removeStaleApiSocket removes the socket file and logs it', async () => {
    vi.mocked(unlink).mockResolvedValue(undefined);

    const result = await winPlatform.removeStaleApiSocket('podman-machine-default', loggerMock);

    expect(result).toBe(true);
    expect(unlink).toHaveBeenCalledWith(SOCKET_PATH);
    expect(loggerMock.log).toHaveBeenCalledWith(`Removed stale API socket ${SOCKET_PATH}`);
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  test('removeStaleApiSocket does not unlink anything when the socket path cannot be located', async () => {
    vi.stubEnv('TEMP', undefined);
    vi.stubEnv('LOCALAPPDATA', undefined);

    const result = await winPlatform.removeStaleApiSocket('podman-machine-default', loggerMock);

    expect(result).toBe(false);
    expect(unlink).not.toHaveBeenCalled();
    expect(loggerMock.warn).toHaveBeenCalledWith(
      'Unable to locate the API socket: neither TEMP nor LOCALAPPDATA is set',
    );
  });

  test('removeStaleApiSocket does nothing when the socket file does not exist', async () => {
    vi.mocked(unlink).mockRejectedValue(Object.assign(new Error('not found'), { code: 'ENOENT' }));

    const result = await winPlatform.removeStaleApiSocket('podman-machine-default', loggerMock);

    expect(result).toBe(false);
    expect(loggerMock.log).not.toHaveBeenCalled();
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  test('removeStaleApiSocket does not throw when the socket file cannot be removed', async () => {
    const error = Object.assign(new Error('busy'), { code: 'EBUSY' });
    vi.mocked(unlink).mockRejectedValue(error);

    await expect(winPlatform.removeStaleApiSocket('podman-machine-default', loggerMock)).resolves.toBe(false);

    expect(loggerMock.log).not.toHaveBeenCalled();
    expect(loggerMock.warn).toHaveBeenCalledWith(`Unable to remove stale API socket ${SOCKET_PATH}`, error);
  });
});
