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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  applyCatalogTableSort,
  orderCatalogTableExtensions,
  resetCatalogTableSort,
} from './catalog-extension-table-sort.svelte';
import {
  markNewlyInstalled,
  NEW_BADGE_DURATION_MS,
  newlyInstalledAt,
  refreshNewBadges,
} from './extension-catalog-settings.svelte';

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
    newlyInstalledAt.clear();
    resetCatalogTableSort();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'));
  });

  afterEach(() => {
    newlyInstalledAt.clear();
    resetCatalogTableSort();
    vi.useRealTimers();
  });

  test('pins newly installed extensions to the top until user sorts', () => {
    markNewlyInstalled('new-ext');
    newlyInstalledAt.set('new-ext', Date.now());

    const extensions = [
      createExtension('alpha', 'Alpha'),
      createExtension('new-ext', 'New Extension'),
      createExtension('beta', 'Beta'),
    ];
    const ordered = orderCatalogTableExtensions(extensions);

    expect(ordered.map(extension => extension.id)).toEqual(['new-ext', 'alpha', 'beta']);
  });

  test('uses standard sorting after user applies a column sort', () => {
    markNewlyInstalled('new-ext');
    newlyInstalledAt.set('new-ext', Date.now());

    const extensions = [
      createExtension('alpha', 'Alpha'),
      createExtension('new-ext', 'New Extension'),
      createExtension('beta', 'Beta'),
    ];

    applyCatalogTableSort('Name');
    const ordered = orderCatalogTableExtensions(extensions);

    expect(ordered.map(extension => extension.id)).toEqual(['alpha', 'beta', 'new-ext']);
  });

  test('returns normal order after the new badge expires', () => {
    markNewlyInstalled('new-ext');

    const extensions = [
      createExtension('alpha', 'Alpha'),
      createExtension('new-ext', 'New Extension'),
      createExtension('beta', 'Beta'),
    ];

    expect(orderCatalogTableExtensions(extensions).map(extension => extension.id)).toEqual([
      'new-ext',
      'alpha',
      'beta',
    ]);

    vi.advanceTimersByTime(NEW_BADGE_DURATION_MS + 1);
    refreshNewBadges();

    expect(orderCatalogTableExtensions(extensions).map(extension => extension.id)).toEqual([
      'alpha',
      'beta',
      'new-ext',
    ]);
  });
});
