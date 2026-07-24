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
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { PodmanRemoteConnections } from './podman-remote-connections';
import type { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

vi.mock(import('node:fs'));

const extensionContext = {} as extensionApi.ExtensionContext;

const provider = {} as extensionApi.Provider;

beforeEach(() => {
  vi.resetAllMocks();
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
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
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

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
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // no connection should be created
  expect(spyCreateTunnel).not.toHaveBeenCalled();
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();
});

test('should check connections if configuration is enabled and a system connection', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);
  const podmanRemoteConnections = new TestPodmanRemoteConnections(extensionContext, provider);

  // mock readFileSync
  vi.spyOn(fs, 'readFileSync').mockReturnValue('file');

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

  // spy createTunnel method
  const spyCreateTunnel = vi.spyOn(podmanRemoteConnections, 'createTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // no connection should be created
  expect(spyCreateTunnel).not.toHaveBeenCalled();
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();
});

test('should register remote connection with tunnel error', async () => {
  vi.useFakeTimers();
  const subscriptions: extensionApi.Disposable[] = [];
  const testProvider = {
    registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  } as unknown as extensionApi.Provider;
  const podmanRemoteConnections = new TestPodmanRemoteConnections(
    { subscriptions } as unknown as extensionApi.ExtensionContext,
    testProvider,
  );
  const sshTunnel = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: vi.fn(() => 'unknown'),
    get error(): string {
      return 'connection refused';
    },
  } as unknown as PodmanRemoteSshTunnel;

  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => undefined,
  } as unknown as extensionApi.Configuration);
  vi.spyOn(fs, 'readFileSync').mockReturnValue('file');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'ssh://dummy@127.0.0.1:1234/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'RemoteSystemConnection1',
      },
    ]),
  } as unknown as extensionApi.RunResult);
  vi.spyOn(podmanRemoteConnections, 'createTunnel').mockReturnValue(sshTunnel);

  const refresh = podmanRemoteConnections.refreshRemoteConnections();
  await vi.advanceTimersByTimeAsync(1000);
  await refresh;

  expect(testProvider.registerContainerProviderConnection).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'RemoteSystemConnection1',
      error: 'connection refused',
    }),
  );
  expect(subscriptions).toHaveLength(1);
});

test('should use default ssh port when remote connection URI has no port', async () => {
  const testProvider = {
    registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: vi.fn() }),
  } as unknown as extensionApi.Provider;
  const podmanRemoteConnections = new TestPodmanRemoteConnections(
    { subscriptions: [] } as unknown as extensionApi.ExtensionContext,
    testProvider,
  );
  const sshTunnel = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: vi.fn(() => 'started'),
  } as unknown as PodmanRemoteSshTunnel;

  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => undefined,
  } as unknown as extensionApi.Configuration);
  vi.spyOn(fs, 'readFileSync').mockReturnValue('file');
  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'ssh://dummy@127.0.0.1/run/podman/podman.sock',
        Identity: '/tmp/fakepath',
        Name: 'RemoteSystemConnection1',
      },
    ]),
  } as unknown as extensionApi.RunResult);
  const createTunnelSpy = vi.spyOn(podmanRemoteConnections, 'createTunnel').mockReturnValue(sshTunnel);

  await podmanRemoteConnections.refreshRemoteConnections();

  expect(createTunnelSpy).toHaveBeenCalledWith(
    '127.0.0.1',
    22,
    'dummy',
    'file',
    '/run/podman/podman.sock',
    expect.any(String),
  );
});
