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

import * as fs from 'node:fs';
import * as os from 'node:os';

import type * as extensionApi from '@podman-desktop/api';
import * as podmanDesktopApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { activate, deactivate } from './extension';
import { ImageHandler } from './image-handler';

vi.mock(import('node:fs'));
vi.mock(import('node:os'));
vi.mock(import('./image-handler'));
vi.mock(import('./limactl'));

const disposeMock = vi.fn();

const PROVIDER_MOCK: podmanDesktopApi.Provider = {
  registerContainerProviderConnection: vi.fn().mockReturnValue({ dispose: disposeMock }),
  registerKubernetesProviderConnection: vi.fn().mockReturnValue({ dispose: disposeMock }),
  updateStatus: vi.fn(),
} as unknown as podmanDesktopApi.Provider;

function createExtensionContext(): extensionApi.ExtensionContext {
  return {
    subscriptions: [],
    storagePath: '/fake/storage',
  } as unknown as extensionApi.ExtensionContext;
}

beforeEach(() => {
  vi.resetAllMocks();

  vi.spyOn(console, 'log').mockImplementation(vi.fn());
  vi.spyOn(console, 'debug').mockImplementation(vi.fn());
  vi.spyOn(console, 'error').mockImplementation(vi.fn());

  vi.mocked(os.homedir).mockReturnValue('/home/testuser');
  vi.mocked(podmanDesktopApi.provider.createProvider).mockReturnValue(PROVIDER_MOCK);

  vi.mocked(podmanDesktopApi.configuration.getConfiguration).mockReturnValue({
    get: vi.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'type':
        case 'name':
          return 'kubernetes';
        case 'socket':
          return 'kubernetes.sock';
        default:
          return undefined;
      }
    }),
  } as unknown as podmanDesktopApi.Configuration);
});

describe('deactivate', () => {
  test('should log stopping message', () => {
    deactivate();
    expect(console.log).toHaveBeenCalledWith('stopping lima extension');
  });
});

describe('activate', () => {
  test('should not create provider when neither socket nor config exists', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    await activate(createExtensionContext());

    expect(podmanDesktopApi.provider.createProvider).not.toHaveBeenCalled();
  });

  test('should create provider when config exists', async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: fs.PathLike) => {
      return String(p).includes('kubeconfig.yaml');
    });

    await activate(createExtensionContext());

    expect(podmanDesktopApi.provider.createProvider).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Lima', id: 'lima' }),
    );
  });
});

describe('moveImage error propagation', () => {
  let registeredConnection: extensionApi.KubernetesProviderConnection;
  let moveImageCommandHandler: (image: { engineId: string; name: string }) => Promise<void>;

  beforeEach(async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: fs.PathLike) => {
      return String(p).includes('kubeconfig.yaml');
    });

    vi.mocked(
      PROVIDER_MOCK as unknown as { registerKubernetesProviderConnection: ReturnType<typeof vi.fn> },
    ).registerKubernetesProviderConnection = vi
      .fn()
      .mockImplementation((connection: extensionApi.KubernetesProviderConnection) => {
        registeredConnection = connection;
        return { dispose: disposeMock };
      });

    vi.mocked(podmanDesktopApi.commands.registerCommand).mockImplementation((_id: string, callback: unknown) => {
      moveImageCommandHandler = callback as typeof moveImageCommandHandler;
      return { dispose: vi.fn() };
    });

    vi.mocked(podmanDesktopApi.window.withProgress).mockImplementation(async (_options, task) => {
      await task(
        { report: vi.fn() } as unknown as podmanDesktopApi.Progress<{ message?: string; increment?: number }>,
        {} as podmanDesktopApi.CancellationToken,
      );
    });

    await activate(createExtensionContext());
  });

  test('should clear connection.error on successful moveImage', async () => {
    registeredConnection.error = 'previous error';
    vi.mocked(ImageHandler.prototype.moveImage).mockResolvedValue(undefined);

    await moveImageCommandHandler({ engineId: 'engine-1', name: 'test-image' });

    expect(registeredConnection.error).toBeUndefined();
  });

  test('should not touch connection.error when it was already undefined on success', async () => {
    registeredConnection.error = undefined;
    vi.mocked(ImageHandler.prototype.moveImage).mockResolvedValue(undefined);

    await moveImageCommandHandler({ engineId: 'engine-1', name: 'test-image' });

    expect(registeredConnection.error).toBeUndefined();
  });

  test('should set connection.error with Error message on moveImage failure', async () => {
    vi.mocked(ImageHandler.prototype.moveImage).mockRejectedValue(new Error('push failed'));

    await expect(moveImageCommandHandler({ engineId: 'engine-1', name: 'test-image' })).rejects.toThrow('push failed');

    expect(registeredConnection.error).toBe('push failed');
  });

  test('should set connection.error with stringified value on non-Error moveImage failure', async () => {
    vi.mocked(ImageHandler.prototype.moveImage).mockRejectedValue('string error');

    await expect(moveImageCommandHandler({ engineId: 'engine-1', name: 'test-image' })).rejects.toBe('string error');

    expect(registeredConnection.error).toBe('string error');
  });
});
