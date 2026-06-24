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

import type { TelemetryLogger } from '@podman-desktop/api';
import { process as processAPI } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { PowerShellClient } from './powershell';
import { getPowerShellClient } from './powershell';

vi.mock(import('@podman-desktop/api'));

const TELEMETRY_LOGGER_MOCK = {
  logUsage: vi.fn(),
} as unknown as TelemetryLogger;

beforeEach(() => {
  vi.clearAllMocks();
});

interface IsUserAdminTestCase {
  name: string;
  stdout: string;
  expected: boolean;
}

describe('PowerShellClient#isUserAdmin', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
  });

  test.each<IsUserAdminTestCase>([
    {
      name: 'should return true when user is admin',
      stdout: 'True',
      expected: true,
    },
    {
      name: 'should return true when user is admin with extra whitespace\n',
      stdout: '\r  True  \n',

      expected: true,
    },
    {
      name: 'should return false when user is not admin',
      stdout: 'False',
      expected: false,
    },
    {
      name: 'should return false with unrecognised stdout',
      stdout: 'foo bar',
      expected: false,
    },
  ])('$name', async ({ stdout, expected }) => {
    vi.mocked(processAPI.exec).mockResolvedValue({
      stdout: stdout,
      stderr: '',
      command: 'powershell.exe',
    });

    const result = await client.isUserAdmin();
    expect(result).toBe(expected);
  });

  test('should return false when exec throws error', async () => {
    vi.mocked(processAPI.exec).mockRejectedValue(new Error('Command failed'));

    const result = await client.isUserAdmin();

    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PS flags: every exec call must include -NoProfile -NonInteractive -Command
// ---------------------------------------------------------------------------

const PS_FLAGS = ['-NoProfile', '-NonInteractive', '-Command'];

describe('PowerShellClient PS flags', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout: '', stderr: '', command: 'powershell.exe' });
  });

  test.each<{ method: string; call: (c: PowerShellClient) => Promise<unknown> }>([
    { method: 'isUserAdmin', call: (c: PowerShellClient): Promise<unknown> => c.isUserAdmin() },
    {
      method: 'isVirtualMachineAvailable',
      call: (c: PowerShellClient): Promise<unknown> => c.isVirtualMachineAvailable(),
    },
    { method: 'isHyperVInstalled', call: (c: PowerShellClient): Promise<unknown> => c.isHyperVInstalled() },
    { method: 'isHyperVRunning', call: (c: PowerShellClient): Promise<unknown> => c.isHyperVRunning() },
    { method: 'isRunningElevated', call: (c: PowerShellClient): Promise<unknown> => c.isRunningElevated() },
  ])('$method passes -NoProfile -NonInteractive -Command', async ({ call }) => {
    await call(client);
    const [exe, args] = vi.mocked(processAPI.exec).mock.calls[0];
    expect(exe).toBe('powershell.exe');
    expect(args).toEqual(expect.arrayContaining(PS_FLAGS));
  });
});

// ---------------------------------------------------------------------------
// Coverage for methods not tested above
// ---------------------------------------------------------------------------

describe('PowerShellClient#isVirtualMachineAvailable', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
  });

  test('should return true when stdout contains VirtualMachinePlatform', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({
      stdout: 'VirtualMachinePlatform',
      stderr: '',
      command: 'powershell.exe',
    });

    expect(await client.isVirtualMachineAvailable()).toBe(true);
  });

  test('should return false when stdout does not contain VirtualMachinePlatform', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout: 'SomeOtherFeature', stderr: '', command: 'powershell.exe' });

    expect(await client.isVirtualMachineAvailable()).toBe(false);
  });

  test('should return false and record telemetry when exec throws', async () => {
    const error = Object.assign(new Error('exec failed'), {
      exitCode: 1,
      stdout: '',
      stderr: 'error output',
      cancelled: false,
      killed: false,
      command: 'powershell.exe',
    });
    vi.mocked(processAPI.exec).mockRejectedValue(error);

    expect(await client.isVirtualMachineAvailable()).toBe(false);
    expect(TELEMETRY_LOGGER_MOCK.logUsage).toHaveBeenCalledWith(
      'check.isVirtualMachineAvailable',
      expect.objectContaining({ error }),
    );
  });

  test('should not log telemetry when feature is found (early return path)', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({
      stdout: 'VirtualMachinePlatform',
      stderr: '',
      command: 'powershell.exe',
    });

    await client.isVirtualMachineAvailable();

    expect(TELEMETRY_LOGGER_MOCK.logUsage).not.toHaveBeenCalled();
  });

  test('should log telemetry when feature is not found', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({
      stdout: 'SomeOtherFeature',
      stderr: 'warn',
      command: 'powershell.exe',
    });

    await client.isVirtualMachineAvailable();

    expect(TELEMETRY_LOGGER_MOCK.logUsage).toHaveBeenCalledWith(
      'check.isVirtualMachineAvailable',
      expect.objectContaining({ stdout: 'SomeOtherFeature', stderr: 'warn' }),
    );
  });
});

describe('PowerShellClient#isHyperVInstalled', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
  });

  test('should return true when Get-Service vmms succeeds', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout: '', stderr: '', command: 'powershell.exe' });

    expect(await client.isHyperVInstalled()).toBe(true);
  });

  test('should return false when exec throws', async () => {
    vi.mocked(processAPI.exec).mockRejectedValue(new Error('Cannot find service'));

    expect(await client.isHyperVInstalled()).toBe(false);
  });
});

describe('PowerShellClient#isHyperVRunning', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
  });

  test('should return true when service status is Running', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout: 'Running', stderr: '', command: 'powershell.exe' });

    expect(await client.isHyperVRunning()).toBe(true);
  });

  test.each([
    { name: 'should return false when status is Stopped', stdout: 'Stopped' },
    { name: 'should return false when status is empty', stdout: '' },
  ])('$name', async ({ stdout }) => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout, stderr: '', command: 'powershell.exe' });

    expect(await client.isHyperVRunning()).toBe(false);
  });

  test('should return false when exec throws', async () => {
    vi.mocked(processAPI.exec).mockRejectedValue(new Error('Cannot find service'));

    expect(await client.isHyperVRunning()).toBe(false);
  });
});

describe('PowerShellClient#isRunningElevated', () => {
  let client: PowerShellClient;

  beforeEach(async () => {
    client = await getPowerShellClient(TELEMETRY_LOGGER_MOCK);
  });

  test('should return true when process is elevated', async () => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout: 'True', stderr: '', command: 'powershell.exe' });

    expect(await client.isRunningElevated()).toBe(true);
  });

  test.each([
    { name: 'should return false when process is not elevated', stdout: 'False' },
    { name: 'should return false with surrounding whitespace', stdout: '  False\n' },
  ])('$name', async ({ stdout }) => {
    vi.mocked(processAPI.exec).mockResolvedValue({ stdout, stderr: '', command: 'powershell.exe' });

    expect(await client.isRunningElevated()).toBe(false);
  });

  test('should return false when exec throws', async () => {
    vi.mocked(processAPI.exec).mockRejectedValue(new Error('Access denied'));

    expect(await client.isRunningElevated()).toBe(false);
  });
});
