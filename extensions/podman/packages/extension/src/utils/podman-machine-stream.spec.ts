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

import { Client } from 'ssh2';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { MachineInfo } from '../extension';
import { ProviderConnectionShellAccessImpl } from './podman-machine-stream';

const onMock = vi.fn();
const onStreamMock = vi.fn();
const streamMock = {
  on: onStreamMock,
  write: vi.fn(),
  close: vi.fn(),
};

let client: Client;
let providerConnectionShellAccess: TestProviderConnectionShellAccessImpl;

beforeEach(() => {
  vi.clearAllMocks();
  const machineInfo: MachineInfo = {
    port: 12345,
    remoteUsername: 'user',
    identityPath: 'path/to/privateKey',
  } as unknown as MachineInfo;

  client = new Client();
  providerConnectionShellAccess = new TestProviderConnectionShellAccessImpl(machineInfo);
});

class TestProviderConnectionShellAccessImpl extends ProviderConnectionShellAccessImpl {
  disposeListeners(): void {
    return super.disposeListeners();
  }
}

vi.mock('@podman-desktop/api', async () => {
  return {
    EventEmitter: vi.fn().mockImplementation(() => ({
      fire: vi.fn(),
      dispose: vi.fn(),
    })),
    Disposable: vi.fn(),
  };
});

vi.mock('node:fs');

// Mock ssh2 Client
vi.mock('ssh2', () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      on: onMock,
      connect: vi.fn(),
      shell: vi.fn(callback => {
        callback(undefined, streamMock);
      }),
      emit: vi.fn(),
      end: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

describe('Test SSH Client', () => {
  test('should register the ready event', () => {
    const onReady = vi.fn();

    // Adds callback for 'ready'
    client.on('ready', onReady);

    expect(onMock).toHaveBeenCalledWith('ready', onReady);
  });

  test('should register the error event', () => {
    const onError = vi.fn();

    // Adds callback for 'error'
    client.on('error', onError);

    expect(onMock).toHaveBeenCalledWith('error', onError);
  });

  test('should emit ready event', () => {
    onMock.mockImplementation((eventName, fn) => {
      if (eventName === 'ready') {
        fn();
      }
      return client;
    });

    // stream.on needs to return ClientChannel (streamMock)
    onStreamMock.mockReturnValue(streamMock);

    providerConnectionShellAccess.open();
  });

  test('should emit error event', () => {
    const errMsg = { message: 'Error message' };
    onMock.mockImplementation((eventName, fn) => {
      if (eventName === 'error') {
        fn(errMsg);
      }
      return client;
    });

    providerConnectionShellAccess.open();
    expect(providerConnectionShellAccess.onErrorEmit.fire).toHaveBeenCalledWith({ error: 'Error message' });
  });
});

describe('Test SSH Stream', () => {
  beforeEach(() => {
    onMock.mockImplementation((eventName, fn) => {
      if (eventName === 'ready') {
        fn();
      }
      return client;
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

    providerConnectionShellAccess.open();
    expect(providerConnectionShellAccess.onDataEmit.fire).toHaveBeenCalledWith({ data: 'Some data' });
  });

  test('should handle ready event and end shell', async () => {
    onStreamMock.mockImplementation((eventName, fn) => {
      if (eventName === 'close') {
        fn();
      }
      return streamMock;
    });

    providerConnectionShellAccess.open();
    expect(providerConnectionShellAccess.onEndEmit.fire).toHaveBeenCalled();
  });
});
