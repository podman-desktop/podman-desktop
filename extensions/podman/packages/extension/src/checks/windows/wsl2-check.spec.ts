/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import type { CheckResult, ExtensionContext, RunResult } from '@podman-desktop/api';
import { commands, process } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { UserAdminCheck } from '/@/checks/windows/user-admin-check';
import { normalizeWSLOutput } from '/@/utils/util';

import { WSL2Check } from './wsl2-check';

const userAdminCheck = { execute: vi.fn() } as unknown as UserAdminCheck;

// mock ps-list
vi.mock('ps-list', async () => {
  return {
    default: vi.fn(),
  };
});

vi.mock(import('../../utils/util'), async () => {
  return {
    getAssetsFolder: vi.fn(),
    runCliCommand: vi.fn(),
    appHomeDir: vi.fn(),
    normalizeWSLOutput: vi.fn(),
    isLinux: vi.fn(),
    isWindows: vi.fn(),
    isMac: vi.fn(),
    execPodman: vi.fn(),
  };
});

const extensionContext = {
  subscriptions: [],
} as unknown as ExtensionContext;

const SUCCESSFUL_CHECK_RESULT: CheckResult = { successful: true };

let winWSLCheck: WSL2Check;

beforeEach(() => {
  vi.resetAllMocks();
  // reset array of subscriptions
  extensionContext.subscriptions.length = 0;

  vi.mocked(normalizeWSLOutput).mockImplementation((s: string) => s);

  winWSLCheck = new WSL2Check(userAdminCheck, extensionContext);
});

test('expect winWSL2 preflight check return successful result if the machine has WSL2 installed and do not need to reboot', async () => {
  vi.mocked(process.exec).mockImplementation(command => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return Promise.resolve({
        stdout: 'blabla',
        stderr: '',
        command: 'command',
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await winWSLCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winWSL2 preflight check return failure result if the machine has WSL2 installed but needs a reboot', async () => {
  vi.mocked(process.exec).mockImplementation((command, args) => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return new Promise<RunResult>((resolve, reject) => {
        if (args?.[0] === '-l') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            exitCode: -1,
            stdout: 'random error message\nError code: Wsl/WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED',
            stderr: '',
            command: 'command',
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          resolve({
            stdout: 'blabla',
            stderr: '',
            command: 'command',
          });
        }
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  const result = await winWSLCheck.execute();
  expect(result.description).equal(
    'WSL2 seems to be installed but the system needs to be restarted so the changes can take effect.',
  );
  expect(result.docLinksDescription).equal(
    `If already restarted, call 'wsl --install --no-distribution' in a terminal.`,
  );
  expect(result.docLinks?.[0].url).equal('https://learn.microsoft.com/en-us/windows/wsl/install');
});

test('expect winWSL2 preflight check return successful result if the machine has WSL2 installed and the reboot check fails with a code different from WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED', async () => {
  vi.mocked(process.exec).mockImplementation((command, args) => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return new Promise<RunResult>((resolve, reject) => {
        if (args?.[0] === '-l') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            exitCode: -1,
            stdout: 'random error message\nError code: Wsl/WSL_E_DEFAULT_DISTRO_NOT_FOUND',
            stderr: '',
            command: 'command',
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          resolve({
            stdout: 'blabla',
            stderr: '',
            command: 'command',
          });
        }
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  const result = await winWSLCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winWSL2 preflight check return successful result if the machine has WSL2 installed and the reboot check fails with a code different from WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED and WSL_E_DEFAULT_DISTRO_NOT_FOUND', async () => {
  vi.mocked(process.exec).mockImplementation((command, args) => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return new Promise<RunResult>((resolve, reject) => {
        if (args?.[0] === '-l') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            exitCode: -1,
            stdout: 'Windows Subsystem for Linux has no installed distributions.\nRandom error message',
            stderr: '',
            command: 'command',
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          resolve({
            stdout: 'blabla',
            stderr: '',
            command: 'command',
          });
        }
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  const result = await winWSLCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winWSL2 preflight check return failure result if user do not have wsl but he is admin', async () => {
  vi.mocked(process.exec).mockImplementation(command => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return Promise.resolve({
        stdout: '',
        stderr: '',
        command: 'command',
      });
    }
  });

  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);
  const result = await winWSLCheck.execute();
  expect(result.description).equal('WSL2 is not installed.');
  expect(result.docLinksDescription).equal(`Call 'wsl --install --no-distribution' in a terminal.`);
  expect(result.docLinks?.[0].url).equal('https://learn.microsoft.com/en-us/windows/wsl/install');
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});

test('expect winWSL2 preflight check return failure result if user do not have wsl but he is not admin', async () => {
  vi.mocked(process.exec).mockImplementation(command => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'False',
        stderr: '',
        command: 'command',
      });
    } else {
      return Promise.resolve({
        stdout: '',
        stderr: '',
        command: 'command',
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue({ successful: false });

  const result = await winWSLCheck.execute();
  expect(result.description).equal('WSL2 is not installed or you do not have permissions to run WSL2.');
  expect(result.docLinksDescription).equal('Contact your Administrator to setup WSL2.');
  expect(result.docLinks?.[0].url).equal('https://learn.microsoft.com/en-us/windows/wsl/install');
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});

test('expect winWSL2 preflight check return failure result if it fails when checking if wsl is installed', async () => {
  vi.mocked(process.exec).mockImplementation(command => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: '',
        stderr: '',
        command: 'command',
      });
    } else {
      throw new Error();
    }
  });
  vi.mocked(userAdminCheck.execute).mockRejectedValue({ successful: false });

  const result = await winWSLCheck.execute();
  expect(result.description).equal('Could not detect WSL2');
  expect(result.docLinks?.[0].url).equal('https://learn.microsoft.com/en-us/windows/wsl/install');
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});

test('expect winWSL2 init to register WSLInstall command', async () => {
  const registerCommandMock = vi.mocked(commands.registerCommand);
  await winWSLCheck.init?.();
  expect(registerCommandMock).toBeCalledWith('podman.onboarding.installWSL', expect.any(Function));
});

test('expect winWSL2 command to be registered as disposable', async () => {
  const registerCommandMock = vi.mocked(commands.registerCommand);
  const disposableMock = {
    dispose: vi.fn(),
  };
  registerCommandMock.mockReturnValue(disposableMock);
  await winWSLCheck.init?.();
  expect(registerCommandMock).toBeCalledWith('podman.onboarding.installWSL', expect.any(Function));

  // should contain a subscription with a disposable function
  expect(extensionContext.subscriptions[0]).toBeDefined();
  expect(extensionContext.subscriptions[0].dispose).toBeDefined();
});

test('expect winWSL2 check to be memoized', async () => {
  vi.mocked(process.exec).mockImplementation(command => {
    if (command === 'powershell.exe') {
      return Promise.resolve({
        stdout: 'True',
        stderr: '',
        command: 'command',
      });
    } else {
      return Promise.resolve({
        stdout: '',
        stderr: '',
        command: 'command',
      });
    }
  });
  vi.mocked(userAdminCheck.execute).mockResolvedValue(SUCCESSFUL_CHECK_RESULT);

  await winWSLCheck.execute();
  expect(userAdminCheck.execute).toHaveBeenCalledTimes(1);
  expect(process.exec).toHaveBeenCalledTimes(2);

  await winWSLCheck.execute();
  expect(userAdminCheck.execute).toHaveBeenCalledTimes(1);
  expect(process.exec).toHaveBeenCalledTimes(2);
});
