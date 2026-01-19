/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import type { ContainerProviderConnection, ProviderContainerConnection } from '@podman-desktop/api';
import { env, provider } from '@podman-desktop/api';
import type { DockerExtensionApi } from '@podman-desktop/docker-extension-api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  DockerContextSynchronizer,
  toDescription,
  toDockerContextName,
  toEndpoint,
} from './docker-context-synchronizer.js';

const DOCKER_CONNECTION = {
  providerId: 'docker',
  connection: {
    type: 'docker',
    name: 'docker',
    endpoint: {
      socketPath: '/var/run/docker.sock',
    },
    status: vi.fn(),
  },
} as unknown as ProviderContainerConnection;

const PODMAN_CONNECTION1 = {
  providerId: 'podman',
  connection: {
    type: 'podman',
    name: 'podman-test-1',
    endpoint: {
      socketPath: '/var/run/podman1.sock',
    },
    status: vi.fn(),
  },
} as unknown as ProviderContainerConnection;

const PODMAN_CONNECTION2 = {
  providerId: 'podman',
  connection: {
    type: 'podman',
    name: 'test-2',
    endpoint: {
      socketPath: '/var/run/podman2.sock',
    },
    status: vi.fn(),
  },
} as unknown as ProviderContainerConnection;

const dockerExtensionAPI: DockerExtensionApi = {
  createContext: vi.fn(),
  removeContext: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  DOCKER_CONNECTION.connection.status = vi.fn().mockReturnValue('started');
  PODMAN_CONNECTION1.connection.status = vi.fn().mockReturnValue('started');
  PODMAN_CONNECTION2.connection.status = vi.fn().mockReturnValue('started');
});

class TestDockerContextSynchronizer extends DockerContextSynchronizer {
  override async processUpdatedConnection(connection: ContainerProviderConnection): Promise<void> {
    return super.processUpdatedConnection(connection);
  }
}

describe('toDockerContextName', () => {
  test.each(['Windows', 'Linux', 'MacOS'])('should return the name prefixed with podman- (%s)', platform => {
    vi.mocked(env).isWindows = platform === 'Windows';
    vi.mocked(env).isLinux = platform === 'Linux';
    vi.mocked(env).isMac = platform === 'MacOS';
    const name = toDockerContextName('foo');
    expect(name).toBe(env.isWindows ? 'podman-foo' : 'podman');
  });

  test.each(['Windows', 'Linux', 'MacOS'])('should return the name (%s)', platform => {
    vi.mocked(env).isWindows = platform === 'Windows';
    vi.mocked(env).isLinux = platform === 'Linux';
    vi.mocked(env).isMac = platform === 'MacOS';
    const name = toDockerContextName('podman-foo');
    expect(name).toBe(env.isWindows ? 'podman-foo' : 'podman');
  });
});

describe('toDescription', () => {
  test.each(['Windows', 'Linux', 'MacOS'])('should return the description (%s)', platform => {
    vi.mocked(env).isWindows = platform === 'Windows';
    vi.mocked(env).isLinux = platform === 'Linux';
    vi.mocked(env).isMac = platform === 'MacOS';
    const name = toDescription('foo');
    expect(name).toBe(env.isWindows ? 'Podman machine foo' : 'Podman');
  });

  test.each(['Windows', 'Linux', 'MacOS'])('should also return the description (%s)', platform => {
    vi.mocked(env).isWindows = platform === 'Windows';
    vi.mocked(env).isLinux = platform === 'Linux';
    vi.mocked(env).isMac = platform === 'MacOS';
    const name = toDescription('podman-foo');
    expect(name).toBe(env.isWindows ? 'Podman machine podman-foo' : 'Podman');
  });
});

describe('toEndpoint', () => {
  test('should return npipe on Windows', () => {
    vi.mocked(env).isWindows = true;
    const name = toEndpoint('foo');
    expect(name).toBe('npipe://foo');
  });

  test('should return unix on Linux/MacOS', () => {
    vi.mocked(env).isWindows = false;
    const name = toEndpoint('podman-foo');
    expect(name).toBe('unix://podman-foo');
  });
});

describe('create contexts', () => {
  test('should not create contexts if no connection', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([]);
    const dockerContextSynchronizer = new DockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).not.toHaveBeenCalled();
  });

  test('should not create contexts if only docker connections', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([DOCKER_CONNECTION]);
    const dockerContextSynchronizer = new DockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).not.toHaveBeenCalled();
  });

  test('should create context if single podman connection', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([PODMAN_CONNECTION1]);
    const dockerContextSynchronizer = new DockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).toHaveBeenCalledOnce();
  });

  test('should create context if podman and docker connections', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([DOCKER_CONNECTION, PODMAN_CONNECTION1]);
    const dockerContextSynchronizer = new DockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).toHaveBeenCalledOnce();
  });

  test('should create contexts if several podman connections', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([PODMAN_CONNECTION1, PODMAN_CONNECTION2]);
    const dockerContextSynchronizer = new DockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).toHaveBeenCalledTimes(2);
  });
});

describe('delete context', () => {
  test('should delete context if podman connection is removed', async () => {
    vi.mocked(provider.getContainerConnections).mockReturnValue([PODMAN_CONNECTION1, PODMAN_CONNECTION2]);
    const dockerContextSynchronizer = new TestDockerContextSynchronizer(dockerExtensionAPI);
    await dockerContextSynchronizer.init();
    expect(dockerExtensionAPI.createContext).toHaveBeenCalledTimes(2);
    vi.mocked(PODMAN_CONNECTION2.connection.status).mockReturnValue('stopped');
    await dockerContextSynchronizer.processUpdatedConnection(PODMAN_CONNECTION2.connection);
    expect(dockerExtensionAPI.removeContext).toHaveBeenCalledTimes(1);
  });
});
