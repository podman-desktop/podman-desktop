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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import ExtensionAutomaticUpdatesPreference from './ExtensionAutomaticUpdatesPreference.svelte';

test('renders automatic updates toggle with enabled state label', async () => {
  setAutoUpdateEnabled('podman-desktop.podman', true);

  const extension = {
    id: 'podman-desktop.podman',
    displayName: 'Podman',
    isInstalled: true,
    installedVersion: '1.0.0',
    fetchVersion: '1.0.0',
    hasUpdate: false,
    fetchable: true,
    availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
  } as CatalogExtensionInfoUI;

  render(ExtensionAutomaticUpdatesPreference, { extension });

  expect(screen.getByText('Automatic updates')).toBeInTheDocument();
  expect(screen.getByText('New updates will be automatically installed')).toBeInTheDocument();
  expect(screen.getByText('Enabled')).toBeInTheDocument();
});

test('renders disabled state label when automatic updates are off', async () => {
  setAutoUpdateEnabled('podman-desktop.kind', false);

  const extension = {
    id: 'podman-desktop.kind',
    displayName: 'Kind',
    isInstalled: true,
    installedVersion: '1.0.0',
    fetchVersion: '1.1.0',
    hasUpdate: true,
    fetchable: true,
    availableVersions: [
      { version: '1.1.0', ociUri: '', preview: false },
      { version: '1.0.0', ociUri: '', preview: false },
    ],
  } as CatalogExtensionInfoUI;

  render(ExtensionAutomaticUpdatesPreference, { extension });

  expect(screen.getByText('Disabled')).toBeInTheDocument();
  expect(
    screen.getByText('An update to v1.1.0 is available, install manually or enable automatic updates'),
  ).toBeInTheDocument();
});

test('reverts toggle to disabled when enabling is cancelled', async () => {
  setAutoUpdateEnabled('podman-desktop.kind', false);
  vi.spyOn(window, 'showMessageBox').mockResolvedValue({ response: 1 });

  const extension = {
    id: 'podman-desktop.kind',
    displayName: 'Kind',
    isInstalled: true,
    installedVersion: '1.0.0',
    fetchVersion: '1.1.0',
    hasUpdate: true,
    fetchable: true,
    availableVersions: [
      { version: '1.1.0', ociUri: '', preview: false },
      { version: '1.0.0', ociUri: '', preview: false },
    ],
  } as CatalogExtensionInfoUI;

  render(ExtensionAutomaticUpdatesPreference, { extension });

  const toggle = screen.getByRole('checkbox');
  expect(toggle).not.toBeChecked();

  await fireEvent.click(toggle);
  await tick();

  expect(screen.getByText('Disabled')).toBeInTheDocument();
  expect(toggle).not.toBeChecked();
});
