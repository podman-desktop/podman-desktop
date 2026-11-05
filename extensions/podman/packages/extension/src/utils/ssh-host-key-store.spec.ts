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
import { join } from 'node:path';

import { window } from '@podman-desktop/api';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore } from './ssh-host-key-store';

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
  await expect(store.verify('server', 22, key)).rejects.toMatchObject({ code: 'EEXIST' });
  await expect(fs.readFile(file, 'utf8')).resolves.toBe('another instance saved a key');
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
