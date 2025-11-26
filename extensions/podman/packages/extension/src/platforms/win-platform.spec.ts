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

import type { CheckResult, ExtensionContext, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { HyperVCheck } from '/@/checks/windows/hyper-v-check';
import type { HyperVPodmanVersionCheck } from '/@/checks/windows/hyper-v-podman-version-check';
import type { VirtualMachinePlatformCheck } from '/@/checks/windows/virtual-machine-platform-check';
import type { WinBitCheck } from '/@/checks/windows/win-bit-check';
import type { WinMemoryCheck } from '/@/checks/windows/win-memory-check';
import type { WinVersionCheck } from '/@/checks/windows/win-version-check';
import type { WSLVersionCheck } from '/@/checks/windows/wsl-version-check';
import type { WSL2Check } from '/@/checks/windows/wsl2-check';

import { WinPlatform } from './win-platform';

const EXTENSION_CONTEXT_MOCK = {} as ExtensionContext;
const TELEMETRY_LOGGER_MOCK = {} as TelemetryLogger;

const WIN_BIT_CHECK_MOCK = { execute: vi.fn() } as unknown as WinBitCheck;
const WIN_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as WinVersionCheck;
const WIN_MEMORY_CHECK_MOCK = { execute: vi.fn() } as unknown as WinMemoryCheck;
const HYPERV_PODMAN_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as HyperVPodmanVersionCheck;
const HYPERV_CHECK_MOCK = { execute: vi.fn() } as unknown as HyperVCheck;
const VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK = { execute: vi.fn() } as unknown as VirtualMachinePlatformCheck;
const WSL_VERSION_CHECK_MOCK = { execute: vi.fn() } as unknown as WSLVersionCheck;
const WSL2_CHECK_MOCK = { execute: vi.fn() } as unknown as WSL2Check;

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
    VIRTUAL_MACHINE_PLATFORM_CHECK_MOCK,
    WSL_VERSION_CHECK_MOCK,
    WSL2_CHECK_MOCK,
  );
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

describe('calcPipeName', () => {
  test('calcPipeName should prepend "podman-" if machine name does not start with "podman"', () => {
    const machineName = 'my-machine';
    const expectedPipeName = '//./pipe/podman-my-machine';
    const result = winPlatform.calcPipeName(machineName);
    expect(result).toBe(expectedPipeName);
  });

  test('calcPipeName should not prepend "podman-" if machine name already starts with "podman"', () => {
    const machineName = 'podman-machine';
    const expectedPipeName = '//./pipe/podman-machine';
    const result = winPlatform.calcPipeName(machineName);
    expect(result).toBe(expectedPipeName);
  });

  test('calcPipeName should handle machine name that is just "podman"', () => {
    const machineName = 'podman';
    const expectedPipeName = '//./pipe/podman';
    const result = winPlatform.calcPipeName(machineName);
    expect(result).toBe(expectedPipeName);
  });
});
