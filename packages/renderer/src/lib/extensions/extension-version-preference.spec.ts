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

import { describe, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  confirmExtensionVersionChange,
  extensionHasVersionChoices,
  extensionIsOnLatestVersion,
  getExtensionVersionOptions,
  getExtensionVersionPreferenceDescription,
  getExtensionVersionPreferenceDetail,
  getExtensionVersionPreferenceSummary,
  getExtensionVersionPreferenceValue,
  matchesExtensionVersionSearch,
  shouldShowExtensionVersionPreference,
} from './extension-version-preference';

describe('extension-version-preference', () => {
  test('shows preference when multiple versions are available', () => {
    const extension = {
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
      availableVersions: [
        { version: '1.1.0', ociUri: '', preview: false },
        { version: '1.0.0', ociUri: '', preview: false },
      ],
      installedExtension: { devMode: false },
    } as CatalogExtensionInfoUI;

    expect(shouldShowExtensionVersionPreference(extension)).toBe(true);
    expect(extensionHasVersionChoices(extension)).toBe(true);
  });

  test('shows preference when only one version is available', () => {
    const extension = {
      isInstalled: true,
      installedVersion: '1.28.0-next',
      fetchVersion: '1.28.0-next',
      availableVersions: [{ version: '1.28.0-next', ociUri: '', preview: false }],
      installedExtension: { devMode: false },
    } as CatalogExtensionInfoUI;

    expect(shouldShowExtensionVersionPreference(extension)).toBe(true);
    expect(extensionHasVersionChoices(extension)).toBe(false);
    expect(getExtensionVersionPreferenceDetail(false)).toBe('No other versions available');
    expect(getExtensionVersionPreferenceDescription('1.28.0-next', false)).toBe(
      'Currently installed v1.28.0-next. No other versions available',
    );
  });

  test('hides preference for dev mode extensions', () => {
    const extension = {
      isInstalled: true,
      installedVersion: '1.0.0',
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
      installedExtension: { devMode: true },
    } as CatalogExtensionInfoUI;

    expect(shouldShowExtensionVersionPreference(extension)).toBe(false);
  });

  test('returns sorted version options with upgrade and downgrade labels', () => {
    const extension = {
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
      availableVersions: [
        { version: '1.0.0', ociUri: '', preview: false },
        { version: '1.1.0', ociUri: '', preview: false },
        { version: '0.9.0', ociUri: '', preview: false },
      ],
    } as CatalogExtensionInfoUI;

    expect(getExtensionVersionOptions(extension, '1.0.0')).toEqual([
      { label: 'v1.1.0 · Upgrade', value: '1.1.0', icon: expect.anything(), status: 'upgrade' },
      { label: 'v1.0.0', value: '1.0.0', status: 'current' },
      { label: 'v0.9.0 · Downgrade', value: '0.9.0', icon: expect.anything(), status: 'downgrade' },
    ]);
    expect(getExtensionVersionPreferenceValue(extension)).toBe('1.0.0');
    expect(getExtensionVersionPreferenceSummary('1.0.0')).toBe('Currently installed v1.0.0');
    expect(getExtensionVersionPreferenceDescription('1.0.0', true)).toContain('upgrade or downgrade');
  });

  test('detects when installed version is the latest catalog version', () => {
    const onLatestWithDowngrades = {
      isInstalled: true,
      installedVersion: '0.4.0',
      fetchVersion: '0.4.0',
      availableVersions: [
        { version: '0.4.0', ociUri: '', preview: false },
        { version: '0.3.0', ociUri: '', preview: false },
      ],
      hasUpdate: false,
    } as CatalogExtensionInfoUI;

    const upgradeAvailable = {
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
      availableVersions: [
        { version: '1.1.0', ociUri: '', preview: false },
        { version: '1.0.0', ociUri: '', preview: false },
      ],
      hasUpdate: true,
    } as CatalogExtensionInfoUI;

    expect(extensionIsOnLatestVersion(onLatestWithDowngrades)).toBe(true);
    expect(extensionHasVersionChoices(onLatestWithDowngrades)).toBe(true);
    expect(extensionIsOnLatestVersion(upgradeAvailable)).toBe(false);
  });

  test('matches version search terms', () => {
    expect(matchesExtensionVersionSearch('version')).toBe(true);
    expect(matchesExtensionVersionSearch('automatic')).toBe(false);
  });

  test('confirmExtensionVersionChange returns true when confirmed', async () => {
    vi.spyOn(window, 'showMessageBox').mockResolvedValue({ response: 0 });

    const extension = {
      displayName: 'Kind',
      installedVersion: '1.0.0',
    } as CatalogExtensionInfoUI;

    await expect(confirmExtensionVersionChange(extension, '1.1.0')).resolves.toBe(true);
    expect(window.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'none',
        title: 'Upgrade to v1.1.0 for Kind?',
      }),
    );
  });
});
