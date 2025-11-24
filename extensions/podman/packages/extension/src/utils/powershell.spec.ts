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
