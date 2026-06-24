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

// mock the router
vi.mock(import('tinro'));

beforeAll(() => {
  Object.defineProperty(window, 'extensionInstallFromImage', { value: vi.fn() });
  Object.defineProperty(window, 'openExternal', { value: vi.fn() });
  Object.defineProperty(window, 'showMessageBox', { value: vi.fn().mockResolvedValue({ response: 0 }) });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect card click opens extension details', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '',
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
  expect(extensionWidget).toBeInTheDocument();

  const publisher = screen.getByText('Foo publisher');
  expect(publisher).toBeInTheDocument();

  await fireEvent.click(extensionWidget);

  expect(vi.mocked(router.goto)).toHaveBeenCalledWith('/extensions/details/myId/?returnScreen=catalog');
});

test('Expect to see featured and fetch button', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: true,
    fetchable: true,
    fetchLink: 'myLink',
    fetchVersion: '1.2.3',
    publisherDisplayName: 'Foo publisher',
    isInstalled: false,
    shortDescription: 'my description',
    categories: [],
    keywords: [],
    availableVersions: [{ version: '1.2.3', ociUri: 'myLink', preview: false }],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
  };

  render(CatalogExtension, { catalogExtensionUI });

  const extensionWidget = screen.getByRole('group', { name: 'This is the display name' });

  expect(extensionWidget).toBeInTheDocument();

  const featured = screen.getByLabelText('Featured extension');
  expect(featured).toBeInTheDocument();

  const installButton = screen.getByRole('button', { name: 'Install myId Extension' });
  expect(installButton).toBeInTheDocument();

  await fireEvent.click(installButton);

  expect(vi.mocked(window.extensionInstallFromImage)).toHaveBeenCalledWith(
    'myLink',
    expect.any(Function),
    expect.any(Function),
    'myId',
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('Expect featured star without category tags on catalog cards', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'minikube',
    displayName: 'minikube',
    isFeatured: true,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '0.4.1',
    installedVersion: '0.4.0',
    publisherDisplayName: 'Podman Desktop',
    isInstalled: true,
    shortDescription: 'Run Kubernetes locally',
    categories: ['Kubernetes'],
    keywords: [],
    availableVersions: [],
    hasUpdate: true,
    isVerified: false,
    isSupportedByRedHat: false,
    installedExtension: {
      id: 'minikube',
      name: 'minikube',
      state: 'started',
      removable: true,
      devMode: false,
      type: 'extension',
    },
  };

  render(CatalogExtension, { catalogExtensionUI });

  expect(screen.getByLabelText('Featured extension')).toBeInTheDocument();
  expect(screen.queryByLabelText('badge-Featured')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('badge-Kubernetes')).not.toBeInTheDocument();
});

test('Expect to have version of installed one', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'myId',
    displayName: 'This is the display name',
    isFeatured: false,
    fetchable: false,
    fetchLink: '',
    fetchVersion: '1.0.0',
    installedVersion: '2.0.0',
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

  expect(screen.getByText('v2.0.0')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Upgrade to v/i })).not.toBeInTheDocument();
});

test('Expect installed catalog card shows version without upgrade link', async () => {
  const catalogExtensionUI: CatalogExtensionInfoUI = {
    id: 'minikube',
    displayName: 'minikube',
    isFeatured: false,
    fetchable: false,
    fetchLink: 'oci://minikube:0.4.1',
    fetchVersion: '0.4.1',
    installedVersion: '0.4.0',
    publisherDisplayName: 'Podman Desktop',
    isInstalled: true,
    shortDescription: 'Run Kubernetes locally',
    categories: [],
    keywords: [],
    availableVersions: [
      { version: '0.4.1', ociUri: 'oci://minikube:0.4.1', preview: false },
      { version: '0.4.0', ociUri: 'oci://minikube:0.4.0', preview: false },
    ],
    hasUpdate: true,
    isVerified: false,
    isSupportedByRedHat: false,
    installedExtension: {
      id: 'minikube',
      name: 'minikube',
      state: 'started',
      removable: true,
      devMode: false,
      type: 'extension',
    },
  };

  render(CatalogExtension, { catalogExtensionUI });

  expect(screen.getByText('v0.4.0')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Upgrade to v0.4.1' })).not.toBeInTheDocument();
});
