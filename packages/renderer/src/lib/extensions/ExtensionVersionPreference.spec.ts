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
 *********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { extensionHasVersionChoices, getExtensionVersionPreferenceValue } from './extension-version-preference';
import { optimisticInstalledVersionsStore, resetVersionUpdateStateForTests } from './extension-version-update.svelte';
import ExtensionVersionPreference from './ExtensionVersionPreference.svelte';

test('renders version dropdown with current installed version selected', async () => {
  const extension = {
    id: 'podman-desktop.kind',
    displayName: 'Kind',
    isInstalled: true,
    installedVersion: '1.0.0',
    fetchVersion: '1.1.0',
    availableVersions: [
      { version: '1.1.0', ociUri: '', preview: false },
      { version: '1.0.0', ociUri: '', preview: false },
    ],
  } as CatalogExtensionInfoUI;

  render(ExtensionVersionPreference, { extension });

  expect(screen.getByText('Version')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Currently installed v1.0.0. Select a version to upgrade or downgrade (may require restart of extension)',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'v1.0.0' })).toBeEnabled();
  expect(screen.queryByLabelText('Up to date')).not.toBeInTheDocument();
});

test('renders up to date chip when latest version is installed but downgrades are available', async () => {
  const extension = {
    id: 'podman-desktop.minikube',
    displayName: 'minikube',
    isInstalled: true,
    installedVersion: '0.4.0',
    fetchVersion: '0.4.0',
    availableVersions: [
      { version: '0.4.0', ociUri: '', preview: false },
      { version: '0.3.0', ociUri: '', preview: false },
      { version: '0.2.0', ociUri: '', preview: false },
    ],
    installedExtension: { devMode: false },
  } as CatalogExtensionInfoUI;

  render(ExtensionVersionPreference, { extension });

  expect(screen.getByLabelText('Up to date')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Currently installed v0.4.0. Select a version to upgrade or downgrade (may require restart of extension)',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'v0.4.0' })).toBeEnabled();
});

test('renders disabled version dropdown when no other versions are available', async () => {
  const extension = {
    id: 'podman-desktop.kind',
    displayName: 'Kind',
    isInstalled: true,
    installedVersion: '1.28.0-next',
    fetchVersion: '1.28.0-next',
    availableVersions: [{ version: '1.28.0-next', ociUri: '', preview: false }],
    installedExtension: { devMode: false },
  } as CatalogExtensionInfoUI;

  render(ExtensionVersionPreference, { extension });

  expect(screen.getByText('Version')).toBeInTheDocument();
  expect(screen.getByLabelText('Up to date')).toBeInTheDocument();
  expect(screen.getByText('Currently installed v1.28.0-next. No other versions available')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'v1.28.0-next' })).toBeDisabled();
});

test('keeps version choices enabled after an optimistic upgrade', () => {
  resetVersionUpdateStateForTests();

  const extension = {
    id: 'podman-desktop.minikube',
    displayName: 'minikube',
    isInstalled: true,
    installedVersion: '0.2.0',
    fetchVersion: '0.4.0',
    availableVersions: [
      { version: '0.4.0', ociUri: 'oci:minikube:0.4.0', preview: false },
      { version: '0.2.0', ociUri: 'oci:minikube:0.2.0', preview: false },
    ],
    installedExtension: {
      id: 'podman-desktop.minikube',
      version: '0.4.0',
      displayName: 'minikube',
      state: 'started',
      removable: true,
      devMode: false,
      type: 'pd',
      path: '',
      readme: '',
    },
  } as CatalogExtensionInfoUI;

  optimisticInstalledVersionsStore.set({ 'podman-desktop.minikube': '0.4.0' });

  expect(getExtensionVersionPreferenceValue(extension)).toBe('0.4.0');
  expect(extensionHasVersionChoices(extension)).toBe(true);

  render(ExtensionVersionPreference, { extension });

  expect(
    screen.getByText(
      'Currently installed v0.4.0. Select a version to upgrade or downgrade (may require restart of extension)',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'v0.4.0' })).toBeEnabled();
});
