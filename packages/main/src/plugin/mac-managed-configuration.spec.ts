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

import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { Container } from 'inversify';
import { beforeEach, expect, test, vi } from 'vitest';

import product from '/@product.json' with { type: 'json' };

import { Directories } from './directories.js';
import { LegacyDirectories } from './directories-legacy.js';
import { MacManagedConfiguration } from './mac-managed-configuration.js';

const convertPlist = vi.fn<(command: string, args: string[]) => Promise<{ stdout: string; stderr: string }>>();

vi.mock(import('node:child_process'));
vi.mock(import('node:fs/promises'));
vi.mock(import('node:os'));
vi.mock(import('./directories-legacy.js'));
vi.mock(import('/@product.json'));

const MANAGED_DIRECTORY = '/managed';
const DEVICE_PLIST = join(MANAGED_DIRECTORY, 'io.podman_desktop.PodmanDesktop.plist');
const USER_PLIST = join(MANAGED_DIRECTORY, 'testuser', 'io.podman_desktop.PodmanDesktop.plist');
const EMPTY_SETTINGS = { defaults: {}, user: {}, locked: [] };

let directories: LegacyDirectories;
let configuration: MacManagedConfiguration;

function mockConversion(device: string, user = '{}', error?: Error): void {
  convertPlist.mockImplementation(async (_command, args) => {
    const isDevice = args.at(-1) === DEVICE_PLIST;
    if (isDevice && error) {
      throw error;
    }
    return { stdout: isDevice ? device : user, stderr: '' };
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  directories = new LegacyDirectories();
  vi.mocked(directories.getManagedPreferencesDir).mockImplementation(username =>
    username === undefined ? MANAGED_DIRECTORY : join(MANAGED_DIRECTORY, username),
  );
  vi.mocked(userInfo).mockReturnValue({
    username: 'testuser',
    uid: 1000,
    gid: 1000,
    homedir: '/Users/testuser',
    shell: '/bin/zsh',
  });
  vi.mocked(access).mockResolvedValue(undefined);
  product.appId = 'io.podman_desktop.PodmanDesktop';
  mockConversion('{}');

  // Preserve the native promise result shape without a custom module factory.
  Object.assign(execFile, { [promisify.custom]: convertPlist });
  configuration = new MacManagedConfiguration(directories);

  console.log = vi.fn();
  console.debug = vi.fn();
  console.error = vi.fn();
});

test('read both scopes with the native converter and the operating system username', async () => {
  await configuration.getContent();

  expect(access).toHaveBeenCalledWith(DEVICE_PLIST);
  expect(access).toHaveBeenCalledWith(USER_PLIST);
  expect(convertPlist).toHaveBeenCalledWith('/usr/bin/plutil', ['-convert', 'json', '-o', '-', DEVICE_PLIST]);
  expect(convertPlist).toHaveBeenCalledWith('/usr/bin/plutil', ['-convert', 'json', '-o', '-', USER_PLIST]);
});

test('resolve managed preferences through the injected directories', async () => {
  const container = new Container();
  container.bind(Directories).toConstantValue(directories);
  container.bind(MacManagedConfiguration).toSelf().inSingletonScope();
  mockConversion(JSON.stringify({ 'test.setting': 'device' }));

  const injected = container.get(MacManagedConfiguration);

  expect(await injected.getContent()).toEqual({
    defaults: { 'test.setting': 'device' },
    user: {},
    locked: [],
  });
});

test('preserve setting types and extract only device locks', async () => {
  const defaults = {
    'telemetry.enabled': false,
    'preferences.appearance': 'dark',
    'test.count': 5,
    'test.ratio': 1.5,
    'test.array': ['one', 'two'],
    'test.object': { enabled: true },
  };
  const user = { 'preferences.appearance': 'light' };
  mockConversion(
    JSON.stringify({ ...defaults, locked: ['telemetry.enabled'] }),
    JSON.stringify({ ...user, locked: ['preferences.appearance'] }),
  );

  expect(await configuration.getContent()).toEqual({
    defaults,
    user,
    locked: ['telemetry.enabled'],
  });
});

test('skip preference access when managed preference directories are unavailable', async () => {
  vi.mocked(directories.getManagedPreferencesDir).mockReturnValue(undefined);

  expect(await configuration.getContent()).toEqual(EMPTY_SETTINGS);
  expect(access).not.toHaveBeenCalled();
  expect(convertPlist).not.toHaveBeenCalled();
  expect(userInfo).not.toHaveBeenCalled();
});

test('use the product application ID for both filenames', async () => {
  product.appId = 'io.test.Desktop';

  await configuration.getContent();

  expect(access).toHaveBeenCalledWith(join(MANAGED_DIRECTORY, 'io.test.Desktop.plist'));
  expect(access).toHaveBeenCalledWith(join(MANAGED_DIRECTORY, 'testuser', 'io.test.Desktop.plist'));
});

test('retain device preferences when the user directory is unavailable', async () => {
  vi.mocked(directories.getManagedPreferencesDir).mockReturnValueOnce(MANAGED_DIRECTORY).mockReturnValueOnce(undefined);
  mockConversion(JSON.stringify({ 'test.setting': 'device', locked: ['test.setting'] }));

  expect(await configuration.getContent()).toEqual({
    defaults: { 'test.setting': 'device' },
    user: {},
    locked: ['test.setting'],
  });
  expect(convertPlist).toHaveBeenCalledTimes(1);
});

test('return empty settings without logs when both files are absent', async () => {
  vi.mocked(access).mockRejectedValue(Object.assign(new Error('File not found'), { code: 'ENOENT' }));

  expect(await configuration.getContent()).toEqual(EMPTY_SETTINGS);
  expect(convertPlist).not.toHaveBeenCalled();
  expect(console.log).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
  expect(console.debug).not.toHaveBeenCalled();
});

test('load user preferences when the device file is absent', async () => {
  vi.mocked(access).mockRejectedValueOnce(Object.assign(new Error('File not found'), { code: 'ENOENT' }));
  mockConversion('{}', JSON.stringify({ 'test.setting': 'user' }));

  expect(await configuration.getContent()).toEqual({
    defaults: {},
    user: { 'test.setting': 'user' },
    locked: [],
  });
});

test('load device preferences when the user file is absent', async () => {
  vi.mocked(access)
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(Object.assign(new Error('File not found'), { code: 'ENOENT' }));
  mockConversion(JSON.stringify({ 'test.setting': 'device', locked: ['test.setting'] }));

  expect(await configuration.getContent()).toEqual({
    defaults: { 'test.setting': 'device' },
    user: {},
    locked: ['test.setting'],
  });
});

test('retain device policy when the operating system account lookup fails', async () => {
  const error = new Error('Account lookup failed');
  vi.mocked(userInfo).mockImplementation(() => {
    throw error;
  });
  mockConversion(JSON.stringify({ 'test.setting': 'device', locked: ['test.setting'] }));

  expect(await configuration.getContent()).toEqual({
    defaults: { 'test.setting': 'device' },
    user: {},
    locked: ['test.setting'],
  });
  expect(convertPlist).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('per-user managed preferences'), error);
});

test('log permission errors and continue with the other scope', async () => {
  const error = Object.assign(new Error('Permission denied'), { code: 'EACCES' });
  vi.mocked(access).mockRejectedValueOnce(error);
  mockConversion('{}', JSON.stringify({ 'test.setting': 'user' }));

  const result = await configuration.getContent();

  expect(result.user).toEqual({ 'test.setting': 'user' });
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining(DEVICE_PLIST), error);
});

test('log conversion failures and continue with the other scope', async () => {
  const error = new Error('Invalid plist');
  mockConversion('', JSON.stringify({ 'test.setting': 'user' }), error);

  const result = await configuration.getContent();

  expect(result.defaults).toEqual({});
  expect(result.user).toEqual({ 'test.setting': 'user' });
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining(DEVICE_PLIST), error);
});

test.each(['invalid json', 'null', '[]', 'true', '"text"'])(
  'reject invalid preference dictionaries: %s',
  async content => {
    mockConversion(content, JSON.stringify({ 'test.setting': 'user' }));

    const result = await configuration.getContent();

    expect(result.defaults).toEqual({});
    expect(result.user).toEqual({ 'test.setting': 'user' });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(DEVICE_PLIST), expect.any(Error));
  },
);

test.each(['"telemetry.enabled"', '[true]', '{}'])('reject invalid lock arrays: %s', async locked => {
  mockConversion(`{"telemetry.enabled":false,"locked":${locked}}`);

  expect(await configuration.getContent()).toEqual(EMPTY_SETTINGS);
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining(DEVICE_PLIST), expect.any(Error));
});
