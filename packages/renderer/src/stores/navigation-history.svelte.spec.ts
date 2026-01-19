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

import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationHistory,
} from './navigation-history.svelte';

vi.mock(import('./navigation/navigation-registry'), async () => {
  const { writable } = await import('svelte/store');

  // Mock navigation registry with kubernetes submenu for testing
  const mockRegistry = [
    {
      name: 'Kubernetes',
      icon: {},
      link: '/kubernetes',
      tooltip: 'Kubernetes',
      counter: 0,
      type: 'submenu' as const,
      items: [
        {
          name: 'Pods',
          icon: {},
          link: '/kubernetes/pods',
          tooltip: 'Pods',
          counter: 0,
          type: 'entry' as const,
        },
        {
          name: 'ConfigMaps & Secrets',
          icon: {},
          link: '/kubernetes/configmapsSecrets',
          tooltip: 'ConfigMaps & Secrets',
          counter: 0,
          type: 'entry' as const,
        },
      ],
    },
    {
      name: 'Containers',
      icon: {},
      link: '/containers',
      tooltip: 'Containers',
      counter: 0,
      type: 'entry' as const,
    },
  ];

  return {
    navigationRegistry: writable(mockRegistry),
  };
});

vi.mock('/@/PreferencesNavigation', () => ({
  settingsNavigationEntries: [],
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);
  // Reset navigation history state
  navigationHistory.stack = [];
  navigationHistory.index = -1;
});

describe('goBack', () => {
  test('should not navigate when history is empty', () => {
    goBack();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should not navigate when at first entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goBack();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should navigate to previous entry', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    goBack();

    expect(navigationHistory.index).toBe(0);
    expect(router.goto).toHaveBeenCalledWith('/containers');
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.back');
  });
});

describe('goForward', () => {
  test('should not navigate when history is empty', () => {
    goForward();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should not navigate when at last entry', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goForward();

    expect(router.goto).not.toHaveBeenCalled();
    expect(window.telemetryTrack).not.toHaveBeenCalled();
  });

  test('should navigate to next entry', () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    goForward();

    expect(navigationHistory.index).toBe(1);
    expect(router.goto).toHaveBeenCalledWith('/images');
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.forward');
  });
});

describe('submenu base routes', () => {
  test('goBack should skip submenu base routes like /kubernetes', () => {
    // Simulate the navigation scenario:
    // User went /containers -> /kubernetes/dashboard
    // The /kubernetes route should NOT be in the stack since it's a submenu base route
    // that immediately redirects to a sub-page
    navigationHistory.stack = ['/containers', '/kubernetes/dashboard'];
    navigationHistory.index = 1;

    goBack();

    // Should go directly back to /containers, not to /kubernetes
    expect(navigationHistory.index).toBe(0);
    expect(router.goto).toHaveBeenCalledWith('/containers');
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.back');
  });
});

describe('goToHistoryIndex', () => {
  test('should not navigate to invalid negative index', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goToHistoryIndex(-1);

    expect(router.goto).not.toHaveBeenCalled();
  });

  test('should not navigate to index beyond stack', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goToHistoryIndex(5);

    expect(router.goto).not.toHaveBeenCalled();
  });

  test('should not navigate to current index', () => {
    navigationHistory.stack = ['/containers'];
    navigationHistory.index = 0;

    goToHistoryIndex(0);

    expect(router.goto).not.toHaveBeenCalled();
  });

  test('should navigate to valid index', () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 2;

    goToHistoryIndex(0);

    expect(navigationHistory.index).toBe(0);
    expect(router.goto).toHaveBeenCalledWith('/containers');
  });
});

describe('getBackEntries', () => {
  test('should return empty array when no history', () => {
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
});

describe('getForwardEntries', () => {
  test('should return empty array when no history', () => {
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

describe('submenu navigation', () => {
  test('should show submenu parent > resource type breadcrumb', () => {
    // Simulate navigation: Dashboard -> Kubernetes Pods list -> Specific pod
    navigationHistory.stack = ['/', '/kubernetes/pods', '/kubernetes/pods/nginx-pod/default/summary'];
    navigationHistory.index = 2;

    const backEntries = getBackEntries();

    expect(backEntries.length).toBe(2);
    // getBackEntries returns in reverse order, so [0] is index 1, [1] is index 0
    // backEntries[0] = '/kubernetes/pods' - should show full breadcrumb from registry
    expect(backEntries[0].name).toBe('Kubernetes > Pods');
    // backEntries[1] = '/' - should show Dashboard
    expect(backEntries[1].name).toBe('Dashboard');

    // The current entry (detail page) should show full breadcrumb with resource name
    const forwardEntries = getForwardEntries();
    expect(forwardEntries.length).toBe(0); // We're at the end
  });

  test('should preserve special characters in submenu breadcrumbs', () => {
    // Test ConfigMaps & Secrets with special character '&'
    navigationHistory.stack = [
      '/',
      '/kubernetes/configmapsSecrets',
      '/kubernetes/configmapsSecrets/my-config/default/summary',
    ];
    navigationHistory.index = 2;

    const backEntries = getBackEntries();

    expect(backEntries.length).toBe(2);
    // backEntries[0] = '/kubernetes/configmapsSecrets' base route
    // Should show proper name from registry with '&' preserved
    expect(backEntries[0].name).toBe('Kubernetes > ConfigMaps & Secrets');
    // backEntries[1] = '/' Dashboard
    expect(backEntries[1].name).toBe('Dashboard');
  });

  test('should show full breadcrumb for detail pages', () => {
    // Test detail page shows: parent > resource type > resource name
    navigationHistory.stack = [
      '/kubernetes/configmapsSecrets/my-config/default/summary',
      '/kubernetes/configmapsSecrets',
    ];
    navigationHistory.index = 1;

    const entries = getBackEntries();
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('Kubernetes > ConfigMaps & Secrets > my-config');
  });
});

describe('tab navigation for detail pages', () => {
  test('should only have one entry per resource when navigating through tabs', () => {
    // Start by navigating to containers list
    router.goto('/containers');
    expect(navigationHistory.stack).toEqual(['/containers']);
    expect(navigationHistory.index).toBe(0);

    // Navigate to container detail page summary tab (should add new entry)
    router.goto('/containers/abc123/summary');
    expect(navigationHistory.stack).toEqual(['/containers', '/containers/abc123/summary']);
    expect(navigationHistory.index).toBe(1);

    // Switch to logs tab (should UPDATE current entry, not add new one)
    router.goto('/containers/abc123/logs');

    // Stack should still only have 2 entries (not 3), with logs replacing summary
    expect(navigationHistory.stack).toEqual(['/containers', '/containers/abc123/logs']);
    expect(navigationHistory.stack.length).toBe(2);
    expect(navigationHistory.index).toBe(1);
  });

  test('should show same display name for different tabs of same resource', () => {
    // Set up stack as if user switched through tabs (but only one entry exists due to update logic)
    navigationHistory.stack = ['/containers', '/containers/abc123/inspect'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();

    // Should show resource name without tab name
    expect(entries).toEqual([{ index: 1, name: 'Containers > abc123', icon: {} }]);
    // Tab name should not appear in display
    expect(entries[0].name).not.toContain('Inspect');
    expect(entries[0].name).not.toContain('Summary');
    expect(entries[0].name).not.toContain('Logs');
  });

  test('should show resource name without tab for submenu resources', () => {
    // Kubernetes pod with tab navigation
    navigationHistory.stack = ['/kubernetes/pods', '/kubernetes/pods/nginx-pod/default/logs'];
    navigationHistory.index = 0;

    const entries = getForwardEntries();

    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe('Kubernetes > Pods > nginx-pod');
  });

  test('should skip detail page root URLs ending with / since we are being immediately redirected to the logs tab', () => {
    // When going to specific containers or pods, we are being immediately redirected to the logs tab
    // This simulates: user clicks on container -> router goes to /containers/abc123/ -> immediately redirects to /containers/abc123/logs

    navigationHistory.stack = ['/'];
    navigationHistory.index = 0;

    // Simulate the router subscription receiving the root URL first (should be skipped by isDetailPageRoot)
    router.goto('/containers/abc123/');

    // Should not have added the root URL to history
    expect(navigationHistory.stack).toEqual(['/']);
    expect(navigationHistory.index).toBe(0);

    // Then simulate the immediate redirect to logs tab (should be added)
    router.goto('/containers/abc123/logs');

    // Now should have both dashboard and logs in history, skipping the root URL
    expect(navigationHistory.stack).toEqual(['/', '/containers/abc123/logs']);
    expect(navigationHistory.index).toBe(1);
  });
});
