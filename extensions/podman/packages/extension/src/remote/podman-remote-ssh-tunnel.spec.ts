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

import { EventEmitter } from 'node:events';
import { rm } from 'node:fs/promises';
import { type AddressInfo, createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Client, type ConnectConfig, Server } from 'ssh2';
import { generatePrivateKey } from 'sshpk';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

class TestPodmanRemoteSshTunnel extends PodmanRemoteSshTunnel {
  isListening(): boolean {
    return super.isListening();
  }

  getSshConfig(): ConnectConfig {
    return super.getSshConfig();
  }

  registerSocketErrorHandler(socket: EventEmitter, peerSocket: { end(): unknown }, side: 'local' | 'remote'): void {
    super.registerSocketErrorHandler(socket, peerSocket, side);
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
      // explicitly identify as something non-OpenSSH
      // the server doesn't need to be OpenSSH, just needs to support some @openssh.com vendor extensions
      ident: 'some-custom-name',
    },
    client => {
      connected = true;

      client
        .on('authentication', ctx => {
          ctx.accept();
        })
        .on('ready', () => {
          authenticated = true;
        })
        .on('openssh.streamlocal', (accept, _reject, info) => {
          const stream = accept();
          stream.pipe(createConnection(info.socketPath)).pipe(stream);
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
  const npipeServer = createServer(socket => socket.end('pong')).listen(socketOrNpipePathRemote, () => {
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
  );

  podmanRemoteSshTunnel.connect();

  // wait authenticated and connected
  await vi.waitFor(() => expect(connected && authenticated && podmanRemoteSshTunnel.isListening()).toBeTruthy());

  // send a request to the tunnel using the socket path and expect the remote server's reply
  let received = '';
  const client = createConnection({ path: socketOrNpipePathLocal });
  client.on('data', data => {
    received += data.toString();
  });

  await vi.waitFor(() => expect(received).toBe('pong'));

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

test('logs safe configuration when either tunnel socket emits an error', () => {
  const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const tunnel = new TestPodmanRemoteSshTunnel('localhost', 22, 'foo', dummyKey, '/tmp/remote.sock', '/tmp/local.sock');
  tunnel.getSshConfig().password = 'test-password';
  tunnel.getSshConfig().passphrase = 'test-passphrase';
  const localSocket = new EventEmitter();
  const remoteSocket = new EventEmitter();
  const localEnd = vi.fn();
  const remoteEnd = vi.fn();
  tunnel.registerSocketErrorHandler(localSocket, { end: remoteEnd }, 'local');
  tunnel.registerSocketErrorHandler(remoteSocket, { end: localEnd }, 'remote');

  const localError = new Error('local socket failure');
  const remoteError = new Error('remote socket failure');
  localSocket.emit('error', localError);
  remoteSocket.emit('error', remoteError);

  expect(logSpy).toHaveBeenNthCalledWith(
    1,
    'Podman ssh tunnel local socket error using configuration',
    { host: 'localhost', port: 22, username: 'foo' },
    localError,
  );
  expect(logSpy).toHaveBeenNthCalledWith(
    2,
    'Podman ssh tunnel remote socket error using configuration',
    { host: 'localhost', port: 22, username: 'foo' },
    remoteError,
  );
  expect(logSpy).toHaveBeenCalledTimes(2);
  expect(localEnd).toHaveBeenCalledOnce();
  expect(remoteEnd).toHaveBeenCalledOnce();
  expect(logSpy.mock.calls.flat().join(' ')).not.toContain(dummyKey);
});

test('should use the provided private key over the ssh-agent', () => {
  const tunnel = new TestPodmanRemoteSshTunnel(
    'localhost',
    22,
    'foo',
    'my-private-key',
    '/tmp/remote.sock',
    '/tmp/local.sock',
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
  );
  const config = tunnel.getSshConfig();
  expect(config.privateKey).toBeUndefined();
  expect(config.agent).toBeUndefined();
});
