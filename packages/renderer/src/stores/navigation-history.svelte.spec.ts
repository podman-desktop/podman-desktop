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

vi.mock(import('tinro'));

vi.mock(import('./navigation/navigation-registry'), async () => {
  const { writable } = await import('svelte/store');
  return {
    navigationRegistry: writable([]),
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
      { index: 0, name: 'Containers', icon: undefined },
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
