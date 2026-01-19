/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { Client, type ClientChannel } from 'ssh2';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { MachineInfo } from '/@/types';

import { ProviderConnectionShellAccessImpl } from './podman-machine-stream';

const onStreamMock = vi.fn();
const streamMock = {
  on: onStreamMock,
  write: vi.fn(),
  close: vi.fn(),
} as unknown as ClientChannel;

let providerConnectionShellAccess: TestProviderConnectionShellAccessImpl;

beforeEach(() => {
  vi.resetAllMocks();
  const machineInfo: MachineInfo = {
    port: 12345,
    remoteUsername: 'user',
    identityPath: 'path/to/privateKey',
  } as unknown as MachineInfo;

  vi.mocked(Client.prototype.on).mockReturnThis();
  vi.mocked(Client.prototype.shell).mockImplementation(function (this: Client, callback) {
    callback(undefined, streamMock);
    return this;
  });

  providerConnectionShellAccess = new TestProviderConnectionShellAccessImpl(machineInfo);
});

class TestProviderConnectionShellAccessImpl extends ProviderConnectionShellAccessImpl {
  disposeListeners(): void {
    return super.disposeListeners();
  }
}

vi.mock(import('node:fs'));

// Mock ssh2 Client
vi.mock(import('ssh2'));

describe('Test SSH Client', () => {
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });

  test('should register the ready event', () => {
    const onReady = vi.fn();

    // Adds callback for 'ready'
    client.on('ready', onReady);

    expect(client.on).toHaveBeenCalledWith('ready', onReady);
  });

  test('should register the error event', () => {
    const onError = vi.fn();

    // Adds callback for 'error'
    client.on('error', onError);

    expect(client.on).toHaveBeenCalledWith('error', onError);
  });

  test('should emit ready event', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    vi.mocked(Client.prototype.on).mockImplementation(function (this: Client, eventName: string, fn: Function): Client {
      if (eventName === 'ready') {
        fn();
      }
      return this;
    });

    // stream.on needs to return ClientChannel (streamMock)
    onStreamMock.mockReturnValue(streamMock);

    providerConnectionShellAccess.open();
  });

  test('should emit error event', () => {
    const errMsg = { message: 'Error message' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    vi.mocked(Client.prototype.on).mockImplementation(function (this: Client, eventName: string, fn: Function): Client {
      if (eventName === 'error') {
        fn(errMsg);
      }
      return this;
    });

    const listener = vi.fn();
    providerConnectionShellAccess.onErrorEmit.event(listener);

    providerConnectionShellAccess.open();

    expect(listener).toHaveBeenCalledWith({ error: 'Error message' });
  });
});

describe('Test SSH Stream', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    vi.mocked(Client.prototype.on).mockImplementation(function (this: Client, eventName: string, fn: Function): Client {
      if (eventName === 'ready') {
        fn();
      }
      return this;
    });
  });

  test('should handle ready event, start shell and get some data', async () => {
    const dataMsg = 'Some data';
    onStreamMock.mockImplementation((eventName, fn) => {
      if (eventName === 'data') {
        fn(dataMsg);
      }
      return streamMock;
    });

    const listener = vi.fn();
    providerConnectionShellAccess.onDataEmit.event(listener);

    providerConnectionShellAccess.open();

    expect(listener).toHaveBeenCalledWith({ data: 'Some data' });
  });

  test('should handle ready event and end shell', async () => {
    onStreamMock.mockImplementation((eventName, fn) => {
      if (eventName === 'close') {
        fn();
      }
      return streamMock;
    });

    const listener = vi.fn();
    providerConnectionShellAccess.onEndEmit.event(listener);

    providerConnectionShellAccess.open();
    expect(listener).toHaveBeenCalled();
  });
});

test('Returned functions should run without errors', () => {
  const shellAccess = providerConnectionShellAccess.open();
  expect(() => shellAccess.close()).not.toThrow();
  expect(() => shellAccess.write('test')).not.toThrow();
  expect(() => shellAccess.resize({ rows: 1, cols: 2 })).not.toThrow();
});
