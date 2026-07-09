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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import CatalogExtension from './CatalogExtension.svelte';

vi.mock(import('tinro'));

beforeAll(() => {
  Object.defineProperty(window, 'extensionInstallFromImage', { value: vi.fn() });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect production catalog card hover border class', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Foo publisher',
    isInstalled: false,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };

  render(CatalogExtension, { catalogExtensionUI });

  const extensionWidget = screen.getByRole('group', { name: 'This is the display name' });
  expect(extensionWidget).toHaveClass('hover:border-[var(--pd-content-card-border-selected)]');
});

test('Expect production catalog card shows More details without actions menu', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Foo publisher',
    isInstalled: false,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };

  render(CatalogExtension, { catalogExtensionUI });

  expect(screen.getByRole('button', { name: 'This is the display name details' })).toBeInTheDocument();
  expect(screen.getByText('More details')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /actions$/i })).not.toBeInTheDocument();
});

test('Expect More details opens extension details route', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Foo publisher',
    isInstalled: false,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };

  render(CatalogExtension, { catalogExtensionUI });

  await fireEvent.click(screen.getByRole('button', { name: 'This is the display name details' }));

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/extensions/details/myId/');
});

test('Expect installed production catalog card shows Already installed', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'Installed extension',
    isFeatured: false,
    fetchable: true,
    fetchLink: 'myLink',
    fetchVersion: '2.0.0',
    installedVersion: '1.0.0',
    publisherDisplayName: 'Foo publisher',
    isInstalled: true,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };

  render(CatalogExtension, { catalogExtensionUI });

  expect(screen.getByText('Already installed')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Install myId Extension' })).not.toBeInTheDocument();
});
