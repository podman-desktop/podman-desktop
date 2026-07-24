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
  return entries.find(item => item.name === `Settings > ${shortName}`);
}

function expectedIcon(title: string): unknown {
  return settingsNavigationEntries.find(entry => entry.title === title)?.icon;
}

beforeEach(() => {
  vi.resetAllMocks();
});

test('returns flat entries prefixed with "Settings > " that are hidden unless pinned', () => {
  const entries = createNavigationSettingsEntries();

  expect(entries.length).toBeGreaterThan(0);
  expect(entries.every(item => item.type === 'entry')).toBe(true);
  expect(entries.every(item => item.name.includes(' > '))).toBe(true);

  const resources = findItem(entries, 'Resources');
  expect(resources).toBeDefined();
  expect(resources?.name).toBe('Settings > Resources');
  expect(resources?.link).toBe('/preferences/resources');
});

test('includes all static entries with their own icon', () => {
  const entries = createNavigationSettingsEntries();

  for (const title of [
    'Resources',
    'Proxy',
    'Docker Compatibility',
    'Registries',
    'Authentication',
    'CLI Tools',
    'Kubernetes',
    'Experimental',
  ]) {
    const item = findItem(entries, title);
    const config = settingsNavigationEntries.find(navItem => navItem.title === title);

    expect(item).toBeDefined();
    expect(item?.link).toBe(config?.href);
    expect(item?.icon.iconComponent).toBe(expectedIcon(title));
    expect(item?.icon.iconComponent).not.toBe(PreferencesIcon);
  }
});

test('static entries keep stable object identity across calls', () => {
  const entries = createNavigationSettingsEntries();
  const resources = findItem(entries, 'Resources');
  resources!.pinned = true;

  const entriesAfter = createNavigationSettingsEntries();
  expect(findItem(entriesAfter, 'Resources')).toBe(resources);
  expect(findItem(entriesAfter, 'Resources')?.pinned).toBe(true);
});

test('always includes a Troubleshooting entry using the same icon as its own page', () => {
  const entries = createNavigationSettingsEntries();
  const troubleshooting = findItem(entries, 'Troubleshooting');

  expect(troubleshooting).toBeDefined();
  expect(troubleshooting?.link).toBe('/troubleshooting/repair-connections');
  expect(troubleshooting?.icon.faIcon?.definition).toBe(faCrosshairs);
});
