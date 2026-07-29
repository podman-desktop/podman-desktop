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

import { EventEmitter } from 'node:events';
import * as http from 'node:http';

import type { ContainerProviderConnection, Disposable, ExtensionContext, Provider } from '@podman-desktop/api';
import { provider as providerApi } from '@podman-desktop/api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { UNIX_SOCKET_PATH } from './docker-api';
import { getDockerInstallation } from './docker-cli';
import { DockerDaemonMonitor } from './docker-daemon-monitor';

vi.mock(import('node:http'));
vi.mock(import('./docker-cli'));

const connectionDisposable: Disposable = { dispose: vi.fn() };

const fakeProvider: Provider = {
  registerContainerProviderConnection: vi.fn().mockReturnValue(connectionDisposable),
  updateStatus: vi.fn(),
  updateVersion: vi.fn(),
  status: 'ready',
} as unknown as Provider;

let extensionContext: ExtensionContext;
let monitor: DockerDaemonMonitor;

const originalConsoleDebug = console.debug;

/**
 * Mock node:http.get for socket-path pings (same EventEmitter approach as compose detect.spec).
 * Pass status codes per path; omit a path to simulate a connection error.
 */
function mockHttpGet(statusByPath: Record<string, number>): void {
  vi.mocked(http.get).mockImplementation(((options: unknown, callback?: (res: http.IncomingMessage) => void) => {
    const path = (options as http.RequestOptions).path ?? '';
    const request = new EventEmitter() as http.ClientRequest;

    const statusCode = statusByPath[path];
    if (statusCode === undefined) {
      queueMicrotask(() => request.emit('error', new Error('connect error')));
      return request;
    }

    const response = new EventEmitter() as http.IncomingMessage;
    response.statusCode = statusCode;
    callback?.(response);
    response.emit('data', '');
    response.emit('end');
    return request;
  }) as unknown as typeof http.get);
}

beforeEach(() => {
  vi.resetAllMocks();
  console.debug = vi.fn();

  vi.mocked(getDockerInstallation).mockResolvedValue({ version: '24.0.0' });
  vi.mocked(fakeProvider.registerContainerProviderConnection).mockReturnValue(connectionDisposable);
  vi.mocked(providerApi.createProvider).mockReturnValue(fakeProvider);
  Object.defineProperty(fakeProvider, 'status', { value: 'ready', configurable: true });

  extensionContext = { subscriptions: [] } as unknown as ExtensionContext;
  monitor = new DockerDaemonMonitor(extensionContext, UNIX_SOCKET_PATH);
});

afterEach(() => {
  console.debug = originalConsoleDebug;
});

describe('updateProvider', () => {
  test('registers a Docker connection when the daemon is alive and not Podman', async () => {
    mockHttpGet({ '/_ping': 200 });

    await monitor.updateProvider();

    expect(providerApi.createProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Docker',
        id: 'docker',
      }),
    );
    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(1);
    const connection = vi.mocked(fakeProvider.registerContainerProviderConnection).mock
      .calls[0][0] as ContainerProviderConnection;
    expect(connection.name).toBe('Docker');
    expect(connection.type).toBe('docker');
    expect(connection.endpoint.socketPath).toBe(UNIX_SOCKET_PATH);
    expect(connection.status()).toBe('started');
    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('started');
    expect(extensionContext.subscriptions).toContain(fakeProvider);
    expect(extensionContext.subscriptions).toContain(connectionDisposable);

    // install/version updates run before provider creation on the first tick;
    // a subsequent tick reports the Docker CLI version once the provider exists
    await monitor.updateProvider();
    expect(fakeProvider.updateVersion).toHaveBeenCalledWith('24.0.0');
  });

  test('does not register a connection when the socket answers as Podman', async () => {
    mockHttpGet({ '/_ping': 200, '/libpod/_ping': 200 });

    await monitor.updateProvider();

    expect(providerApi.createProvider).not.toHaveBeenCalled();
    expect(fakeProvider.registerContainerProviderConnection).not.toHaveBeenCalled();
  });

  test('does not register a connection when the daemon is unreachable', async () => {
    mockHttpGet({});

    await monitor.updateProvider();

    expect(providerApi.createProvider).not.toHaveBeenCalled();
    expect(fakeProvider.registerContainerProviderConnection).not.toHaveBeenCalled();
  });

  test('disposes the connection and marks the provider stopped when the daemon dies', async () => {
    mockHttpGet({ '/_ping': 200 });
    await monitor.updateProvider();

    mockHttpGet({});
    await monitor.updateProvider();

    expect(connectionDisposable.dispose).toHaveBeenCalled();
    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('stopped');
  });

  test('re-registers the connection when the daemon comes back after being stopped', async () => {
    mockHttpGet({ '/_ping': 200 });
    await monitor.updateProvider();

    mockHttpGet({});
    await monitor.updateProvider();

    const secondDisposable = { dispose: vi.fn() };
    vi.mocked(fakeProvider.registerContainerProviderConnection).mockReturnValue(secondDisposable);

    mockHttpGet({ '/_ping': 200 });
    await monitor.updateProvider();

    expect(fakeProvider.registerContainerProviderConnection).toHaveBeenCalledTimes(2);
    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('started');
    expect(extensionContext.subscriptions).toContain(secondDisposable);
  });

  test('marks the provider not-installed when Docker CLI is missing', async () => {
    mockHttpGet({ '/_ping': 200 });
    await monitor.updateProvider();

    vi.mocked(getDockerInstallation).mockResolvedValue(undefined);
    await monitor.updateProvider();

    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('not-installed');
  });

  test('updates provider status to installed when Docker appears after being not-installed', async () => {
    mockHttpGet({ '/_ping': 200 });
    await monitor.updateProvider();

    Object.defineProperty(fakeProvider, 'status', { value: 'not-installed', configurable: true });
    vi.mocked(getDockerInstallation).mockResolvedValue({ version: '25.0.0' });
    await monitor.updateProvider();

    expect(fakeProvider.updateVersion).toHaveBeenCalledWith('25.0.0');
    expect(fakeProvider.updateStatus).toHaveBeenCalledWith('installed');
  });
});

describe('stop', () => {
  test('stops the monitoring loop', () => {
    expect(() => monitor.stop()).not.toThrow();
  });
});
