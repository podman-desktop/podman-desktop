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

import { homedir } from 'node:os';
import { join, posix, win32 } from 'node:path';

import type { Configuration, RunResult } from '@podman-desktop/api';
import { configuration } from '@podman-desktop/api';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { execPodman } from '/@/utils/util';

import { setupDefaultConnections } from './default-connections';

vi.mock(import('node:os'));
vi.mock(import('node:path'), async importOriginal => ({
  ...(await importOriginal()),
  join: vi.fn(),
}));
vi.mock(import('/@/utils/util'));

const DEFAULT_CONNECTION = {
  name: 'build-server',
  identity: '/keys/id_ed25519',
  user: 'developer',
  host: 'build.example.com',
  socket: '/run/user/1000/podman/podman.sock',
};
const DEFAULT_URI = 'ssh://developer@build.example.com/run/user/1000/podman/podman.sock';

const CONFIGURATION: Configuration = {
  get: vi.fn(),
  has: vi.fn(),
  update: vi.fn(),
};

const EMPTY_RESULT: RunResult = { command: 'podman', stdout: '[]', stderr: '' };

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(homedir).mockReturnValue('/home/developer');
  vi.mocked(join).mockImplementation(posix.join);
  vi.mocked(configuration.getConfiguration).mockReturnValue(CONFIGURATION);
  vi.mocked(CONFIGURATION.get).mockReturnValue([DEFAULT_CONNECTION]);
  vi.mocked(execPodman).mockResolvedValue(EMPTY_RESULT);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

test.each([undefined, []])('does not call Podman without presets: %j', async defaults => {
  vi.mocked(CONFIGURATION.get).mockReturnValue(defaults);

  await setupDefaultConnections();

  expect(execPodman).not.toHaveBeenCalled();
});

test.each([{}, 'build-server', false])('rejects a non-array configuration: %j', async defaults => {
  vi.mocked(CONFIGURATION.get).mockReturnValue(defaults);

  await setupDefaultConnections();

  expect(console.warn).toHaveBeenCalled();
  expect(execPodman).not.toHaveBeenCalled();
});

test('creates root and non-root connections', async () => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([
    DEFAULT_CONNECTION,
    { ...DEFAULT_CONNECTION, name: 'root-server', user: 'root', socket: '/run/podman/podman.sock' },
  ]);

  await setupDefaultConnections();

  expect(configuration.getConfiguration).toHaveBeenCalledWith('podman');
  expect(CONFIGURATION.get).toHaveBeenCalledWith('system.connections.defaults');
  expect(execPodman).toHaveBeenNthCalledWith(1, ['system', 'connection', 'list', '--format', 'json']);
  expect(execPodman).toHaveBeenNthCalledWith(2, [
    'system',
    'connection',
    'add',
    '--identity',
    DEFAULT_CONNECTION.identity,
    '--',
    DEFAULT_CONNECTION.name,
    DEFAULT_URI,
  ]);
  expect(execPodman).toHaveBeenNthCalledWith(3, [
    'system',
    'connection',
    'add',
    '--identity',
    DEFAULT_CONNECTION.identity,
    '--',
    'root-server',
    'ssh://root@build.example.com/run/podman/podman.sock',
  ]);
});

test.each([
  { identity: '~/.ssh/id_ed25519', expected: '/home/developer/.ssh/id_ed25519' },
  { identity: '/keys with spaces/id_ed25519', expected: '/keys with spaces/id_ed25519' },
  { identity: 'C:\\keys\\id_ed25519', expected: 'C:\\keys\\id_ed25519' },
])('resolves the identity path $identity', async ({ identity, expected }) => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([{ ...DEFAULT_CONNECTION, identity }]);

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenLastCalledWith([
    'system',
    'connection',
    'add',
    '--identity',
    expected,
    '--',
    DEFAULT_CONNECTION.name,
    DEFAULT_URI,
  ]);
});

test.each([
  { identity: '~/.ssh/id_ed25519', expected: 'C:\\Users\\developer\\.ssh\\id_ed25519' },
  { identity: '~\\.ssh\\id_ed25519', expected: 'C:\\Users\\developer\\.ssh\\id_ed25519' },
  { identity: 'C:\\keys\\id_ed25519', expected: 'C:\\keys\\id_ed25519' },
  { identity: '\\\\server\\keys\\id_ed25519', expected: '\\\\server\\keys\\id_ed25519' },
])('resolves the Windows identity path $identity', async ({ identity, expected }) => {
  vi.mocked(homedir).mockReturnValue('C:\\Users\\developer');
  vi.mocked(join).mockImplementation(win32.join);
  vi.mocked(CONFIGURATION.get).mockReturnValue([{ ...DEFAULT_CONNECTION, identity }]);

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenLastCalledWith([
    'system',
    'connection',
    'add',
    '--identity',
    expected,
    '--',
    DEFAULT_CONNECTION.name,
    DEFAULT_URI,
  ]);
});

test.each([false, true])('preserves an existing connection with IsMachine=%s', async IsMachine => {
  vi.mocked(execPodman).mockResolvedValue({
    ...EMPTY_RESULT,
    stdout: JSON.stringify([
      { Name: DEFAULT_CONNECTION.name, IsMachine, URI: 'ssh://root@other.example.com/other.sock' },
    ]),
  });

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenCalledExactlyOnceWith(['system', 'connection', 'list', '--format', 'json']);
  expect(console.warn).toHaveBeenCalledExactlyOnceWith(
    'Skipping default Podman connection build-server: a connection with this name already exists. Existing connections are not modified.',
  );
});

test('creates duplicate names only once', async () => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([
    DEFAULT_CONNECTION,
    { ...DEFAULT_CONNECTION, host: 'other.example.com' },
  ]);

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenCalledTimes(2);
});

test('does not recreate connections on the next startup', async () => {
  vi.mocked(execPodman)
    .mockResolvedValueOnce(EMPTY_RESULT)
    .mockResolvedValueOnce(EMPTY_RESULT)
    .mockResolvedValueOnce({ ...EMPTY_RESULT, stdout: JSON.stringify([{ Name: DEFAULT_CONNECTION.name }]) });

  await setupDefaultConnections();
  await setupDefaultConnections();

  expect(execPodman).toHaveBeenCalledTimes(3);
  expect(execPodman).toHaveBeenLastCalledWith(['system', 'connection', 'list', '--format', 'json']);
});

test.each(['name', 'identity', 'user', 'host', 'socket'])(
  'skips a connection without %s and creates the next connection',
  async field => {
    const incomplete = { ...DEFAULT_CONNECTION, [field]: undefined };
    vi.mocked(CONFIGURATION.get).mockReturnValue([incomplete, DEFAULT_CONNECTION]);

    await setupDefaultConnections();

    expect(console.warn).toHaveBeenCalledOnce();
    expect(execPodman).toHaveBeenCalledTimes(2);
  },
);

test.each([
  undefined,
  false,
  42,
  {},
  { ...DEFAULT_CONNECTION, user: ' ' },
  { ...DEFAULT_CONNECTION, socket: 'relative.sock' },
])('skips an invalid entry: %j', async connection => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([connection]);

  await setupDefaultConnections();

  expect(console.warn).toHaveBeenCalledOnce();
  expect(execPodman).toHaveBeenCalledTimes(1);
});

test('continues after an add failure', async () => {
  const error = new Error('Failed to add connection');
  vi.mocked(CONFIGURATION.get).mockReturnValue([DEFAULT_CONNECTION, { ...DEFAULT_CONNECTION, name: 'other-server' }]);
  vi.mocked(execPodman).mockResolvedValueOnce(EMPTY_RESULT).mockRejectedValueOnce(error);

  await setupDefaultConnections();

  expect(console.warn).toHaveBeenCalledWith('Failed to add default Podman connection build-server', error);
  expect(execPodman).toHaveBeenCalledTimes(3);
  expect(execPodman).toHaveBeenLastCalledWith(expect.arrayContaining(['other-server']));
});

test('leaves existing connections intact if the list fails', async () => {
  const error = new Error('Podman is unavailable');
  vi.mocked(execPodman).mockRejectedValue(error);

  await expect(setupDefaultConnections()).resolves.toBeUndefined();

  expect(console.warn).toHaveBeenCalledWith('Failed to list Podman connections for defaults:', error);
  expect(execPodman).toHaveBeenCalledTimes(1);
});

test('does not add connections if the list contains invalid JSON', async () => {
  vi.mocked(execPodman).mockResolvedValue({ ...EMPTY_RESULT, stdout: 'invalid JSON' });

  await expect(setupDefaultConnections()).resolves.toBeUndefined();

  expect(console.warn).toHaveBeenCalled();
  expect(execPodman).toHaveBeenCalledTimes(1);
});

test('continues after an invalid host', async () => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([{ ...DEFAULT_CONNECTION, host: 'invalid host' }, DEFAULT_CONNECTION]);

  await setupDefaultConnections();

  expect(console.warn).toHaveBeenCalled();
  expect(execPodman).toHaveBeenCalledTimes(2);
});

test('encodes the SSH user and socket path', async () => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([
    { ...DEFAULT_CONNECTION, user: 'user@example.com', host: '[2001:db8::1]', socket: '/run/my socket.sock' },
  ]);

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenLastCalledWith(
    expect.arrayContaining(['ssh://user%40example.com@[2001:db8::1]/run/my%20socket.sock']),
  );
});

test('preserves a custom SSH port', async () => {
  vi.mocked(CONFIGURATION.get).mockReturnValue([{ ...DEFAULT_CONNECTION, host: 'build.example.com:2222' }]);

  await setupDefaultConnections();

  expect(execPodman).toHaveBeenLastCalledWith(
    expect.arrayContaining(['ssh://developer@build.example.com:2222/run/user/1000/podman/podman.sock']),
  );
});
