/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import { existsSync, type PathLike } from 'node:fs';

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { DarwinSocketCompatibility } from '/@/compatibility-mode/darwin-socket-compatibility';
import * as extension from '/@/extension';
import { findRunningMachine } from '/@/extension';

vi.mock(import('/@/extension'));
vi.mock(import('node:fs'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();

  // Mock that findRunningMachine returns undefined
  vi.mocked(findRunningMachine).mockResolvedValue(undefined);

  // mock existsSync to return true only if '/usr/local/bin/podman-mac-helper' is passed in,
  // forcing it to return false for all other paths.
  // this imitates that the binary is found in /usr/local/bin and not other folders
  vi.mocked(existsSync).mockImplementation((path: PathLike): boolean => {
    return path === '/usr/local/bin/podman-mac-helper';
  });
});

test('darwin: compatibility mode binary not found failure', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  });

  // Mock that the binary is not found
  const socketCompatClass = new DarwinSocketCompatibility();
  const spyFindPodmanHelper = vi.spyOn(socketCompatClass, 'findPodmanHelper');
  spyFindPodmanHelper.mockReturnValue('');

  // Expect the error to show when it's not found / enable isn't ran.
  await socketCompatClass.enable();
  expect(extensionApi.window.showErrorMessage).toHaveBeenCalledWith('podman-mac-helper binary not found.', 'OK');
});

test('darwin: DarwinSocketCompatibility class, test runMacHelperCommandWithAdminPriv ran within runCommand', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  });

  const socketCompatClass = new DarwinSocketCompatibility();

  // Mock that the binary is found
  const spyFindPodmanHelper = vi.spyOn(socketCompatClass, 'findPodmanHelper');
  spyFindPodmanHelper.mockReturnValue('/opt/podman/bin/podman-mac-helper');

  // Mock that admin command ran successfully (since we cannot test interactive mode priv in vitest / has to be integration tests)
  const spyMacHelperCommand = vi.spyOn(socketCompatClass, 'runMacHelperCommandWithAdminPriv');
  spyMacHelperCommand.mockImplementation(() => {
    return Promise.resolve();
  });

  // Run the command
  await socketCompatClass.runCommand('enable', 'enabled');

  // Expect that mac helper command was ran
  expect(spyMacHelperCommand).toHaveBeenCalled();
});

test('darwin: DarwinSocketCompatibility class, test promptRestart ran within runCommand', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  });

  const socketCompatClass = new DarwinSocketCompatibility();

  vi.spyOn(extensionApi.process, 'exec').mockImplementation(() => Promise.resolve({} as extensionApi.RunResult));

  const spyFindRunningMachine = vi.spyOn(extension, 'findRunningMachine');
  spyFindRunningMachine.mockImplementation(() => {
    return Promise.resolve('default');
  });

  // Mock that enable ran successfully
  const spyEnable = vi.spyOn(socketCompatClass, 'runCommand');
  spyEnable.mockImplementation(() => {
    return Promise.resolve();
  });

  const spyPromptRestart = vi.spyOn(socketCompatClass, 'promptRestart');

  // Run the command
  await socketCompatClass.enable();

  // Expect that promptRestart was ran
  expect(spyPromptRestart).toHaveBeenCalled();
});

test('darwin: mock fs.existsSync returns /usr/local/bin/podman-mac-helper', async () => {
  // Mock platform to be darwin
  Object.defineProperty(process, 'platform', {
    value: 'darwin',
  });

  // Mock that the binary is found
  const socketCompatClass = new DarwinSocketCompatibility();

  // Run findPodmanHelper
  const binaryPath = socketCompatClass.findPodmanHelper();

  // Expect binaryPath to be /usr/local/bin/podman-mac-helper
  expect(binaryPath).toBe('/usr/local/bin/podman-mac-helper');
});
