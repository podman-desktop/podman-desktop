/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import * as os from 'node:os';

import * as extensionApi from '@podman-desktop/api';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { MacKrunkitPodmanMachineCreationCheck, MacVersionCheck, MINIMUM_VERSION } from './macos-checks';

let macVersionCheck: MacVersionCheck;

vi.mock('node:os', () => {
  return {
    release: vi.fn(),
    platform: vi.fn(),
  };
});

beforeEach(() => {
  macVersionCheck = new MacVersionCheck();
  vi.clearAllMocks();
});

test('expect error on versions of macOS too old', async () => {
  // Let say we have a very old macOS version
  (os.release as Mock).mockReturnValue('5.0.0');
  const result = await macVersionCheck.execute();
  expect(result).toBeDefined();
  expect(result.successful).toBeFalsy();
  expect(result.description).toMatch('you need to update to macOS Catalina');
});

test('expect success on versions of macOS matching the minimum version', async () => {
  // pickup minimum version
  (os.release as Mock).mockReturnValue(MINIMUM_VERSION);
  const result = await macVersionCheck.execute();
  expect(result).toBeDefined();
  // minimum version should match
  expect(result.successful).toBeTruthy();
});

test('expect success on a recent macOS version', async () => {
  (os.release as Mock).mockReturnValue('22.1.0');
  const result = await macVersionCheck.execute();
  expect(result).toBeDefined();
  expect(result.successful).toBeTruthy();
});

describe('Krunkit', () => {
  test('Krunkit is installed by brew', async () => {
    vi.mocked(extensionApi.process.exec).mockImplementation(() =>
      Promise.resolve({ exitCode: 0, stdout: 'hello-world' } as extensionApi.RunError),
    );

    const krunkitCheck = new MacKrunkitPodmanMachineCreationCheck();
    const result = await krunkitCheck.execute();
    expect(result).toBeDefined();
    expect(result.successful).toBeTruthy();
  });

  test('Krunkit is installed by Podman installer', async () => {
    vi.mocked(extensionApi.process.exec).mockImplementation(() => Promise.reject(new Error('Brew is not installed')));

    const krunkitCheck = new MacKrunkitPodmanMachineCreationCheck();
    const result = await krunkitCheck.execute();
    expect(result).toBeDefined();
    expect(result.successful).toBeTruthy();
  });

  test('Krunkit is not installed', async () => {
    vi.mocked(extensionApi.process.exec).mockImplementation(() =>
      Promise.resolve({ exitCode: 1, stderr: 'error-world' } as extensionApi.RunError),
    );

    vi.mocked(extensionApi.process.exec).mockImplementationOnce(() =>
      Promise.resolve({ exitCode: 0, stdout: 'hello-world' } as extensionApi.RunError),
    );
    const krunkitCheck = new MacKrunkitPodmanMachineCreationCheck();
    const result = await krunkitCheck.execute();
    expect(result).toBeDefined();
    expect(result.successful).toBeFalsy();
  });
});
