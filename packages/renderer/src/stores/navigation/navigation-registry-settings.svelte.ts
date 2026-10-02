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

import PreferencesIcon from '/@/lib/images/PreferencesIcon.svelte';
import { settingsNavigationEntries, type SettingsNavItemConfig } from '/@/PreferencesNavigation';

import type { NavigationRegistryEntry } from './navigation-registry';

function toEntry(
  name: string,
  link: string,
  icon: NavigationRegistryEntry['icon'] = { iconComponent: PreferencesIcon },
  parentName = 'Settings',
): NavigationRegistryEntry {
  return {
    name,
    parentName,
    icon,
    tooltip: name,
    link,
    type: 'entry',
    counter: 0,
    destinations: [],
  };
}

function toEntries(entries: SettingsNavItemConfig[], parentName: string): NavigationRegistryEntry[] {
  return entries.flatMap(entry => [
    toEntry(entry.title, entry.href, entry.icon ? { iconComponent: entry.icon } : undefined, parentName),
    ...toEntries(entry.children ?? [], `${parentName} > ${entry.title}`),
  ]);
}

export function createNavigationSettingsEntries(): NavigationRegistryEntry[] {
  return [
    ...toEntries(settingsNavigationEntries, 'Settings'),
    toEntry('Troubleshooting', '/troubleshooting/repair-connections', {
      faIcon: { definition: faCrosshairs, size: 'lg' },
    }),
  ];
}
