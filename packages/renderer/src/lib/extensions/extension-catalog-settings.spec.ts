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
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  clearNewBadge,
  isNewBadgeActive,
  markNewlyInstalled,
  NEW_BADGE_DURATION_MS,
  newlyInstalledAt,
} from './extension-catalog-settings.svelte';

vi.mock(import('/@/stores/webviews'), () => ({
  webviews: writable([]),
  fetchWebviews: vi.fn(async () => undefined),
}));

vi.mock(import('/@/stores/contribs'), () => ({
  contributions: writable([]),
}));

vi.mock(import('/@/stores/navigation/navigation-registry-extension.svelte'), () => ({
  refreshExtensionNavigationItems: vi.fn(),
}));

vi.mock(import('./extension-nav-pointer.svelte'), () => ({
  onExtensionNewlyInstalled: vi.fn(),
}));

describe('extension-catalog-settings new badge', () => {
  beforeEach(() => {
    newlyInstalledAt.clear();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    newlyInstalledAt.clear();
    localStorage.clear();
  });

  test('marks extension as new and persists for one day', () => {
    markNewlyInstalled('redhat.ai-lab');

    expect(isNewBadgeActive('redhat.ai-lab')).toBe(true);

    vi.advanceTimersByTime(NEW_BADGE_DURATION_MS - 1);
    expect(isNewBadgeActive('redhat.ai-lab')).toBe(true);

    vi.advanceTimersByTime(1);
    expect(isNewBadgeActive('redhat.ai-lab')).toBe(false);
  });

  test('restores active new badges from localStorage', () => {
    markNewlyInstalled('redhat.ai-lab');
    newlyInstalledAt.clear();

    const stored = localStorage.getItem('podman-desktop-extension-new-badges');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored ?? '{}') as Record<string, number>;
    newlyInstalledAt.set('redhat.ai-lab', parsed['redhat.ai-lab']);

    expect(isNewBadgeActive('redhat.ai-lab')).toBe(true);
  });

  test('clearNewBadge removes persisted entry', () => {
    markNewlyInstalled('redhat.ai-lab');
    clearNewBadge('redhat.ai-lab');

    expect(isNewBadgeActive('redhat.ai-lab')).toBe(false);
    expect(localStorage.getItem('podman-desktop-extension-new-badges')).toBe('{}');
  });
});
