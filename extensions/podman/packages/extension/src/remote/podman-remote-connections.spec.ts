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

import * as fs from 'node:fs';

import * as extensionApi from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { PodmanRemoteConnections } from './podman-remote-connections';
import type { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

vi.mock(import('node:fs'));

const extensionContext = {} as extensionApi.ExtensionContext;

const provider = {} as extensionApi.Provider;

beforeEach(() => {
  vi.resetAllMocks();
});
class TestPodmanRemoteConnections extends PodmanRemoteConnections {
  createTunnel(
    host: string,
    port: number,
    username: string,
    privateKey: string,
    remotePath: string,
    localPath: string,
  ): PodmanRemoteSshTunnel {
    return super.createTunnel(host, port, username, privateKey, remotePath, localPath);
  }

  async refreshRemoteConnections(): Promise<void> {
    return super.refreshRemoteConnections();
  }
}

test('should do nothing if the configuration is disabled', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => false,
  } as unknown as extensionApi.Configuration);
  const podmanRemoteConnections = new TestPodmanRemoteConnections(extensionContext, provider);

  // spy createTunnel method
  const spyCreateTunnel = vi.spyOn(podmanRemoteConnections, 'createTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  await podmanRemoteConnections.start();

  // no connection should be created
  expect(spyCreateTunnel).not.toHaveBeenCalled();
  expect(spyRefreshRemoteConnections).not.toHaveBeenCalled();
});

test('should check connections if configuration is enabled', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);
  const podmanRemoteConnections = new TestPodmanRemoteConnections(extensionContext, provider);

  // mock exec method for listing podman system connections
  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([]),
  } as unknown as extensionApi.RunResult);

  // spy createTunnel method
  const spyCreateTunnel = vi.spyOn(podmanRemoteConnections, 'createTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  await podmanRemoteConnections.start();

  // no connection should be created
  expect(spyCreateTunnel).not.toHaveBeenCalled();
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();
});

test('hasConnections should return false when no connections exist', () => {
  const remoteConnections = new TestPodmanRemoteConnections(extensionContext, provider);
  expect(remoteConnections.hasConnections()).toBe(false);
});

test('hasConnections should return true after remote connections are registered', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);

  const mockProvider = {
    registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  } as unknown as extensionApi.Provider;
  const mockContext = {
    subscriptions: [],
  } as unknown as extensionApi.ExtensionContext;

  const remoteConnections = new TestPodmanRemoteConnections(mockContext, mockProvider);

  vi.spyOn(fs, 'readFileSync').mockReturnValue('fake-key');
  vi.spyOn(remoteConnections, 'createTunnel').mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: () => 'started',
  } as unknown as PodmanRemoteSshTunnel);

  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'ssh://dummy@192.168.1.100:22/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'RemoteConnection1',
      },
    ]),
  } as unknown as extensionApi.RunResult);

  await remoteConnections.refreshRemoteConnections();

  expect(remoteConnections.hasConnections()).toBe(true);
});

test('should skip broken connection and still register valid ones', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);

  const mockProvider = {
    registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  } as unknown as extensionApi.Provider;
  const mockContext = {
    subscriptions: [],
  } as unknown as extensionApi.ExtensionContext;

  const remoteConnections = new TestPodmanRemoteConnections(mockContext, mockProvider);

  vi.spyOn(fs, 'readFileSync').mockImplementation((path: unknown) => {
    if (String(path) === '/tmp/broken-key') {
      throw new Error('ENOENT: no such file');
    }
    return 'fake-key';
  });
  vi.spyOn(remoteConnections, 'createTunnel').mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: () => 'started',
  } as unknown as PodmanRemoteSshTunnel);

  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'ssh://user@192.168.1.1:22/run/podman/podman.sock',
        Identity: '/tmp/broken-key',
        Name: 'BrokenRemote',
      },
      {
        IsMachine: false,
        URI: 'ssh://user@192.168.1.2:22/run/podman/podman.sock',
        Identity: '/tmp/valid-key',
        Name: 'ValidRemote',
      },
    ]),
  } as unknown as extensionApi.RunResult);

  await remoteConnections.refreshRemoteConnections();

  expect(remoteConnections.hasConnections()).toBe(true);
});

test('should disconnect tunnel if registration fails after connect', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);

  const mockProvider = {
    registerContainerProviderConnection: vi.fn().mockImplementation(() => {
      throw new Error('registration failed');
    }),
  } as unknown as extensionApi.Provider;
  const mockContext = {
    subscriptions: [],
  } as unknown as extensionApi.ExtensionContext;

  const remoteConnections = new TestPodmanRemoteConnections(mockContext, mockProvider);

  vi.spyOn(fs, 'readFileSync').mockReturnValue('fake-key');
  const mockDisconnect = vi.fn();
  vi.spyOn(remoteConnections, 'createTunnel').mockReturnValue({
    connect: vi.fn(),
    disconnect: mockDisconnect,
    status: () => 'started',
  } as unknown as PodmanRemoteSshTunnel);

  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'ssh://user@192.168.1.1:22/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'FailingRemote',
      },
    ]),
  } as unknown as extensionApi.RunResult);

  await remoteConnections.refreshRemoteConnections();

  expect(mockDisconnect).toHaveBeenCalledOnce();
  expect(remoteConnections.hasConnections()).toBe(false);
});

test('should check connections if configuration is enabled and a system connection', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);

  const mockProvider = {
    registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  } as unknown as extensionApi.Provider;
  const mockContext = {
    subscriptions: [],
  } as unknown as extensionApi.ExtensionContext;

  const podmanRemoteConnections = new TestPodmanRemoteConnections(mockContext, mockProvider);

  // mock readFileSync
  vi.spyOn(fs, 'readFileSync').mockReturnValue('file');

  // mock createTunnel to return a mock tunnel
  const spyCreateTunnel = vi.spyOn(podmanRemoteConnections, 'createTunnel').mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: () => 'started',
  } as unknown as PodmanRemoteSshTunnel);

  // mock exec method for listing podman system connections
  // one machine and one remote connection
  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: true,
        URI: 'ssh://dummy@127.0.0.1:1234/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'Machine1',
      },
      {
        IsMachine: false,
        URI: 'ssh://dummy@127.0.0.1:1234/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'RemoteSystemConnection1',
      },
    ]),
  } as unknown as extensionApi.RunResult);

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  await podmanRemoteConnections.start();

  // remote connection should trigger tunnel creation (machine is filtered out)
  expect(spyCreateTunnel).toHaveBeenCalledOnce();
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();
  expect(podmanRemoteConnections.hasConnections()).toBe(true);
});
