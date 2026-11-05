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

import { mkdtemp, rm } from 'node:fs/promises';
import { type AddressInfo, createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { window } from '@podman-desktop/api';
import { Client, type ConnectConfig, Server } from 'ssh2';
import { generatePrivateKey } from 'sshpk';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore } from '/@/utils/ssh-host-key-store';

import { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

let storagePath: string;

beforeEach(async () => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  storagePath = await mkdtemp(join(tmpdir(), 'podman-ssh-test-'));
  vi.mocked(window.showWarningMessage).mockResolvedValue('Trust and Save');
  vi.mocked(window.showErrorMessage).mockResolvedValue(undefined);
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  await rm(storagePath, { recursive: true, force: true });
});

class TestPodmanRemoteSshTunnel extends PodmanRemoteSshTunnel {
  isListening(): boolean {
    return super.isListening();
  }

  getSshConfig(): ConnectConfig {
    return super.getSshConfig();
  }
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
    dummyKey,
    socketOrNpipePathRemote,
    socketOrNpipePathLocal,
    storagePath,
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
  podmanRemoteSshTunnel.disconnect();
  sshServer.close();
  npipeServer.close();
});

test.each(['declined', 'changed'])('should reject a %s host key before authentication', async reason => {
  if (reason === 'declined') {
    vi.mocked(window.showWarningMessage).mockResolvedValue(undefined);
  }
  let authenticated = false;
  const server = new Server({ hostKeys: [dummyKey] }, client => {
    client.on('error', () => {});
    client.on('authentication', ctx => {
      authenticated = true;
      ctx.accept();
    });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as AddressInfo).port;
  if (reason === 'changed') {
    await new SshHostKeyStore(storagePath).verify('127.0.0.1', port, Buffer.from('different key'));
    vi.mocked(window.showWarningMessage).mockClear();
  }
  const tunnel = new TestPodmanRemoteSshTunnel(
    '127.0.0.1',
    port,
    'foo',
    dummyKey,
    '/tmp/remote.sock',
    '/tmp/local.sock',
    storagePath,
  );
  try {
    tunnel.connect();
    await expect(tunnel.isConnected()).resolves.toBe(false);
    expect(authenticated).toBe(false);
    expect(tunnel.isListening()).toBe(false);
    expect(window.showErrorMessage).toHaveBeenCalled();
    if (reason === 'changed') {
      expect(window.showWarningMessage).not.toHaveBeenCalled();
    }
    vi.useFakeTimers();
    const reconnect = vi.spyOn(tunnel, 'connect');
    tunnel.handleReconnect();
    vi.advanceTimersByTime(30000);
    expect(reconnect).not.toHaveBeenCalled();
  } finally {
    tunnel.disconnect();
    server.close();
  }
});

test('keeps the SSH connection open while approval takes longer than the handshake timeout', async () => {
  let approve: ((value: string) => void) | undefined;
  vi.mocked(window.showWarningMessage).mockReturnValue(
    new Promise<string>(resolve => {
      approve = resolve;
    }),
  );
  const server = new Server({ hostKeys: [dummyKey] }, client => {
    client.on('error', () => {});
    client.on('authentication', ctx => ctx.accept());
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as AddressInfo).port;
  const path = process.platform === 'win32' ? `\\\\.\\pipe\\approval-${port}` : join(storagePath, 'approval.sock');
  const tunnel = new TestPodmanRemoteSshTunnel('127.0.0.1', port, 'foo', dummyKey, '/remote.sock', path, storagePath);
  try {
    tunnel.connect();
    await vi.waitFor(() => expect(window.showWarningMessage).toHaveBeenCalledOnce());
    vi.useFakeTimers();
    vi.advanceTimersByTime(60000);
    expect(window.showErrorMessage).not.toHaveBeenCalled();
    expect(tunnel.isListening()).toBe(false);
    approve?.('Trust and Save');
    vi.useRealTimers();
    await expect(tunnel.isConnected()).resolves.toBe(true);
    await vi.waitFor(() => expect(tunnel.isListening()).toBe(true));
  } finally {
    tunnel.disconnect();
    server.close();
  }
});

test('closes the old listener after transport loss and rejects a changed key on reconnect', async () => {
  const connections: Client[] = [];
  const connect = vi.spyOn(Client.prototype, 'connect').mockImplementation(function (this: Client) {
    connections.push(this);
    return this;
  });
  const createVerifier = vi.spyOn(SshHostKeyStore.prototype, 'createVerifier');
  const path = process.platform === 'win32' ? '\\\\.\\pipe\\reconnect-test' : join(storagePath, 'reconnect.sock');
  const tunnel = new TestPodmanRemoteSshTunnel('server', 22, 'foo', dummyKey, '/remote.sock', path, storagePath);
  try {
    tunnel.connect();
    const first = connections[0];
    if (!first) throw new Error('Missing SSH client');
    await new SshHostKeyStore(storagePath).verify('server', 22, Buffer.from('trusted'));
    first.emit('ready');
    await vi.waitFor(() => expect(tunnel.isListening()).toBe(true));
    first.emit('error', new Error('Transport lost'));
    expect(tunnel.isListening()).toBe(false);
    await vi.waitFor(async () => {
      const error = await new Promise<Error>(resolve => {
        const socket = createConnection({ path });
        socket.on('error', resolve);
        socket.on('connect', () => {
          socket.destroy();
          resolve(new Error('Listener is still active'));
        });
      });
      expect(error.message).not.toBe('Listener is still active');
    });
    tunnel.connect();
    // A listener from a previously authenticated connection must also close on rejection.
    connections[1]?.emit('ready');
    await vi.waitFor(() => expect(tunnel.isListening()).toBe(true));
    const callback = vi.fn();
    const verifier = createVerifier.mock.results[0]?.value;
    if (!verifier) throw new Error('Missing verifier');
    verifier(Buffer.from('changed'), callback);
    await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(false));
    expect(window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('SSH host key changed'));
    expect(tunnel.isListening()).toBe(false);
    const config = connect.mock.lastCall?.[0];
    expect(config?.readyTimeout).toBe(0);
    vi.useFakeTimers();
    tunnel.handleReconnect();
    vi.advanceTimersByTime(30000);
    expect(connect).toHaveBeenCalledTimes(2);
  } finally {
    tunnel.disconnect();
  }
});

test('handles synchronous forwarding failures without leaving a socket open', async () => {
  const connect = vi.spyOn(Client.prototype, 'connect').mockReturnThis();
  const forward = vi.spyOn(Client.prototype, 'openssh_forwardOutStreamLocal').mockImplementation(() => {
    throw new Error('Not connected');
  });
  const path = process.platform === 'win32' ? '\\\\.\\pipe\\forward-test' : join(storagePath, 'forward.sock');
  const tunnel = new TestPodmanRemoteSshTunnel('server', 22, 'foo', dummyKey, '/remote.sock', path, storagePath);
  let socket: ReturnType<typeof createConnection> | undefined;
  try {
    tunnel.connect();
    const sshClient = connect.mock.contexts[0];
    if (!(sshClient instanceof Client)) {
      throw new Error('Missing SSH client');
    }
    sshClient.emit('ready');
    await vi.waitFor(() => expect(tunnel.isListening()).toBe(true));
    await new Promise<void>((resolve, reject) => {
      socket = createConnection({ path });
      socket.on('end', resolve).on('error', reject);
      socket.resume();
    });
    expect(forward).toHaveBeenCalledOnce();
  } finally {
    socket?.destroy();
    tunnel.disconnect();
  }
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
    storagePath,
  );
  const connectSpy = vi.spyOn(podmanRemoteSshTunnel, 'connect');

  podmanRemoteSshTunnel.connect();
  podmanRemoteSshTunnel.handleReconnect();
  podmanRemoteSshTunnel.disconnect();

  vi.advanceTimersByTime(30000);
  expect(connectSpy).toHaveBeenCalledTimes(1);
});

test('should use the provided private key over the ssh-agent', () => {
  const tunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    'my-private-key',
    '/tmp/remote.sock',
    '/tmp/local.sock',
    storagePath,
  );
  const config = tunnel.getSshConfig();
  expect(config.privateKey).toBe('my-private-key');
  expect(config.agent).toBeUndefined();
});

test('should fall back to the ssh-agent when no private key is provided', () => {
  vi.stubEnv('SSH_AUTH_SOCK', '/tmp/agent.sock');
  const tunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    undefined,
    '/tmp/remote.sock',
    '/tmp/local.sock',
    storagePath,
  );
  const config = tunnel.getSshConfig();
  expect(config.privateKey).toBeUndefined();
  expect(config.agent).toBe('/tmp/agent.sock');
});

test('should not set an agent when no private key and no ssh-agent are available', () => {
  vi.stubEnv('SSH_AUTH_SOCK', undefined);
  const tunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    undefined,
    '/tmp/remote.sock',
    '/tmp/local.sock',
    storagePath,
  );
  const config = tunnel.getSshConfig();
  expect(config.privateKey).toBeUndefined();
  expect(config.agent).toBeUndefined();
});
