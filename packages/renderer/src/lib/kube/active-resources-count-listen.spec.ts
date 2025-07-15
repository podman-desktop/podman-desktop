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

import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { listenActiveResourcesCount } from './active-resources-count-listen';

const callbacks = new Map<string, () => void>();

const eventEmitter = {
  receive: (message: string, callback: () => void): void => {
    callbacks.set(message, callback);
  },
};

beforeAll(() => {
  Object.defineProperty(window, 'events', {
    value: {
      receive: (message: string, callback: () => void) => {
        eventEmitter.receive(message, callback);
        return {
          dispose: (): void => {},
        };
      },
    },
  });
});

test('listenActiveResourcesCount is undefined in non experimental mode (setting is set to false)', async () => {
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(false);
  const result = await listenActiveResourcesCount((): void => {});
  expect(result).toBeUndefined();
});

test('listenActiveResourcesCount is undefined in non experimental mode (setting is undefined)', async () => {
  vi.mocked(window.getConfigurationValue<boolean>).mockResolvedValue(undefined);
  const result = await listenActiveResourcesCount((): void => {});
  expect(result).toBeUndefined();
});

describe('experimental mode is set', () => {
  beforeEach(() => {
    vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(true);
  });

  test('get initial and updated values', async () => {
    const counts = [
      {
        contextName: 'ctx1',
        resourceName: 'resource1',
        count: 1,
      },
      {
        contextName: 'ctx2',
        resourceName: 'resource1',
        count: 2,
      },
      {
        contextName: 'ctx2',
        resourceName: 'resource2',
        count: 3,
      },
    ];
    vi.mocked(window.kubernetesGetActiveResourcesCount).mockResolvedValue(counts);

    const callback = vi.fn();
    const result = await listenActiveResourcesCount(callback);
    expect(result).not.toBeUndefined();
    expect(callback).toHaveBeenCalledWith(counts);

    const newCounts = [
      {
        contextName: 'ctx1',
        resourceName: 'resource1',
        count: 1,
      },
    ];
    vi.mocked(window.kubernetesGetActiveResourcesCount).mockResolvedValue(newCounts);

    callback.mockClear();
    const cb = callbacks.get('kubernetes-active-resources-count');
    expect(cb).toBeDefined();
    cb!();
    await vi.waitFor(() => {
      expect(callback).toHaveBeenCalledWith(newCounts);
    });
  });
});
