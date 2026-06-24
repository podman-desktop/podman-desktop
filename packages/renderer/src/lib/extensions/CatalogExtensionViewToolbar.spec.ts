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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionList from './CatalogExtensionList.svelte';
import { getCatalogViewMode, setCatalogViewMode } from './extension-catalog-settings.svelte';

const extension: CatalogExtensionInfoUI = {
  id: 'myId1',
  displayName: 'Extension One',
  isFeatured: false,
  fetchable: false,
  fetchLink: '',
  fetchVersion: '1.0.0',
  publisherDisplayName: 'Publisher',
  isInstalled: false,
  shortDescription: 'description',
  categories: [],
  keywords: [],
  availableVersions: [],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};

beforeEach(() => {
  setCatalogViewMode('grid');
});

test('switches catalog list from grid to table view', async () => {
  render(CatalogExtensionList, {
    catalogExtensions: [extension],
    allCatalogExtensions: [extension],
  });

  expect(screen.getByRole('region', { name: 'Catalog Extensions' })).toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Table view' }));

  expect(getCatalogViewMode()).toBe('table');
  expect(screen.getByRole('table', { name: 'extensions' })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Catalog Extensions' })).not.toBeInTheDocument();
});
