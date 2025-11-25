/*********************************************************************
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
 ********************************************************************/

import type { Provider } from '@podman-desktop/api';
import { configuration, provider } from '@podman-desktop/api';
import { Container as InversifyContainer } from 'inversify';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanProvider } from '/@/providers/podman-provider';
import { PodmanBinary } from '/@/utils/podman-binary';

const PODMAN_BINARY: PodmanBinary = {
  getBinaryInfo: vi.fn(),
} as unknown as PodmanBinary;

const PROVIDER_MOCK: Provider = {
  dispose: vi.fn(),
} as unknown as Provider;

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(provider.createProvider).mockReturnValue(PROVIDER_MOCK);
  vi.mocked(configuration.getConfiguration).mockReturnValue({
    get: vi.fn(),
    has: vi.fn(),
    update: vi.fn(),
  });
});

describe('initialisation', () => {
  test('PodmanProvider#provider should throw an error if not initialized', () => {
    const podmanProvider = new PodmanProvider(PODMAN_BINARY);

    // expect error to be thrown
    expect(() => {
      return podmanProvider.provider;
    }).toThrowError('Podman provider not initialized');
  });

  test('PodmanProvider#provider should return the provider once initialized', async () => {
    const podmanProvider = new PodmanProvider(PODMAN_BINARY);
    await podmanProvider.init();

    const provider = podmanProvider.provider;
    expect(provider).toBe(PROVIDER_MOCK);
  });

  test('inversify should handle init through postConstructor decorator', async () => {
    const inversify = new InversifyContainer();

    inversify.bind(PodmanBinary).toConstantValue(PODMAN_BINARY);
    inversify.bind(PodmanProvider).toSelf().inSingletonScope();

    // be careful to use getAsync
    const podmanProvider = await inversify.getAsync(PodmanProvider);

    const provider = podmanProvider.provider;
    expect(provider).toBe(PROVIDER_MOCK);
  });

  test('provider#createProvider should be called with the correct arguments', async () => {
    const podmanProvider = new PodmanProvider(PODMAN_BINARY);
    await podmanProvider.init();

    expect(provider.createProvider).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: 'Podman',
        id: 'podman',
        status: 'not-installed',
      }),
    );
  });

  test('provider#createProvider should have status installed if version detected', async () => {
    vi.mocked(PODMAN_BINARY.getBinaryInfo).mockResolvedValue({ version: '5.1.2' });

    const podmanProvider = new PodmanProvider(PODMAN_BINARY);
    await podmanProvider.init();

    expect(provider.createProvider).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: 'installed',
      }),
    );
  });
});

test('dispose should make provider undefined', async () => {
  const podmanProvider = new PodmanProvider(PODMAN_BINARY);
  await podmanProvider.init();

  expect(podmanProvider.provider).toBeDefined();

  podmanProvider.dispose();

  // expect error to be thrown
  expect(() => {
    return podmanProvider.provider;
  }).toThrowError('Podman provider not initialized');
});
