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
import type { TelemetryLogger } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { PowerShellClient } from '../../utils/powershell';
import { getPowerShellClient } from '../../utils/powershell';
import { HyperVCheck } from './hyperv-check';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('../../utils/powershell'), () => ({
  getPowerShellClient: vi.fn(),
}));

const mockTelemetryLogger = {} as TelemetryLogger;

const POWERSHELL_CLIENT: PowerShellClient = {
  isUserAdmin: vi.fn(),
  isHyperVInstalled: vi.fn(),
  isHyperVRunning: vi.fn(),
  isVirtualMachineAvailable: vi.fn(),
  isRunningElevated: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getPowerShellClient).mockResolvedValue(POWERSHELL_CLIENT);
});

test('expect HyperV preflight check return failure result if non admin user', async () => {
  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('You must have administrative rights to run Hyper-V Podman machines');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return failure result if Podman Desktop is not run with elevated privileges', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(true);

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal(
    'You must run Podman Desktop with administrative rights to run Hyper-V Podman machines.',
  );
  expect(result.docLinks).toBeUndefined();
});

test('expect HyperV preflight check return failure result if HyperV not installed', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isRunningElevated).mockResolvedValue(true);

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('Hyper-V is not installed on your system.');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return failure result if HyperV not running', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isRunningElevated).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isHyperVInstalled).mockResolvedValue(true);

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('Hyper-V is not running on your system.');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect HyperV preflight check return OK', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isRunningElevated).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isHyperVInstalled).mockResolvedValue(true);
  vi.mocked(POWERSHELL_CLIENT.isHyperVRunning).mockResolvedValue(true);

  const hyperVCheck = new HyperVCheck(mockTelemetryLogger);
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeTruthy();
  expect(result.description).toBeUndefined();
  expect(result.docLinks?.[0].url).toBeUndefined();
  expect(result.docLinks?.[0].title).toBeUndefined();
});
