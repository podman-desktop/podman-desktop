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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { router } from 'tinro';
import { describe, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  canRemoveExtensionFromPreferences,
  getExtensionRemoveBlockedReason,
  getExtensionRemovePreferenceDetail,
  PREFERENCES_MAIN_ROUTE,
  removeExtensionWithConfirmation,
} from './extension-remove-preference';
import ExtensionLifecyclePreference from './ExtensionLifecyclePreference.svelte';
import ExtensionRemovePreference from './ExtensionRemovePreference.svelte';

vi.mock(import('tinro'));

describe('ExtensionLifecyclePreference', () => {
  test('renders enabled toggle for started extensions', async () => {
    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'started',
        devMode: false,
        removable: true,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    render(ExtensionLifecyclePreference, { extension });

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText('Extension is running and available in Podman Desktop')).toBeInTheDocument();
  });

  test('keeps toggle off while disabling until extension state catches up', async () => {
    vi.spyOn(window, 'stopExtension').mockImplementation(
      () =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 50);
        }),
    );

    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'starting',
        devMode: false,
        removable: true,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    const { rerender } = render(ExtensionLifecyclePreference, { extension });

    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeChecked();

    await fireEvent.click(toggle);

    expect(window.stopExtension).toHaveBeenCalledWith('podman-desktop.kind');
    expect(toggle).not.toBeChecked();

    extension.installedExtension!.state = 'stopping';
    await rerender({ extension });

    expect(toggle).not.toBeChecked();

    extension.installedExtension!.state = 'stopped';
    await rerender({ extension });

    await waitFor(() => {
      expect(toggle).not.toBeChecked();
    });
  });
});

describe('ExtensionRemovePreference', () => {
  test('renders remove button for removable extensions', async () => {
    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      fetchable: true,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'started',
        devMode: false,
        removable: true,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    render(ExtensionRemovePreference, { extension });

    expect(screen.getByRole('button', { name: /Remove/i })).toBeEnabled();
    expect(getExtensionRemovePreferenceDetail(extension)).toContain('Permanently remove Kind');
  });

  test('disables remove button for built-in extensions', async () => {
    const extension = {
      id: 'podman-desktop.compose',
      displayName: 'Compose',
      isInstalled: true,
      fetchable: false,
      installedExtension: {
        id: 'podman-desktop.compose',
        state: 'started',
        devMode: false,
        removable: false,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    render(ExtensionRemovePreference, { extension });

    expect(screen.getByRole('button', { name: /Remove/i })).toBeDisabled();
    expect(getExtensionRemovePreferenceDetail(extension)).toContain(
      'Built-in extensions are integrated with Podman Desktop and cannot be removed',
    );
    expect(canRemoveExtensionFromPreferences(extension)).toBe(false);
  });

  test('explains why bundled extensions such as Kind cannot be removed', () => {
    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      fetchable: false,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'started',
        devMode: false,
        removable: false,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    expect(getExtensionRemoveBlockedReason(extension)).toBe('Bundled with Podman Desktop and cannot be removed');
    expect(getExtensionRemovePreferenceDetail(extension)).toBe('Bundled with Podman Desktop and cannot be removed');
    expect(canRemoveExtensionFromPreferences(extension)).toBe(false);
  });

  test('removeExtensionWithConfirmation asks before removing', async () => {
    vi.spyOn(window, 'showMessageBox').mockResolvedValue({ response: 1 });
    vi.spyOn(window, 'removeExtension').mockResolvedValue(undefined);

    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      fetchable: true,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'started',
        devMode: false,
        removable: true,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    render(ExtensionRemovePreference, { extension });
    await fireEvent.click(screen.getByRole('button', { name: /Remove/i }));

    expect(window.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Remove extension?',
        type: 'danger',
      }),
    );
    expect(window.removeExtension).not.toHaveBeenCalled();
    expect(router.goto).not.toHaveBeenCalled();

    removeExtensionWithConfirmation(extension);
    expect(window.showMessageBox).toHaveBeenCalledTimes(2);
  });

  test('redirects to preferences main page after removing from preferences', async () => {
    vi.spyOn(window, 'showMessageBox').mockResolvedValue({ response: 0 });
    vi.spyOn(window, 'removeExtension').mockResolvedValue(undefined);

    const extension = {
      id: 'podman-desktop.kind',
      displayName: 'Kind',
      isInstalled: true,
      fetchable: true,
      installedExtension: {
        id: 'podman-desktop.kind',
        state: 'started',
        devMode: false,
        removable: true,
        type: 'pd',
      },
    } as CatalogExtensionInfoUI;

    removeExtensionWithConfirmation(extension, { redirectAfterRemove: PREFERENCES_MAIN_ROUTE });

    await waitFor(() => {
      expect(window.removeExtension).toHaveBeenCalledWith('podman-desktop.kind');
      expect(router.goto).toHaveBeenCalledWith(PREFERENCES_MAIN_ROUTE, true);
    });
  });
});
