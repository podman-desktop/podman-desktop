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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import Actions from '/@/lib/extensions/dev-mode/selectable/Actions.svelte';

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

test('Expect enable action being displayed', async () => {
  render(Actions, { extensionFolder: extensionFolderWithExtensionStopped });
  const enableButton = screen.getByRole('button', { name: 'Enable' });
  expect(enableButton).toBeInTheDocument();
});

test('Expect disable action being displayed', async () => {
  render(Actions, { extensionFolder: extensionFolderWithExtensionStarted });
  const disableButton = screen.getByRole('button', { name: 'Disable' });
  expect(disableButton).toBeInTheDocument();
});

test('Expect uninstall action being displayed', async () => {
  render(Actions, { extensionFolder: extensionFolderWithExtensionStopped });
  const uninstallButton = screen.getByRole('button', { name: 'Uninstall' });
  expect(uninstallButton).toBeInTheDocument();
});

test('Expect more actions menu not being displayed', async () => {
  render(Actions, { extensionFolder: extensionFolderWithExtensionStarted });
  expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
});
