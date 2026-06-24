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

import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  applyCatalogTableSort,
  orderCatalogTableExtensions,
  resetCatalogTableSort,
} from './catalog-extension-table-sort.svelte';

function createExtension(id: string, name: string, featured = false): CatalogExtensionInfoUI {
  return {
    id,
    displayName: name,
    isFeatured: featured,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Publisher',
    isInstalled: false,
    shortDescription: '',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };
}

describe('catalog-extension-table-sort', () => {
  beforeEach(() => {
    resetCatalogTableSort();
  });

  afterEach(() => {
    resetCatalogTableSort();
  });

  test('orders featured extensions before others by default', () => {
    const extensions = [
      createExtension('alpha', 'Alpha'),
      createExtension('featured', 'Featured Extension', true),
      createExtension('beta', 'Beta'),
    ];
    const ordered = orderCatalogTableExtensions(extensions);

    expect(ordered.map(extension => extension.id)).toEqual(['featured', 'alpha', 'beta']);
  });

  test('uses standard sorting after user applies a column sort', () => {
    const extensions = [
      createExtension('alpha', 'Alpha'),
      createExtension('beta', 'Beta'),
      createExtension('featured', 'Featured Extension', true),
    ];

    applyCatalogTableSort('Name');
    const ordered = orderCatalogTableExtensions(extensions);

    expect(ordered.map(extension => extension.id)).toEqual(['alpha', 'beta', 'featured']);
  });
});
