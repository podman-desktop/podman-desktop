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

import { createHmac } from 'node:crypto';
import * as fs from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { window } from '@podman-desktop/api';
import { Client, Server } from 'ssh2';
import { generatePrivateKey } from 'sshpk';
import { beforeEach, expect, test, vi } from 'vitest';

import { SshHostKeyStore } from './ssh-host-key-store';

vi.mock(import('node:fs/promises'));

const privateKey = generatePrivateKey('ed25519');
const key = privateKey.toPublic().toBuffer('rfc4253');
const otherKey = generatePrivateKey('ed25519').toPublic().toBuffer('rfc4253');
const publicKey = `ssh-ed25519 ${key.toString('base64')}`;
const otherPublicKey = `ssh-ed25519 ${otherKey.toString('base64')}`;
const knownHostsPath = join(homedir(), '.ssh', 'known_hosts');
let store: SshHostKeyStore;
let contents: string | undefined;

beforeEach(() => {
  vi.resetAllMocks();
  store = new SshHostKeyStore();
  contents = undefined;
  vi.mocked(fs.readFile).mockImplementation(async () => {
    if (contents === undefined) {
      throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
    }
    return contents;
  });
  vi.mocked(fs.appendFile).mockImplementation(async (_file, data) => {
    contents = (contents ?? '') + data;
  });
});

test('automatically adds unknown hosts to the CLI known_hosts file without prompting', async () => {
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  expect(fs.mkdir).toHaveBeenCalledWith(join(homedir(), '.ssh'), { recursive: true, mode: 0o700 });
  expect(fs.appendFile).toHaveBeenCalledWith(knownHostsPath, `\nserver ${publicKey}\n`, { mode: 0o600 });
  expect(window.showWarningMessage).not.toHaveBeenCalled();

  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  expect(fs.appendFile).toHaveBeenCalledOnce();
});

test.each([
  ['server', 22, 'server'],
  ['server', 2222, '[server]:2222'],
  ['2001:db8::1', 22, '2001:db8::1'],
  ['[2001:db8::1]', 2222, '[2001:db8::1]:2222'],
])('uses the OpenSSH endpoint format for %s:%s', async (host, port, endpoint) => {
  await expect(store.verify(host, port, key)).resolves.toBe(true);
  expect(contents).toBe(`\n${endpoint} ${publicKey}\n`);
});

test.each(['server', 'other,server', '*.example,server', 'ser?er', '!excluded,server'])(
  'accepts existing known_hosts patterns (%s) and rejects changed keys',
  async hosts => {
    contents = `# Existing SSH hosts\r\n${hosts} ${publicKey} comment\r\n`;
    await expect(store.verify('server', 22, key)).resolves.toBe(true);
    await expect(store.verify('server', 22, otherKey)).rejects.toThrow('SSH host key changed');
    expect(fs.appendFile).not.toHaveBeenCalled();
  },
);

test('does not match excluded hosts or entries for another port', async () => {
  contents = `!server,* ${otherPublicKey}\n[server]:2222 ${otherPublicKey}\n`;
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  expect(fs.appendFile).toHaveBeenCalledOnce();
});

test.each([22, 2222])('checks hashed known_hosts entries for port %s', async port => {
  const endpoint = port === 22 ? 'server' : `[server]:${port}`;
  const salt = Buffer.from('known-hosts-test-salt');
  const hash = createHmac('sha1', salt).update(endpoint).digest('base64');
  contents = `|1|${salt.toString('base64')}|${hash} ${publicKey}\n`;
  await expect(store.verify('server', port, key)).resolves.toBe(true);
  await expect(store.verify('server', port, otherKey)).rejects.toThrow('SSH host key changed');
  expect(fs.appendFile).not.toHaveBeenCalled();
});

test('accepts any recorded key but rejects revoked keys', async () => {
  contents = `server ${publicKey}\nserver ${otherPublicKey}\n`;
  await expect(store.verify('server', 22, key)).resolves.toBe(true);
  await expect(store.verify('server', 22, otherKey)).resolves.toBe(true);
  contents += `@revoked * ${publicKey}\n`;
  await expect(store.verify('server', 22, key)).rejects.toThrow('SSH host key revoked');
  expect(fs.appendFile).not.toHaveBeenCalled();
});

test('does not replace a certificate-authority entry with a newly trusted raw key', async () => {
  contents = `@cert-authority server ${publicKey}\n`;
  await expect(store.verify('server', 22, otherKey)).rejects.toThrow('Connection refused');
  expect(fs.appendFile).not.toHaveBeenCalled();
});

test('serializes simultaneous first connections and rejects a conflicting key', async () => {
  const results = await Promise.allSettled([
    store.verify('server', 22, key),
    store.verify('server', 22, otherKey),
    store.verify('server', 22, key),
  ]);
  expect(results[0]).toEqual({ status: 'fulfilled', value: true });
  expect(results[1]).toMatchObject({ status: 'rejected', reason: expect.any(Error) });
  expect(results[2]).toEqual({ status: 'fulfilled', value: true });
  expect(fs.appendFile).toHaveBeenCalledOnce();
});

test.each(['invalid entry', 'server ssh-ed25519 invalid', '@unknown server key data'])(
  'fails closed on malformed known_hosts data (%s)',
  async entry => {
    contents = entry;
    await expect(store.verify('server', 22, key)).rejects.toThrow('Invalid SSH');
    expect(fs.appendFile).not.toHaveBeenCalled();
  },
);

test('fails closed on unreadable known_hosts or failed writes', async () => {
  vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('Permission denied'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Permission denied');
  expect(fs.appendFile).not.toHaveBeenCalled();
  vi.mocked(fs.appendFile).mockRejectedValueOnce(new Error('Disk full'));
  await expect(store.verify('server', 22, key)).rejects.toThrow('Disk full');
});

test.each(['localhost', 'LOCALHOST', 'localhost.', '127.0.0.1', '127.99.0.2', '::1', '[::1]', '0:0:0:0:0:0:0:1'])(
  'leaves localhost endpoint %s unchanged',
  async host => {
    await expect(store.getConnectionConfig(host, 22, vi.fn())).resolves.toEqual({});
    await expect(store.verify(host, 22, key)).resolves.toBe(true);
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(fs.appendFile).not.toHaveBeenCalled();
  },
);

test('prefers recorded host-key algorithms and preserves the default handshake timeout', async () => {
  contents = `server ${publicKey}\n`;
  const config = await store.getConnectionConfig('server', 22, vi.fn());
  expect(config.algorithms?.serverHostKey).toEqual(['ssh-ed25519']);
  expect(config).not.toHaveProperty('readyTimeout');
});

test('reports verification failures to ssh2 and the tunnel', async () => {
  contents = `server ${otherPublicKey}\n`;
  const rejected = vi.fn();
  const callback = vi.fn();
  const config = await store.getConnectionConfig('server', 22, rejected);
  if (!config.hostVerifier) throw new Error('Missing host verifier');
  config.hostVerifier(key, callback);
  await vi.waitFor(() => expect(callback).toHaveBeenCalledWith(false));
  expect(rejected).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('changed') }));
});

test.each([false, true])('verifies a multi-key SSH server before authenticating (changed: %s)', async changed => {
  const authenticated = vi.fn();
  const rejected = vi.fn();
  const ecdsaKey = generatePrivateKey('ecdsa');
  const server = new Server({ hostKeys: [privateKey.toString('ssh'), ecdsaKey.toString('ssh')] }, connection => {
    connection.on('error', () => {});
    connection.on('authentication', context => {
      authenticated();
      context.accept();
    });
  });
  const client = new Client();
  try {
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = (server.address() as AddressInfo).port;
    contents = `[server]:${port} ${changed ? otherPublicKey : ecdsaKey.toPublic().toString('ssh')}\n`;
    const config = await store.getConnectionConfig('server', port, rejected);
    const outcome = new Promise<string>(resolve => {
      client.on('ready', () => resolve('ready'));
      client.on('error', () => resolve('error'));
    });
    client.connect({ host: '127.0.0.1', port, username: 'test', ...config });
    await expect(outcome).resolves.toBe(changed ? 'error' : 'ready');
    expect(authenticated).toHaveBeenCalledTimes(changed ? 0 : 1);
    expect(rejected).toHaveBeenCalledTimes(changed ? 1 : 0);
    expect(fs.appendFile).not.toHaveBeenCalled();
  } finally {
    client.destroy();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
