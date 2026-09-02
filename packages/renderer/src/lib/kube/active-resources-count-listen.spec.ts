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
    configurable: true,
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
  vi.mocked(window.getConfigurationValue<boolean>).mockResolvedValue(false);
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

  // Regression test for the preload bridge cold-start race (see #18225): on slow/cold Windows
  // starts window.events may not be exposed yet. Without optional chaining, window.events.receive(...)
  // throws a TypeError (rejecting this promise) and disposable.dispose() throws on teardown. The
  // optional chaining must turn both into safe no-ops.
  test('does not throw when the preload bridge (window.events) is not yet exposed', async () => {
    vi.mocked(window.kubernetesGetActiveResourcesCount).mockResolvedValue([]);

    const original = window.events;
    Object.defineProperty(window, 'events', { configurable: true, value: undefined });
    try {
      const callback = vi.fn();
      // must resolve, not reject: with `window.events.receive` (no ?.) this line throws
      const result = await listenActiveResourcesCount(callback);
      expect(result).not.toBeUndefined();
      // must not throw: with `disposable.dispose()` (no ?.) this throws since disposable is undefined
      expect(() => result?.dispose()).not.toThrow();
    } finally {
      Object.defineProperty(window, 'events', { configurable: true, value: original });
    }
  });
});
