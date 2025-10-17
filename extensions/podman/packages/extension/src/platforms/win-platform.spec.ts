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
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { ExtensionContext, TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { expect, test, vi } from 'vitest';

import { HyperVCheck } from '../checks/windows/hyperv-check';
import { HyperVPodmanVersionCheck } from '../checks/windows/hyperv-podman-version-check';
import { VirtualMachinePlatformCheck } from '../checks/windows/virtual-machine-platform-check';
import { WSLVersionCheck } from '../checks/windows/wsl-version-check';
import { WSL2Check } from '../checks/windows/wsl2-check';
import { WinPlatform } from './win-platform';

vi.mock('@podman-desktop/api', () => ({ env: { isWindows: false } }));

vi.mock(import('../checks/windows/hyperv-check'));
vi.mock(import('../checks/windows/hyperv-podman-version-check'));
vi.mock(import('../checks/windows/virtual-machine-platform-check'));
vi.mock(import('../checks/windows/wsl-version-check'));
vi.mock(import('../checks/windows/wsl2-check'));

const extensionContextMock = {} as ExtensionContext;
const telemetryLoggerMock = {} as TelemetryLogger;

const successfulCheckResult = { successful: true };
const failedCheckResult = { successful: false };

test('isHyperVEnabled should return false if it is not a Windows environment', async () => {
  vi.mocked(extensionApi.env).isWindows = false;

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeFalsy();
});

test('isHyperVEnabled should return false if Hyper-V check fails', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(HyperVCheck.prototype.execute).mockResolvedValue(failedCheckResult);
  vi.mocked(HyperVPodmanVersionCheck.prototype.execute).mockResolvedValue(failedCheckResult);

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeFalsy();
});

test('isHyperVEnabled should return true if all Hyper-V checks succeed', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(HyperVCheck.prototype.execute).mockResolvedValue(successfulCheckResult);
  vi.mocked(HyperVPodmanVersionCheck.prototype.execute).mockResolvedValue(successfulCheckResult);

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const hypervEnabled = await winPlatform.isHyperVEnabled();

  expect(hypervEnabled).toBeTruthy();
});

test('isWSLEnabled should return false if not on Windows', async () => {
  vi.mocked(extensionApi.env).isWindows = false;

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return false if any WSL check fails', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VirtualMachinePlatformCheck.prototype.execute).mockResolvedValue(successfulCheckResult);
  vi.mocked(WSLVersionCheck.prototype.execute).mockResolvedValue(failedCheckResult);
  vi.mocked(WSL2Check.prototype.execute).mockResolvedValue(successfulCheckResult);

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeFalsy();
});

test('isWSLEnabled should return true if all WSL checks succeed', async () => {
  vi.mocked(extensionApi.env).isWindows = true;

  vi.mocked(VirtualMachinePlatformCheck.prototype.execute).mockResolvedValue(successfulCheckResult);
  vi.mocked(WSLVersionCheck.prototype.execute).mockResolvedValue(successfulCheckResult);
  vi.mocked(WSL2Check.prototype.execute).mockResolvedValue(successfulCheckResult);

  const winPlatform = new WinPlatform(extensionContextMock, telemetryLoggerMock);
  const wslEnabled = await winPlatform.isWSLEnabled();

  expect(wslEnabled).toBeTruthy();
});
