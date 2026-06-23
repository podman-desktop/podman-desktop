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

import { type NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import {
  consumePendingWebviewSubRoute,
  getBackEntries,
  getForwardEntries,
  getWebviewSubRouteMetadata,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationHistory,
  parseWebviewSubRoute,
  pushWebviewSubRoute,
  replaceWebviewSubRoute,
} from '/@/stores/navigation-history.svelte';

vi.mock(import('/@/stores/navigation/navigation-registry'));

vi.mock(import('/@/PreferencesNavigation'), () => ({
  settingsNavigationEntries: [],
}));

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

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);

  navigationHistory.stack = [];
  navigationHistory.index = -1;
});

describe('goBack', () => {
  test('should navigate back and track telemetry', () => {
    navigationHistory.stack = ['/', '/containers', '/images'];
    navigationHistory.index = 2;

    goBack();

    expect(navigationHistory.index).toBe(1);
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.back');
  });

  test('should not navigate when at start of history', () => {
    navigationHistory.stack = ['/'];
    navigationHistory.index = 0;

    goBack();

    expect(navigationHistory.index).toBe(0);
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });
});

describe('goForward', () => {
  test('should navigate forward and track telemetry', () => {
    navigationHistory.stack = ['/', '/containers', '/images'];
    navigationHistory.index = 0;

    goForward();

    expect(navigationHistory.index).toBe(1);
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.forward');
  });

  test('should not navigate when at end of history', () => {
    navigationHistory.stack = ['/', '/containers'];
    navigationHistory.index = 1;

    goForward();

    expect(navigationHistory.index).toBe(1);
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });
});

describe('goToHistoryIndex', () => {
  test('should navigate to the given index', () => {
    navigationHistory.stack = ['/', '/containers', '/images'];
    navigationHistory.index = 2;

    goToHistoryIndex(0);

    expect(navigationHistory.index).toBe(0);
  });

  test('should not navigate to invalid index', () => {
    navigationHistory.stack = ['/', '/containers'];
    navigationHistory.index = 1;

    goToHistoryIndex(5);

    expect(navigationHistory.index).toBe(1);
  });

  test('should not navigate to current index', () => {
    navigationHistory.stack = ['/', '/containers'];
    navigationHistory.index = 1;

    goToHistoryIndex(1);

    expect(navigationHistory.index).toBe(1);
  });
});

describe('getBackEntries', () => {
  test('should return empty array when no history', () => {
    navigationHistory.stack = [];
    navigationHistory.index = -1;

    const entries = getBackEntries();
    expect(entries).toEqual([]);
  });

  test('should return empty array when at first entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    const entries = getBackEntries();
    expect(entries).toEqual([]);
  });

  test('should return previous entries in reverse order with computed names', () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 2;

    const entries = getBackEntries();

    expect(entries).toEqual([
      { index: 1, name: 'Images', icon: undefined },
      { index: 0, name: 'Containers', icon: {} },
    ]);
  });

  test('should include all previous entries without filtering', () => {
    navigationHistory.stack = ['/', '/kubernetes/pods', '/containers'];
    navigationHistory.index = 2;

    const entries = getBackEntries();

    expect(entries).toHaveLength(2);
    expect(entries[0].name).toBe('Kubernetes > Pods');
    expect(entries[1].name).toBe('Dashboard');
  });
});

describe('getForwardEntries', () => {
  test('should return empty array when no history', () => {
    navigationHistory.stack = [];
    navigationHistory.index = -1;

    const entries = getForwardEntries();
    expect(entries).toEqual([]);
  });

  test('should return empty array when at last entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();
    expect(entries).toEqual([]);
  });

  test('should return forward entries in order with computed names', () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();

    expect(entries).toEqual([
      { index: 1, name: 'Images', icon: undefined },
      { index: 2, name: 'Pods', icon: undefined },
    ]);
  });
});

describe('submenu navigation display names', () => {
  test('should show submenu parent > resource type breadcrumb', () => {
    navigationHistory.stack = ['/', '/kubernetes/pods', '/kubernetes/pods/nginx-pod/default/summary'];
    navigationHistory.index = 2;

    const backEntries = getBackEntries();

    expect(backEntries.length).toBe(2);
    expect(backEntries[0].name).toBe('Kubernetes > Pods');
    expect(backEntries[1].name).toBe('Dashboard');

    const forwardEntries = getForwardEntries();
    expect(forwardEntries.length).toBe(0);
  });

  test('should preserve special characters in submenu breadcrumbs', () => {
    navigationHistory.stack = [
      '/',
      '/kubernetes/configmapsSecrets',
      '/kubernetes/configmapsSecrets/my-config/default/summary',
    ];
    navigationHistory.index = 2;

    const backEntries = getBackEntries();

    expect(backEntries.length).toBe(2);
    expect(backEntries[0].name).toBe('Kubernetes > ConfigMaps & Secrets');
    expect(backEntries[1].name).toBe('Dashboard');
  });

  test('should show full breadcrumb for detail pages including tab', () => {
    navigationHistory.stack = [
      '/kubernetes/configmapsSecrets/my-config/default/summary',
      '/kubernetes/configmapsSecrets',
    ];
    navigationHistory.index = 1;

    const entries = getBackEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('Kubernetes > ConfigMaps & Secrets > my-config > Summary');
  });
});

describe('tab navigation display names', () => {
  test('should show tab name in display for different tabs', () => {
    navigationHistory.stack = ['/containers', '/containers/abc123/inspect'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();

    expect(entries).toEqual([{ index: 1, name: 'Containers > abc123 > Inspect', icon: {} }]);
    expect(entries[0].name).toContain('Inspect');
  });

  test('should show resource name with tab for submenu resources', () => {
    navigationHistory.stack = ['/kubernetes/pods', '/kubernetes/pods/nginx-pod/default/logs'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();

    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('Kubernetes > Pods > nginx-pod > Logs');
  });
});

describe('parseWebviewSubRoute', () => {
  test('should return undefined for non-webview URLs', () => {
    expect(parseWebviewSubRoute('/containers')).toBeUndefined();
    expect(parseWebviewSubRoute('/images')).toBeUndefined();
    expect(parseWebviewSubRoute('/')).toBeUndefined();
  });

  test('should return undefined for webview URL without hash', () => {
    expect(parseWebviewSubRoute('/webviews/0')).toBeUndefined();
  });

  test('should parse webview sub-route with hash', () => {
    const result = parseWebviewSubRoute('/webviews/0#/services');
    expect(result).toEqual({
      baseUrl: '/webviews/0',
      subPath: '/services',
      webviewId: '0',
    });
  });

  test('should parse webview sub-route with nested path', () => {
    const result = parseWebviewSubRoute('/webviews/2#/catalog/models');
    expect(result).toEqual({
      baseUrl: '/webviews/2',
      subPath: '/catalog/models',
      webviewId: '2',
    });
  });

  test('should return undefined for hash in non-webview URL', () => {
    expect(parseWebviewSubRoute('/containers#something')).toBeUndefined();
  });
});

describe('pushWebviewSubRoute', () => {
  test('should add entry to stack and store metadata', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    pushWebviewSubRoute('0', '/services', 'Services', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/services']);
    expect(navigationHistory.index).toBe(1);

    const metadata = getWebviewSubRouteMetadata('/webviews/0#/services');
    expect(metadata).toEqual({ title: 'Services', webviewName: 'AI Lab', webviewUrl: undefined });
  });

  test('should not push duplicate entry', () => {
    navigationHistory.stack = ['/containers', '/webviews/0#/catalog'];
    navigationHistory.index = 1;

    pushWebviewSubRoute('0', '/catalog', 'Catalog', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/catalog']);
    expect(navigationHistory.index).toBe(1);
  });

  test('should truncate forward history when pushing', () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 0;

    pushWebviewSubRoute('0', '/services', 'Services', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/services']);
    expect(navigationHistory.index).toBe(1);
  });

  test('should clean up orphaned metadata when truncating forward history', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    pushWebviewSubRoute('0', '/page1', 'Page 1', 'AI Lab');
    pushWebviewSubRoute('0', '/page2', 'Page 2', 'AI Lab');

    expect(getWebviewSubRouteMetadata('/webviews/0#/page1')).toBeDefined();
    expect(getWebviewSubRouteMetadata('/webviews/0#/page2')).toBeDefined();

    navigationHistory.index = 0;
    pushWebviewSubRoute('1', '/new-page', 'New Page', 'Bootc');

    expect(getWebviewSubRouteMetadata('/webviews/0#/page1')).toBeUndefined();
    expect(getWebviewSubRouteMetadata('/webviews/0#/page2')).toBeUndefined();
    expect(getWebviewSubRouteMetadata('/webviews/1#/new-page')).toBeDefined();
  });
});

describe('replaceWebviewSubRoute', () => {
  test('should replace current entry when same webview', () => {
    navigationHistory.stack = ['/containers', '/webviews/0#/home'];
    navigationHistory.index = 1;

    replaceWebviewSubRoute('0', '/catalog', 'Catalog', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/catalog']);
    expect(navigationHistory.index).toBe(1);

    const metadata = getWebviewSubRouteMetadata('/webviews/0#/catalog');
    expect(metadata).toEqual({ title: 'Catalog', webviewName: 'AI Lab', webviewUrl: undefined });
  });

  test('should replace base webview URL', () => {
    navigationHistory.stack = ['/containers', '/webviews/0'];
    navigationHistory.index = 1;

    replaceWebviewSubRoute('0', '/catalog', 'Catalog', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/catalog']);
    expect(navigationHistory.index).toBe(1);
  });

  test('should clean up old metadata when replacing', () => {
    navigationHistory.stack = ['/containers', '/webviews/0#/services'];
    navigationHistory.index = 1;

    pushWebviewSubRoute('0', '/services', 'Services', 'AI Lab');
    replaceWebviewSubRoute('0', '/catalog', 'Catalog', 'AI Lab');

    expect(getWebviewSubRouteMetadata('/webviews/0#/services')).toBeUndefined();
    expect(getWebviewSubRouteMetadata('/webviews/0#/catalog')).toBeDefined();
  });

  test('should push when current entry is different webview', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    replaceWebviewSubRoute('0', '/catalog', 'Catalog', 'AI Lab');

    expect(navigationHistory.stack).toEqual(['/containers', '/webviews/0#/catalog']);
    expect(navigationHistory.index).toBe(1);
  });
});

describe('consumePendingWebviewSubRoute', () => {
  test('should return undefined when no pending sub-route', () => {
    const pending = consumePendingWebviewSubRoute('0');
    expect(pending).toBeUndefined();
  });

  test('should return undefined for wrong webview id', () => {
    const pending = consumePendingWebviewSubRoute('1');
    expect(pending).toBeUndefined();
  });
});
