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

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { type CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { extensionInfos } from '/@/stores/extensions';
import type { CatalogExtension } from '/@api/extension-catalog/extensions-catalog-api';

import ExtensionList from './ExtensionList.svelte';

beforeEach(() => {
  vi.resetAllMocks();
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

async function renderIt(searchTerm?: string): Promise<void> {
  render(ExtensionList, { searchTerm: searchTerm });

  // wait for page to be rendered
  await waitFor(() => expect(screen.queryByText('extensions')).toBeInTheDocument());
}

test('Expect to see extensions', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set(combined);

  await renderIt();

  const headingExtensions = screen.getByRole('heading', { name: 'extensions' });
  expect(headingExtensions).toBeInTheDocument();

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
  catalogExtensionInfos.set([aFakeExtension]);
  extensionInfos.set([]);

  await renderIt('A');

  let title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).toBeInTheDocument();

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).not.toBeInTheDocument();
});

test('Expect to see empty screen on catalog page only', async () => {
  catalogExtensionInfos.set([]);
  extensionInfos.set(combined);

  await renderIt('A');

  let title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).not.toBeInTheDocument();

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  title = screen.queryByText(`No extensions matching 'A' found`);
  expect(title).toBeInTheDocument();
});

test('Expect to see empty screens on both pages', async () => {
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  await renderIt('foo');

  let title = screen.getByText(`No extensions matching 'foo' found`);
  expect(title).toBeInTheDocument();

  // click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  title = screen.getByText(`No extensions matching 'foo' found`);
  expect(title).toBeInTheDocument();
});

test('Search extension page searches also description', async () => {
  catalogExtensionInfos.set([aFakeExtension]);
  extensionInfos.set(combined);

  await renderIt('bar');

  const myExtension1 = screen.getByRole('region', { name: 'idAInstalled' });
  expect(myExtension1).toBeInTheDocument();

  // second extension should not be there as only in catalog (not installed) and doesn't have "bar" in the description
  const extensionIdB = screen.queryByRole('group', { name: 'B Extension' });
  expect(extensionIdB).not.toBeInTheDocument();

  cleanup();

  // Change the search
  await renderIt('foo');

  // The extension should not be there as it doesn't have "foo" in the description
  const myExtension2 = screen.queryByRole('region', { name: 'idAInstalled' });
  expect(myExtension2).not.toBeInTheDocument();
});

test('Search catalog page searches also description', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set([]);

  await renderIt('bar');

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
  catalogExtensionInfos.set([]);
  extensionInfos.set([]);

  await renderIt();

  // select the local extensions tab
  const localModeTab = screen.getByRole('button', { name: 'Local Extensions' });
  await fireEvent.click(localModeTab);

  // expect to see empty screen
  const emptyText = screen.getByText('Enable Preferences > Extensions > Development Mode to test local extensions');
  expect(emptyText).toBeInTheDocument();
});

test('Switching tabs keeps only terms in search term', async () => {
  catalogExtensionInfos.set([aFakeExtension, bFakeExtension]);
  extensionInfos.set([]);

  await renderIt('bar category:bar not:installed');

  // Click on the catalog
  const catalogTab = screen.getByRole('button', { name: 'Catalog' });
  await fireEvent.click(catalogTab);

  // Verify that the extension containing "bar" in the description is displayed (which is not in bar category and is installed)
  // meaning that `category:bar not:installed` has been removed from search term
  const myExtension1 = screen.getByRole('group', { name: 'A Extension' });
  expect(myExtension1).toBeInTheDocument();
});
