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

import { HyperVCheck } from './hyperv-check';
import type { HyperVInstalledCheck } from './hyperv-installed-check';
import type { HyperVRunningCheck } from './hyperv-running-check';
import type { PodmanDesktopElevatedCheck } from './podman-desktop-elevated-check';
import type { UserAdminCheck } from './user-admin-check';

vi.mock(import('@podman-desktop/api'));

let hyperVCheck: HyperVCheck;

const SUCCESSFUL_CHECK_RESULT: CheckResult = { successful: true };
const FAILED_CHECK_RESULT: CheckResult = { successful: false };

const isUserAdminCheck = { execute: vi.fn() } as unknown as UserAdminCheck;
const isPodmanDesktopElevatedCheck = { execute: vi.fn() } as unknown as PodmanDesktopElevatedCheck;
const isHyperVInstalledCheck = { execute: vi.fn() } as unknown as HyperVInstalledCheck;
const isHyperVRunningCheck = { execute: vi.fn() } as unknown as HyperVRunningCheck;

beforeEach(() => {
  vi.resetAllMocks();

  vi.spyOn(isUserAdminCheck, 'execute').mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.spyOn(isPodmanDesktopElevatedCheck, 'execute').mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.spyOn(isHyperVInstalledCheck, 'execute').mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  vi.spyOn(isHyperVRunningCheck, 'execute').mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  hyperVCheck = new HyperVCheck(
    isUserAdminCheck,
    isPodmanDesktopElevatedCheck,
    isHyperVInstalledCheck,
    isHyperVRunningCheck,
  );
});

test('expect HyperV preflight check return failure result if non admin user', async () => {
  vi.spyOn(isUserAdminCheck, 'execute').mockResolvedValue({ ...FAILED_CHECK_RESULT, description: 'isUserAdminCheck' });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isUserAdminCheck');
});

test('expect HyperV preflight check return failure result if Podman Desktop is not run with elevated privileges', async () => {
  vi.spyOn(isPodmanDesktopElevatedCheck, 'execute').mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isPodmanDesktopElevatedCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isPodmanDesktopElevatedCheck');
  expect(result.docLinks).toBeUndefined();
});

test('expect HyperV preflight check return failure result if HyperV not installed', async () => {
  vi.spyOn(isHyperVInstalledCheck, 'execute').mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isHyperVInstalledCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isHyperVInstalledCheck');
});

test('expect HyperV preflight check return failure result if HyperV not running', async () => {
  vi.spyOn(isHyperVRunningCheck, 'execute').mockResolvedValue({
    ...FAILED_CHECK_RESULT,
    description: 'isHyperVRunningCheck',
  });

  const result = await hyperVCheck.execute();
  expect(result.successful).toBeFalsy();
  expect(result.description).equal('isHyperVRunningCheck');
});

test('expect HyperV preflight check return OK', async () => {
  const result = await hyperVCheck.execute();
  expect(result.successful).toBeTruthy();
  expect(result.description).toBeUndefined();
  expect(result.docLinks?.[0].url).toBeUndefined();
  expect(result.docLinks?.[0].title).toBeUndefined();
});
