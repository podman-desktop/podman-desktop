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

import {
  configuration as configurationAPI,
  type Disposable,
  process as processAPI,
  type RunError,
} from '@podman-desktop/api';
import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanBinary } from '/@/utils/podman-binary';

vi.mock(import('/@/utils/podman-cli'));
vi.mock('@podman-desktop/api', () => ({
  process: {
    exec: vi.fn(),
  },
  configuration: {
    onDidChangeConfiguration: vi.fn(),
  },
}));

const disposableMock: Disposable = {
  dispose: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(processAPI.exec).mockResolvedValue({
    stdout: 'podman version 5.6.2',
    stderr: '',
    command: '',
  });
  vi.mocked(configurationAPI.onDidChangeConfiguration).mockReturnValue(disposableMock);
});

test('PodmanBinary#getBinaryInfo should resolve undefined when processAPI.exec throw an error', async () => {
  vi.mocked(processAPI.exec).mockRejectedValue({
    exitCode: 1,
    command: '',
    stderr: '',
    stdout: '',
    killed: false,
    name: 'error',
  } as RunError);

  const binary = new PodmanBinary();
  const info = await binary.getBinaryInfo();
  expect(info).toBeUndefined();
});

test('PodmanBinary#getBinaryInfo should cache the exec result', async () => {
  const binary = new PodmanBinary();
  const info = await binary.getBinaryInfo();
  expect(processAPI.exec).toHaveBeenCalledOnce();
  expect(info?.version).toEqual('5.6.2');

  // call again
  await binary.getBinaryInfo();
  // assert the exec is not called again
  expect(processAPI.exec).toHaveBeenCalledOnce();
});

test('PodmanBinary#invalidate should reset the cache', async () => {
  const binary = new PodmanBinary();
  const info = await binary.getBinaryInfo();
  expect(processAPI.exec).toHaveBeenCalledOnce();
  expect(info?.version).toEqual('5.6.2');

  // invalidate the cache
  binary.invalidate();

  // update version stdout
  vi.mocked(processAPI.exec).mockResolvedValue({
    stdout: 'podman version 5.6.3',
    stderr: '',
    command: '',
  });
  const nInfo = await binary.getBinaryInfo();
  expect(nInfo?.version).toEqual('5.6.3');

  // ensure we call twice
  expect(processAPI.exec).toHaveBeenCalledTimes(2);
});

describe('PodmanBinary#init', () => {
  test('should register listener for configuration#onDidChangeConfiguration', () => {
    const binary = new PodmanBinary();

    expect(configurationAPI.onDidChangeConfiguration).not.toHaveBeenCalled();
    binary.init();

    expect(configurationAPI.onDidChangeConfiguration).toHaveBeenCalledOnce();
  });

  test('should call invalidate when appropriate configuration is changed', async () => {
    const binary = new PodmanBinary();
    binary.init();

    // call once
    const nInfo = await binary.getBinaryInfo();
    expect(nInfo?.version).toEqual('5.6.2');

    // get the onDidChangeConfiguration listener
    const listener = vi.mocked(configurationAPI.onDidChangeConfiguration).mock.calls[0]?.[0];
    assert(listener, 'listener should be registered with init');

    listener({
      affectsConfiguration: () => true,
    });

    // call again
    await binary.getBinaryInfo();

    // ensure we call twice
    expect(processAPI.exec).toHaveBeenCalledTimes(2);
  });

  test('should not call invalidate when non affected configuration is changed', async () => {
    const binary = new PodmanBinary();
    binary.init();

    // call once
    const nInfo = await binary.getBinaryInfo();
    expect(nInfo?.version).toEqual('5.6.2');

    // get the onDidChangeConfiguration listener
    const listener = vi.mocked(configurationAPI.onDidChangeConfiguration).mock.calls[0]?.[0];
    assert(listener, 'listener should be registered with init');

    listener({
      affectsConfiguration: () => false,
    });

    // call again
    await binary.getBinaryInfo();

    // ensure we call once
    expect(processAPI.exec).toHaveBeenCalledOnce();
  });
});

test('PodmanBinary#dispose should unregister listener', () => {
  const binary = new PodmanBinary();
  binary.init();

  expect(configurationAPI.onDidChangeConfiguration).toHaveBeenCalledOnce();
  expect(disposableMock.dispose).not.toHaveBeenCalled();

  binary.dispose();
  expect(disposableMock.dispose).toHaveBeenCalledOnce();
});
