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

import * as http from 'node:http';

import type { ContainerProviderConnection, Disposable, ExtensionContext, Provider } from '@podman-desktop/api';
import { provider as providerApi } from '@podman-desktop/api';
import type { DockerContextInfo } from '@podman-desktop/docker-extension-api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { getDockerInstallation } from './docker-cli';
import type { DockerContextHandler } from './docker-context-handler';
import * as extension from './extension';

vi.mock(import('node:http'));
vi.mock(import('./docker-cli'));

function contextFixture(name: string, host: string): DockerContextInfo {
  return {
    name,
    isCurrentContext: false,
    metadata: { description: name },
    endpoints: { docker: { host } },
  };
}

interface EngineFixture {
  docker?: boolean;
  podman?: boolean;
}

const engines = new Map<string, EngineFixture>();

function setEngine(socketPath: string, fixture: EngineFixture): void {
  engines.set(socketPath, fixture);
}

function mockHttpGet(): void {
  vi.mocked(http.get).mockImplementation(((options: unknown, callback?: (res: unknown) => void) => {
    const { path, socketPath } = options as { path: string; socketPath: string };
    const fixture = engines.get(socketPath);
    const alive = path === '/_ping' ? fixture?.docker === true : fixture?.podman === true;

    if (alive) {
      callback?.({
        statusCode: 200,
        on: (event: string, handler: () => void): void => {
          if (event === 'end') {
            handler();
          }
        },
      });
      return { once: vi.fn() };
    }

    return {
      once: (event: string, handler: (err: Error) => void): void => {
        if (event === 'error') {
          handler(new Error('connect error'));
        }
      },
    };
  }) as unknown as typeof http.get);
}

function createFakeProvider(): Provider {
  return {
    registerContainerProviderConnection: vi.fn(() => ({ dispose: vi.fn() }) as unknown as Disposable),
    updateStatus: vi.fn(),
    updateVersion: vi.fn(),
    status: 'ready',
  } as unknown as Provider;
}

let fakeProvider: Provider;
let dockerContextHandler: DockerContextHandler;
let extensionContext: ExtensionContext;

beforeEach(() => {
  vi.resetAllMocks();
  engines.clear();
  mockHttpGet();
  extension.resetProviderState();

  vi.mocked(getDockerInstallation).mockResolvedValue({ version: '24.0.0' });

  fakeProvider = createFakeProvider();
  vi.mocked(providerApi.createProvider).mockReturnValue(fakeProvider);

  dockerContextHandler = { listContexts: vi.fn() } as unknown as DockerContextHandler;
  extensionContext = { subscriptions: [] } as unknown as ExtensionContext;
});

describe('registerConnectionForContext', () => {
  test('registers a docker connection using the raw context name and socket path', () => {
    let registered: ContainerProviderConnection | undefined;
    vi.mocked(fakeProvider.registerContainerProviderConnection).mockImplementation(connection => {
      registered = connection;
      return { dispose: vi.fn() } as unknown as Disposable;
    });

    extension.registerConnectionForContext(
      fakeProvider,
      contextFixture('colima', 'unix:///colima.sock'),
      '/colima.sock',
    );

    expect(registered).toBeDefined();
    expect(registered?.name).toBe('colima');
    expect(registered?.displayName).toBe('colima');
    expect(registered?.type).toBe('docker');
    expect(registered?.endpoint.socketPath).toBe('/colima.sock');
    expect(registered?.status()).toBe('started');
  });

  test('keeps displaying the default context as "Docker"', () => {
    let registered: ContainerProviderConnection | undefined;
    vi.mocked(fakeProvider.registerContainerProviderConnection).mockImplementation(connection => {
      registered = connection;
      return { dispose: vi.fn() } as unknown as Disposable;
    });

    extension.registerConnectionForContext(
      fakeProvider,
      contextFixture('default', 'unix:///var/run/docker.sock'),
      '/var/run/docker.sock',
    );

    expect(registered?.name).toBe('default');
    expect(registered?.displayName).toBe('Docker');
  });
});

describe('updateProvider', () => {
  test('registers one connection per alive, non-podman context', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([
      contextFixture('default', 'unix:///var/run/docker.sock'),
      contextFixture('colima', 'unix:///colima.sock'),
    ]);
    setEngine('/var/run/docker.sock', { docker: true });
    setEngine('/colima.sock', { docker: true });

    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(2);
    const names = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.calls.map(([c]) => c.name);
    expect(names).toEqual(['default', 'colima']);
  });

  test('never registers a context whose socket answers as podman, not docker', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([
      contextFixture('podman', 'unix:///run/podman.sock'),
    ]);
    setEngine('/run/podman.sock', { docker: true, podman: true });

    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(fakeProvider.registerContainerProviderConnection).not.toHaveBeenCalled();
  });

  test('skips and logs a context with an unsupported endpoint scheme', async () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([contextFixture('remote', 'tcp://1.2.3.4:2376')]);

    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(fakeProvider.registerContainerProviderConnection).not.toHaveBeenCalled();
    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining('remote'));
  });

  test('keeps a connection registered and flips its status when its engine stops answering, then answers again', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([contextFixture('colima', 'unix:///colima.sock')]);
    setEngine('/colima.sock', { docker: true });

    await extension.updateProvider(extensionContext, dockerContextHandler);
    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(1);
    const registeredConnection = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.calls[0][0];
    const disposable = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.results[0]?.value as Disposable;
    expect(registeredConnection.status()).toBe('started');

    setEngine('/colima.sock', { docker: false });
    await extension.updateProvider(extensionContext, dockerContextHandler);
    expect(disposable.dispose).not.toHaveBeenCalled();
    expect(registeredConnection.status()).toBe('stopped');

    setEngine('/colima.sock', { docker: true });
    await extension.updateProvider(extensionContext, dockerContextHandler);
    // still the same connection object, not re-registered
    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(1);
    expect(registeredConnection.status()).toBe('started');
  });

  test('keeps a connection registered while its context is still listed but its engine stops answering', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([contextFixture('colima', 'unix:///colima.sock')]);
    setEngine('/colima.sock', { docker: true });
    await extension.updateProvider(extensionContext, dockerContextHandler);
    const registeredConnection = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.calls[0][0];
    const disposable = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.results[0]?.value as Disposable;

    setEngine('/colima.sock', { docker: false });
    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(disposable.dispose).not.toHaveBeenCalled();
    // registered only once, never re-registered
    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(1);
    expect(registeredConnection.status()).toBe('stopped');
  });

  test('disposes a connection once its context disappears entirely (e.g. `colima stop` removes its own context)', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValueOnce([
      contextFixture('colima', 'unix:///colima.sock'),
    ]);
    setEngine('/colima.sock', { docker: true });
    await extension.updateProvider(extensionContext, dockerContextHandler);
    const disposable = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.results[0]?.value as Disposable;

    // colima removes its own context and stops answering at the same time
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValueOnce([]);
    setEngine('/colima.sock', { docker: false });
    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(disposable.dispose).toHaveBeenCalled();
  });

  test('still disposes a connection if its context later answers as podman, not docker', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([contextFixture('shared', 'unix:///shared.sock')]);
    setEngine('/shared.sock', { docker: true });
    await extension.updateProvider(extensionContext, dockerContextHandler);
    const disposable = vi.mocked(fakeProvider.registerContainerProviderConnection).mock.results[0]?.value as Disposable;

    setEngine('/shared.sock', { docker: true, podman: true });
    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(disposable.dispose).toHaveBeenCalled();
  });

  test('marks the provider started while any connection is alive, without redundant updates', async () => {
    vi.mocked(dockerContextHandler.listContexts).mockResolvedValue([
      contextFixture('default', 'unix:///var/run/docker.sock'),
    ]);
    setEngine('/var/run/docker.sock', { docker: true });

    await extension.updateProvider(extensionContext, dockerContextHandler);
    await extension.updateProvider(extensionContext, dockerContextHandler);

    const startedCalls = vi.mocked(fakeProvider.updateStatus).mock.calls.filter(([status]) => status === 'started');
    expect(startedCalls).toHaveLength(1);

    setEngine('/var/run/docker.sock', { docker: false });
    await extension.updateProvider(extensionContext, dockerContextHandler);

    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('stopped');
  });
});
