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

import type { PowerShellClient } from '/@/utils/powershell';
import { getPowerShellClient } from '/@/utils/powershell';

import { UserAdminCheck } from './user-admin-check';

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

test('expect UserAdminCheck preflight check return failure result if non admin user', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(false);

  const userAdminCheck = new UserAdminCheck(mockTelemetryLogger);
  const result = await userAdminCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('You must have administrative rights to run Hyper-V Podman machines');
  expect(result.docLinks?.[0].url).equal(
    'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
  );
  expect(result.docLinks?.[0].title).equal('Hyper-V Manual Installation Steps');
});

test('expect UserAdminCheck preflight check return OK if user is admin', async () => {
  vi.mocked(POWERSHELL_CLIENT.isUserAdmin).mockResolvedValue(true);

  const userAdminCheck = new UserAdminCheck(mockTelemetryLogger);
  const result = await userAdminCheck.execute();
  expect(result.successful).toBeTruthy();
  expect(result.description).toBeUndefined();
  expect(result.docLinks).toBeUndefined();
});
