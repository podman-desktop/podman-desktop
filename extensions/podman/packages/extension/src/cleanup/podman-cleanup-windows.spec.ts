/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import { process } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { PodmanCleanupWindows } from './podman-cleanup-windows';

let podmanCleanupWindows: PodmanCleanupWindows;

// mock exists sync
vi.mock(import('node:fs'));
vi.mock(import('node:fs/promises'));

// mock ps-list
vi.mock(import('ps-list'), async () => {
  return {
    default: vi.fn(),
  };
});

beforeEach(() => {
  podmanCleanupWindows = new PodmanCleanupWindows();
  vi.resetAllMocks();
});

test('check stopPodmanProcesses', async () => {
  // mock process.exec
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'podman-my-machine1\r\npodman-my-machine2',
    command: 'wsl',
    stderr: '',
  });

  // mock stopProcessesPids and removeHyperVMachines
  const getProcessesToStopMock = vi.spyOn(podmanCleanupWindows, 'stopProcessesPids');
  getProcessesToStopMock.mockResolvedValue();
  const removeHyperVMock = vi.spyOn(podmanCleanupWindows, 'removeHyperVMachines');
  removeHyperVMock.mockResolvedValue();

  await podmanCleanupWindows.stopPodmanProcesses({ logger: { log: vi.fn(), error: vi.fn(), warn: vi.fn() } });

  expect(process.exec).toHaveBeenNthCalledWith(1, 'wsl', ['--list', '--running', '--quiet'], {
    env: { WSL_UTF8: '1' },
  });
  expect(process.exec).toHaveBeenNthCalledWith(2, 'wsl', ['--terminate', 'podman-my-machine1'], {
    env: { WSL_UTF8: '1' },
  });
  expect(process.exec).toHaveBeenNthCalledWith(3, 'wsl', ['--terminate', 'podman-my-machine2'], {
    env: { WSL_UTF8: '1' },
  });
  expect(process.exec).toHaveBeenNthCalledWith(4, 'wsl', ['--list', '--quiet'], { env: { WSL_UTF8: '1' } });
  expect(process.exec).toHaveBeenNthCalledWith(5, 'wsl', ['--unregister', 'podman-my-machine1'], {
    env: { WSL_UTF8: '1' },
  });
  expect(process.exec).toHaveBeenNthCalledWith(6, 'wsl', ['--unregister', 'podman-my-machine2'], {
    env: { WSL_UTF8: '1' },
  });
  expect(removeHyperVMock).toHaveBeenCalled();
});

test('check stopPodmanProcesses with error', async () => {
  // mock process.exec
  vi.mocked(process.exec).mockRejectedValue(new Error('dummy error'));

  const getProcessesToStopMock = vi.spyOn(podmanCleanupWindows, 'stopProcessesPids');
  getProcessesToStopMock.mockResolvedValue();
  const removeHyperVMock = vi.spyOn(podmanCleanupWindows, 'removeHyperVMachines');
  removeHyperVMock.mockResolvedValue();

  await podmanCleanupWindows.stopPodmanProcesses({ logger: { log: vi.fn(), error: vi.fn(), warn: vi.fn() } });

  expect(process.exec).toBeCalledWith('wsl', ['--list', '--running', '--quiet'], { env: { WSL_UTF8: '1' } });

  // only one call, no call to terminate
  expect(vi.mocked(process.exec).call.length).toBe(1);
});

test('check removeHyperVMachines removes VMs', async () => {
  vi.mocked(process.exec)
    .mockResolvedValueOnce({
      stdout: 'podman-machine-default\r\npodman-my-machine',
      command: 'powershell.exe',
      stderr: '',
    })
    .mockResolvedValue({ stdout: '', command: 'powershell.exe', stderr: '' });

  const logger = { log: vi.fn(), error: vi.fn(), warn: vi.fn() };
  await podmanCleanupWindows.removeHyperVMachines({ logger });

  expect(process.exec).toHaveBeenNthCalledWith(
    1,
    'powershell.exe',
    expect.arrayContaining([expect.stringContaining('Get-VM -Name "podman-*"')]),
  );
  expect(process.exec).toHaveBeenCalledWith(
    'powershell.exe',
    expect.arrayContaining([expect.stringContaining('Remove-VM -Name "podman-machine-default"')]),
  );
  expect(process.exec).toHaveBeenCalledWith(
    'powershell.exe',
    expect.arrayContaining([expect.stringContaining('Remove-VM -Name "podman-my-machine"')]),
  );
});

test('check removeHyperVMachines with no VMs found', async () => {
  vi.mocked(process.exec).mockResolvedValueOnce({
    stdout: '',
    command: 'powershell.exe',
    stderr: '',
  });

  const logger = { log: vi.fn(), error: vi.fn(), warn: vi.fn() };
  await podmanCleanupWindows.removeHyperVMachines({ logger });

  expect(process.exec).toHaveBeenCalledTimes(1);
});

test('check removeHyperVMachines handles Get-VM error gracefully', async () => {
  vi.mocked(process.exec).mockRejectedValueOnce(new Error('powershell not available'));

  const logger = { log: vi.fn(), error: vi.fn(), warn: vi.fn() };
  await podmanCleanupWindows.removeHyperVMachines({ logger });

  expect(logger.error).toHaveBeenCalledWith('error while listing Hyper-V machines', expect.any(Error));
});

test('check removeHyperVMachines handles removal failure gracefully', async () => {
  vi.mocked(process.exec)
    .mockResolvedValueOnce({
      stdout: 'podman-machine-default\r\npodman-my-machine',
      command: 'powershell.exe',
      stderr: '',
    })
    .mockRejectedValueOnce(new Error('remove failed'))
    .mockResolvedValueOnce({ stdout: '', command: 'powershell.exe', stderr: '' });

  const logger = { log: vi.fn(), error: vi.fn(), warn: vi.fn() };
  await podmanCleanupWindows.removeHyperVMachines({ logger });

  expect(logger.error).toHaveBeenCalledWith(
    'unable to remove Hyper-V machine podman-machine-default',
    expect.any(Error),
  );
  expect(process.exec).toHaveBeenCalledWith(
    'powershell.exe',
    expect.arrayContaining([expect.stringContaining('Remove-VM -Name "podman-my-machine"')]),
  );
});

test('check getContainersConfPath', async () => {
  const containersPath = podmanCleanupWindows.getContainersConfPath();

  expect(containersPath).includes('containers.conf');
});

test('check folders to delete', async () => {
  const folders = podmanCleanupWindows.getFoldersToDelete();

  expect(folders).lengthOf(3);
});

test('check terminateProcess', async () => {
  await podmanCleanupWindows.terminateProcess(123456);

  expect(vi.mocked(process.exec)).toBeCalledWith('taskkill', ['/f', '/pid', '123456']);
});

test('check getProcessesToStop', async () => {
  const stdout = `Image Name                     PID Session Name        Session#    Mem Usage\r\n========================= ======== ================ =========== ============\r\nwin-sshproxy.exe               123 Console                    1      1,000 K\r\ngvproxy.exe                    456 Console                    1      1,000 K\r\n`;

  // mock external exec process
  vi.mocked(process.exec).mockResolvedValue({
    stdout,
    command: 'tasklist',
    stderr: '',
  });

  const processesToTerminate = await podmanCleanupWindows.getPidProcesses(['win-sshproxy.exe']);

  expect(processesToTerminate).toStrictEqual([{ pid: 123, name: 'win-sshproxy.exe' }]);
});

test('check stopProcessesPids', async () => {
  // mock getPidProcesses
  const getPidProcessesMock = vi.spyOn(podmanCleanupWindows, 'getPidProcesses');
  getPidProcessesMock.mockResolvedValue([
    { pid: 123, name: 'win-ssh-proxy.exe' },
    { pid: 456, name: 'gvproxy.exe' },
  ]);

  // mock terminateProcess
  const terminateProcessMock = vi.spyOn(podmanCleanupWindows, 'terminateProcess');
  terminateProcessMock.mockResolvedValue(undefined);

  await podmanCleanupWindows.stopProcessesPids({ logger: { log: vi.fn(), error: vi.fn(), warn: vi.fn() } });

  expect(podmanCleanupWindows.getPidProcesses).toBeCalledWith(['win-sshproxy.exe', 'gvproxy.exe']);

  // expect should have call terminateProcess twice
  expect(terminateProcessMock).toBeCalledWith(123);
  expect(terminateProcessMock).toBeCalledWith(456);
});
