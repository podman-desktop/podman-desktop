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

import { describe, expect, test } from 'vitest';

import type { NavigationRegistryEntry } from './navigation-registry';
import { NavigationUtils } from './navigation-utils';

const navigationUtils = new NavigationUtils();

function makeEntry(
  name: string,
  link: string,
  overrides: Partial<NavigationRegistryEntry> = {},
): NavigationRegistryEntry {
  return {
    name,
    icon: {},
    tooltip: name,
    link,
    counter: 0,
    destinations: [],
    type: 'entry',
    ...overrides,
  };
}

describe('qualifyName', () => {
  test('adds an optional parent name', () => {
    expect(navigationUtils.qualifyName(undefined, 'Pods')).toBe('Pods');
    expect(navigationUtils.qualifyName('Kubernetes', 'Pods')).toBe('Kubernetes > Pods');
  });
});

test('qualifies a drag payload with its optional parent name', () => {
  expect(navigationUtils.getNavigationDragName({ name: 'Appearance', link: '/preferences/appearance' })).toBe(
    'Appearance',
  );
  expect(
    navigationUtils.getNavigationDragName({
      parentName: 'Settings',
      name: 'Appearance',
      link: '/preferences/appearance',
    }),
  ).toBe('Settings > Appearance');
});

describe('flattenNavigationEntries', () => {
  test('flattens groups and qualifies only indexed submenu children', () => {
    const entries: NavigationRegistryEntry[] = [
      makeEntry('Pods', '/pods', { index: 0 }),
      makeEntry('Extensions', '/extensions', {
        type: 'group',
        items: [makeEntry('Images', '/images', { index: 1 })],
      }),
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        index: 2,
        items: [makeEntry('Pods', '/kubernetes/pods', { index: 3 }), makeEntry('Services', '/kubernetes/services')],
      }),
    ];

    const flattened = navigationUtils.flattenNavigationEntries(entries);

    expect(flattened.map(entry => entry.name)).toEqual(['Pods', 'Images', 'Kubernetes', 'Kubernetes > Pods']);
    expect(flattened[3]).toMatchObject({
      link: '/kubernetes/pods',
      name: 'Kubernetes > Pods',
      tooltip: 'Kubernetes > Pods',
    });
  });
});

describe('findNavigationEntryByLink', () => {
  test('finds nested entries and returns undefined for an unknown link', () => {
    const pods = makeEntry('Pods', '/kubernetes/pods');
    const entries = [
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        items: [pods],
      }),
    ];

    expect(navigationUtils.findNavigationEntryByLink(entries, '/kubernetes/pods')).toBe(pods);
    expect(navigationUtils.findNavigationEntryByLink(entries, '/unknown')).toBeUndefined();
  });
});
