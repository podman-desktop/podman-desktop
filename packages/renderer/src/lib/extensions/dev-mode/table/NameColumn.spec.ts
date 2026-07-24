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
import { beforeEach, expect, test, vi } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import NameColumn from './NameColumn.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  Object.defineProperty(window, 'clipboardWriteText', { value: vi.fn(), configurable: true });
});

test('truncates path display and copies full location', async () => {
  const object = {
    path: '/Users/example/very/long/path/to/extension',
    name: '/Users/example/very/long/path/to/extension',
    selected: false,
    source: 'folder',
  } as SelectableExtensionDevelopmentFolderInfoUI;

  render(NameColumn, { object });

  expect(screen.getByText(object.path)).toBeInTheDocument();
  const copyButton = screen.getByRole('button', { name: 'Copy location' });
  await fireEvent.click(copyButton);
  expect(window.clipboardWriteText).toHaveBeenCalledWith(object.path);
  expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

  // Hover to show the Copied tip with check icon
  const trigger = copyButton.closest('[data-testid="tooltip-trigger"]');
  expect(trigger).toBeTruthy();
  await fireEvent.mouseEnter(trigger!);
  expect(await screen.findByText('Copied', { selector: '[aria-label="tooltip"] *' })).toBeInTheDocument();
});
