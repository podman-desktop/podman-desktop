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

import { render } from '@testing-library/svelte';
import { beforeAll, expect, test, vi } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { featuredExtensionInfos } from '/@/stores/featuredExtensions';

import InstalledExtensionList from './InstalledExtensionList.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'openExternal', { value: vi.fn() });
  Object.defineProperty(window, 'showMessageBox', { value: vi.fn().mockResolvedValue({ response: 0 }) });
  catalogExtensionInfos.set([]);
  featuredExtensionInfos.set([]);
});

test('Expect to see each extension', async () => {
  const extension1: CombinedExtensionInfoUI = {
    type: 'pd',
    id: 'myExtensionId1',
    name: 'foo1',
    description: 'my description1',
    displayName: '',
    publisher: '',
    removable: false,
    devMode: false,
    version: 'v1.2.3',
    state: 'started',
    path: '',
    readme: '',
    icon: 'iconOfMyExtension.png',
  };

  const extension2: CombinedExtensionInfoUI = {
    type: 'pd',
    id: 'myExtensionId2',
    name: 'foo2',
    description: 'my description2',
    displayName: '',
    publisher: '',
    removable: false,
    devMode: false,
    version: 'v1.2.3',
    state: 'started',
    path: '',
    readme: '',
    icon: 'iconOfMyExtension.png',
  };
  const { findByRole } = render(InstalledExtensionList, { extensionInfos: [extension1, extension2] });

  const myExtension1 = await findByRole('button', { name: 'foo1 extension details' });
  expect(myExtension1).toBeInTheDocument();

  const myExtension2 = await findByRole('button', { name: 'foo2 extension details' });
  expect(myExtension2).toBeInTheDocument();
});
