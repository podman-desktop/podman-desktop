/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { context, env } from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { HYPERV_PREP_NOT_APPLIED_KEY, HYPERV_PREP_SUPPORTED_KEY } from '/@/constants';
import {
  getHyperVPrepStatus,
  isHyperVPrepSupported,
  parseHyperVPrepStatus,
  refreshHyperVPrepContext,
  runHyperVPrep,
} from '/@/hyperv/hyperv-prep';
import type { PodmanBinary } from '/@/utils/podman-binary';
import { execPodman } from '/@/utils/util';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/utils/util'));

const podmanBinaryMock: PodmanBinary = {
  getBinaryInfo: vi.fn(),
} as unknown as PodmanBinary;

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(env).isWindows = true;
});

describe('parseHyperVPrepStatus', () => {
  test.each([
    {
      name: 'returns applied when group member and registry entries exist',
      stdout: `Hyper-V Administrators group membership: yes
VSock registry entries in GuestCommunicationServices: 2`,
      expectedStatus: 'applied',
    },
    {
      name: 'returns notApplied when user is not a group member',
      stdout: 'Hyper-V Administrators group membership: no',
      expectedStatus: 'notApplied',
    },
    {
      name: 'returns notApplied for Podman 6 status output before prep',
      stdout: `Hyper-V vsock registry entries:
  No vsock registry entries found.
Hyper-V Administrators group membership:
  Current user is NOT a member`,
      expectedStatus: 'notApplied',
    },
    {
      name: 'returns applied when registry entries exist before group membership is visible',
      stdout: `Hyper-V vsock registry entries:
  GuestCommunicationServices VSock registry entries: 2
Hyper-V Administrators group membership:
  Current user is NOT a member`,
      expectedStatus: 'applied',
    },
    {
      name: 'returns applied when user is a group member',
      stdout: `Hyper-V vsock registry entries:
  No vsock registry entries found.
Hyper-V Administrators group membership:
  Current user is a member`,
      expectedStatus: 'applied',
    },
  ])('$name', ({ stdout, expectedStatus }) => {
    expect(parseHyperVPrepStatus(stdout).status).toBe(expectedStatus);
  });

  test('parses legacy applied status output', () => {
    expect(
      parseHyperVPrepStatus(
        'Hyper-V Administrators group membership: yes\nGuestCommunicationServices VSock registry entries: 2',
      ),
    ).toMatchObject({
      status: 'applied',
      isGroupMember: true,
      hasRegistryEntries: true,
    });
  });

  test('describes group membership', () => {
    expect(
      parseHyperVPrepStatus(`Hyper-V vsock registry entries:
  No vsock registry entries found.
Hyper-V Administrators group membership:
  Current user is NOT a member`).summary,
    ).toBe('You are not a member of the Hyper-V Administrators group.');
  });
});

describe('isHyperVPrepSupported', () => {
  test.each([
    { name: 'returns false on non-Windows', isWindows: false, version: '6.0.0', expected: false },
    { name: 'returns false for Podman 5', isWindows: true, version: '5.4.0', expected: false },
    { name: 'returns true for Podman 6', isWindows: true, version: '6.0.0', expected: true },
  ])('$name', async ({ isWindows, version, expected }) => {
    vi.mocked(env).isWindows = isWindows;
    vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version });

    expect(await isHyperVPrepSupported(podmanBinaryMock)).toBe(expected);
  });
});

describe('getHyperVPrepStatus', () => {
  beforeEach(() => {
    vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version: '6.0.0' });
  });

  test.each([{ message: 'unknown command' }, { message: 'unrecognized subcommand' }])(
    'throws when podman reports "$message"',
    async ({ message }) => {
      vi.mocked(execPodman).mockRejectedValue({
        message,
        stderr: '',
        stdout: '',
      });

      await expect(getHyperVPrepStatus()).rejects.toMatchObject({ message });
    },
  );
});

describe('refreshHyperVPrepContext', () => {
  beforeEach(() => {
    vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version: '6.0.0' });
  });

  test('hides buttons when Podman is older than version 6', async () => {
    vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version: '5.4.0' });

    const status = await refreshHyperVPrepContext(podmanBinaryMock);

    expect(status).toBeUndefined();
    expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, false);
    expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, false);
    expect(execPodman).not.toHaveBeenCalled();
  });

  test.each([{ message: 'unknown command' }, { message: 'unrecognized subcommand' }])(
    'hides buttons when podman reports "$message"',
    async ({ message }) => {
      vi.mocked(execPodman).mockRejectedValue({
        message,
        stderr: '',
        stdout: '',
      });

      const status = await refreshHyperVPrepContext(podmanBinaryMock);

      expect(status).toBeUndefined();
      expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, false);
      expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, false);
    },
  );

  test.each([
    {
      name: 'sets context keys when prep is not applied',
      stdout: 'Hyper-V Administrators group membership: no',
      expectedStatus: 'notApplied',
      prepNotApplied: true,
    },
    {
      name: 'hides the action when prep is complete',
      stdout: 'Hyper-V Administrators group membership: yes\nGuestCommunicationServices VSock registry entries: 2',
      expectedStatus: 'applied',
      prepNotApplied: false,
    },
  ])('$name', async ({ stdout, expectedStatus, prepNotApplied }) => {
    vi.mocked(execPodman).mockResolvedValue({
      stdout,
      stderr: '',
      command: 'podman system hyperv-prep --status',
    });

    const status = await refreshHyperVPrepContext(podmanBinaryMock);

    expect(status?.status).toBe(expectedStatus);
    expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, true);
    expect(context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, prepNotApplied);
  });
});

describe('runHyperVPrep', () => {
  test('executes podman system hyperv-prep with admin privileges', async () => {
    vi.mocked(execPodman).mockResolvedValue({
      stdout: '',
      stderr: '',
      command: 'podman system hyperv-prep',
    });

    await runHyperVPrep();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  });
});
