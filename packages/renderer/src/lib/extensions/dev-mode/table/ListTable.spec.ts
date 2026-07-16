/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { tablePersistence } from '@podman-desktop/ui-svelte';
import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import { extensionTableViewport } from '/@/lib/extensions/extension-table-columns.svelte';

import DevelopmentExtensionListTable from './ListTable.svelte';

const mockPersistence = {
  load: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
  reset: vi.fn().mockResolvedValue([]),
};

beforeEach(() => {
  extensionTableViewport.hideOrigin = false;
  extensionTableViewport.hideStatus = false;
  tablePersistence.storage = mockPersistence;
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    })),
  );
});

afterEach(() => {
  tablePersistence.storage = undefined;
});

const extensionFolderWithExtensionStopped: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'foo',
  name: 'Extension A',
  extension: {
    id: 'extension.id-a',
    name: 'My Extension A',
    state: 'stopped',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

const extensionFolderWithExtensionStarted: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'bar',
  name: 'Extension B',
  extension: {
    id: 'extension.id-b',
    name: 'My Extension B',
    state: 'started',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

test('Expect dev folders being displayed', async () => {
  const extensionFolderUIInfos: SelectableExtensionDevelopmentFolderInfoUI[] = [
    extensionFolderWithExtensionStopped,
    extensionFolderWithExtensionStarted,
  ];
  render(DevelopmentExtensionListTable, { extensionFolderUIInfos, selectedItemsNumber: 0 });

  // get all rows
  const rows = screen.getAllByRole('row');
  // check if all folders are displayed
  expect(rows).toHaveLength(3);

  // Location shows path; Name shows extension name
  expect(screen.getByText('foo')).toBeInTheDocument();
  expect(screen.getByText('bar')).toBeInTheDocument();
  expect(screen.getByText('My Extension A')).toBeInTheDocument();
  expect(screen.getByText('My Extension B')).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
  expect(screen.getByTitle('Configure Columns')).toBeInTheDocument();
});

test('hides Type column on small viewports', async () => {
  extensionTableViewport.hideOrigin = true;
  render(DevelopmentExtensionListTable, {
    extensionFolderUIInfos: [extensionFolderWithExtensionStopped],
    selectedItemsNumber: 0,
  });

  expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument();
  expect(screen.queryByRole('columnheader', { name: 'Type' })).not.toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  expect(screen.getByTitle('Configure Columns')).toBeInTheDocument();
});

test('hides Status column on very small viewports', async () => {
  extensionTableViewport.hideOrigin = true;
  extensionTableViewport.hideStatus = true;
  render(DevelopmentExtensionListTable, {
    extensionFolderUIInfos: [extensionFolderWithExtensionStopped],
    selectedItemsNumber: 0,
  });

  expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument();
  expect(screen.queryByRole('columnheader', { name: 'Type' })).not.toBeInTheDocument();
  expect(screen.queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
});
