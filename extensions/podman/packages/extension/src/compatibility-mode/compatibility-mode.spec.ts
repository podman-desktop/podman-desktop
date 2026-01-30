/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import { afterEach, expect, test, vi } from 'vitest';

import { DarwinSocketCompatibility } from '/@/compatibility-mode/darwin-socket-compatibility';

import { getSocketCompatibility, LinuxSocketCompatibility } from './compatibility-mode';

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

// Linux tests
test('linux: compatibility mode pass', async () => {
  Object.defineProperty(process, 'platform', {
    value: 'linux',
  });
  expect(() => getSocketCompatibility()).toBeTruthy();
});

// Fail when trying to use runSystemdCommand with a command that's not "enable" or "disable"
test('linux: fail when trying to use runSystemdCommand with a command that is not "enable" or "disable"', async () => {
  Object.defineProperty(process, 'platform', {
    value: 'linux',
  });

  const socketCompatClass = new LinuxSocketCompatibility();
  await expect(socketCompatClass.runSystemdCommand('start', 'enabled')).rejects.toThrowError(
    'runSystemdCommand only accepts enable or disable as the command',
  );
});

test('linux: pass enabling when systemctl command exists', async () => {
  Object.defineProperty(process, 'platform', {
    value: 'linux',
  });

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));

  const socketCompatClass = new LinuxSocketCompatibility();

  // Expect enable() to pass since systemctl command exists
  await expect(socketCompatClass.enable()).resolves.toBeUndefined();
  expect(extensionApi.window.showErrorMessage).not.toHaveBeenCalled();
});

// Windows tests
test('windows: compatibility mode fail', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'win32',
  });

  // Expect getSocketCompatibility to return error since Linux is not supported yet
  expect(() => getSocketCompatibility()).toThrowError();
});

test('darwin: test promptRestart IS NOT ran when findRunningMachine returns undefined for enable AND disable', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  });

  const socketCompatClass = new DarwinSocketCompatibility();

  // Mock execPromise was ran successfully
  vi.mock('execPromise', () => {
    return Promise.resolve();
  });

  // Mock that enable ran successfully
  const spyEnable = vi.spyOn(socketCompatClass, 'runCommand');
  spyEnable.mockImplementation(() => {
    return Promise.resolve();
  });

  // Mock that disable ran successfully
  const spyDisable = vi.spyOn(socketCompatClass, 'runCommand');
  spyDisable.mockImplementation(() => {
    return Promise.resolve();
  });

  // Mock that findRunningMachine returns undefined
  vi.mock('./../extension', () => {
    return {
      findRunningMachine: (): Promise<void> => {
        return Promise.resolve();
      },
    };
  });

  const spyPromptRestart = vi.spyOn(extensionApi.window, 'showInformationMessage');

  // Enable shouldn't call promptRestart
  await socketCompatClass.enable();
  expect(spyPromptRestart).not.toHaveBeenCalled();

  // Disable shouldn't call promptRestart
  await socketCompatClass.disable();
  expect(spyPromptRestart).not.toHaveBeenCalled();
});
