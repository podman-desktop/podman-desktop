/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import { expect, test } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import DevelopmentExtensionListTable from './ListTable.svelte';

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

  // check if all ext folders are displayed
  expect(screen.getByText('Extension A')).toBeInTheDocument();
  expect(screen.getByText('Extension B')).toBeInTheDocument();
});
