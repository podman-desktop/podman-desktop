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
import * as net from 'node:net';
import { type AddressInfo, createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';

import { Client, Server } from 'ssh2';
import { generatePrivateKey } from 'sshpk';
import type { Mock } from 'vitest';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

type NodeNet = typeof net;

vi.mock(import('node:net'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    createServer: vi.fn((...args: unknown[]) =>
      (actual.createServer as (...createServerArgs: unknown[]) => net.Server)(...args),
    ) as unknown as typeof actual.createServer,
  };
});

beforeEach(async () => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  const actualNet = await vi.importActual<NodeNet>('node:net');
  mockedCreateServer().mockImplementation((...args: unknown[]) =>
    (actualNet.createServer as (...createServerArgs: unknown[]) => net.Server)(...args),
  );
});

afterEach(() => {
  vi.useRealTimers();
});

class TestPodmanRemoteSshTunnel extends PodmanRemoteSshTunnel {
  isListening(): boolean {
    return super.isListening();
  }
}

function mockedCreateServer(): Mock {
  return net.createServer as unknown as Mock;
}

let dummyKey: string;
beforeAll(async () => {
  // generate on the fly a dummy key
  dummyKey = generatePrivateKey('ed25519').toString('ssh');
});

test('should be able to connect', async () => {
  let sshPort = 0;
  let connected = false;
  let authenticated = false;

  // create ssh server
  const sshServer = new Server(
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

  // create a npipe/socket server
  // on windows it's an npipe, on macOS a socket file
  let socketOrNpipePathLocal: string;
  let socketOrNpipePathRemote: string;
  if (process.platform === 'win32') {
    socketOrNpipePathLocal = '\\\\.\\pipe\\test-local';
    socketOrNpipePathRemote = '\\\\.\\pipe\\test-remote';
  } else {
    socketOrNpipePathLocal = join(tmpdir(), 'test-local.sock');
    socketOrNpipePathRemote = join(tmpdir(), 'test-remote.sock');
  }

  // delete file if exists
  await rm(socketOrNpipePathLocal, { force: true });
  await rm(socketOrNpipePathRemote, { force: true });

  let listenReady = false;

  // start a remote server
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

test('disconnect should clear pending reconnect timeout', () => {
  vi.useFakeTimers();
  vi.spyOn(Client.prototype, 'connect').mockReturnThis();

  const podmanRemoteSshTunnel = new PodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );
  const connectSpy = vi.spyOn(podmanRemoteSshTunnel, 'connect');

  podmanRemoteSshTunnel.connect();
  podmanRemoteSshTunnel.handleReconnect();
  podmanRemoteSshTunnel.disconnect();

  vi.advanceTimersByTime(30000);
  expect(connectSpy).toHaveBeenCalledTimes(1);
});

test('should expose ssh connection errors', () => {
  vi.useFakeTimers();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const capturedClient: { value?: Client } = {};
  vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client): Client {
    capturedClient.value = this;
    return this;
  });

  const podmanRemoteSshTunnel = new PodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );

  podmanRemoteSshTunnel.connect();
  capturedClient.value?.emit('error', new Error('connection refused'));

  expect(podmanRemoteSshTunnel.status()).toBe('unknown');
  expect(podmanRemoteSshTunnel.error).toBe('connection refused');

  podmanRemoteSshTunnel.disconnect();
});

test('should expose unexpected ssh end and close errors while reconnecting', () => {
  vi.useFakeTimers();
  const capturedClients: Client[] = [];
  vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client): Client {
    capturedClients.push(this);
    return this;
  });

  const podmanRemoteSshTunnel = new PodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );

  podmanRemoteSshTunnel.connect();
  capturedClients[0].emit('end');

  expect(podmanRemoteSshTunnel.status()).toBe('stopped');
  expect(podmanRemoteSshTunnel.error).toBe('SSH connection ended unexpectedly');

  vi.advanceTimersByTime(30000);
  capturedClients[1].emit('close');

  expect(podmanRemoteSshTunnel.status()).toBe('stopped');
  expect(podmanRemoteSshTunnel.error).toBe('SSH connection closed unexpectedly');

  podmanRemoteSshTunnel.disconnect();
});

test('should clear error when ssh connection becomes ready', async () => {
  vi.useFakeTimers();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mockedCreateServer().mockReturnValue({
    listen: vi.fn((_path, callback) => {
      callback();
    }),
    on: vi.fn(),
    close: vi.fn(),
  } as unknown as net.Server);

  const capturedClient: { value?: Client } = {};
  vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client): Client {
    capturedClient.value = this;
    return this;
  });

  const podmanRemoteSshTunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );

  podmanRemoteSshTunnel.connect();
  capturedClient.value?.emit('error', new Error('connection refused'));
  capturedClient.value?.emit('ready');

  await vi.waitFor(() => expect(podmanRemoteSshTunnel.isListening()).toBeTruthy());
  expect(podmanRemoteSshTunnel.status()).toBe('started');
  expect(podmanRemoteSshTunnel.error).toBeUndefined();

  podmanRemoteSshTunnel.disconnect();
});

test('should expose remote socket errors', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  let localConnectionHandler: ((localSocket: net.Socket) => void) | undefined;
  mockedCreateServer().mockImplementation(
    (optionsOrHandler?: net.ServerOpts | ((socket: net.Socket) => void), handler?: (socket: net.Socket) => void) => {
      localConnectionHandler = typeof optionsOrHandler === 'function' ? optionsOrHandler : handler;
      return {
        listen: vi.fn((_path, callback) => {
          callback();
        }),
        on: vi.fn(),
        close: vi.fn(),
      } as unknown as net.Server;
    },
  );

  const localSocket = new PassThrough() as unknown as net.Socket;
  const remoteSocket = new PassThrough();
  const capturedClient: { value?: Client } = {};
  vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client): Client {
    capturedClient.value = this;
    return this;
  });
  vi.spyOn(Client.prototype, 'openssh_forwardOutStreamLocal').mockImplementation((_path, callback) => {
    callback(undefined, remoteSocket as never);
    return undefined as never;
  });

  const podmanRemoteSshTunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );

  podmanRemoteSshTunnel.connect();
  capturedClient.value?.emit('ready');
  await vi.waitFor(() => expect(podmanRemoteSshTunnel.isListening()).toBeTruthy());

  localConnectionHandler?.(localSocket);
  await vi.waitFor(() => expect(Client.prototype.openssh_forwardOutStreamLocal).toHaveBeenCalled());

  remoteSocket.emit('error', { message: 'remote socket failed' });

  expect(podmanRemoteSshTunnel.error).toBe('remote socket failed');

  podmanRemoteSshTunnel.disconnect();
});

test('should expose errors when remote forwarding fails', async () => {
  let localConnectionHandler: ((localSocket: net.Socket) => void) | undefined;
  mockedCreateServer().mockImplementation(
    (optionsOrHandler?: net.ServerOpts | ((socket: net.Socket) => void), handler?: (socket: net.Socket) => void) => {
      localConnectionHandler = typeof optionsOrHandler === 'function' ? optionsOrHandler : handler;
      return {
        listen: vi.fn((_path, callback) => {
          callback();
        }),
        on: vi.fn(),
        close: vi.fn(),
      } as unknown as net.Server;
    },
  );

  const localSocket = new PassThrough() as unknown as net.Socket;
  const capturedClient: { value?: Client } = {};
  vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client): Client {
    capturedClient.value = this;
    return this;
  });
  vi.spyOn(Client.prototype, 'openssh_forwardOutStreamLocal').mockImplementation((_path, callback) => {
    callback(new Error('forward failed'), undefined as never);
    return undefined as never;
  });

  const podmanRemoteSshTunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    '',
    '/tmp/remote.sock',
    '/tmp/local.sock',
  );

  podmanRemoteSshTunnel.connect();
  capturedClient.value?.emit('ready');
  await vi.waitFor(() => expect(podmanRemoteSshTunnel.isListening()).toBeTruthy());

  localConnectionHandler?.(localSocket);
  await vi.waitFor(() => expect(podmanRemoteSshTunnel.error).toBe('forward failed'));

  podmanRemoteSshTunnel.disconnect();
});
