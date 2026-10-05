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

import type { TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { Container } from 'inversify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { HYPERV_PREP_COMMAND, HYPERV_PREP_NOT_APPLIED_KEY, HYPERV_PREP_SUPPORTED_KEY } from '/@/constants';
import { HyperVPrep } from '/@/hyperv/hyperv-prep';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { PodmanBinary } from '/@/utils/podman-binary';
import { execPodman } from '/@/utils/util';

vi.mock(import('@podman-desktop/api'));
vi.mock(import('/@/utils/util'));
vi.mock(import('/@/utils/podman-binary'));

const podmanBinaryMock = new PodmanBinary();

const telemetryLoggerMock = {
  logError: vi.fn(),
  logUsage: vi.fn(),
} as unknown as TelemetryLogger;

const APPLIED_STATUS_OUTPUT =
  'Hyper-V Administrators group membership: yes\nGuestCommunicationServices VSock registry entries: 2';

const NEEDED_STATUS_OUTPUT = 'Hyper-V Administrators group membership: no';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.env).isWindows = true;
  vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '6.0.0' });
  vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');
  vi.mocked(extensionApi.window.withProgress).mockImplementation((_options, task) => {
    return task({ report: vi.fn() }, {} as extensionApi.CancellationToken);
  });
  vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });
});

function createHyperVPrep(): HyperVPrep {
  const isWindows = vi.mocked(extensionApi.env).isWindows;
  vi.mocked(extensionApi.env).isWindows = false;

  const container = new Container();
  container.bind(PodmanBinary).toConstantValue(podmanBinaryMock);
  container.bind(TelemetryLoggerSymbol).toConstantValue(telemetryLoggerMock);
  container.bind(HyperVPrep).toSelf();

  let hyperVPrep: HyperVPrep;
  try {
    hyperVPrep = container.get(HyperVPrep);
  } finally {
    vi.mocked(extensionApi.env).isWindows = isWindows;
  }

  return hyperVPrep;
}

describe('HyperVPrep.parseStatus', () => {
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
      name: 'returns notApplied when registry entries exist but membership is not visible',
      stdout: `Hyper-V vsock registry entries:
  GuestCommunicationServices VSock registry entries: 2
Hyper-V Administrators group membership:
  Current user is NOT a member`,
      expectedStatus: 'notApplied',
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
    const hyperVPrep = createHyperVPrep();
    expect(hyperVPrep.parseStatus(stdout).status).toBe(expectedStatus);
  });

  test('parses legacy applied status output', () => {
    const hyperVPrep = createHyperVPrep();
    expect(
      hyperVPrep.parseStatus(
        'Hyper-V Administrators group membership: yes\nGuestCommunicationServices VSock registry entries: 2',
      ),
    ).toEqual({ status: 'applied' });
  });
});

describe('HyperVPrep.isSupported', () => {
  test.each([
    { name: 'returns false on non-Windows', isWindows: false, version: '6.0.0', expected: false },
    { name: 'returns false for Podman 5', isWindows: true, version: '5.4.0', expected: false },
    { name: 'returns true for Podman 6', isWindows: true, version: '6.0.0', expected: true },
  ])('$name', async ({ isWindows, version, expected }) => {
    vi.mocked(extensionApi.env).isWindows = isWindows;
    vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version });

    const hyperVPrep = createHyperVPrep();

    expect(await hyperVPrep.isSupported()).toBe(expected);
  });

  test.each(['not-a-version', '', '6'])('returns false for invalid Podman version %j', async version => {
    vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version });
    const hyperVPrep = createHyperVPrep();

    await expect(hyperVPrep.isSupported()).resolves.toBe(false);
  });
});

describe('HyperVPrep.getStatus', () => {
  test.each([{ message: 'access denied' }, { message: 'status unavailable' }])(
    'throws when podman reports "$message"',
    async ({ message }) => {
      vi.mocked(execPodman).mockRejectedValue({
        message,
        stderr: '',
        stdout: '',
      });

      const hyperVPrep = createHyperVPrep();

      await expect(hyperVPrep.getStatus()).rejects.toMatchObject({ message });
    },
  );
});

describe('HyperVPrep.refreshContext', () => {
  test('hides buttons when Podman is older than version 6', async () => {
    vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '5.4.0' });

    const hyperVPrep = createHyperVPrep();
    const status = await hyperVPrep.refreshContext();

    expect(status).toBeUndefined();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, false);
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, false);
    expect(execPodman).not.toHaveBeenCalled();
  });

  test.each([{ message: 'unknown command' }, { message: 'unrecognized subcommand' }])(
    'keeps the action available and records status-check failures for "$message"',
    async ({ message }) => {
      vi.mocked(execPodman).mockRejectedValue({
        message,
        stderr: '',
        stdout: '',
      });

      const hyperVPrep = createHyperVPrep();
      const status = await hyperVPrep.refreshContext();

      expect(status).toBeUndefined();
      expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, true);
      expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, true);
      expect(telemetryLoggerMock.logError).toHaveBeenCalledWith('hypervPrepStatusCheckFailed', {
        error: expect.objectContaining({ message }),
      });
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
    {
      name: 'keeps the action available when registry entries exist without group membership',
      stdout: `Hyper-V vsock registry entries:
  GuestCommunicationServices VSock registry entries: 2
Hyper-V Administrators group membership:
  Current user is NOT a member`,
      expectedStatus: 'notApplied',
      prepNotApplied: true,
    },
  ])('$name', async ({ stdout, expectedStatus, prepNotApplied }) => {
    vi.mocked(execPodman).mockResolvedValue({
      stdout,
      stderr: '',
      command: 'podman system hyperv-prep --status',
    });

    const hyperVPrep = createHyperVPrep();
    const status = await hyperVPrep.refreshContext();

    expect(status?.status).toBe(expectedStatus);
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, true);
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_NOT_APPLIED_KEY, prepNotApplied);
  });
});

describe('HyperVPrep.run', () => {
  test('executes podman system hyperv-prep with admin privileges', async () => {
    vi.mocked(execPodman).mockResolvedValue({
      stdout: '',
      stderr: '',
      command: 'podman system hyperv-prep',
    });

    const hyperVPrep = createHyperVPrep();
    await hyperVPrep.run();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  });
});

async function setupHyperVPrepCommand(): Promise<() => Promise<void>> {
  vi.mocked(execPodman).mockResolvedValue({
    stdout: APPLIED_STATUS_OUTPUT,
    stderr: '',
    command: 'podman system hyperv-prep --status',
  });

  const hyperVPrep = createHyperVPrep();
  hyperVPrep.init();
  await vi.waitFor(() =>
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, expect.any(Boolean)),
  );
  vi.mocked(execPodman).mockClear();

  return vi.mocked(extensionApi.commands.registerCommand).mock.calls[0][1] as () => Promise<void>;
}

describe('HyperVPrep command lifecycle', () => {
  test('registers the command on Windows and disposes it on deactivation', () => {
    const disposable = { dispose: vi.fn() };
    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue(disposable);
    vi.mocked(execPodman).mockResolvedValue({
      stdout: APPLIED_STATUS_OUTPUT,
      stderr: '',
      command: 'podman system hyperv-prep --status',
    });

    const hyperVPrep = createHyperVPrep();
    hyperVPrep.init();

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(HYPERV_PREP_COMMAND, expect.any(Function));
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledTimes(1);

    hyperVPrep.dispose();

    expect(disposable.dispose).toHaveBeenCalledOnce();
  });

  test('does not register the command on non-Windows', () => {
    vi.mocked(extensionApi.env).isWindows = false;

    const hyperVPrep = createHyperVPrep();
    hyperVPrep.init();

    expect(extensionApi.commands.registerCommand).not.toHaveBeenCalled();
    expect(execPodman).not.toHaveBeenCalled();
  });

  test('registers the command without waiting for the initial status check', async () => {
    let resolveBinaryInfo: ((value: { version: string }) => void) | undefined;
    vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockReturnValue(
      new Promise(resolve => {
        resolveBinaryInfo = resolve;
      }),
    );
    const hyperVPrep = createHyperVPrep();

    hyperVPrep.init();

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(HYPERV_PREP_COMMAND, expect.any(Function));
    expect(PodmanBinary.prototype.getBinaryInfo).toHaveBeenCalledOnce();

    resolveBinaryInfo?.({ version: '5.0.0' });
    await vi.waitFor(() =>
      expect(extensionApi.context.setValue).toHaveBeenCalledWith(HYPERV_PREP_SUPPORTED_KEY, false),
    );
  });
});

describe('HyperVPrep command handler', () => {
  test('is a no-op when Podman 6 is not available', async () => {
    vi.mocked(PodmanBinary.prototype.getBinaryInfo).mockResolvedValue({ version: '5.4.0' });
    const callback = await setupHyperVPrepCommand();

    await callback();

    expect(execPodman).not.toHaveBeenCalled();
  });

  test('runs prep when needed and confirmed', async () => {
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman)
      .mockResolvedValueOnce({ stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' })
      .mockResolvedValueOnce({ stdout: '', stderr: '', command: 'run' })
      .mockResolvedValueOnce({ stdout: APPLIED_STATUS_OUTPUT, stderr: '', command: 'status' });

    await callback();

    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      'Prepare Hyper-V now? Administrator approval (UAC) is required.',
      'Yes',
      'No',
    );
    expect(extensionApi.window.withProgress).toHaveBeenCalled();
    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
    expect(telemetryLoggerMock.logUsage).toHaveBeenCalledWith('podman.hypervPrep', { status: 'applied' });
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Hyper-V preparation applied.'),
    );
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining(HyperVPrep.HYPERV_PREP_RELOGIN_MESSAGE),
    );
  });

  test('skips prep when user declines confirmation', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('No');
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman).mockResolvedValue({ stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' });

    await callback();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep', '--status']);
    expect(execPodman).not.toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
  });

  test('shows status when prep is already applied', async () => {
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman).mockResolvedValue({ stdout: APPLIED_STATUS_OUTPUT, stderr: '', command: 'status' });

    await callback();

    expect(execPodman).toHaveBeenCalledWith(['system', 'hyperv-prep', '--status']);
    expect(execPodman).not.toHaveBeenCalledWith(['system', 'hyperv-prep'], undefined, { isAdmin: true });
    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Hyper-V preparation is already applied.'),
    );
  });

  test.each([{ message: 'Access is denied.' }, { message: 'operation was canceled' }])(
    'shows error when prep fails with "$message"',
    async ({ message }) => {
      const callback = await setupHyperVPrepCommand();
      vi.mocked(execPodman)
        .mockResolvedValueOnce({ stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' })
        .mockRejectedValueOnce({ message, stderr: '', stdout: '' });

      await callback();

      expect(extensionApi.window.showErrorMessage).toHaveBeenCalledWith(`Hyper-V preparation failed: ${message}`);
      expect(telemetryLoggerMock.logError).toHaveBeenCalledWith('hypervPrepFailed', { error: message });
    },
  );

  test('narrows error fields before using them in user-facing feedback', async () => {
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman)
      .mockResolvedValueOnce({ stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' })
      .mockRejectedValueOnce({ message: 42, stderr: 'Administrator approval was denied' });

    await callback();

    expect(extensionApi.window.showErrorMessage).toHaveBeenCalledWith(
      'Hyper-V preparation failed: Administrator approval was denied',
    );
  });

  test('shows a user-facing error when the initial status check fails', async () => {
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman).mockRejectedValueOnce({ message: 'Access denied', stderr: '', stdout: '' });

    await callback();

    expect(extensionApi.window.showErrorMessage).toHaveBeenCalledWith(
      'Hyper-V preparation status check failed: Access denied',
    );
    expect(telemetryLoggerMock.logError).toHaveBeenCalledWith('hypervPrepStatusCheckFailed', {
      error: 'Access denied',
    });
    expect(extensionApi.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test.each([
    {
      name: 'notApplied',
      result: { stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' },
      status: 'notApplied',
    },
    { name: 'unknown', result: new Error('unknown command'), status: 'unknown' },
  ])('does not report success when refreshed status is $name', async ({ result, status }) => {
    const callback = await setupHyperVPrepCommand();
    vi.mocked(execPodman)
      .mockResolvedValueOnce({ stdout: NEEDED_STATUS_OUTPUT, stderr: '', command: 'status' })
      .mockResolvedValueOnce({ stdout: '', stderr: '', command: 'run' });

    if (result instanceof Error) {
      vi.mocked(execPodman).mockRejectedValueOnce(result);
    } else {
      vi.mocked(execPodman).mockResolvedValueOnce(result);
    }

    await callback();

    expect(extensionApi.window.showInformationMessage).toHaveBeenCalledWith(
      expect.stringContaining('Hyper-V preparation finished, but the status could not be confirmed.'),
    );
    expect(telemetryLoggerMock.logUsage).toHaveBeenCalledWith('podman.hypervPrep', { status });
  });
});
