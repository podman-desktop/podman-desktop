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

import type { CatalogExtension } from '@podman-desktop/core-api/extension-catalog';
import { describe, expect, test, vi } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  getExtensionAutoUpdatePreferenceDetail,
  getExtensionPreferencesSectionTitle,
  matchesExtensionAutoUpdateSearch,
  resolveExtensionAutoUpdatePreference,
  resolveExtensionIdFromPreferencesKey,
  resolveExtensionPreferenceCatalog,
  shouldShowExtensionAutoUpdatePreference,
  toggleExtensionAutoUpdate,
} from './extension-auto-update-preference';
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { ExtensionsUtils } from './extensions-utils';

function createCatalogExtension(id: string): CatalogExtension {
  return {
    id,
    extensionName: id.split('.').pop() ?? id,
    displayName: id,
    shortDescription: '',
    publisherDisplayName: 'Podman Desktop',
    categories: [],
    keywords: [],
    versions: [
      {
        version: '1.0.0',
        preview: false,
        ociUri: `ghcr.io/example/${id}:1.0.0`,
        files: [],
      },
    ],
  } as CatalogExtension;
}

function createInstalled(id: string): CombinedExtensionInfoUI {
  return {
    id,
    name: id,
    displayName: id,
    description: '',
    publisher: 'podman-desktop',
    removable: false,
    devMode: false,
    type: 'pd',
    version: '1.0.0',
    state: 'started',
    path: '',
    readme: '',
  } as CombinedExtensionInfoUI;
}

describe('extension-auto-update-preference', () => {
  test('resolves extension id from preferences key', () => {
    expect(resolveExtensionIdFromPreferencesKey('preferences.podman-desktop.podman')).toBe('podman-desktop.podman');
    expect(resolveExtensionIdFromPreferencesKey('preferences')).toBeUndefined();
  });

  test('shows preference for installed fetchable extensions', () => {
    const extension = {
      isInstalled: true,
      fetchable: true,
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
      installedExtension: { devMode: false },
    } as CatalogExtensionInfoUI;

    expect(shouldShowExtensionAutoUpdatePreference(extension)).toBe(true);
  });

  test('hides preference for dev mode extensions', () => {
    const extension = {
      isInstalled: true,
      fetchable: true,
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
      installedExtension: { devMode: true },
    } as CatalogExtensionInfoUI;

    expect(shouldShowExtensionAutoUpdatePreference(extension)).toBe(false);
  });

  test('resolves catalog extension for extension preferences page', () => {
    const extensionsUtils = new ExtensionsUtils();
    const installed = createInstalled('podman-desktop.podman');
    const catalog = createCatalogExtension('podman-desktop.podman');

    const preference = resolveExtensionAutoUpdatePreference(
      'preferences.podman-desktop.podman',
      [installed],
      [catalog],
      [],
      extensionsUtils,
    );

    expect(preference?.id).toBe('podman-desktop.podman');
    expect(preference?.isInstalled).toBe(true);
  });

  test('resolveExtensionPreferenceCatalog returns installed extensions without fetchable metadata', () => {
    const extensionsUtils = new ExtensionsUtils();
    const installed = {
      ...createInstalled('podman-desktop.registries'),
      displayName: 'Registries',
      version: '1.0.0',
    } as CombinedExtensionInfoUI;

    const preference = resolveExtensionPreferenceCatalog(
      'preferences.podman-desktop.registries',
      [installed],
      [],
      [],
      extensionsUtils,
    );

    expect(preference?.id).toBe('podman-desktop.registries');
    expect(preference?.isInstalled).toBe(true);
  });

  test('formats extension preferences section title', () => {
    expect(getExtensionPreferencesSectionTitle('Docker')).toBe('Extension: Docker');
  });

  test('describes manual update state when an update is available', () => {
    setAutoUpdateEnabled('podman-desktop.kind', false);

    const detail = getExtensionAutoUpdatePreferenceDetail({
      id: 'podman-desktop.kind',
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
      hasUpdate: true,
      availableVersions: [
        { version: '1.1.0', ociUri: '', preview: false },
        { version: '1.0.0', ociUri: '', preview: false },
      ],
    } as CatalogExtensionInfoUI);

    expect(detail).toBe('An update to v1.1.0 is available, install manually or enable automatic updates');
  });

  test('does not mention an available update when versions match', () => {
    setAutoUpdateEnabled('podman-desktop.docker', false);

    const detail = getExtensionAutoUpdatePreferenceDetail({
      id: 'podman-desktop.docker',
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.0.0',
      hasUpdate: false,
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
    } as CatalogExtensionInfoUI);

    expect(detail).toBe('Manual version installation is required');
    expect(detail).not.toContain('An update');
  });

  test('does not mention an available update when hasUpdate flag is stale but versions match', () => {
    setAutoUpdateEnabled('podman-desktop.compose', false);

    const detail = getExtensionAutoUpdatePreferenceDetail({
      id: 'podman-desktop.compose',
      isInstalled: true,
      installedVersion: '1.28.0-next',
      fetchVersion: '1.28.0-next',
      hasUpdate: true,
      availableVersions: [{ version: '1.28.0-next', ociUri: '', preview: false }],
    } as CatalogExtensionInfoUI);

    expect(detail).toBe('Manual version installation is required');
    expect(detail).not.toContain('An update');
  });

  test('buildCatalogExtensionInfoForId does not inject prototype update on unrelated extensions', () => {
    const extensionsUtils = new ExtensionsUtils();
    const installed = {
      ...createInstalled('podman-desktop.compose'),
      version: '1.28.0-next',
      displayName: 'Compose',
    } as CombinedExtensionInfoUI;

    const catalogInfo = extensionsUtils.buildCatalogExtensionInfoForId('podman-desktop.compose', [], [], [installed]);

    expect(catalogInfo?.hasUpdate).toBe(false);
    expect(catalogInfo?.fetchVersion).toBe('1.28.0-next');
    expect(getExtensionAutoUpdatePreferenceDetail(catalogInfo!)).toBe('Manual version installation is required');
  });

  test('matches automatic updates search terms', () => {
    expect(matchesExtensionAutoUpdateSearch('automatic')).toBe(true);
    expect(matchesExtensionAutoUpdateSearch('unknown')).toBe(false);
  });

  test('toggle returns false when confirmation is cancelled', async () => {
    vi.spyOn(window, 'showMessageBox').mockResolvedValue({ response: 1 });

    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
      hasUpdate: true,
      availableVersions: [{ version: '1.1.0', ociUri: '', preview: false }],
    } as CatalogExtensionInfoUI;

    await expect(toggleExtensionAutoUpdate(extension, true)).resolves.toBe(false);
  });
});
