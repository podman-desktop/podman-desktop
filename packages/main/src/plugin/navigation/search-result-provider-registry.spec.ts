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

import type { SearchResultProvider } from '@podman-desktop/api';
import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Emitter } from '/@/plugin/events/emitter.js';

import { SearchResultProviderRegistry } from './search-result-provider-registry.js';

const apiSender: ApiSenderType = {
  send: vi.fn(),
  receive: vi.fn(),
};

let registry: SearchResultProviderRegistry;

beforeEach(() => {
  vi.resetAllMocks();
  registry = new SearchResultProviderRegistry(apiSender);
});

function createMockProvider(items: { label: string; command: string }[] = []): SearchResultProvider {
  return {
    provideItems: vi.fn().mockResolvedValue(items.map(i => ({ label: i.label, command: i.command }))),
  };
}

describe('registerProvider', () => {
  test('should return a disposable', () => {
    const provider = createMockProvider();
    const disposable = registry.registerProvider('ext1', 'Extension 1', undefined, provider);
    expect(disposable).toBeDefined();
    expect(disposable.dispose).toBeDefined();
  });

  test('should subscribe to onDidChangeItems and notify via apiSender', () => {
    const emitter = new Emitter<void>();
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([]),
      onDidChangeItems: emitter.event,
    };

    registry.registerProvider('ext1', 'Extension 1', undefined, provider);
    emitter.fire();

    expect(apiSender.send).toHaveBeenCalledWith('navigation-search-provider-items-changed');
  });

  test('dispose should unsubscribe from onDidChangeItems', () => {
    const emitter = new Emitter<void>();
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([]),
      onDidChangeItems: emitter.event,
    };

    const disposable = registry.registerProvider('ext1', 'Extension 1', undefined, provider);
    disposable.dispose();
    emitter.fire();

    expect(apiSender.send).not.toHaveBeenCalled();
  });
});

describe('search', () => {
  test('should return results from a single provider', async () => {
    const provider = createMockProvider([
      { label: 'Pod A', command: 'ext.open' },
      { label: 'Pod B', command: 'ext.open' },
    ]);

    registry.registerProvider('ext1', 'Kubernetes', undefined, provider);
    const results = await registry.search('Pod');

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual(
      expect.objectContaining({ label: 'Pod A', command: 'ext.open', providerLabel: 'Kubernetes' }),
    );
  });

  test('should aggregate results from multiple providers', async () => {
    const provider1 = createMockProvider([{ label: 'Pod A', command: 'k8s.open' }]);
    const provider2 = createMockProvider([{ label: 'Model X', command: 'ai.open' }]);

    registry.registerProvider('k8s', 'Kubernetes', undefined, provider1);
    registry.registerProvider('ai', 'AI Lab', undefined, provider2);

    const results = await registry.search('test');
    expect(results).toHaveLength(2);
    expect(results[0]!.providerLabel).toBe('Kubernetes');
    expect(results[1]!.providerLabel).toBe('AI Lab');
  });

  test('should use metadata label over extension label', async () => {
    const provider = createMockProvider([{ label: 'Item', command: 'cmd' }]);
    registry.registerProvider('ext1', 'Extension 1', undefined, provider, { label: 'Custom Label' });

    const results = await registry.search('Item');
    expect(results[0]!.providerLabel).toBe('Custom Label');
  });

  test('should fall back to extension icon when item has no icon', async () => {
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([{ label: 'Item', command: 'cmd' }]),
    };

    registry.registerProvider('ext1', 'Ext', 'ext-icon-data', provider);
    const results = await registry.search('Item');
    expect(results[0]!.icon).toBe('ext-icon-data');
  });

  test('should preserve item icon when provided', async () => {
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([{ label: 'Item', command: 'cmd', icon: 'custom-icon' }]),
    };

    registry.registerProvider('ext1', 'Ext', 'ext-icon-data', provider);
    const results = await registry.search('Item');
    expect(results[0]!.icon).toBe('custom-icon');
  });

  test('should respect maxResults', async () => {
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([
        { label: 'A', command: 'cmd' },
        { label: 'B', command: 'cmd' },
        { label: 'C', command: 'cmd' },
      ]),
    };

    registry.registerProvider('ext1', 'Ext', undefined, provider);
    const results = await registry.search('test', 2);

    expect(results).toHaveLength(2);
    expect(provider.provideItems).toHaveBeenCalledWith('test', { maxResults: 2 }, expect.anything());
  });

  test('should cancel previous search when a new one starts', async () => {
    let capturedToken: { isCancellationRequested: boolean } | undefined;
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockImplementation(async (_query, _options, token) => {
        capturedToken = token;
        return [{ label: 'Result', command: 'cmd' }];
      }),
    };

    registry.registerProvider('ext1', 'Ext', undefined, provider);
    await registry.search('first');
    const firstToken = capturedToken;

    await registry.search('second');
    expect(firstToken!.isCancellationRequested).toBe(true);
  });

  test('should handle provider errors gracefully', async () => {
    const errorProvider: SearchResultProvider = {
      provideItems: vi.fn().mockRejectedValue(new Error('Provider failed')),
    };
    const goodProvider = createMockProvider([{ label: 'Good', command: 'cmd' }]);

    registry.registerProvider('bad', 'Bad', undefined, errorProvider);
    registry.registerProvider('good', 'Good', undefined, goodProvider);

    const results = await registry.search('test');
    expect(results).toHaveLength(1);
    expect(results[0]!.label).toBe('Good');
  });

  test('should return empty results after provider is disposed', async () => {
    const provider = createMockProvider([{ label: 'Item', command: 'cmd' }]);
    const disposable = registry.registerProvider('ext1', 'Ext', undefined, provider);

    disposable.dispose();
    const results = await registry.search('test');
    expect(results).toHaveLength(0);
  });

  test('should pass args through from provider results', async () => {
    const provider: SearchResultProvider = {
      provideItems: vi.fn().mockResolvedValue([{ label: 'Item', command: 'cmd', args: ['arg1', 42] }]),
    };

    registry.registerProvider('ext1', 'Ext', undefined, provider);
    const results = await registry.search('test');
    expect(results[0]!.args).toEqual(['arg1', 42]);
  });
});
