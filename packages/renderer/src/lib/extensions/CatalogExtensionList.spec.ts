/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { render, screen } from '@testing-library/svelte';
import { beforeAll, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtensionList from './CatalogExtensionList.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'extensionInstallFromImage', { value: vi.fn() });
  Object.defineProperty(window, 'openExternal', { value: vi.fn() });
  Object.defineProperty(window, 'showMessageBox', { value: vi.fn().mockResolvedValue({ response: 0 }) });
});

const extensionA: CatalogExtensionInfoUI = {
  id: 'myId1',
  displayName: 'This is the display name1',
  isFeatured: false,
  fetchable: false,
  fetchLink: '',
  fetchVersion: '',
  publisherDisplayName: 'Foo publisher',
  isInstalled: false,
  shortDescription: 'my description1',
  categories: [],
  keywords: [],
  availableVersions: [],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};

const extensionB: CatalogExtensionInfoUI = {
  id: 'myId2',
  displayName: 'This is the display name2',
  isFeatured: false,
  fetchable: false,
  fetchLink: '',
  fetchVersion: '',
  publisherDisplayName: 'Foo publisher',
  isInstalled: false,
  shortDescription: 'my description2',
  categories: [],
  keywords: [],
  availableVersions: [],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};
test('Check with empty', async () => {
  render(CatalogExtensionList, { catalogExtensions: [], allCatalogExtensions: [] });

  const availableExtensions = screen.queryByText('Available extensions');
  expect(availableExtensions).not.toBeInTheDocument();

  const emptyScreen = screen.getByText('No extensions in the catalog');
  expect(emptyScreen).toBeInTheDocument();

  const refreshButton = screen.queryByRole('button', { name: 'Refresh the catalog' });
  expect(refreshButton).not.toBeInTheDocument();
});

test('Check with 2 extensions', async () => {
  render(CatalogExtensionList, {
    catalogExtensions: [extensionA, extensionB],
    allCatalogExtensions: [extensionA, extensionB],
  });

  const region = screen.getByRole('region', { name: 'Catalog Extensions' });
  expect(region).toBeInTheDocument();

  const extensionWidgetA = screen.getByRole('group', { name: 'This is the display name1' });
  expect(extensionWidgetA).toBeInTheDocument();

  const extensionWidgetB = screen.getByRole('group', { name: 'This is the display name2' });
  expect(extensionWidgetB).toBeInTheDocument();

  const refreshButton = screen.queryByRole('button', { name: 'Refresh the catalog' });
  expect(refreshButton).not.toBeInTheDocument();
});

test('non default title', async () => {
  render(CatalogExtensionList, {
    title: 'Another title',
    catalogExtensions: [extensionA, extensionB],
    allCatalogExtensions: [extensionA, extensionB],
  });
  const availableExtensions = screen.queryByText('Available extensions');
  expect(availableExtensions).not.toBeInTheDocument();

  const title = screen.queryByText('Another title');
  expect(title).toBeInTheDocument();
});

test('empty catalog, do not hide if empty (default)', async () => {
  render(CatalogExtensionList, { catalogExtensions: [], allCatalogExtensions: [] });

  const emptyMsg = screen.queryByText('No extensions in the catalog');
  expect(emptyMsg).toBeInTheDocument();
});

test('shows filter toolbar when catalog is filtered empty', async () => {
  render(CatalogExtensionList, {
    catalogExtensions: [],
    allCatalogExtensions: [extensionA, extensionB],
    showFilteredEmpty: true,
    searchTerm: 'missing',
  });

  expect(screen.getByLabelText('Filter by install status')).toBeInTheDocument();
  expect(screen.getByText(/No extensions matching/i)).toBeInTheDocument();
});

test('empty catalog, hide if empty', async () => {
  render(CatalogExtensionList, { showEmptyScreen: false, catalogExtensions: [], allCatalogExtensions: [] });

  const emptyMsg = screen.queryByText('No extensions in the catalog');
  expect(emptyMsg).not.toBeInTheDocument();
});
