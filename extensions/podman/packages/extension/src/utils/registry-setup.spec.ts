/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';
import type { MockedFunction } from 'vitest';
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { ContainersAuthConfigFile } from './registry-setup';
import { RegistrySetup } from './registry-setup';

// allow us to test protected methods
export class TestRegistrySetup extends RegistrySetup {
  publicReadAuthFile(): Promise<ContainersAuthConfigFile> {
    return super.readAuthFile();
  }

  getAuthFileLocation(): string {
    return super.getAuthFileLocation();
  }

  updateRegistries(): Promise<void> {
    return super.updateRegistries();
  }
}

let registrySetup: TestRegistrySetup;

// mock the fs module
vi.mock('node:fs');

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const consoleErroMock = vi.fn();
const consoleWarnMock = vi.fn();

beforeAll(() => {
  registrySetup = new TestRegistrySetup();
});

beforeEach(() => {
  vi.resetAllMocks();
  console.error = consoleErroMock;
  console.warn = consoleWarnMock;
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

type ReadFileType = (
  path: string,
  options: string,
  callback: (err: NodeJS.ErrnoException | undefined, data: string | Buffer) => void,
) => void;

test('should work with invalid JSON auth file', async () => {
  // mock the existSync
  const existSyncSpy = vi.spyOn(fs, 'existsSync');
  existSyncSpy.mockReturnValue(true);

  // mock the readFile
  const readFileSpy = vi.spyOn(fs, 'readFile') as unknown as MockedFunction<ReadFileType>;

  readFileSpy.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error
      callback(undefined, 'invalid json');
    },
  );

  // mock the location
  const authJsonLocation = '/tmp/containers/auth.json';
  const mockGetAuthFileLocation = vi.spyOn(registrySetup, 'getAuthFileLocation');
  mockGetAuthFileLocation.mockReturnValue(authJsonLocation);

  // expect an error
  const authFile = await registrySetup.publicReadAuthFile();

  // expect the file to be empty
  expect(authFile).toEqual({});

  // expect read with the correct file
  expect(readFileSpy).toHaveBeenCalledWith(authJsonLocation, 'utf-8', expect.anything());

  // expect error was logged
  expect(consoleErroMock).toHaveBeenCalledWith('Error parsing auth file', expect.anything());
});

test('should work with JSON auth file', async () => {
  // mock the existSync
  const existSyncSpy = vi.spyOn(fs, 'existsSync');
  existSyncSpy.mockReturnValue(true);

  // mock the readFile
  const readFileSpy = vi.spyOn(fs, 'readFile') as unknown as MockedFunction<ReadFileType>;
  const auth = Buffer.from('user:password').toString('base64');

  readFileSpy.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error

      callback(undefined, JSON.stringify({ auths: { 'myregistry.io': { auth: auth } } }));
    },
  );

  // mock the location
  const authJsonLocation = '/tmp/containers/auth.json';
  const mockGetAuthFileLocation = vi.spyOn(registrySetup, 'getAuthFileLocation');
  mockGetAuthFileLocation.mockReturnValue(authJsonLocation);

  // expect an error
  const authFile = await registrySetup.publicReadAuthFile();

  // expect the file to have a single entry
  expect(authFile.auths?.['myregistry.io']).toBeDefined();
  expect(authFile.auths?.['myregistry.io'].auth).toBe(auth);
  expect(authFile.auths?.['myregistry.io']['podmanDesktopAlias']).not.toBeDefined();

  // expect read with the correct file
  expect(readFileSpy).toHaveBeenCalledWith(authJsonLocation, 'utf-8', expect.anything());
});

test('should work with JSON auth file and alias', async () => {
  // mock the existSync
  const existSyncSpy = vi.spyOn(fs, 'existsSync');
  existSyncSpy.mockReturnValue(true);

  // mock the readFile
  const readFileSpy = vi.spyOn(fs, 'readFile') as unknown as MockedFunction<ReadFileType>;
  const auth = Buffer.from('user:password').toString('base64');

  readFileSpy.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error

      callback(undefined, JSON.stringify({ auths: { 'myregistry.io': { auth: auth, podmanDesktopAlias: 'alias' } } }));
    },
  );

  // mock the location
  const authJsonLocation = '/tmp/containers/auth.json';
  const mockGetAuthFileLocation = vi.spyOn(registrySetup, 'getAuthFileLocation');
  mockGetAuthFileLocation.mockReturnValue(authJsonLocation);

  // expect an error
  const authFile = await registrySetup.publicReadAuthFile();

  // expect the file to have a single entry
  expect(authFile.auths?.['myregistry.io']).toBeDefined();
  expect(authFile.auths?.['myregistry.io'].auth).toBe(auth);
  expect(authFile.auths?.['myregistry.io']['podmanDesktopAlias']).toBe('alias');

  // expect read with the correct file
  expect(readFileSpy).toHaveBeenCalledWith(authJsonLocation, 'utf-8', expect.anything());
});

test('should send a warning in console if registry auth value is invalid', async () => {
  // mock the existSync
  const existSyncMock = vi.mocked(fs.existsSync);
  existSyncMock.mockReturnValue(true);

  // mock the readFile
  const readFileMock = vi.mocked(fs.readFile) as unknown as MockedFunction<ReadFileType>;
  const auth = Buffer.from('user:password').toString('base64');
  const invalidAuth = Buffer.from('userpassword').toString('base64');

  readFileMock.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error

      callback(
        undefined,
        JSON.stringify({
          auths: {
            'myregistry.io': { auth: auth, podmanDesktopAlias: 'alias' },
            'myinvalidregistry.io': { auth: invalidAuth, podmanDesktopAlias: 'alias1' },
          },
        }),
      );
    },
  );

  // mock the location
  const authJsonLocation = '/tmp/containers/auth.json';
  const mockGetAuthFileLocation = vi.spyOn(registrySetup, 'getAuthFileLocation');
  mockGetAuthFileLocation.mockReturnValue(authJsonLocation);

  await registrySetup.updateRegistries();

  // expect read with the correct file
  expect(readFileMock).toHaveBeenCalledWith(authJsonLocation, 'utf-8', expect.anything());
  expect(consoleWarnMock).toHaveBeenCalledWith('Invalid auth value for myinvalidregistry.io');
});

const [username, secret] = 'userpassword'.split(':');

test.each([
  {
    fileAuth: {
      'myregistry1.io': { auth: Buffer.from('user:password').toString('base64'), podmanDesktopAlias: 'alias' },
    },
    registeredRegistry: {
      source: 'podman',
      serverUrl: 'myregistry1.io',
      username: 'user',
      secret: 'password1',
    },
    timesCalled: 1,
  },
  {
    fileAuth: {
      'myinvalidregistry1.io': { auth: Buffer.from('userpassword').toString('base64'), podmanDesktopAlias: 'alias1' },
    },
    registeredRegistry: {
      source: 'podman',
      serverUrl: 'myinvalidregistry1.io',
      username: username,
      secret: secret,
    },
    timesCalled: 0,
  },
])('do not write existing registries that did not change values to auth.json', async ({
  fileAuth,
  registeredRegistry,
  timesCalled,
}) => {
  // mock the existSync
  const existSyncMock = vi.mocked(fs.existsSync);
  existSyncMock.mockReturnValue(true);

  // mock the readFile
  const readFileMock = vi.mocked(fs.readFile) as unknown as MockedFunction<ReadFileType>;

  readFileMock.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error

      callback(undefined, JSON.stringify({}));
    },
  );

  // mock the location
  const authJsonLocation = '/tmp/containers/auth.json';
  const mockGetAuthFileLocation = vi.spyOn(registrySetup, 'getAuthFileLocation');
  mockGetAuthFileLocation.mockReturnValue(authJsonLocation);

  let onRegisterRegistry: ((e: extensionApi.Registry) => unknown) | undefined;

  vi.mocked(extensionApi.registry.onDidRegisterRegistry).mockImplementation(callback => {
    onRegisterRegistry = callback;

    return {
      dispose: vi.fn(),
    };
  });

  const writeFileMock = vi.mocked(fs.writeFile);

  await registrySetup.setup();

  readFileMock.mockImplementation(
    (_path: string, _encoding: string, callback: (err: Error | undefined, data: string | Buffer) => void) => {
      // mock the error

      callback(undefined, JSON.stringify({ auths: fileAuth }));
    },
  );

  expect(onRegisterRegistry).toBeDefined();

  onRegisterRegistry?.(registeredRegistry);

  await vi.waitFor(() => expect(writeFileMock).toHaveBeenCalledTimes(timesCalled));
});
