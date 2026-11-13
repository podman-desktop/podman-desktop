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

import * as net from 'node:net';
import { EventEmitter } from 'node:events';
import { rm } from 'node:fs/promises';
import { type AddressInfo, createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ExtensionContext } from '@podman-desktop/api';
import { window } from '@podman-desktop/api';
import { Client, type ConnectConfig } from 'ssh2';
import { beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore } from '/@/utils/ssh-host-key-store';

import { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

vi.mock(import('ssh2'));
vi.mock(import('node:net'));
vi.mock(import('/@/utils/ssh-host-key-store'));

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

let store: SshHostKeyStore;
let client: Client;
let server: net.Server;
let tunnel: TestPodmanRemoteSshTunnel;
let events: Map<string, () => void>;
let rejected: ((error: Error) => void) | undefined;
const hostVerifier = vi.fn();

beforeEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.resetAllMocks();
  store = new SshHostKeyStore({} as ExtensionContext);
  client = new Client();
  server = new net.Server();
  events = new Map();
  rejected = undefined;
  vi.mocked(Client).mockImplementation(function () {
    return client;
  });
  vi.mocked(client.on).mockImplementation(function (this: Client, event: string, listener: (...args: never[]) => void) {
    events.set(event, listener);
    return this;
  });
  vi.mocked(client.connect).mockReturnThis();
  vi.mocked(net.createServer).mockReturnValue(server);
  vi.mocked(server.on).mockReturnThis();
  vi.mocked(server.listen).mockImplementation(function (this: net.Server, _path, callback) {
    if (typeof callback === 'function') callback();
    return this;
  });
  vi.mocked(store.getConnectionConfig).mockImplementation((_client, _host, _port, onRejected) => {
    rejected = onRejected;
    return { hostVerifier, readyTimeout: 0 };
  });
  vi.mocked(window.showErrorMessage).mockResolvedValue(undefined);
  tunnel = new TestPodmanRemoteSshTunnel('remote.example', 22, 'user', 'key', '/remote.sock', '/local.sock', store);
});

test('uses the injected singleton to configure verification before authentication', () => {
  tunnel.connect();
  expect(store.getConnectionConfig).toHaveBeenCalledWith(client, 'remote.example', 22, expect.any(Function));
  expect(client.connect).toHaveBeenCalledWith(expect.objectContaining({ hostVerifier, readyTimeout: 0 }));
  expect(net.createServer).not.toHaveBeenCalled();
});

test('allows OpenSSH extensions on servers with a non-OpenSSH identifier', () => {
  expect(tunnel.getSshConfig().strictVendor).toBe(false);
});

test('creates the listener only when the SSH client is ready', async () => {
  tunnel.connect();
  events.get('ready')?.();
  await expect(tunnel.isConnected()).resolves.toBe(true);
  expect(tunnel.isListening()).toBe(true);
  expect(server.listen).toHaveBeenCalledWith('/local.sock', expect.any(Function));
  tunnel.disconnect();
});

test('host-key rejection closes the old listener and prevents retries', async () => {
  tunnel.connect();
  events.get('ready')?.();
  expect(tunnel.isListening()).toBe(true);
  tunnel.connect();
  vi.useFakeTimers();
  tunnel.handleReconnect();
  rejected?.(new Error('SSH host key changed'));
  await expect(tunnel.isConnected()).resolves.toBe(false);
  expect(server.close).toHaveBeenCalledOnce();
  expect(client.end).toHaveBeenCalledOnce();
  expect(tunnel.isListening()).toBe(false);
  expect(window.showErrorMessage).toHaveBeenCalledWith('SSH host key changed');
  events.get('close')?.();
  vi.advanceTimersByTime(60000);
  expect(client.connect).toHaveBeenCalledTimes(2);
});

test('host-key rejection cancels a reconnect timer that was already pending', async () => {
  vi.useFakeTimers();
  tunnel.connect();
  tunnel.handleReconnect();
  expect(vi.getTimerCount()).toBe(1);
  rejected?.(new Error('SSH host key changed'));
  await expect(tunnel.isConnected()).resolves.toBe(false);
  await vi.advanceTimersByTimeAsync(30000);
  expect(client.connect).toHaveBeenCalledOnce();
});

test('disconnect clears a pending reconnect', () => {
  vi.useFakeTimers();
  tunnel.connect();
  tunnel.handleReconnect();
  tunnel.disconnect();
  vi.advanceTimersByTime(30000);
  expect(client.connect).toHaveBeenCalledOnce();
});

test('does not add a verifier or alter timeouts for a localhost tunnel', () => {
  vi.mocked(store.getConnectionConfig).mockReturnValue({});
  const local = new TestPodmanRemoteSshTunnel('localhost', 22, 'user', 'key', '/remote.sock', '/local.sock', store);
  local.connect();
  expect(store.getConnectionConfig).toHaveBeenCalledWith(client, 'localhost', 22, expect.any(Function));
  const config = vi.mocked(client.connect).mock.lastCall?.[0];
  expect(config?.hostVerifier).toBeUndefined();
  expect(config?.readyTimeout).toBeUndefined();
  local.disconnect();
});

test('uses the private key instead of the ssh-agent', () => {
  expect(tunnel.getSshConfig().privateKey).toBe('key');
  expect(tunnel.getSshConfig().agent).toBeUndefined();
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

test('falls back to the ssh-agent without a private key', () => {
  vi.stubEnv('SSH_AUTH_SOCK', '/agent.sock');
  const agentTunnel = new TestPodmanRemoteSshTunnel('remote.example', 22, 'user', undefined, '/r', '/l', store);
  expect(agentTunnel.getSshConfig().agent).toBe('/agent.sock');
  expect(agentTunnel.getSshConfig().privateKey).toBeUndefined();
});

test('does not set an agent when none is available', () => {
  vi.stubEnv('SSH_AUTH_SOCK', undefined);
  const agentTunnel = new TestPodmanRemoteSshTunnel('remote.example', 22, 'user', undefined, '/r', '/l', store);
  expect(agentTunnel.getSshConfig().agent).toBeUndefined();
});
