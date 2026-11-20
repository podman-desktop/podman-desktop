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

import type { CatalogExtension } from '@desktop-framework/api/extension-catalog';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { type CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { extensionInfos } from '/@/stores/extensions';

import { CatalogCategoryFilter } from './catalog-category-filter';
import { CatalogInstallStatusFilter } from './catalog-install-status-filter';
import ExtensionList from './ExtensionList.svelte';

vi.mock(import('./catalog-category-filter'), { spy: true });
vi.mock(import('./catalog-install-status-filter'), { spy: true });

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
});

export const aFakeExtension: CatalogExtension = {
  id: 'idAInstalled',
  publisherName: 'FooPublisher',
  shortDescription: 'this is short A. The word bar appears here but not in the title',
  publisherDisplayName: 'Foo Publisher',
  extensionName: 'a-extension',
  displayName: 'A Extension',
  categories: ['foo'],
  keywords: [],
  unlisted: false,
  versions: [
    {
      version: '1.0.0A',
      preview: false,
      files: [
        {
          assetType: 'icon',
          data: 'iconA',
        },
      ],
      ociUri: 'linkA',
      lastUpdated: new Date(),
    },
  ],
};

export const bFakeExtension: CatalogExtension = {
  id: 'idB',
  publisherName: 'FooPublisher',
  shortDescription: 'this is short B',
  publisherDisplayName: 'Foo Publisher',
  extensionName: 'b-extension',
  displayName: 'B Extension',
  categories: ['foo'],
  keywords: [],
  unlisted: false,
  versions: [
    {
      version: '1.0.0B',
      preview: false,
      files: [
        {
          assetType: 'icon',
          data: 'iconB',
        },
      ],
      ociUri: 'linkB',
      lastUpdated: new Date(),
    },
  ],
};

const combined: CombinedExtensionInfoUI[] = [
  {
    id: 'idAInstalled',
    displayName: 'A installed Extension',
    description: 'The word bar appears here but not in the title',
    removable: true,
    state: 'started',
  },
] as unknown[] as CombinedExtensionInfoUI[];

test('Expect to see extensions', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(screen.getByRole('heading', { name: 'extensions' })).toBeInTheDocument();
  });

  // get first extension
  const myExtension1 = screen.getByRole('region', { name: 'idAInstalled' });
  expect(myExtension1).toBeInTheDocument();

  // second extension should not be there as only in catalog (not installed)
  const extensionIdB = screen.queryByRole('group', { name: 'B Extension' });
  expect(extensionIdB).not.toBeInTheDocument();

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  // now the catalog extension should be there
  const extensionIdBAfterSwitch = screen.getByRole('group', { name: 'B Extension' });
  expect(extensionIdBAfterSwitch).toBeInTheDocument();
});

test('Expect to see empty screen on extension page only', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([aFakeExtension]);
  extensionInfos.set([]);

  render(ExtensionList, { searchTerm: 'A' });

  await vi.waitFor(() => {
    expect(screen.getByText(`No extensions matching 'A' found`)).toBeInTheDocument();
  });

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  const title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).not.toBeInTheDocument();
});

test('Expect to see empty screen on catalog page only', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([]);
  extensionInfos.set(combined);

  render(ExtensionList, { searchTerm: 'A' });

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Catalog' })).toBeInTheDocument();
  });

  let title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).not.toBeInTheDocument();

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).toBeInTheDocument();
});

test('Expect to see empty screens on both pages', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  render(ExtensionList, { searchTerm: 'foo' });

  await vi.waitFor(() => {
    expect(screen.getByText(`No extensions matching 'foo' found`)).toBeInTheDocument();
  });

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  const title = screen.getByText(`No extensions matching 'foo' found`);
  expect(title).toBeInTheDocument();
});

test('Search extension page searches also description', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([aFakeExtension]);
  extensionInfos.set(combined);

  render(ExtensionList, { searchTerm: 'bar' });

  await vi.waitFor(() => {
    expect(screen.getByRole('region', { name: 'idAInstalled' })).toBeInTheDocument();
  });

  // second extension should not be there as only in catalog (not installed) and doesn't have "bar" in the description
  const extensionIdB = screen.queryByRole('group', { name: 'B Extension' });
  expect(extensionIdB).not.toBeInTheDocument();

  cleanup();

  // Change the search
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  render(ExtensionList, { searchTerm: 'foo' });

  await vi.waitFor(() => {
    expect(window.getConfigurationValue).toHaveBeenCalled();
  });

  // The extension should not be there as it doesn't have "foo" in the description
  const myExtension2 = screen.queryByRole('region', { name: 'idAInstalled' });
  expect(myExtension2).not.toBeInTheDocument();
});

test('Search catalog page searches also description', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set([]);

  render(ExtensionList, { searchTerm: 'bar' });

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Catalog' })).toBeInTheDocument();
  });

  // Click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  // Verify that the extension containing "bar" in the description is displayed
  const myExtension1 = screen.getByRole('group', { name: 'A Extension' });
  expect(myExtension1).toBeInTheDocument();

  // Verify that the other extension that doesn't contain "bar" is not displayed
  const extensionIdB = screen.queryByRole('group', { name: 'B Extension' });
  expect(extensionIdB).not.toBeInTheDocument();
});

test('Expect to see local extensions tab content', async () => {
  vi.mocked(window.getConfigurationValue).mockImplementation(async (key: string) => {
    // Return true for local extensions and catalog enabled
    return key === 'extensions.localExtensions.enabled' || key === 'extensions.catalog.enabled';
  });
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  vi.mocked(window.getConfigurationValue).mockResolvedValue(undefined);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Local extensions' })).toBeInTheDocument();
  });

  // select the local extensions tab
  const localModeTab = screen.getByRole('button', { name: 'Local extensions' });
  await fireEvent.click(localModeTab);

  // expect to see empty screen
  const emptyText = screen.getByText('Enable Preferences > Extensions > Development Mode to test local extensions');
  expect(emptyText).toBeInTheDocument();
});

test('Switching tabs keeps only terms in search term', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set([]);

  render(ExtensionList, { searchTerm: 'bar category:bar not:installed' });

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Catalog' })).toBeInTheDocument();
  });

  // Click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  // Verify that the extension containing "bar" in the description is displayed (which is not in bar category and is installed)
  // meaning that `category:bar not:installed` has been removed from search term
  const myExtension1 = screen.getByRole('group', { name: 'A Extension' });
  expect(myExtension1).toBeInTheDocument();
});

test.each(['installed', 'catalog'] as const)(
  '%s search is below the tabs and outside the page header',
  async currentScreen => {
    render(ExtensionList, { screen: currentScreen });

    const catalogTab = await screen.findByRole('button', { name: 'Catalog' });
    const searchInput = screen.getByRole('textbox', { name: 'search extensions' });
    expect(screen.getAllByRole('textbox', { name: 'search extensions' })).toHaveLength(1);
    expect(catalogTab.compareDocumentPosition(searchInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('region', { name: 'content' })).toContainElement(searchInput);
  },
);

test.each(['installed', 'catalog'] as const)(
  '%s search stays above scrolling content with an opaque themed background',
  async currentScreen => {
    render(ExtensionList, { screen: currentScreen });

    const searchRegion = await screen.findByRole('region', { name: 'search' });
    expect(searchRegion).toHaveClass('sticky', 'top-0', 'z-10', 'shrink-0', 'bg-(--pd-content-bg)');
    expect(screen.getByRole('region', { name: 'content' })).toContainElement(searchRegion);
  },
);

test.each(['installed', 'catalog'] as const)(
  '%s keeps the filter status mounted before filtering and after clearing',
  async currentScreen => {
    catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
    extensionInfos.set(combined);
    render(ExtensionList, { screen: currentScreen });

    const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
    const searchRegion = within(screen.getByRole('region', { name: 'search' }));
    const filterStatus = searchRegion.getByRole('status');
    expect(filterStatus).toBeEmptyDOMElement();
    if (currentScreen === 'catalog') {
      expect(filterStatus).not.toHaveClass('px-5');
    } else {
      expect(filterStatus).toHaveClass('px-5');
    }

    await fireEvent.input(searchInput, { target: { value: 'no-match' } });

    expect(searchRegion.getByRole('status')).toBe(filterStatus);
    expect(filterStatus).toHaveClass('px-5');
    expect(filterStatus).toHaveTextContent(
      currentScreen === 'installed' ? 'Filtered out 1 items of 1' : 'Filtered out 2 items of 2',
    );

    await fireEvent.click(screen.getByRole('button', { name: 'clear' }));

    expect(searchRegion.getByRole('status')).toBe(filterStatus);
    expect(filterStatus).toBeEmptyDOMElement();
  },
);

test('Local extensions keeps search above the tabs', async () => {
  render(ExtensionList, { screen: 'development' });

  const catalogTab = await screen.findByRole('button', { name: 'Catalog' });
  const searchInput = screen.getByRole('textbox', { name: 'search extensions' });
  expect(screen.getAllByRole('textbox', { name: 'search extensions' })).toHaveLength(1);
  expect(searchInput.compareDocumentPosition(catalogTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByRole('region', { name: 'content' })).not.toContainElement(searchInput);
  expect(screen.queryByText('Install status')).not.toBeInTheDocument();
});

test('Catalog install status shares the sticky search row', async () => {
  render(ExtensionList, { screen: 'catalog' });

  const dropdown = await screen.findByRole('button', { name: 'Install status All statuses' });
  expect(dropdown).toHaveTextContent('All statuses');
  expect(screen.getByRole('region', { name: 'search' })).toContainElement(dropdown);
});

test('Catalog keeps both dropdowns in one shrinkable group without growing them', async () => {
  render(ExtensionList, { screen: 'catalog' });

  const filters = await screen.findByRole('group', { name: 'Catalog filters' });
  expect(filters).toHaveClass('flex', 'min-w-0', 'max-w-full');
  expect(filters).not.toHaveClass('flex-wrap');
  expect(screen.getByRole('region', { name: 'search' })).toContainElement(filters);
  within(filters).getByRole('button', { name: 'Install status All statuses' });
  within(filters).getByRole('button', { name: 'Category All categories' });
  expect(filters.children).toHaveLength(2);
  expect(filters.children[0]).toHaveClass('w-40', 'grow-0');
  expect(filters.children[1]).toHaveClass('w-48', 'grow-0');
});

test('Catalog category shares the sticky row and lists categories from the unfiltered catalog', async () => {
  catalogExtensionInfos.set([
    { ...aFakeExtension, categories: ['Kubernetes', 'Cloud'] },
    { ...bFakeExtension, categories: ['Extension Packs', 'Cloud'] },
    { ...bFakeExtension, id: 'unlisted', unlisted: true, categories: ['Hidden'] },
  ]);
  render(ExtensionList, { screen: 'catalog', searchTerm: 'no-match is:installed' });

  const dropdown = await screen.findByRole('button', { name: 'Category All categories' });
  const row = screen.getByRole('region', { name: 'search' });
  expect(row).toContainElement(dropdown);
  await fireEvent.click(dropdown);
  expect(
    within(row)
      .getAllByRole('button')
      .map(button => button.textContent?.trim()),
  ).toEqual([
    '',
    'Install status Installed',
    'Category All categories',
    'All categories',
    'Cloud',
    'Extension Packs',
    'Kubernetes',
  ]);
  expect(screen.queryByRole('button', { name: 'Hidden' })).not.toBeInTheDocument();
});

test('selecting, changing and clearing category updates the query and results', async () => {
  catalogExtensionInfos.set([
    { ...aFakeExtension, categories: ['Cloud'] },
    { ...bFakeExtension, categories: ['Extension Packs'] },
  ]);
  extensionInfos.set(combined);
  render(ExtensionList, { screen: 'catalog' });

  const dropdown = await screen.findByRole('button', { name: 'Category All categories' });
  const input = screen.getByRole('textbox', { name: 'search extensions' });
  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'Cloud' }));
  expect(input).toHaveValue('category:Cloud');
  screen.getByRole('button', { name: 'Category Cloud' });
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
  screen.getByText('Filtered out 1 items of 2');

  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'Extension Packs' }));
  expect(input).toHaveValue('category:"Extension Packs"');
  screen.getByRole('button', { name: 'Category Extension Packs' });
  screen.getByRole('group', { name: 'B Extension' });
  expect(screen.queryByRole('group', { name: 'A Extension' })).not.toBeInTheDocument();

  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'All categories' }));
  expect(input).toHaveValue('');
  screen.getByRole('group', { name: 'A Extension' });
  screen.getByRole('group', { name: 'B Extension' });
  screen.getByRole('button', { name: 'Category All categories' });
});

test('category reflects typed quoted tokens, unknown categories and clearing search', async () => {
  catalogExtensionInfos.set([{ ...aFakeExtension, categories: ['Cloud', 'Extension Packs'] }]);
  render(ExtensionList, { screen: 'catalog' });

  const input = await screen.findByRole('textbox', { name: 'search extensions' });
  for (const [query, label] of [
    ['CATEGORY:cloud', 'Cloud'],
    [`category:'Extension Packs' not:installed`, 'Extension Packs'],
    ['category:"Unknown Category"', 'unknown category'],
    ['-category:Cloud', 'All categories'],
  ]) {
    await fireEvent.input(input, { target: { value: query } });
    screen.getByRole('button', { name: `Category ${label}` });
  }
  await fireEvent.click(screen.getByRole('button', { name: 'clear' }));
  screen.getByRole('button', { name: 'Category All categories' });
});

test('category and install status preserve text and other filters while combining results', async () => {
  catalogExtensionInfos.set([
    { ...aFakeExtension, categories: ['Cloud', 'Extension Packs'], keywords: ['cli'] },
    { ...bFakeExtension, categories: ['Extension Packs'], keywords: ['cli'] },
  ]);
  extensionInfos.set(combined);
  render(ExtensionList, { screen: 'catalog', searchTerm: 'Extension keyword:cli category:Cloud' });

  const input = await screen.findByRole('textbox', { name: 'search extensions' });
  await fireEvent.click(screen.getByRole('button', { name: 'Category Cloud' }));
  await fireEvent.click(screen.getByRole('button', { name: 'Extension Packs' }));
  expect(input).toHaveValue('Extension keyword:cli category:"Extension Packs"');

  await fireEvent.click(screen.getByRole('button', { name: 'Install status All statuses' }));
  await fireEvent.click(
    within(screen.getByRole('region', { name: 'search' })).getByRole('button', { name: 'Installed' }),
  );
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
  screen.getByRole('button', { name: 'Category Extension Packs' });

  await fireEvent.click(screen.getByRole('button', { name: 'Install status Installed' }));
  await fireEvent.click(screen.getByRole('button', { name: 'Not installed' }));
  screen.getByRole('group', { name: 'B Extension' });
  expect(screen.queryByRole('group', { name: 'A Extension' })).not.toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Category Extension Packs' }));
  await fireEvent.click(screen.getByRole('button', { name: 'All categories' }));
  expect(input).toHaveValue('Extension keyword:cli not:installed');
  screen.getByRole('button', { name: 'Install status Not installed' });
});

test('category is Catalog-only and switching tabs retains existing query-reset behavior', async () => {
  catalogExtensionInfos.set([aFakeExtension]);
  render(ExtensionList, { screen: 'catalog', searchTerm: 'bar category:foo is:installed' });

  await screen.findByRole('button', { name: 'Category foo' });
  await fireEvent.click(screen.getByRole('button', { name: 'Installed' }));
  expect(screen.queryByRole('button', { name: /^Category / })).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue('bar');
  await fireEvent.click(screen.getByRole('button', { name: 'Local extensions' }));
  expect(screen.queryByRole('button', { name: /^Category / })).not.toBeInTheDocument();
  await fireEvent.click(screen.getByRole('button', { name: 'Catalog' }));
  screen.getByRole('button', { name: 'Category All categories' });
});

test.each(['Cloud', 'A very long category name for cloud native development and extension tooling'])(
  'category %s keeps its accessible name and supports keyboard selection',
  async category => {
    catalogExtensionInfos.set([{ ...aFakeExtension, categories: [category] }]);
    render(ExtensionList, { screen: 'catalog' });

    const dropdown = await screen.findByRole('button', { name: 'Category All categories' });
    await fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    await fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    await fireEvent.keyDown(dropdown, { key: 'Enter' });
    screen.getByRole('button', { name: `Category ${category}` });
    expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue(
      category === 'Cloud' ? 'category:Cloud' : `category:"${category}"`,
    );
  },
);

test('a category deep link can be cleared with an empty catalog', async () => {
  catalogExtensionInfos.set([]);
  render(ExtensionList, { screen: 'catalog', searchTerm: 'category:Unknown' });

  const dropdown = await screen.findByRole('button', { name: 'Category unknown' });
  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'All categories' }));
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue('');
  screen.getByRole('button', { name: 'Category All categories' });
});

test.each([
  { searchTerm: 'category:""', afterReset: '' },
  { searchTerm: 'category:"" keyword:cli', afterReset: 'keyword:cli' },
  { searchTerm: 'category:"" category:foo keyword:cli', afterReset: 'keyword:cli' },
])('mounting Catalog preserves $searchTerm until an explicit category reset', async ({ searchTerm, afterReset }) => {
  catalogExtensionInfos.set([
    { ...aFakeExtension, keywords: ['cli'] },
    { ...bFakeExtension, keywords: ['cli'] },
  ]);
  render(ExtensionList, { screen: 'catalog', searchTerm });

  const input = await screen.findByRole('textbox', { name: 'search extensions' });
  expect(input).toHaveValue(searchTerm);
  expect(screen.queryByRole('group', { name: 'A Extension' })).not.toBeInTheDocument();
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Category All categories' }));
  await fireEvent.click(screen.getByRole('button', { name: 'All categories' }));

  expect(input).toHaveValue(afterReset);
  screen.getByRole('group', { name: 'A Extension' });
  screen.getByRole('group', { name: 'B Extension' });
});

test('a rejected category edit keeps the dropdown, query and results in sync', async () => {
  const searchTerm = 'category:foo';
  catalogExtensionInfos.set([aFakeExtension, { ...bFakeExtension, categories: ['Cloud'] }]);
  vi.mocked(CatalogCategoryFilter.prototype.withCategory).mockReturnValue(searchTerm);
  render(ExtensionList, { screen: 'catalog', searchTerm });

  const dropdown = await screen.findByRole('button', { name: 'Category foo' });
  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'Cloud' }));
  expect(vi.mocked(CatalogCategoryFilter.prototype.withCategory)).toHaveBeenCalledWith('category:cloud');
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue(searchTerm);
  screen.getByRole('button', { name: 'Category foo' });
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
});

test('Installed search keeps its layout without the Catalog status control', async () => {
  render(ExtensionList, { screen: 'installed' });

  const searchRegion = await screen.findByRole('region', { name: 'search' });
  expect(within(searchRegion).queryByRole('button', { name: /^Install status / })).not.toBeInTheDocument();
  expect(searchRegion).not.toHaveClass('flex-wrap');
  const filterStatus = within(searchRegion).getByRole('status');
  expect(filterStatus).toHaveClass('flex-1');
  expect(filterStatus).not.toHaveClass('whitespace-nowrap');
});

test('Catalog install status choices filter results through the search input', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);
  render(ExtensionList, { screen: 'catalog' });

  const dropdown = await screen.findByRole('button', { name: 'Install status All statuses' });
  const searchInput = screen.getByRole('textbox', { name: 'search extensions' });
  const searchRow = within(screen.getByRole('region', { name: 'search' }));
  screen.getByRole('group', { name: 'A Extension' });
  screen.getByRole('group', { name: 'B Extension' });

  await fireEvent.click(dropdown);
  await fireEvent.click(searchRow.getByRole('button', { name: 'Installed' }));
  expect(searchInput).toHaveValue('is:installed');
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
  screen.getByText('Filtered out 1 items of 2');

  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'Not installed' }));
  expect(searchInput).toHaveValue('not:installed');
  expect(screen.queryByRole('group', { name: 'A Extension' })).not.toBeInTheDocument();
  screen.getByRole('group', { name: 'B Extension' });

  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'All statuses' }));
  expect(searchInput).toHaveValue('');
  screen.getByRole('group', { name: 'A Extension' });
  screen.getByRole('group', { name: 'B Extension' });
  expect(screen.queryByText('Filtered out 1 items of 2')).not.toBeInTheDocument();
});

test('Catalog install status preserves text and unrelated filters', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);
  render(ExtensionList, { screen: 'catalog', searchTerm: 'bar category:foo is:featured keyword:cloud' });

  const dropdown = await screen.findByRole('button', { name: 'Install status All statuses' });
  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'Not installed' }));
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue(
    'bar category:foo is:featured keyword:cloud not:installed',
  );

  await fireEvent.click(dropdown);
  await fireEvent.click(screen.getByRole('button', { name: 'All statuses' }));
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue(
    'bar category:foo is:featured keyword:cloud',
  );
});

test('Catalog install status reflects typed tokens and clearing the search', async () => {
  render(ExtensionList, { screen: 'catalog' });

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  for (const [searchTerm, label] of [
    ['bar IS:Installed', 'Installed'],
    ['not:installed category:foo', 'Not installed'],
    ['not:installed is:installed', 'Installed'],
    ['is:featured', 'All statuses'],
  ]) {
    await fireEvent.input(searchInput, { target: { value: searchTerm } });
    screen.getByRole('button', { name: `Install status ${label}` });
  }

  await fireEvent.input(searchInput, { target: { value: 'is:installed' } });
  await fireEvent.click(screen.getByRole('button', { name: 'clear' }));
  screen.getByRole('button', { name: 'Install status All statuses' });
});

test.each([
  {
    searchTerm: `is:installed "a 'b" c' not:installed`,
    option: 'All statuses',
    expected: `"a 'b" c' not:installed`,
  },
  { searchTerm: 'mini -', option: 'Installed', expected: 'is:installed mini -' },
  { searchTerm: 'mini -', option: 'Not installed', expected: 'not:installed mini -' },
])('selecting $option preserves query context in $searchTerm', async ({ searchTerm, option, expected }) => {
  render(ExtensionList, { screen: 'catalog', searchTerm });

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  const searchRow = within(screen.getByRole('region', { name: 'search' }));
  await fireEvent.click(searchRow.getByRole('button', { name: /^Install status / }));
  await fireEvent.click(searchRow.getByRole('button', { name: option }));

  expect(searchInput).toHaveValue(expected);
  searchRow.getByRole('button', { name: `Install status ${option}` });
});

test('a rejected status edit keeps the dropdown and results in sync with the search', async () => {
  const searchTerm = 'is:installed';
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);
  vi.mocked(CatalogInstallStatusFilter.prototype.withStatus).mockReturnValue(searchTerm);
  render(ExtensionList, { screen: 'catalog', searchTerm });
  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  const searchRow = within(screen.getByRole('region', { name: 'search' }));
  await fireEvent.click(searchRow.getByRole('button', { name: 'Install status Installed' }));
  await fireEvent.click(searchRow.getByRole('button', { name: 'Not installed' }));

  expect(vi.mocked(CatalogInstallStatusFilter.prototype.withStatus)).toHaveBeenCalledWith('not-installed');
  expect(searchInput).toHaveValue(searchTerm);
  searchRow.getByRole('button', { name: 'Install status Installed' });
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
});

test('Installed search remains below the tabs when optional extension features are disabled', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  render(ExtensionList);

  const installedTab = await screen.findByRole('button', { name: 'Installed' });
  const searchInput = screen.getByRole('textbox', { name: 'search extensions' });
  expect(screen.getAllByRole('textbox', { name: 'search extensions' })).toHaveLength(1);
  expect(installedTab.compareDocumentPosition(searchInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByRole('region', { name: 'content' })).toContainElement(searchInput);
  expect(screen.queryByRole('button', { name: 'Catalog' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Local extensions' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Install custom' })).not.toBeInTheDocument();
});

test('Typing and clearing installed search updates results and the filtered count', async () => {
  catalogExtensionInfos.set([]);
  extensionInfos.set([
    ...combined,
    ...combined.map(extension => ({
      ...extension,
      id: 'idBInstalled',
      displayName: 'B installed Extension',
      description: 'this is short B',
    })),
  ]);
  render(ExtensionList);

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  screen.getByRole('region', { name: 'idAInstalled' });
  screen.getByRole('region', { name: 'idBInstalled' });
  expect(screen.queryByText(/Filtered out/)).not.toBeInTheDocument();

  await fireEvent.input(searchInput, { target: { value: 'bar' } });

  screen.getByRole('region', { name: 'idAInstalled' });
  expect(screen.queryByRole('region', { name: 'idBInstalled' })).not.toBeInTheDocument();
  const filteredCount = screen.getByText('Filtered out 1 items of 2');
  expect(filteredCount).toHaveAttribute('role', 'status');
  expect(screen.getByRole('region', { name: 'search' })).toContainElement(filteredCount);

  await fireEvent.click(screen.getByRole('button', { name: 'clear' }));

  expect(searchInput).toHaveValue('');
  screen.getByRole('region', { name: 'idAInstalled' });
  screen.getByRole('region', { name: 'idBInstalled' });
  expect(screen.queryByText(/Filtered out/)).not.toBeInTheDocument();
});

test('Clearing the installed no-match state restores the search input and results', async () => {
  catalogExtensionInfos.set([]);
  extensionInfos.set(combined);
  render(ExtensionList, { searchTerm: 'no-match' });

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  screen.getByText(`No extensions matching 'no-match' found`);
  screen.getByText('Filtered out 1 items of 1');

  await fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));

  expect(searchInput).toHaveValue('');
  screen.getByRole('region', { name: 'idAInstalled' });
  expect(screen.queryByText(/No extensions matching/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Filtered out/)).not.toBeInTheDocument();
});

test('Typing and clearing catalog search updates results and the filtered count', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set([]);
  render(ExtensionList, { screen: 'catalog' });

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  await fireEvent.input(searchInput, { target: { value: 'bar' } });

  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();
  const filteredCount = screen.getByText('Filtered out 1 items of 2');
  expect(filteredCount).toHaveAttribute('role', 'status');
  expect(screen.getByRole('region', { name: 'search' })).toContainElement(filteredCount);
  expect(filteredCount).toHaveClass('whitespace-nowrap');
  expect(filteredCount).not.toHaveClass('flex-1');

  await fireEvent.click(screen.getByRole('button', { name: 'clear' }));

  expect(searchInput).toHaveValue('');
  screen.getByRole('group', { name: 'A Extension' });
  screen.getByRole('group', { name: 'B Extension' });
  expect(screen.queryByText('Filtered out 1 items of 2')).not.toBeInTheDocument();
});

test('Switching tabs updates the filter summary for the active extension list', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);
  render(ExtensionList, { searchTerm: 'no-match' });

  await screen.findByText('Filtered out 1 items of 1');
  await fireEvent.click(screen.getByRole('button', { name: 'Catalog' }));

  screen.getByText('Filtered out 2 items of 2');
  expect(screen.queryByText('Filtered out 1 items of 1')).not.toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Local extensions' }));

  expect(screen.queryByText(/Filtered out/)).not.toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Installed' }));

  screen.getByText('Filtered out 1 items of 1');
  expect(screen.queryByText('Filtered out 2 items of 2')).not.toBeInTheDocument();
});

test('Switching tabs preserves search text between installed, catalog and local inputs', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);
  render(ExtensionList);

  const searchInput = await screen.findByRole('textbox', { name: 'search extensions' });
  await fireEvent.input(searchInput, { target: { value: 'bar' } });
  await fireEvent.click(screen.getByRole('button', { name: 'Catalog' }));

  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue('bar');
  screen.getByRole('group', { name: 'A Extension' });
  expect(screen.queryByRole('group', { name: 'B Extension' })).not.toBeInTheDocument();

  await fireEvent.click(screen.getByRole('button', { name: 'Local extensions' }));

  const localSearchInput = screen.getByRole('textbox', { name: 'search extensions' });
  expect(localSearchInput).toHaveValue('bar');
  expect(screen.getAllByRole('textbox', { name: 'search extensions' })).toHaveLength(1);
  expect(screen.getByRole('region', { name: 'content' })).not.toContainElement(localSearchInput);

  await fireEvent.click(screen.getByRole('button', { name: 'Installed' }));

  expect(screen.getByRole('textbox', { name: 'search extensions' })).toHaveValue('bar');
  expect(screen.getAllByRole('textbox', { name: 'search extensions' })).toHaveLength(1);
  screen.getByRole('region', { name: 'idAInstalled' });
});

test('Expect install custom button is visible', async () => {
  render(ExtensionList);

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Install custom' })).toBeInTheDocument();
  });
});

test('Expect install custom button to not be visible if extensions.customExtensions.enabled is false', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(window.getConfigurationValue).toHaveBeenCalled();
  });

  const installCustomButton = screen.queryByRole('button', { name: 'Install custom' });
  expect(installCustomButton).not.toBeInTheDocument();
});

test('Expect local extensions tab is visible', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(undefined);
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(screen.getByRole('button', { name: 'Local extensions' })).toBeInTheDocument();
  });
});

test('Expect local extensions tab to not be visible if extensions.localExtensions.enabled is false', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(window.getConfigurationValue).toHaveBeenCalled();
  });

  const localExtensionsTab = screen.queryByRole('button', { name: 'Local extensions' });
  expect(localExtensionsTab).not.toBeInTheDocument();
});

test('Expect catalog tab is visible', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(undefined);
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  render(ExtensionList);

  await vi.waitFor(() => {
    const catalogTab = screen.getByRole('button', { name: 'Catalog' });
    expect(catalogTab).toBeInTheDocument();
  });
});

test('Expect catalog tab to not be visible if extensions.catalog.enabled is false', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  render(ExtensionList);

  await vi.waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Catalog' })).not.toBeInTheDocument();
  });
});
