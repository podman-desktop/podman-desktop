/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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

import * as fs from 'node:fs';
import * as path from 'node:path';

import * as extensionApi from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { deleteFile, getSystemBinaryPath, installBinaryToSystem, localBinDir } from './index';

vi.mock(import('node:fs'));

const previousPath = process.env.PATH;

beforeEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  process.env.PATH = localBinDir;
  (extensionApi.env.isWindows as boolean) = false;
});

afterEach(() => {
  process.env.PATH = previousPath;
});

test('fails to install a non-existing binary', async () => {
  Object.defineProperty(process, 'platform', { value: 'linux' });
  vi.mocked(extensionApi.process.exec).mockRejectedValue({
    name: '',
    message: 'Command failed',
    exitCode: 1603,
    command: 'command',
    stdout: 'stdout',
    stderr: 'stderr',
    cancelled: false,
    killed: false,
  } satisfies extensionApi.RunError);

  await expect(installBinaryToSystem('test', 'tmpBinary')).rejects.toThrowError();
});

test('installs on macOS when /usr/local/bin already exists', async () => {
  Object.defineProperty(process, 'platform', { value: 'darwin' });
  vi.mocked(fs.existsSync).mockReturnValue(true);

  await installBinaryToSystem('test', 'tmpBinary');

  expect(extensionApi.process.exec).toBeCalledWith(
    'exec',
    expect.arrayContaining(['cp', '-f', 'test', `${path.sep}usr${path.sep}local${path.sep}bin${path.sep}tmpBinary`]),
    expect.objectContaining({ isAdmin: true }),
  );
});

test('creates /usr/local/bin before installing on Linux', async () => {
  Object.defineProperty(process, 'platform', { value: 'linux' });
  vi.mocked(fs.existsSync).mockReturnValue(false);

  await installBinaryToSystem('test', 'tmpBinary');

  expect(extensionApi.process.exec).toBeCalledWith(
    '/bin/sh',
    expect.arrayContaining([
      '-c',
      `mkdir -p /usr/local/bin && cp test ${path.sep}usr${path.sep}local${path.sep}bin${path.sep}tmpBinary`,
    ]),
    expect.objectContaining({ isAdmin: true }),
  );
});

test('warns when the installed Linux binary directory is not in PATH', async () => {
  Object.defineProperty(process, 'platform', { value: 'linux' });
  process.env.PATH = '';
  vi.mocked(fs.existsSync).mockReturnValue(false);

  await installBinaryToSystem('test', 'tmpBinary');

  expect(extensionApi.window.showWarningMessage).toBeCalled();
});

test('copies the binary on Windows', async () => {
  Object.defineProperty(process, 'platform', { value: 'win32' });
  vi.mocked(fs.promises.copyFile).mockResolvedValue();

  await installBinaryToSystem('test', 'tmpBinary');

  expect(fs.promises.copyFile).toBeCalledWith('test', getSystemBinaryPath('tmpBinary'));
});

describe('deleteFile', () => {
  test('does nothing for an empty or missing path', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    await deleteFile('');
    await deleteFile('missing');

    expect(fs.promises.unlink).not.toBeCalled();
  });

  test('unlinks an existing file', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.unlink).mockResolvedValue();

    await deleteFile('existing');

    expect(fs.promises.unlink).toBeCalledWith('existing');
    expect(extensionApi.process.exec).not.toBeCalled();
  });

  test.each([
    ['EACCES', false, 'rm'],
    ['EPERM', true, 'del'],
  ])('uses elevated %s removal with %s', async (code, isWindows, command) => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.unlink).mockRejectedValue({ code });
    (extensionApi.env.isWindows as boolean) = isWindows;

    await deleteFile('protected');

    expect(extensionApi.process.exec).toBeCalledWith(command, ['protected'], { isAdmin: true });
  });

  test('propagates an unlink error other than a permission error', async () => {
    const error = new Error('unlink failed');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.unlink).mockRejectedValue(error);

    await expect(deleteFile('existing')).rejects.toBe(error);
    expect(extensionApi.process.exec).not.toBeCalled();
  });

  test('logs and propagates an elevated removal error', async () => {
    const error = new Error('elevated removal failed');
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.unlink).mockRejectedValue({ code: 'EACCES' });
    vi.mocked(extensionApi.process.exec).mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(deleteFile('protected')).rejects.toBe(error);

    expect(consoleError).toBeCalledWith(`Failed to uninstall 'protected': ${error}`);
  });
});
