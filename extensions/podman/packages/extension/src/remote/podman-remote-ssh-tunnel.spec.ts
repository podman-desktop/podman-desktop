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

import { rm } from 'node:fs/promises';
import { type AddressInfo, createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { Event, EventEmitter } from '@podman-desktop/api';
import { Disposable } from '@podman-desktop/api';
import type { ServerChannel, WindowChangeInfo } from 'ssh2';
import { Server } from 'ssh2';
import { generatePrivateKey } from 'sshpk';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

// mock the API
vi.mock('@podman-desktop/api', () => {
  /**
   * Mock the {@link EventEmitter} class logic
   */
  class EventEmitterMock<T> implements EventEmitter<T> {
    #set: Set<(t: T) => void> = new Set();

    get event(): Event<T> {
      return (listener: (t: T) => void): Disposable => {
        this.#set.add(listener);
        return {
          dispose: (): void => {
            this.#set.delete(listener);
          },
        };
      };
    }

    fire(data: T): void {
      this.#set.forEach(listener => listener(data));
    }

    dispose(): void {
      this.#set.clear();
    }
  }

  return {
    process: {
      exec: vi.fn(),
    },
    EventEmitter: EventEmitterMock,
    Disposable: {
      create: vi.fn(),
    },
  };
});

class TestPodmanRemoteSshTunnel extends PodmanRemoteSshTunnel {
  isListening(): boolean {
    return super.isListening();
  }
}

let dummyKey: string;
beforeAll(async () => {
  // generate on the fly a dummy key
  dummyKey = generatePrivateKey('ed25519').toString('ssh');
});

let sshPort: number;
let connected: boolean;
let authenticated: boolean;
let sshServer: Server;

// create a npipe/socket server
// on windows it's an npipe, on macOS a socket file
let socketOrNpipePathLocal: string;
let socketOrNpipePathRemote: string;

beforeEach(async () => {
  vi.resetAllMocks();

  vi.mocked(Disposable.create).mockReturnValue({
    dispose: vi.fn(),
  });

  sshPort = 0;
  connected = false;
  authenticated = false;
  sshServer = new Server(
    {
      hostKeys: [dummyKey],
    },
    client => {
      connected = true;

      client
        .on('authentication', ctx => {
          ctx.accept();
        })
        .on('ready', () => {
          authenticated = true;
        });
    },
  ).listen(0, '127.0.0.1', () => {
    const address: AddressInfo = sshServer.address() as AddressInfo;
    sshPort = address?.port;
  });

  // wait that the server is listening
  await vi.waitFor(() => expect(sshPort).toBeGreaterThan(0));

  if (process.platform === 'win32') {
    socketOrNpipePathLocal = '\\\\.\\pipe\\test-local';
    socketOrNpipePathRemote = '\\\\.\\pipe\\test-remote';
  } else {
    socketOrNpipePathLocal = join(tmpdir(), 'test-local.sock');
    socketOrNpipePathRemote = join(tmpdir(), 'test-remote.sock');
  }
});

afterEach(async () => {
  sshServer.close();

  // delete file if exists
  await rm(socketOrNpipePathLocal, { force: true });
  await rm(socketOrNpipePathRemote, { force: true });
});

test('should be able to connect', async () => {
  let listenReady = false;

  // start a remote server (fake podman socket)
  const npipeServer = createServer(_socket => {}).listen(socketOrNpipePathRemote, () => {
    listenReady = true;
  });

  await vi.waitFor(() => expect(listenReady).toBeTruthy());

  const podmanRemoteSshTunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    sshPort,
    'foo',
    '',
    socketOrNpipePathRemote,
    socketOrNpipePathLocal,
  );

  podmanRemoteSshTunnel.connect();

  // wait authenticated and connected
  await vi.waitFor(() => expect(connected && authenticated && podmanRemoteSshTunnel.isListening()).toBeTruthy());

  let connectedToLocal = false;
  // send a request to the tunnel using the socket path
  const client = createConnection({ path: socketOrNpipePathLocal }, () => {
    connectedToLocal = true;
  });

  await vi.waitFor(() => expect(connectedToLocal).toBeTruthy());

  client.end();
  npipeServer.close();
});

describe('shell', () => {
  let shellServerChannel: ServerChannel | undefined;
  let windowChangeInfo: WindowChangeInfo | undefined;

  beforeEach(() => {
    shellServerChannel = undefined;
    windowChangeInfo = undefined;

    // our custom SSH server need to handle the shell & pty to avoid having Channel open failure
    sshServer.on('connection', connection => {
      connection.on('session', accept => {
        const session = accept();

        session.on('pty', accept => {
          accept(); // Accept pseudo-terminal request
        });

        session.on('shell', accept => {
          shellServerChannel = accept();
        });

        session.on('window-change', (_accept, _reject, info) => {
          windowChangeInfo = info;
        });
      });
    });
  });

  afterEach(() => {
    shellServerChannel?.close();
  });

  async function getPodmanRemote(): Promise<PodmanRemoteSshTunnel> {
    const podmanRemoteSshTunnel = new TestPodmanRemoteSshTunnel(
      'localhost',
      sshPort,
      'foo',
      '',
      socketOrNpipePathRemote,
      socketOrNpipePathLocal,
    );

    podmanRemoteSshTunnel.connect();

    // wait authenticated and connected
    await vi.waitFor(() => expect(connected && authenticated && podmanRemoteSshTunnel.isListening()).toBeTruthy());

    return podmanRemoteSshTunnel;
  }

  test('client to server data', async () => {
    const podmanRemoteSshTunnel = await getPodmanRemote();

    // open shell
    const session = podmanRemoteSshTunnel.open();

    // wait for server to receive the shell
    await vi.waitFor(() => {
      expect(shellServerChannel).toBeDefined();
    });

    // create listener and attach it to server channel
    const shellDataListener = vi.fn();
    shellServerChannel?.on('data', shellDataListener);

    // write client => server
    session.write('ping');

    await vi.waitFor(() => {
      expect(shellDataListener).toHaveBeenCalledWith(Buffer.from('ping'));
    });
  });

  test('server to client data', async () => {
    const podmanRemoteSshTunnel = await getPodmanRemote();

    // open shell
    const session = podmanRemoteSshTunnel.open();

    // wait for server to receive the shell
    await vi.waitFor(() => {
      expect(shellServerChannel).toBeDefined();
    });

    // create listener and attach it to client event emitter
    const shellDataListener = vi.fn();
    session.onData(shellDataListener);

    // write server => client
    shellServerChannel?.write('ping');

    await vi.waitFor(() => {
      expect(shellDataListener).toHaveBeenCalledWith({
        data: Buffer.from('ping'),
      });
    });
  });

  test('shell closing should trigger onEnd', async () => {
    const podmanRemoteSshTunnel = await getPodmanRemote();

    // open shell
    const session = podmanRemoteSshTunnel.open();

    // wait for server to receive the shell
    await vi.waitFor(() => {
      expect(shellServerChannel).toBeDefined();
    });

    // create listener and attach it to client event emitter
    const shellDataListener = vi.fn();
    session.onEnd(shellDataListener);

    // close the channel
    shellServerChannel?.close();

    await vi.waitFor(() => {
      expect(shellDataListener).toHaveBeenCalledOnce();
    });
  });

  test('resize should request resize', async () => {
    const podmanRemoteSshTunnel = await getPodmanRemote();

    // open shell
    const session = podmanRemoteSshTunnel.open();

    // wait for server to receive the shell
    await vi.waitFor(() => {
      expect(shellServerChannel).toBeDefined();
    });

    expect(windowChangeInfo).toBeUndefined();

    session.resize({
      rows: 88,
      cols: 32,
    });

    const info = await vi.waitFor<WindowChangeInfo>(() => {
      expect(windowChangeInfo).toBeDefined();
      return windowChangeInfo as WindowChangeInfo;
    });

    expect(info.rows).toEqual(88);
    expect(info.cols).toEqual(32);
  });
});
