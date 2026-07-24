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
import { beforeAll, expect, test, vi } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import InstalledExtensionCardLeftLifecycleToggle from './InstalledExtensionCardLeftLifecycleToggle.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'startExtension', { value: vi.fn() });
  Object.defineProperty(window, 'stopExtension', { value: vi.fn() });
});

test('Expect Enable button when extension is stopped', async () => {
  const extension: CombinedExtensionInfoUI = {
    type: 'pd',
    id: 'idExtension',
    name: 'fooName',
    description: 'my description',
    displayName: '',
    publisher: '',
    removable: true,
    devMode: false,
    version: 'v1.2.3',
    state: 'stopped',
    path: '',
    readme: '',
  };
  render(InstalledExtensionCardLeftLifecycleToggle, { extension });

  const button = screen.getByRole('button', { name: 'Enable' });
  expect(button).toBeEnabled();

  await fireEvent.click(button);
  expect(vi.mocked(window.startExtension)).toHaveBeenCalledWith('idExtension');
});

test('Expect Disable button when extension is started', async () => {
  const extension: CombinedExtensionInfoUI = {
    type: 'pd',
    id: 'idExtension',
    name: 'fooName',
    description: 'my description',
    displayName: '',
    publisher: '',
    removable: true,
    devMode: false,
    version: 'v1.2.3',
    state: 'started',
    path: '',
    readme: '',
  };
  render(InstalledExtensionCardLeftLifecycleToggle, { extension });

  const button = screen.getByRole('button', { name: 'Disable' });
  expect(button).toBeEnabled();

  await fireEvent.click(button);
  expect(vi.mocked(window.stopExtension)).toHaveBeenCalledWith('idExtension');
});

test('Expect Disable button disabled while extension is stopping', async () => {
  const extension: CombinedExtensionInfoUI = {
    type: 'pd',
    id: 'idExtension',
    name: 'fooName',
    description: 'my description',
    displayName: '',
    publisher: '',
    removable: true,
    devMode: false,
    version: 'v1.2.3',
    state: 'stopping',
    path: '',
    readme: '',
  };
  render(InstalledExtensionCardLeftLifecycleToggle, { extension });

  const button = screen.getByRole('button', { name: 'Enable' });
  expect(button).toBeDisabled();
});
