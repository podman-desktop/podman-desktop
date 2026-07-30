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

import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { beforeEach, expect, test, vi } from 'vitest';

import PreferencesIcon from '/@/lib/images/PreferencesIcon.svelte';
import { settingsNavigationEntries } from '/@/PreferencesNavigation';

import type { NavigationRegistryEntry } from './navigation-registry';
import { createNavigationSettingsEntries } from './navigation-registry-settings.svelte';

function findItem(entries: NavigationRegistryEntry[], shortName: string): NavigationRegistryEntry | undefined {
  return entries.find(item => item.name === shortName);
}

function expectedIcon(title: string): unknown {
  return settingsNavigationEntries.find(entry => entry.title === title)?.icon;
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('returns flat Settings entries hidden unless pinned', () => {
  const entries = createNavigationSettingsEntries();

  expect(entries.length).toBeGreaterThan(0);
  expect(entries.every(item => item.type === 'entry')).toBe(true);
  expect(entries.every(item => item.parentName === 'Settings')).toBe(true);

  const resources = findItem(entries, 'Resources');
  expect(resources).toBeDefined();
  expect(resources?.name).toBe('Resources');
  expect(resources?.link).toBe('/preferences/resources');
  expect(findItem(entries, 'Preferences')).toBeUndefined();
});

test('does not register generated Preferences configuration rows', () => {
  expect(createNavigationSettingsEntries().some(entry => entry.link.startsWith('/preferences/default/'))).toBe(false);
});

test('registers explicitly declared static children with their own icons and parent path', () => {
  settingsNavigationEntries.push({
    title: 'Tools',
    href: '/preferences/tools',
    children: [{ title: 'Logs', href: '/preferences/tools/logs', icon: PreferencesIcon }],
  });
  try {
    expect(findItem(createNavigationSettingsEntries(), 'Logs')).toMatchObject({
      parentName: 'Settings > Tools',
      link: '/preferences/tools/logs',
      icon: { iconComponent: PreferencesIcon },
    });
  } finally {
    settingsNavigationEntries.pop();
  }
});

test.each([
  'Resources',
  'Proxy',
  'Docker Compatibility',
  'Registries',
  'Authentication',
  'CLI Tools',
  'Kubernetes',
  'Experimental',
])('includes static entry %s with its own icon', title => {
  const entries = createNavigationSettingsEntries();
  const item = findItem(entries, title);
  const config = settingsNavigationEntries.find(navItem => navItem.title === title);

  expect(item).toBeDefined();
  expect(item?.link).toBe(config?.href);
  expect(item?.icon.iconComponent).toBe(expectedIcon(title));
  expect(item?.icon.iconComponent).not.toBe(PreferencesIcon);
});

test('creates fresh entries without leaking previously assigned indices', () => {
  const entries = createNavigationSettingsEntries();
  const resources = findItem(entries, 'Resources');
  if (!resources) {
    throw new Error('Expected Resources entry');
  }
  resources.index = 0;

  const entriesAfter = createNavigationSettingsEntries();
  expect(findItem(entriesAfter, 'Resources')).not.toBe(resources);
  expect(findItem(entriesAfter, 'Resources')?.index).toBeUndefined();
});

test('always includes a Troubleshooting entry using the same icon as its own page', () => {
  const entries = createNavigationSettingsEntries();
  const troubleshooting = findItem(entries, 'Troubleshooting');

  expect(troubleshooting).toBeDefined();
  expect(troubleshooting?.link).toBe('/troubleshooting/repair-connections');
  expect(troubleshooting?.icon.faIcon?.definition).toBe(faCrosshairs);
});
