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
import type { CheckResult } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { PodmanDesktopElevatedCheck } from '/@/checks/windows/podman-desktop-elevated-check';
import type { PowerShellClient } from '/@/utils/powershell';
import { getPowerShellClient } from '/@/utils/powershell';

import { HyperVCheck } from './hyper-v-check';
import type { HyperVInstalledCheck } from './hyper-v-installed-check';
import type { HyperVRunningCheck } from './hyper-v-running-check';
import type { UserAdminCheck } from './user-admin-check';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('../../utils/powershell'), () => ({
  getPowerShellClient: vi.fn(),
}));

const isHyperVRunningCheck = { execute: vi.fn() } as unknown as HyperVRunningCheck;
const isHyperVInstalledCheck = { execute: vi.fn() } as unknown as HyperVInstalledCheck;
const isPodmanDesktopElevatedCheck = { execute: vi.fn() } as unknown as PodmanDesktopElevatedCheck;
const userAdminCheck = { execute: vi.fn() } as unknown as UserAdminCheck;

const SUCCESSFUL_CHECK_RESULT: CheckResult = { successful: true };
const FAILED_CHECK_RESULT: CheckResult = { successful: false };

let hyperVCheck: HyperVCheck;

const POWERSHELL_CLIENT: PowerShellClient = {
  isUserAdmin: vi.fn(),
  isHyperVInstalled: vi.fn(),
  isVirtualMachineAvailable: vi.fn(),
  isRunningElevated: vi.fn(),
  isHyperVRunning: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getPowerShellClient).mockResolvedValue(POWERSHELL_CLIENT);
  hyperVCheck = new HyperVCheck(
    isHyperVRunningCheck,
    isHyperVInstalledCheck,
    isPodmanDesktopElevatedCheck,
    userAdminCheck,
  );
});

test('expect HyperV preflight check return failure result if non admin user', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'userAdminCheck',
  });
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('userAdminCheck');
});

test('expect HyperV preflight check return failure result if Podman Desktop is not run with elevated privileges', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isPodmanDesktopElevatedCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isPodmanDesktopElevatedCheck');
  expect(result.docLinks).toBeUndefined();
});

test('expect HyperV preflight check return failure result if HyperV not installed', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isHyperVInstalledCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isHyperVInstalledCheck');
});

test('expect HyperV preflight check return failure result if HyperV not running', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVRunningCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isHyperVRunningCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isHyperVRunningCheck');
});

test('expect HyperV preflight check return OK', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVRunningCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeTruthy();
  expect(result.description).toBeUndefined();
  expect(result.docLinks?.[0].url).toBeUndefined();
  expect(result.docLinks?.[0].title).toBeUndefined();
});
