/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import * as fs from 'node:fs/promises';

import type { ExtensionContext } from '@podman-desktop/api';
import { window } from '@podman-desktop/api';
import { Client } from 'ssh2';
import { beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore } from './ssh-host-key-store';

vi.mock(import('node:fs/promises'));
vi.mock(import('ssh2'));

class TestSshHostKeyStore extends SshHostKeyStore {
  getFingerprint(key: Buffer): string {
    return super.getFingerprint(key);
  }

  getPinPath(host: string, port: number): string {
    return super.getPinPath(host, port);
  }
}

const key = Buffer.from('server public key');
const context = { storagePath: '/extension-storage' } as ExtensionContext;
let store: TestSshHostKeyStore;
let client: Client;
let events: Map<string, () => void>;

beforeEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
  store = new TestSshHostKeyStore(context);
  client = new Client();
  events = new Map();
  vi.mocked(client.once).mockImplementation(function (
    this: Client,
    event: string,
    listener: (...args: never[]) => void,
  ) {
    events.set(event, listener);
    return this;
  });
  vi.mocked(fs.readFile).mockRejectedValue(Object.assign(new Error('Not found'), { code: 'ENOENT' }));
  vi.mocked(fs.mkdtemp).mockResolvedValue('/extension-storage/ssh-host-keys/.pending-test');
  vi.mocked(window.showWarningMessage).mockResolvedValue('Trust and Save');
});

test('requires explicit approval and publishes a complete fingerprint without overwriting a pin', async () => {
  const fingerprint = store.getFingerprint(key);
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  expect(window.showWarningMessage).toHaveBeenCalledWith(
    expect.stringContaining(`[server]:22 is not yet trusted. Host key fingerprint: ${fingerprint}`),
    'Cancel',
    'Trust and Save',
  );
  expect(fs.writeFile).toHaveBeenCalledWith('/extension-storage/ssh-host-keys/.pending-test/pin', fingerprint, {
    flag: 'wx',
    mode: 0o600,
    flush: true,
  });
  expect(fs.link).toHaveBeenCalledWith(
    '/extension-storage/ssh-host-keys/.pending-test/pin',
    store.getPinPath('server', 22),
  );
  expect(vi.mocked(fs.writeFile).mock.invocationCallOrder[0]).toBeLessThan(
    vi.mocked(fs.link).mock.invocationCallOrder[0] ?? 0,
  );
  expect(fs.rm).toHaveBeenCalledWith('/extension-storage/ssh-host-keys/.pending-test', {
    recursive: true,
    force: true,
  });
});

test.each(['Cancel', undefined, 'unexpected'])('refuses unapproved keys (%s)', async approval => {
  vi.mocked(window.showWarningMessage).mockResolvedValue(approval);
  await expect(store.verify('server', 22, key)).resolves.toBe(false);
  expect(fs.writeFile).not.toHaveBeenCalled();
});

test('accepts a saved fingerprint without prompting', async () => {
  vi.mocked(fs.readFile).mockResolvedValue(store.getFingerprint(key));
  await expect(store.verify('SERVER', 22, key)).resolves.toBe(true);
  expect(fs.readFile).toHaveBeenCalledWith(store.getPinPath('server', 22), 'utf8');
  expect(window.showWarningMessage).not.toHaveBeenCalled();
});

test('rejects changed keys without offering replacement', async () => {
  vi.mocked(fs.readFile).mockResolvedValue('SHA256:old-key');
  await expect(store.verify('server', 22, key)).rejects.toThrow('SSH host key changed');
  expect(window.showWarningMessage).not.toHaveBeenCalled();
  expect(fs.writeFile).not.toHaveBeenCalled();
});

test('pins independently by hostname and port', () => {
  expect(store.getPinPath('server', 22)).not.toBe(store.getPinPath('other', 22));
  expect(store.getPinPath('server', 22)).not.toBe(store.getPinPath('server', 2222));
  expect(store.getPinPath('SERVER', 22)).toBe(store.getPinPath('server', 22));
});

test('deduplicates simultaneous prompts in the singleton', async () => {
  await expect(Promise.all([store.verify('server', 22, key), store.verify('server', 22, key)])).resolves.toEqual([
    true,
    true,
  ]);
  expect(window.showWarningMessage).toHaveBeenCalledOnce();
});

test('rechecks a pinned key after a concurrent mismatch fails', async () => {
  vi.mocked(fs.readFile).mockResolvedValue(store.getFingerprint(key));
  const results = await Promise.allSettled([
    store.verify('server', 22, Buffer.from('attacker')),
    store.verify('server', 22, key),
  ]);
  expect(results[0]).toMatchObject({ status: 'rejected' });
  expect(results[1]).toEqual({ status: 'fulfilled', value: true });
});

test.each([true, false])('accepts only an identical concurrently published pin (same: %s)', async same => {
  vi.mocked(fs.link).mockRejectedValue(Object.assign(new Error('Exists'), { code: 'EEXIST' }));
  vi.mocked(fs.readFile)
    .mockRejectedValueOnce(Object.assign(new Error('Not found'), { code: 'ENOENT' }))
    .mockResolvedValue(same ? store.getFingerprint(key) : 'SHA256:other-key');
  if (same) {
    await expect(store.verify('server', 22, key)).resolves.toBe(true);
  } else {
    await expect(store.verify('server', 22, key)).rejects.toThrow('SSH host key changed');
  }
  expect(fs.rm).toHaveBeenCalled();
});

test('does not publish a partially written pin', async () => {
  vi.mocked(fs.writeFile).mockRejectedValue(new Error('Disk full'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Disk full');
  expect(fs.link).not.toHaveBeenCalled();
  expect(fs.rm).toHaveBeenCalled();
});

test('fails closed on unreadable storage', async () => {
  vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Permission denied');
  expect(window.showWarningMessage).not.toHaveBeenCalled();
});

test('fails closed when approval fails', async () => {
  vi.mocked(window.showWarningMessage).mockRejectedValue(new Error('Dialog failed'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Dialog failed');
});

test.each(['localhost', 'LOCALHOST', 'localhost.', '127.0.0.1', '127.99.0.2', '::1', '[::1]', '0:0:0:0:0:0:0:1'])(
  'does not verify localhost endpoint %s or require storage',
  async host => {
    const localStore = new TestSshHostKeyStore({} as ExtensionContext);
    expect(localStore.getConnectionConfig(client, host, 22, vi.fn())).toEqual({});
    await expect(localStore.verify(host, 22, key)).resolves.toBe(true);
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(window.showWarningMessage).not.toHaveBeenCalled();
    expect(client.once).not.toHaveBeenCalled();
  },
);

test.each(['remote.example', 'localhost.example.com', '192.168.0.1', '128.0.0.1', '::2'])(
  'requires verification for non-localhost endpoint %s',
  host => {
    const config = store.getConnectionConfig(client, host, 22, vi.fn());
    expect(config.hostVerifier).toBeTypeOf('function');
    expect(config.readyTimeout).toBe(0);
    events.get('close')?.();
  },
);

test('reports rejection to ssh2 and the caller', async () => {
  const rejected = vi.fn();
  const callback = vi.fn();
  const config = store.getConnectionConfig(client, 'server', 22, rejected);
  vi.mocked(window.showWarningMessage).mockResolvedValue(undefined);
  // The configuration uses a raw-key asynchronous verifier, not a fingerprint overload.
  if (!config.hostVerifier) throw new Error('Missing raw host verifier');
  const verifier = config.hostVerifier;
  verifier(key, callback);
  await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(false));
  expect(rejected).toHaveBeenCalledWith(expect.any(Error));
  events.get('close')?.();
});

test('pauses the timeout while approval is pending and resumes after approval', async () => {
  vi.useFakeTimers();
  let approve: ((value: string) => void) | undefined;
  vi.mocked(window.showWarningMessage).mockReturnValue(
    new Promise(resolve => {
      approve = resolve;
    }),
  );
  const config = store.getConnectionConfig(client, 'server', 22, vi.fn());
  const verifier = config.hostVerifier;
  if (!verifier) throw new Error('Missing raw host verifier');
  const callback = vi.fn();
  verifier(key, callback);
  await vi.advanceTimersByTimeAsync(60000);
  expect(client.destroy).not.toHaveBeenCalled();
  approve?.('Trust and Save');
  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledWith(true);
  await vi.advanceTimersByTimeAsync(20000);
  expect(client.emit).toHaveBeenCalledWith('error', expect.any(Error));
  expect(client.destroy).toHaveBeenCalledOnce();
});

test('bounds handshake time before approval and clears the timer when ready', () => {
  vi.useFakeTimers();
  store.getConnectionConfig(client, 'server', 22, vi.fn());
  vi.advanceTimersByTime(20000);
  expect(client.destroy).toHaveBeenCalledOnce();
  events.get('close')?.();
  store.getConnectionConfig(client, 'server', 22, vi.fn());
  events.get('ready')?.();
  vi.advanceTimersByTime(20000);
  expect(client.destroy).toHaveBeenCalledOnce();
});

test('does not resume a closed connection after approval', async () => {
  vi.useFakeTimers();
  let approve: ((value: string) => void) | undefined;
  vi.mocked(window.showWarningMessage).mockReturnValue(
    new Promise(resolve => {
      approve = resolve;
    }),
  );
  const config = store.getConnectionConfig(client, 'server', 22, vi.fn());
  if (!config.hostVerifier) throw new Error('Missing raw host verifier');
  const callback = vi.fn();
  config.hostVerifier(key, callback);
  await vi.advanceTimersByTimeAsync(0);
  events.get('close')?.();
  approve?.('Trust and Save');
  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledWith(false);
  expect(vi.getTimerCount()).toBe(0);
});

test('verifies rekeying without restarting the handshake timer', async () => {
  vi.useFakeTimers();
  vi.mocked(fs.readFile).mockResolvedValue(store.getFingerprint(key));
  const config = store.getConnectionConfig(client, 'server', 22, vi.fn());
  if (!config.hostVerifier) throw new Error('Missing raw host verifier');
  events.get('ready')?.();
  const callback = vi.fn();
  config.hostVerifier(key, callback);
  await vi.advanceTimersByTimeAsync(0);
  expect(callback).toHaveBeenCalledWith(true);
  expect(vi.getTimerCount()).toBe(0);
});

test('reports unavailable remote trust storage rather than accepting the host', async () => {
  const missingStorage = new TestSshHostKeyStore({} as ExtensionContext);
  await expect(missingStorage.verify('server', 22, key)).rejects.toThrow('extension storage is unavailable');
});
