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
import type { PodmanRemoteDirectTunnel } from './podman-remote-direct-tunnel';
import type { PodmanRemoteSshTunnel } from './podman-remote-ssh-tunnel';

vi.mock('node:fs');

const extensionContext = {} as extensionApi.ExtensionContext;

const provider = {} as extensionApi.Provider;

beforeEach(() => {
  vi.resetAllMocks();
});
class TestPodmanRemoteConnections extends PodmanRemoteConnections {
  createSshTunnel(
    host: string,
    port: number,
    username: string,
    privateKey: string,
    remotePath: string,
    localPath: string,
  ): PodmanRemoteSshTunnel {
    return super.createSshTunnel(host, port, username, privateKey, remotePath, localPath);
  }

  createDirectTunnel(host: string, port: number, localPath: string): PodmanRemoteDirectTunnel {
    return super.createDirectTunnel(host, port, localPath);
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

  // spy createSshTunnel method
  const spyCreateSshTunnel = vi.spyOn(podmanRemoteConnections, 'createSshTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // no connection should be created
  expect(spyCreateSshTunnel).not.toHaveBeenCalled();
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

  // spy createSshTunnel method
  const spyCreateSshTunnel = vi.spyOn(podmanRemoteConnections, 'createSshTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // no connection should be created
  expect(spyCreateSshTunnel).not.toHaveBeenCalled();
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

  // spy createSshTunnel method
  const spyCreateSshTunnel = vi.spyOn(podmanRemoteConnections, 'createSshTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // no connection should be created
  expect(spyCreateSshTunnel).not.toHaveBeenCalled();
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();
});

test('should create direct tunnel for tcp connections', async () => {
  vi.mocked(extensionApi.configuration.getConfiguration).mockReturnValue({
    get: () => true,
  } as unknown as extensionApi.Configuration);
  const podmanRemoteConnections = new TestPodmanRemoteConnections(extensionContext, provider);

  // mock exec method for listing podman system connections with a TCP connection
  vi.mocked(extensionApi.process.exec).mockResolvedValue({
    stdout: JSON.stringify([
      {
        IsMachine: false,
        URI: 'tcp://192.168.1.100:2375',
        Identity: '',
        Name: 'TcpRemoteConnection',
      },
    ]),
  } as unknown as extensionApi.RunResult);

  // spy createSshTunnel method - should NOT be called for TCP connections
  const spyCreateSshTunnel = vi.spyOn(podmanRemoteConnections, 'createSshTunnel');

  // spy refreshRemoteConnections method
  const spyRefreshRemoteConnections = vi.spyOn(podmanRemoteConnections, 'refreshRemoteConnections');

  // start
  podmanRemoteConnections.start();

  // wait for the getConfiguration being called
  await vi.waitFor(() => expect(extensionApi.configuration.getConfiguration).toHaveBeenCalled());

  // should call refreshRemoteConnections
  expect(spyRefreshRemoteConnections).toHaveBeenCalled();

  // SSH tunnel should not be called for TCP connections
  expect(spyCreateSshTunnel).not.toHaveBeenCalled();
});
