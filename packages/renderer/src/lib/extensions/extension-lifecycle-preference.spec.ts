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
  canChangeExtensionLifecyclePreference,
  getExtensionLifecyclePreferenceDetail,
  isExtensionLifecyclePreferenceChecked,
  matchesExtensionLifecycleSearch,
  shouldShowExtensionLifecyclePreference,
  toggleExtensionLifecyclePreference,
} from './extension-lifecycle-preference';

describe('extension-lifecycle-preference', () => {
  test('shows preference for installed extensions', () => {
    expect(
      shouldShowExtensionLifecyclePreference({
        isInstalled: true,
        installedExtension: { devMode: false, state: 'started' },
      } as CatalogExtensionInfoUI),
    ).toBe(true);
  });

  test('hides preference for dev mode extensions', () => {
    expect(
      shouldShowExtensionLifecyclePreference({
        isInstalled: true,
        installedExtension: { devMode: true, state: 'started' },
      } as CatalogExtensionInfoUI),
    ).toBe(false);
  });

  test('reflects enabled state from extension lifecycle', () => {
    const extension = {
      isInstalled: true,
      installedExtension: { id: 'podman-desktop.kind', state: 'started', devMode: false },
    } as CatalogExtensionInfoUI;

    expect(isExtensionLifecyclePreferenceChecked(extension)).toBe(true);
    expect(canChangeExtensionLifecyclePreference(extension)).toBe(true);
    expect(getExtensionLifecyclePreferenceDetail(extension)).toContain('running');
  });

  test('describes stopped extensions', () => {
    const extension = {
      isInstalled: true,
      installedExtension: { id: 'podman-desktop.kind', state: 'stopped', devMode: false },
    } as CatalogExtensionInfoUI;

    expect(isExtensionLifecyclePreferenceChecked(extension)).toBe(false);
    expect(getExtensionLifecyclePreferenceDetail(extension)).toContain('stopped');
  });

  test('matches lifecycle search terms', () => {
    expect(matchesExtensionLifecycleSearch('enable')).toBe(true);
    expect(matchesExtensionLifecycleSearch('remove')).toBe(false);
  });

  test('starts and stops extensions from preferences', async () => {
    vi.spyOn(window, 'startExtension').mockResolvedValue(undefined);
    vi.spyOn(window, 'stopExtension').mockResolvedValue(undefined);

    const extension = {
      isInstalled: true,
      installedExtension: { id: 'podman-desktop.kind', state: 'stopped', devMode: false },
    } as CatalogExtensionInfoUI;

    await toggleExtensionLifecyclePreference(extension, true);
    expect(window.startExtension).toHaveBeenCalledWith('podman-desktop.kind');

    extension.installedExtension!.state = 'started';
    await toggleExtensionLifecyclePreference(extension, false);
    expect(window.stopExtension).toHaveBeenCalledWith('podman-desktop.kind');
  });
});
