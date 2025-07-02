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

import ActionsColumn from './ActionsColumn.svelte';

const extensionFolderWithExtensionStopped: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'foo',
  extension: {
    id: 'extensionid',
    name: 'My Extension',
    state: 'stopped',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

const extensionFolderWithExtensionStarted: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'foo',
  extension: {
    id: 'extensionid',
    name: 'My Extension',
    state: 'started',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

test('Expect start action being displayed', async () => {
  render(ActionsColumn, { object: extensionFolderWithExtensionStopped });
  const startButton = screen.getByRole('button', { name: 'Start the extension' });
  expect(startButton).toBeInTheDocument();
});

test('Expect stop action being displayed', async () => {
  render(ActionsColumn, { object: extensionFolderWithExtensionStarted });
  const stopButton = screen.getByRole('button', { name: 'Stop the extension' });
  expect(stopButton).toBeInTheDocument();
});

test('Expect untrack action being displayed', async () => {
  render(ActionsColumn, { object: extensionFolderWithExtensionStopped });
  const untrackButton = screen.getByRole('button', { name: 'Untrack extension folder' });
  expect(untrackButton).toBeInTheDocument();
});
