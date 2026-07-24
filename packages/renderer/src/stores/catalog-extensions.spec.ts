/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import { get } from 'svelte/store';
import { assert, beforeAll, beforeEach, expect, test, vi } from 'vitest';

import {
  catalogExtensionEventStore,
  catalogExtensionEventStoreInfo,
  catalogExtensionInfos,
} from './catalog-extensions';

const callbacks = new Map<string, (data?: unknown) => void | Promise<void>>();

// setup() registers a real window.addEventListener that is never removed, so it must
// only run once for the file rather than per test (which would stack duplicate listeners).
beforeAll(() => {
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
  catalogExtensionEventStore.setup();
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('catalog extension should be updated in case of a container is removed', async () => {
  // initial catalog is empty
  vi.mocked(window.getCatalogExtensions).mockResolvedValue([]);

  // get list and expect nothing there
  const catalogExtensions = get(catalogExtensionInfos);
  expect(catalogExtensions.length).toBe(0);

  vi.mocked(window.getCatalogExtensions).mockReset();
  vi.mocked(window.getCatalogExtensions).mockResolvedValue([
    {
      id: 'first.extension1',
      displayName: 'test1',
      publisherName: 'Foo publisher',
      extensionName: 'extension',
      shortDescription: 'short description',
      publisherDisplayName: 'Foo publisher display name',
      unlisted: false,
      categories: [],
      keywords: [],
      versions: [
        {
          version: '1.0.0',
          ociUri: 'oci://test1',
          preview: false,
          files: [],
          lastUpdated: new Date(),
        },
      ],
    },
    {
      id: 'second.extension2',
      displayName: 'test2',
      publisherName: 'Foo publisher',
      extensionName: 'extension2',
      shortDescription: 'short description',
      publisherDisplayName: 'Foo publisher display name',
      categories: [],
      keywords: [],
      unlisted: true,
      versions: [
        {
          version: '2.0.0',
          ociUri: 'oci://test2',
          preview: false,
          files: [],
          lastUpdated: new Date(),
        },
      ],
    },
  ]);

  // send 'system-ready' event
  window.dispatchEvent(new CustomEvent('system-ready'));

  // check that getCatalogExtensions is called
  await vi.waitFor(() => expect(window.getCatalogExtensions).toBeCalled());

  // fetch manually
  await catalogExtensionEventStoreInfo.fetch();

  // check if the catalog has been updated
  const afterCatalogExtensions = get(catalogExtensionInfos);
  expect(afterCatalogExtensions.length).toBe(2);

  // get first extension
  const firstExtension = afterCatalogExtensions.find(ext => ext.id === 'first.extension1');
  expect(firstExtension).toBeDefined();
  expect(firstExtension?.unlisted).toBeFalsy();

  // get second extension
  const secondExtension = afterCatalogExtensions.find(ext => ext.id === 'second.extension2');
  expect(secondExtension).toBeDefined();
  expect(secondExtension?.unlisted).toBeTruthy();
});

test('catalog extension should be updated in refresh event is published', async () => {
  // initial catalog is empty
  vi.mocked(window.getCatalogExtensions).mockResolvedValue([]);
  vi.mocked(window.getCatalogExtensions).mockReset();

  const callback = callbacks.get('refresh-catalog');
  // send 'refresh-catalog' event
  assert(callback);
  await callback();

  // check that getCatalogExtensions is called
  expect(window.getCatalogExtensions).toBeCalled();
});
