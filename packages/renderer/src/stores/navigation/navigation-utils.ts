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

import type { DragPayload } from '@podman-desktop/core-api';

import type { NavigationRegistryEntry } from './navigation-registry';

export class NavigationUtils {
  qualifyName(groupName: string | undefined, name: string): string {
    return groupName ? `${groupName} > ${name}` : name;
  }

  getNavigationDragName(payload: DragPayload): string {
    return this.qualifyName(payload.parentName, payload.name);
  }

  flattenNavigationEntries(entries: NavigationRegistryEntry[]): NavigationRegistryEntry[] {
    const flat: NavigationRegistryEntry[] = [];
    for (const entry of entries) {
      if (entry.items && entry.type === 'group') {
        flat.push(...entry.items);
      } else if (entry.type === 'submenu') {
        flat.push(entry);
        for (const child of entry.items ?? []) {
          if (child.index !== undefined) {
            const name = this.qualifyName(entry.name, child.name);
            flat.push({ ...child, name, tooltip: name });
          }
        }
      } else {
        flat.push(entry);
      }
    }
    return flat;
  }

  findNavigationEntryByLink(entries: NavigationRegistryEntry[], link: string): NavigationRegistryEntry | undefined {
    for (const entry of entries) {
      if (entry.link === link) {
        return entry;
      }
      const child = this.findNavigationEntryByLink(entry.items ?? [], link);
      if (child) {
        return child;
      }
    }
    return undefined;
  }
}
