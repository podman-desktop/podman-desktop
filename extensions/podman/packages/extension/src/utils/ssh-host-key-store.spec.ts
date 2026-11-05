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

import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { window } from '@podman-desktop/api';
import { Client } from 'ssh2';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore, withHostVerificationTimeout } from './ssh-host-key-store';

vi.mock(import('node:fs/promises'), { spy: true });

let storagePath: string;
let store: SshHostKeyStore;
const key = Buffer.from('server public key');
const fingerprint = `SHA256:${createHash('sha256').update(key).digest('base64').replace(/=+$/, '')}`;

beforeEach(async () => {
  vi.resetAllMocks();
  storagePath = await fs.mkdtemp(join(tmpdir(), 'podman-host-keys-'));
  store = new SshHostKeyStore(storagePath);
  vi.mocked(window.showWarningMessage).mockResolvedValue('Trust and Save');
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  await fs.rm(storagePath, { recursive: true, force: true });
});

test('requires explicit approval and persists the SHA256 fingerprint across instances', async () => {
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  expect(window.showWarningMessage).toHaveBeenCalledWith(
    expect.stringContaining(`[server]:22 is not yet trusted by Podman Desktop. Host key fingerprint: ${fingerprint}`),
    'Cancel',
    'Trust and Save',
  );
  vi.mocked(window.showWarningMessage).mockClear();
  await expect(new SshHostKeyStore(storagePath).verify('SERVER', 22, key)).resolves.toBe(true);
  expect(window.showWarningMessage).not.toHaveBeenCalled();
});

test.each(['Cancel', undefined, 'unexpected'])('does not save unapproved keys (%s)', async approval => {
  vi.mocked(window.showWarningMessage).mockResolvedValue(approval);
  await expect(store.verify('server', 22, key)).resolves.toBe(false);
  await expect(fs.readdir(join(storagePath, 'ssh-host-keys'))).rejects.toMatchObject({ code: 'ENOENT' });
});

test('rejects changed keys without prompting or replacing the pin', async () => {
  await store.verify('server', 22, key);
  vi.mocked(window.showWarningMessage).mockClear();
  await expect(store.verify('server', 22, Buffer.from('attacker key'))).rejects.toThrow('SSH host key changed');
  expect(window.showWarningMessage).not.toHaveBeenCalled();
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
});

test('pins independently by hostname and port', async () => {
  await store.verify('server', 22, key);
  await store.verify('other', 22, key);
  await store.verify('server', 2222, key);
  expect(window.showWarningMessage).toHaveBeenCalledTimes(3);
});

test('deduplicates simultaneous approval prompts across instances', async () => {
  const other = new SshHostKeyStore(storagePath);
  await expect(Promise.all([store.verify('server', 22, key), other.verify('server', 22, key)])).resolves.toEqual([
    true,
    true,
  ]);
  expect(window.showWarningMessage).toHaveBeenCalledTimes(1);
});

test('does not allow concurrent approval to overwrite a different key', async () => {
  const results = await Promise.allSettled([
    store.verify('server', 22, key),
    store.verify('server', 22, Buffer.from('different key')),
  ]);
  expect(results[0]).toMatchObject({ status: 'fulfilled', value: true });
  expect(results[1]).toMatchObject({ status: 'rejected', reason: expect.any(Error) });
  expect(window.showWarningMessage).toHaveBeenCalledTimes(1);
});

test('fails closed on unreadable storage without offering approval', async () => {
  const file = join(storagePath, 'ssh-host-keys', createHash('sha256').update('[server]:22').digest('hex'));
  await fs.mkdir(file, { recursive: true });
  await expect(store.verify('server', 22, key)).rejects.toMatchObject({ code: 'EISDIR' });
  expect(window.showWarningMessage).not.toHaveBeenCalled();
});

test('fails closed if the approved pin cannot be saved', async () => {
  const file = join(storagePath, 'ssh-host-keys', createHash('sha256').update('[server]:22').digest('hex'));
  vi.mocked(window.showWarningMessage).mockImplementation(async () => {
    await fs.mkdir(join(storagePath, 'ssh-host-keys'), { recursive: true });
    await fs.writeFile(file, 'another instance saved a key');
    return 'Trust and Save';
  });
  await expect(store.verify('server', 22, key)).rejects.toThrow('SSH host key changed');
  await expect(fs.readFile(file, 'utf8')).resolves.toBe('another instance saved a key');
});

test('rechecks a pinned key after a concurrent mismatching key fails', async () => {
  await store.verify('server', 22, key);
  const results = await Promise.allSettled([
    store.verify('server', 22, Buffer.from('attacker')),
    store.verify('server', 22, key),
  ]);
  expect(results[0]).toMatchObject({ status: 'rejected' });
  expect(results[1]).toEqual({ status: 'fulfilled', value: true });
});

test('accepts an identical pin published by another process during approval', async () => {
  const file = join(storagePath, 'ssh-host-keys', createHash('sha256').update('[server]:22').digest('hex'));
  vi.mocked(window.showWarningMessage).mockImplementation(async () => {
    await fs.mkdir(join(storagePath, 'ssh-host-keys'), { recursive: true });
    await fs.writeFile(file, fingerprint);
    return 'Trust and Save';
  });
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  await expect(fs.readFile(file, 'utf8')).resolves.toBe(fingerprint);
  expect(await fs.readdir(join(storagePath, 'ssh-host-keys'))).toEqual([basename(file)]);
});

test('publishes a complete fingerprint and removes the temporary pin', async () => {
  const { link: originalLink } = await vi.importActual<typeof fs>('node:fs/promises');
  const publish = vi.spyOn(fs, 'link').mockImplementation(async (temporary, destination) => {
    await expect(fs.readFile(temporary, 'utf8')).resolves.toBe(fingerprint);
    await expect(fs.readFile(destination, 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await originalLink(temporary, destination);
  });
  await store.verify('server', 22, key);
  expect(publish).toHaveBeenCalledOnce();
  const files = await fs.readdir(join(storagePath, 'ssh-host-keys'));
  expect(files).toHaveLength(1);
  await expect(fs.readFile(join(storagePath, 'ssh-host-keys', files[0] ?? ''), 'utf8')).resolves.toBe(fingerprint);
});

test('a failed write never publishes a partial pin', async () => {
  vi.spyOn(fs, 'open').mockRejectedValueOnce(new Error('Disk full'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Disk full');
  expect(await fs.readdir(join(storagePath, 'ssh-host-keys'))).toEqual([]);
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
});

test('pauses handshake timeout during approval and resumes after approval', async () => {
  vi.useFakeTimers();
  const client = new Client();
  const error = vi.fn();
  client.on('error', error);
  const destroy = vi.spyOn(client, 'destroy').mockReturnThis();
  let approve: ((trusted: boolean) => void) | undefined;
  const config = withHostVerificationTimeout(client, (_key, callback) => {
    approve = callback;
  });
  const callback = vi.fn();
  config.hostVerifier(key, callback);
  vi.advanceTimersByTime(60000);
  expect(error).not.toHaveBeenCalled();
  expect(config.readyTimeout).toBe(0);
  approve?.(true);
  expect(callback).toHaveBeenCalledWith(true);
  vi.advanceTimersByTime(20000);
  expect(error).toHaveBeenCalledWith(expect.any(Error));
  expect(destroy).toHaveBeenCalledOnce();
});

test('bounds handshake time before approval and clears the timer when ready', () => {
  vi.useFakeTimers();
  const client = new Client();
  const error = vi.fn();
  client.on('error', error);
  const destroy = vi.spyOn(client, 'destroy').mockReturnThis();
  withHostVerificationTimeout(client, (_key, callback) => callback(true));
  vi.advanceTimersByTime(20000);
  expect(destroy).toHaveBeenCalledOnce();
  const readyClient = new Client();
  readyClient.on('error', error);
  withHostVerificationTimeout(readyClient, (_key, callback) => callback(true));
  readyClient.emit('ready');
  vi.advanceTimersByTime(20000);
  expect(error).toHaveBeenCalledOnce();
});

test('does not resume a disconnected client after approval', () => {
  vi.useFakeTimers();
  const client = new Client();
  let approve: ((trusted: boolean) => void) | undefined;
  const config = withHostVerificationTimeout(client, (_key, callback) => {
    approve = callback;
  });

  const callback = vi.fn();
  config.hostVerifier(key, callback);
  client.emit('close');
  approve?.(true);
  expect(callback).toHaveBeenCalledWith(false);
  expect(vi.getTimerCount()).toBe(0);
});

test('verifies rekeying after authentication without restarting the handshake timer', () => {
  vi.useFakeTimers();
  const client = new Client();
  const config = withHostVerificationTimeout(client, (_key, callback) => callback(true));
  client.emit('ready');
  const callback = vi.fn();
  config.hostVerifier(key, callback);
  expect(callback).toHaveBeenCalledWith(true);
  expect(vi.getTimerCount()).toBe(0);
});

test('fails closed when approval fails', async () => {
  vi.mocked(window.showWarningMessage).mockRejectedValue(new Error('Dialog failed'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Dialog failed');
});

test('reports verification failures to ssh2 and the caller', async () => {
  const rejected = vi.fn();
  const callback = vi.fn();
  new SshHostKeyStore(undefined).createVerifier('server', 22, rejected)(key, callback);
  await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(false));
  expect(rejected).toHaveBeenCalledWith(expect.any(Error));
});
