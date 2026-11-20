/**********************************************************************
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
 ***********************************************************************/
import type { CheckResult } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { PodmanDesktopElevatedCheck } from '/@/checks/windows/podman-desktop-elevated-check';
import { HyperVPrep } from '/@/platforms/windows/hyperv-prep';
import type { PowerShellClient } from '/@/utils/powershell';
import { getPowerShellClient } from '/@/utils/powershell';

import { HyperVCheck } from './hyper-v-check';
import type { HyperVInstalledCheck } from './hyper-v-installed-check';
import type { HyperVRunningCheck } from './hyper-v-running-check';
import type { UserAdminCheck } from './user-admin-check';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/platforms/windows/hyperv-prep'));
vi.mock(import('/@/utils/powershell'), () => ({
  getPowerShellClient: vi.fn(),
}));

const isHyperVRunningCheck = { execute: vi.fn() } as unknown as HyperVRunningCheck;
const isHyperVInstalledCheck = { execute: vi.fn() } as unknown as HyperVInstalledCheck;
const isPodmanDesktopElevatedCheck = { execute: vi.fn() } as unknown as PodmanDesktopElevatedCheck;
const userAdminCheck = { execute: vi.fn() } as unknown as UserAdminCheck;
const hyperVPrep = new HyperVPrep();

const SUCCESSFUL_CHECK_RESULT: CheckResult = { successful: true };
const FAILED_CHECK_RESULT: CheckResult = { successful: false };

let hyperVCheck: HyperVCheck;

const POWERSHELL_CLIENT: PowerShellClient = {
  isUserAdmin: vi.fn(),
  isHyperVInstalled: vi.fn(),
  isVirtualMachineAvailable: vi.fn(),
  isVirtualizationFirmwareEnabled: vi.fn(),
  isHypervisorPresent: vi.fn(),
  isRunningElevated: vi.fn(),
  isHyperVRunning: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(HyperVPrep.prototype.isCurrentUserHyperVAdminGroupMember).mockResolvedValue(false);
  vi.mocked(getPowerShellClient).mockResolvedValue(POWERSHELL_CLIENT);
  hyperVCheck = new HyperVCheck(
    isHyperVRunningCheck,
    isHyperVInstalledCheck,
    isPodmanDesktopElevatedCheck,
    userAdminCheck,
    hyperVPrep,
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

test('uses supported group membership when the user is not in Windows Administrators', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'userAdminCheck',
  });
  vi.mocked(hyperVPrep.isCurrentUserHyperVAdminGroupMember).mockResolvedValue(true);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVRunningCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await hyperVCheck.execute();

  expect(result.successful).toBe(true);
  expect(hyperVPrep.isCurrentUserHyperVAdminGroupMember).toHaveBeenCalledOnce();
  expect(isPodmanDesktopElevatedCheck.execute).not.toHaveBeenCalled();
  expect(isHyperVInstalledCheck.execute).toHaveBeenCalledOnce();
  expect(isHyperVRunningCheck.execute).toHaveBeenCalledOnce();
});

test('uses supported group membership when Podman Desktop is not elevated', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isPodmanDesktopElevatedCheck',
  });
  vi.mocked(hyperVPrep.isCurrentUserHyperVAdminGroupMember).mockResolvedValue(true);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVRunningCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await hyperVCheck.execute();

  expect(result.successful).toBe(true);
  expect(hyperVPrep.isCurrentUserHyperVAdminGroupMember).toHaveBeenCalledOnce();
  expect(isHyperVInstalledCheck.execute).toHaveBeenCalledOnce();
  expect(isHyperVRunningCheck.execute).toHaveBeenCalledOnce();
});

test('returns the original permission failure when group membership is false', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'userAdminCheck',
  });
  vi.mocked(hyperVPrep.isCurrentUserHyperVAdminGroupMember).mockResolvedValue(false);

  const result = await hyperVCheck.execute();

  expect(result.successful).toBe(false);
  expect(result.description).toBe('userAdminCheck');
  expect(hyperVPrep.isCurrentUserHyperVAdminGroupMember).toHaveBeenCalledOnce();
  expect(isHyperVInstalledCheck.execute).not.toHaveBeenCalled();
  expect(isHyperVRunningCheck.execute).not.toHaveBeenCalled();
});

test('returns the original permission failure when HyperVPrep is not available', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'userAdminCheck',
  });
  const checkWithoutHyperVPrep = new HyperVCheck(
    isHyperVRunningCheck,
    isHyperVInstalledCheck,
    isPodmanDesktopElevatedCheck,
    userAdminCheck,
  );

  const result = await checkWithoutHyperVPrep.execute();

  expect(result.successful).toBe(false);
  expect(result.description).toBe('userAdminCheck');
  expect(isHyperVInstalledCheck.execute).not.toHaveBeenCalled();
});

test('still fails when Hyper-V is unavailable after group membership succeeds', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'userAdminCheck',
  });
  vi.mocked(hyperVPrep.isCurrentUserHyperVAdminGroupMember).mockResolvedValue(true);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isHyperVInstalledCheck',
  });

  const result = await hyperVCheck.execute();

  expect(result.successful).toBe(false);
  expect(result.description).toBe('isHyperVInstalledCheck');
  expect(isHyperVRunningCheck.execute).not.toHaveBeenCalled();
});

test('does not check group membership when existing permissions succeed', async () => {
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isPodmanDesktopElevatedCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVInstalledCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.mocked(isHyperVRunningCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await hyperVCheck.execute();

  expect(result.successful).toBe(true);
  expect(hyperVPrep.isCurrentUserHyperVAdminGroupMember).not.toHaveBeenCalled();
});
