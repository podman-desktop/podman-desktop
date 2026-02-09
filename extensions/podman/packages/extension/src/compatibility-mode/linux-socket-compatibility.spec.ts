/*********************************************************************
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
 ********************************************************************/
import { existsSync } from 'node:fs';

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { getSocketCompatibility } from '/@/compatibility-mode/compatibility-mode';
import { LinuxSocketCompatibility } from '/@/compatibility-mode/linux-socket-compatibility';

vi.mock(import('node:fs'));

beforeEach(() => {
  vi.resetAllMocks();

  Object.defineProperty(process, 'platform', {
    value: 'linux',
  });
});

// Linux tests
test('linux: compatibility mode pass', async () => {
  expect(() => getSocketCompatibility()).toBeTruthy();
});

describe('runSystemdCommand', () => {
  // Fail when trying to use runSystemdCommand with a command that's not "enable" or "disable"
  test('linux: fail when trying to use runSystemdCommand with a command that is not "enable" or "disable"', async () => {
    const socketCompatClass = new LinuxSocketCompatibility();
    await expect(socketCompatClass.runSystemdCommand('start', 'enabled')).rejects.toThrowError(
      'runSystemdCommand only accepts enable or disable as the command',
    );
  });

  test('systemctl error should show user error message', async () => {
    vi.mocked(extensionApi.process.exec).mockRejectedValue('dummy');

    const socketCompatClass = new LinuxSocketCompatibility();
    await socketCompatClass.runSystemdCommand('enable', 'enable');

    expect(extensionApi.window.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching('Error running systemctl command: dummy'),
      'OK',
    );
  });

  test('enable command should ask user to create symlink', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');

    const socketCompatClass = new LinuxSocketCompatibility();
    await socketCompatClass.runSystemdCommand('enable', 'enable');

    expect(extensionApi.process.exec).toHaveBeenLastCalledWith('pkexec', [
      'ln',
      '-s',
      '/run/podman/podman.sock',
      '/var/run/docker.sock',
    ]);
  });

  test('error in symlink creation should show user error message', async () => {
    vi.mocked(extensionApi.window.showInformationMessage).mockResolvedValue('Yes');
    vi.mocked(extensionApi.process.exec).mockImplementation(async (command): Promise<extensionApi.RunResult> => {
      switch (command) {
        case 'systemctl':
          return { command, stdout: '', stderr: '' };
        case 'pkexec':
          throw new Error('dummy pkexec error');
        default:
          throw new Error(`unknown command ${command}`);
      }
    });

    const socketCompatClass = new LinuxSocketCompatibility();
    await socketCompatClass.runSystemdCommand('enable', 'enable');

    expect(extensionApi.window.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
      'Error creating symlink: Error: dummy pkexec error',
      'OK',
    );
  });
});

test('linux: pass enabling when systemctl command exists', async () => {
  vi.mocked(extensionApi.process.exec).mockResolvedValue({} as extensionApi.RunResult);

  const socketCompatClass = new LinuxSocketCompatibility();

  // Expect enable() to pass since systemctl command exists
  await expect(socketCompatClass.enable()).resolves.toBeUndefined();
  expect(extensionApi.window.showErrorMessage).not.toHaveBeenCalled();
});

describe('tooltip', () => {
  test.each<{
    enabled: boolean;
    text: string;
  }>([
    {
      enabled: true,
      text: 'Disable Linux Docker socket compatibility for Podman.',
    },
    {
      enabled: false,
      text: 'Enable Linux Docker socket compatibility for Podman.',
    },
  ])('text should be $text when isEnabled is $enabled', ({ enabled, text }) => {
    // Mock that the binary is found
    const socketCompatClass = new LinuxSocketCompatibility();

    vi.spyOn(socketCompatClass, 'isEnabled').mockReturnValue(enabled);

    expect(socketCompatClass.tooltipText()).toEqual(text);
  });
});

describe('isEnabled', () => {
  test('should return true if corresponding file exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    const socketCompatClass = new LinuxSocketCompatibility();

    expect(socketCompatClass.isEnabled()).toBeTruthy();
    expect(existsSync).toHaveBeenCalledExactlyOnceWith(`/etc/systemd/system/socket.target.wants/podman.socket`);
  });

  test('should return false if corresponding file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const socketCompatClass = new LinuxSocketCompatibility();

    expect(socketCompatClass.isEnabled()).toBeFalsy();
    expect(existsSync).toHaveBeenCalledExactlyOnceWith(`/etc/systemd/system/socket.target.wants/podman.socket`);
  });
});

test('disable exec systemctl disable', async () => {
  const socketCompatClass = new LinuxSocketCompatibility();

  await socketCompatClass.disable();
  expect(extensionApi.process.exec).toHaveBeenCalledExactlyOnceWith('systemctl', ['disable', '--now', 'podman.socket']);
});
