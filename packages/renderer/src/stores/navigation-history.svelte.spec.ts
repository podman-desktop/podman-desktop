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

import { writable } from 'svelte/store';
import { router, type TinroRoute } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as kubernetesNoCurrentContext from '/@/stores/kubernetes-no-current-context';
import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import * as navigationRegistry from '/@/stores/navigation/navigation-registry';

import { goBack, goForward, navigationHistory } from './navigation-history.svelte';

let routerSubscribeCallback = vi.hoisted(() => {
  return vi.fn() as unknown as (navigation: TinroRoute) => void;
});

vi.mock('tinro', () => ({
  router: {
    goto: vi.fn(),
    subscribe: vi.fn((callback: (navigation: TinroRoute) => void) => {
      routerSubscribeCallback = callback;
      return vi.fn();
    }),
  },
}));

vi.mock(import('/@/stores/kubernetes-no-current-context'));
vi.mock(import('/@/stores/navigation/navigation-registry'));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);
  vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(true);

  vi.mocked(navigationRegistry).navigationRegistry = writable([
    { type: 'root', link: '/', title: 'Dashboard' } as unknown as NavigationRegistryEntry,
    { type: 'submenu', link: '/kubernetes', title: 'Kubernetes' } as unknown as NavigationRegistryEntry,
    {
      title: 'Kubernetes Dashboard',
      link: '/kubernetes/dashboard',
      type: 'entry',
    } as unknown as NavigationRegistryEntry,
  ]);

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

describe('kubernetes dashboard submenu', () => {
  test('/kubernetes submenu base route should NOT be added to history stack when kubernetes context exists', () => {
    // When cluster exists (kubernetesNoCurrentContext = false)
    // /kubernetes route should be skipped because it redirects to /kubernetes/dashboard
    vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(false);

    routerSubscribeCallback({ url: '/' } as TinroRoute);
    routerSubscribeCallback({ url: '/kubernetes' } as TinroRoute);
    // Simulate redirect to /kubernetes/dashboard
    routerSubscribeCallback({ url: '/kubernetes/dashboard' } as TinroRoute);

    // Stack should contain / and /kubernetes/dashboard, but NOT /kubernetes
    expect(navigationHistory.stack).toEqual(['/', '/kubernetes/dashboard']);
    expect(navigationHistory.index).toBe(1);
  });

  test('/kubernetes submenu base route SHOULD be added to history stack when kubernetes context does NOT exist', () => {
    // When no cluster exists (kubernetesNoCurrentContext = true)
    // /kubernetes route should be added because user stays on the empty page
    vi.mocked(kubernetesNoCurrentContext).kubernetesNoCurrentContext = writable(true);

    routerSubscribeCallback({ url: '/' } as TinroRoute);
    routerSubscribeCallback({ url: '/kubernetes' } as TinroRoute);

    // Stack should contain both / and /kubernetes
    expect(navigationHistory.stack).toEqual(['/', '/kubernetes']);
    expect(navigationHistory.index).toBe(1);
  });
});

describe('router navigation events', () => {
  test('should not store index.html in the history stack', () => {
    // Simulate navigation: /index.html -> / when starting the app in production mode
    // The /index.html route should not be stored in the navigation history
    routerSubscribeCallback({ url: '/index.html' } as TinroRoute);
    routerSubscribeCallback({ url: '/' } as TinroRoute);

    expect(navigationHistory.stack).not.toContain('/index.html');
    expect(navigationHistory.stack).toContain('/');
    expect(navigationHistory.index).toBe(0);
  });
});
