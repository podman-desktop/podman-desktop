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

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { HYPERV_PREP_COMMAND } from '/@/constants';
import { HYPERV_PREP_RELOGIN_MESSAGE } from '/@/hyperv/hyperv-prep';
import { registerHyperVPrepCommands } from '/@/hyperv/hyperv-prep-command';
import type { PodmanBinary } from '/@/utils/podman-binary';
import { execPodman } from '/@/utils/util';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/utils/util'));

const podmanBinaryMock: PodmanBinary = {
  getBinaryInfo: vi.fn(),
} as unknown as PodmanBinary;

const TELEMETRY_LOGGER_MOCK = {
  logError: vi.fn(),
  logUsage: vi.fn(),
} as unknown as extensionApi.TelemetryLogger;

const APPLIED_STATUS_OUTPUT =
  'Hyper-V Administrators group membership: yes\nGuestCommunicationServices VSock registry entries: 2';
const NEEDED_STATUS_OUTPUT = 'Hyper-V Administrators group membership: no';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.env).isWindows = true;
  vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');
  vi.mocked(extensionApi.window.withProgress).mockImplementation((_options, task) => {
    return task({ report: vi.fn() }, {} as extensionApi.CancellationToken);
  });
  vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version: '6.0.0' });
});

describe('registerHyperVPrepCommands', () => {
  test('registers podman.hypervPrep', () => {
    registerHyperVPrepCommands(podmanBinaryMock, TELEMETRY_LOGGER_MOCK);

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(HYPERV_PREP_COMMAND, expect.any(Function));
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledTimes(1);
  });
});

describe('hypervPrep command handler', () => {
  async function runPrepareCommand(): Promise<void> {
    registerHyperVPrepCommands(podmanBinaryMock, TELEMETRY_LOGGER_MOCK);
    const callback = vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1];
    await callback();
  }

  test.each([
    {
      name: 'is a no-op on non-Windows',
      isWindows: false,
      podmanVersion: '6.0.0',
    },
    {
      name: 'is a no-op when Podman 6 is not available',
      isWindows: true,
      podmanVersion: '5.4.0',
    },
  ])('$name', async ({ isWindows, podmanVersion }) => {
    vi.mocked(extensionApi.env).isWindows = isWindows;
    vi.mocked(podmanBinaryMock.getBinaryInfo).mockResolvedValue({ version: podmanVersion });

    await runPrepareCommand();

    expect(execPodman).not.toHaveBeenCalled();
  });

  test('runs prep when needed and confirmed', async () => {
    vi.mocked(execPodman)
      .mockResolvedValueOnce({
        stdout: NEEDED_STATUS_OUTPUT,
        stderr: '',
        command: 'podman system hyperv-prep --status',
      })
      .mockResolvedValueOnce({
        stdout: '',
        stderr: '',
        command: 'podman system hyperv-prep',
      })
      .mockResolvedValueOnce({
        stdout: APPLIED_STATUS_OUTPUT,
        stderr: '',
        command: 'podman system hyperv-prep --status',
      });

    await runPrepareCommand();

    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      'Prepare Hyper-V now? Administrator approval (UAC) is required.',
      'Yes',
      'No',
    );
    expect(extensionApi.window.withProgress).toHaveBeenCalled();
    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
    expect(TELEMETRY_LOGGER_MOCK.logUsage).toHaveBeenCalledWith('podman.hypervPrep', { status: 'applied' });
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Hyper-V preparation applied.'),
    );
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining(HYPERV_PREP_RELOGIN_MESSAGE),
    );
  });

  test('skips prep when user declines confirmation', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('No');
    vi.mocked(execPodman).mockResolvedValue({
      stdout: NEEDED_STATUS_OUTPUT,
      stderr: '',
      command: 'podman system hyperv-prep --status',
    });

    await runPrepareCommand();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep', '--status']);
    expect(execPodman).not.toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  });

  test('shows status when prep is already applied', async () => {
    vi.mocked(execPodman).mockResolvedValue({
      stdout: APPLIED_STATUS_OUTPUT,
      stderr: '',
      command: 'podman system hyperv-prep --status',
    });

    await runPrepareCommand();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep', '--status']);
    expect(execPodman).not.toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Hyper-V preparation is already applied.'),
    );
  });

  test.each([{ message: 'Access is denied.' }, { message: 'operation was canceled' }])(
    'shows error when prep fails with "$message"',
    async ({ message }) => {
      vi.mocked(execPodman)
        .mockResolvedValueOnce({
          stdout: NEEDED_STATUS_OUTPUT,
          stderr: '',
          command: 'podman system hyperv-prep --status',
        })
        .mockRejectedValueOnce({
          message,
          stderr: '',
          stdout: '',
        });

      await runPrepareCommand();

      expect(extensionApi.window.showErrorMessage).toHaveBeenCalledWith(`Hyper-V preparation failed: ${message}`);
      expect(TELEMETRY_LOGGER_MOCK.logError).toHaveBeenCalledWith('hypervPrepFailed', { error: message });
    },
  );
});
