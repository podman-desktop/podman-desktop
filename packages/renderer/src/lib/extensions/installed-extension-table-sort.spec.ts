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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  markNewlyInstalled,
  NEW_BADGE_DURATION_MS,
  newlyInstalledAt,
  refreshNewBadges,
} from './extension-catalog-settings.svelte';
import { USE_CASE_EXTENSION_IDS } from './extension-prototype-use-cases';
import { ExtensionsUtils } from './extensions-utils';
import type { InstalledExtensionTableRow } from './installed-extension-table-row';
import {
  applyInstalledTableSort,
  orderInstalledTableRows,
  resetInstalledTableSort,
} from './installed-extension-table-sort.svelte';

function createRow(id: string, name: string, options?: { hasUpdate?: boolean }): InstalledExtensionTableRow {
  const extension = {
    id,
    name,
    displayName: name,
    state: 'started',
    removable: true,
    devMode: false,
    type: 'pd',
    path: '',
    readme: '',
  } as CombinedExtensionInfoUI;

  const catalogExtension = {
    id,
    displayName: name,
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    installedVersion: '1.0.0',
    publisherDisplayName: 'Publisher',
    isInstalled: true,
    shortDescription: '',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: options?.hasUpdate ?? false,
    isVerified: false,
    isSupportedByRedHat: false,
  } as CatalogExtensionInfoUI;

  return { name, extension, catalogExtension };
}

describe('installed-extension-table-sort', () => {
  const extensionsUtils = new ExtensionsUtils();

  beforeEach(() => {
    newlyInstalledAt.clear();
    resetInstalledTableSort();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'));
  });

  afterEach(() => {
    newlyInstalledAt.clear();
    resetInstalledTableSort();
    vi.useRealTimers();
  });

  test('pins manual update demo rows above other installed extensions', () => {
    const rows = [
      createRow('alpha', 'Alpha'),
      createRow(USE_CASE_EXTENSION_IDS.communityActiveWithUpdate, 'Kind', { hasUpdate: true }),
      createRow('beta', 'Beta'),
    ];
    rows[1].catalogExtension.fetchVersion = '1.1.0';

    const ordered = orderInstalledTableRows(rows, extensionsUtils);

    expect(ordered.map(row => row.extension.id)).toEqual([
      USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      'alpha',
      'beta',
    ]);
  });

  test('pins newly installed extensions to the top until user sorts', () => {
    markNewlyInstalled('new-ext');
    newlyInstalledAt.set('new-ext', Date.now());

    const rows = [createRow('alpha', 'Alpha'), createRow('new-ext', 'New Extension'), createRow('beta', 'Beta')];
    const ordered = orderInstalledTableRows(rows, extensionsUtils);

    expect(ordered.map(row => row.extension.id)).toEqual(['new-ext', 'alpha', 'beta']);
  });

  test('uses standard sorting after user applies a column sort', () => {
    markNewlyInstalled('new-ext');
    newlyInstalledAt.set('new-ext', Date.now());

    const rows = [createRow('alpha', 'Alpha'), createRow('new-ext', 'New Extension'), createRow('beta', 'Beta')];

    applyInstalledTableSort('Name');
    const ordered = orderInstalledTableRows(rows, extensionsUtils);

    expect(ordered.map(row => row.extension.id)).toEqual(['alpha', 'beta', 'new-ext']);
  });

  test('returns normal order after the new badge expires', () => {
    markNewlyInstalled('new-ext');

    const rows = [createRow('alpha', 'Alpha'), createRow('new-ext', 'New Extension'), createRow('beta', 'Beta')];

    expect(orderInstalledTableRows(rows, extensionsUtils).map(row => row.extension.id)).toEqual([
      'new-ext',
      'alpha',
      'beta',
    ]);

    vi.advanceTimersByTime(NEW_BADGE_DURATION_MS + 1);
    refreshNewBadges();

    expect(orderInstalledTableRows(rows, extensionsUtils).map(row => row.extension.id)).toEqual([
      'alpha',
      'beta',
      'new-ext',
    ]);
  });
});
