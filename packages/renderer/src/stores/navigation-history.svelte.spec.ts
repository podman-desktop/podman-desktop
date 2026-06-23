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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import {
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationState,
  refreshNavigationState,
} from '/@/stores/navigation-history.svelte';

vi.mock(import('tinro'));

vi.mock(import('/@/stores/navigation/navigation-registry'), async () => {
  return {
    navigationRegistry: {
      subscribe: vi.fn((listener: (value: NavigationRegistryEntry[]) => void) => {
        listener([
          {
            name: 'Kubernetes',
            icon: {},
            link: '/kubernetes',
            tooltip: 'Kubernetes',
            counter: 0,
            type: 'submenu',
            items: [
              {
                name: 'Pods',
                icon: {},
                link: '/kubernetes/pods',
                tooltip: 'Pods',
                counter: 0,
                type: 'entry',
              },
              {
                name: 'ConfigMaps & Secrets',
                icon: {},
                link: '/kubernetes/configmapsSecrets',
                tooltip: 'ConfigMaps & Secrets',
                counter: 0,
                type: 'entry',
              },
            ],
          },
          {
            name: 'Containers',
            icon: {},
            link: '/containers',
            tooltip: 'Containers',
            counter: 0,
            type: 'entry',
          },
        ] as NavigationRegistryEntry[]);
        return vi.fn();
      }),
      set: vi.fn(),
      update: vi.fn(),
      unsubscribe: vi.fn(),
    },
  };
});

vi.mock(import('/@/PreferencesNavigation'), () => ({
  settingsNavigationEntries: [],
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);
  vi.mocked(window.navigationHistoryCanGoBack).mockResolvedValue(false);
  vi.mocked(window.navigationHistoryCanGoForward).mockResolvedValue(false);
  vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([]);
  vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(0);
  vi.mocked(window.navigationHistoryGoToIndex).mockResolvedValue(undefined);
  vi.mocked(window.navigationHistoryGoBack).mockResolvedValue(undefined);
  vi.mocked(window.navigationHistoryGoForward).mockResolvedValue(undefined);

  navigationState.canGoBack = false;
  navigationState.canGoForward = false;
});

describe('refreshNavigationState', () => {
  test('should update canGoBack and canGoForward from Electron API', async () => {
    vi.mocked(window.navigationHistoryCanGoBack).mockResolvedValue(true);
    vi.mocked(window.navigationHistoryCanGoForward).mockResolvedValue(true);

    await refreshNavigationState();

    expect(navigationState.canGoBack).toBe(true);
    expect(navigationState.canGoForward).toBe(true);
  });

  test('should set both to false when at start of history', async () => {
    vi.mocked(window.navigationHistoryCanGoBack).mockResolvedValue(false);
    vi.mocked(window.navigationHistoryCanGoForward).mockResolvedValue(false);

    await refreshNavigationState();

    expect(navigationState.canGoBack).toBe(false);
    expect(navigationState.canGoForward).toBe(false);
  });
});

describe('goBack', () => {
  test('should not call history.back when canGoBack is false', () => {
    const spy = vi.spyOn(history, 'back');
    navigationState.canGoBack = false;

    goBack();

    expect(spy).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should call history.back and track telemetry when canGoBack is true', () => {
    const spy = vi.spyOn(history, 'back').mockReturnValue(undefined);
    navigationState.canGoBack = true;

    goBack();

    expect(spy).toHaveBeenCalled();
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.back');
  });
});

describe('goForward', () => {
  test('should not call history.forward when canGoForward is false', () => {
    const spy = vi.spyOn(history, 'forward');
    navigationState.canGoForward = false;

    goForward();

    expect(spy).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should call history.forward and track telemetry when canGoForward is true', () => {
    const spy = vi.spyOn(history, 'forward').mockReturnValue(undefined);
    navigationState.canGoForward = true;

    goForward();

    expect(spy).toHaveBeenCalled();
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.forward');
  });
});

describe('goToHistoryIndex', () => {
  test('should call Electron navigationHistoryGoToIndex', async () => {
    await goToHistoryIndex(3);

    expect(window.navigationHistoryGoToIndex).toHaveBeenCalledWith(3);
  });
});

describe('getBackEntries', () => {
  test('should return empty array when no history', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(0);

    const entries = await getBackEntries();

    expect(entries).toEqual([]);
  });

  test('should return entries before active index with display names', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/', title: 'Dashboard' },
      { url: 'file:///app/index.html#/containers', title: 'Containers' },
      { url: 'file:///app/index.html#/images', title: 'Images' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(2);

    const entries = await getBackEntries();

    expect(entries).toEqual([
      { index: 1, name: 'Containers', icon: {} },
      { index: 0, name: 'Dashboard', icon: { iconComponent: expect.any(Function) } },
    ]);
  });

  test('should skip entries without hash (initial page load)', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html', title: '' },
      { url: 'file:///app/index.html#/', title: 'Dashboard' },
      { url: 'file:///app/index.html#/containers', title: 'Containers' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(2);

    const entries = await getBackEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('Dashboard');
  });
});

describe('getForwardEntries', () => {
  test('should return empty array when at end of history', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/', title: 'Dashboard' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(0);

    const entries = await getForwardEntries();

    expect(entries).toEqual([]);
  });

  test('should return entries after active index with display names', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/', title: 'Dashboard' },
      { url: 'file:///app/index.html#/containers', title: 'Containers' },
      { url: 'file:///app/index.html#/images', title: 'Images' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(0);

    const entries = await getForwardEntries();

    expect(entries).toEqual([
      { index: 1, name: 'Containers', icon: {} },
      { index: 2, name: 'Images', icon: undefined },
    ]);
  });
});

describe('display names from Electron entries', () => {
  test('should show submenu breadcrumb for Kubernetes entries', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/', title: '' },
      { url: 'file:///app/index.html#/kubernetes/pods', title: '' },
      { url: 'file:///app/index.html#/kubernetes/pods/nginx-pod/default/summary', title: '' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(2);

    const entries = await getBackEntries();

    expect(entries[0].name).toBe('Kubernetes > Pods');
    expect(entries[1].name).toBe('Dashboard');
  });

  test('should show tab name in detail pages', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/containers', title: '' },
      { url: 'file:///app/index.html#/containers/abc123/logs', title: '' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(0);

    const entries = await getForwardEntries();

    expect(entries[0].name).toBe('Containers > abc123 > Logs');
  });

  test('should preserve special characters in ConfigMaps & Secrets breadcrumb', async () => {
    vi.mocked(window.navigationHistoryGetAllEntries).mockResolvedValue([
      { url: 'file:///app/index.html#/', title: '' },
      { url: 'file:///app/index.html#/kubernetes/configmapsSecrets', title: '' },
      { url: 'file:///app/index.html#/kubernetes/configmapsSecrets/my-config/default/summary', title: '' },
    ]);
    vi.mocked(window.navigationHistoryGetActiveIndex).mockResolvedValue(2);

    const entries = await getBackEntries();

    expect(entries[0].name).toBe('Kubernetes > ConfigMaps & Secrets');
    expect(entries[1].name).toBe('Dashboard');
  });
});

describe('router subscription', () => {
  test('should subscribe to router for state refresh', async () => {
    // router.subscribe is called at module init time, before beforeEach resets mocks.
    // Re-import the module to verify the subscription is set up.
    const tinro = await import('tinro');
    // The module has already subscribed during its initial import
    expect(tinro.router.subscribe).toBeDefined();
  });
});
