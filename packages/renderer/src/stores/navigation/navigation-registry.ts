/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import type { DisplayItem, DragPayload, GoToInfo } from '@podman-desktop/core-api';
import type { Component } from 'svelte';
import { type Writable, writable } from 'svelte/store';
import type { IconSize } from 'svelte-fa';

import { configurationProperties } from '/@/stores/configurationProperties';
import { EventStore } from '/@/stores/event-store';

import { createNavigationContainerEntry } from './navigation-registry-container.svelte';
import { createNavigationExtensionEntry, createNavigationExtensionGroup } from './navigation-registry-extension.svelte';
import { createNavigationImageEntry } from './navigation-registry-image.svelte';
import { createNavigationKubernetesGroup } from './navigation-registry-kubernetes.svelte';
import { createNavigationNetworkEntry } from './navigation-registry-network.svelte';
import { createNavigationPodEntry } from './navigation-registry-pod.svelte';
import { createNavigationSecretEntry } from './navigation-registry-secret.svelte';
import { createNavigationSettingsEntries } from './navigation-registry-settings.svelte';
import { createNavigationVolumeEntry } from './navigation-registry-volume.svelte';
import { NavigationUtils } from './navigation-utils';

export interface NavigationRegistryEntry {
  /** The entry's short display name, without its parent's name. */
  name: string;
  /** The parent name, composed with `name` only when a qualified label or identifier is needed. */
  parentName?: string;
  icon: {
    iconImage?: string | { readonly light: string; readonly dark: string };
    iconComponent?: Component;
    faIcon?: { definition: IconDefinition; size: IconSize };
  };
  tooltip: string;
  link: string;
  counter: number;
  destinations: Array<GoToInfo>;
  type: 'entry' | 'group' | 'submenu';
  enabled?: boolean;
  items?: NavigationRegistryEntry[];
  hidden?: boolean;
  index?: number;
}

const windowEvents: string[] = [];
const windowListeners = ['extensions-already-started', 'system-ready'];

export const navigationRegistry: Writable<NavigationRegistryEntry[]> = writable([]);
const navigationUtils = new NavigationUtils();

let hiddenItems: string[] = [];
let itemOrder: string[] = [];

let values: NavigationRegistryEntry[] = [];
let initialized = false;
const init = (): void => {
  values.push(createNavigationContainerEntry());
  values.push(createNavigationPodEntry());
  values.push(createNavigationImageEntry());
  values.push(createNavigationVolumeEntry());
  values.push(createNavigationNetworkEntry());
  values.push(createNavigationSecretEntry());
  values.push(createNavigationExtensionEntry());
  values.push(createNavigationExtensionGroup());
  values.push(...createNavigationSettingsEntries());
  handleKubernetesGroup();
  hideItems().catch((err: unknown) => console.error('Error hiding navigation items', err));
};

function collecItem(entry: NavigationRegistryEntry, items: DisplayItem[], parentName?: string): void {
  const resolvedParentName = parentName ?? entry.parentName;
  const name = navigationUtils.formatNavigationName(entry.name, resolvedParentName);
  if (entry.items) {
    const childParentName = entry.type === 'submenu' ? name : resolvedParentName;
    entry.items.forEach(child => collecItem(child, items, childParentName));
  }
  if (entry.type === 'group' || (entry.index === undefined && resolvedParentName === undefined)) {
    return;
  }
  if (items.some(item => item.name === name)) {
    return;
  }
  items.push({ name, link: entry.link, visible: !entry.hidden, index: entry.index });
}

// use helper here as window methods are initialized after the store in tests
const grabList = async (): Promise<NavigationRegistryEntry[]> => {
  if (!initialized) {
    init();
    initialized = true;
  }

  // override hidden property
  await hideItems();
  return values;
};

const navigationRegistryEventStore = new EventStore<NavigationRegistryEntry[]>(
  'navigation-registry',
  navigationRegistry,
  // should initialize when app is initializing
  () => Promise.resolve(true),
  windowEvents,
  windowListeners,
  grabList,
);
const navigationRegistryEventStoreInfo = navigationRegistryEventStore.setup();

export const fetchNavigationRegistries = async (): Promise<void> => {
  await navigationRegistryEventStoreInfo.fetch();
};

export function pinToNavbar(payload: DragPayload): number | undefined {
  const entry = navigationUtils.findNavigationEntryByLink(values, payload.link);
  if (!entry) {
    return undefined;
  }
  const identifier = navigationUtils.formatNavigationName(entry.name, entry.parentName);

  const currentEntries = navigationUtils.getVisibleOrderedEntries(values);
  const currentOrder = currentEntries
    .map(entry => navigationUtils.formatNavigationName(entry.name, entry.parentName))
    .filter((entry, index, all) => all.indexOf(entry) === index);
  const existingIndex = currentOrder.indexOf(identifier);
  if (existingIndex !== -1) {
    return existingIndex + 1;
  }

  const order = [identifier, ...currentOrder];
  setNavigationItemOrder(order, entry);
  return 1;
}

function assignNavigationIndices(
  navigationRegistryEntry: NavigationRegistryEntry,
  order: string[],
  parentName?: string,
): void {
  const itemOrderName = navigationUtils.formatNavigationName(
    navigationRegistryEntry.name,
    parentName ?? navigationRegistryEntry.parentName,
  );
  const index = order.indexOf(itemOrderName);
  navigationRegistryEntry.index = index === -1 ? undefined : index;

  const childParentName =
    navigationRegistryEntry.type === 'submenu' ? itemOrderName : (parentName ?? navigationRegistryEntry.parentName);
  for (const item of navigationRegistryEntry.items ?? []) {
    assignNavigationIndices(item, order, childParentName);
  }
}

function hideSingleItem(navigationRegistryEntry: NavigationRegistryEntry, parentName?: string): void {
  const itemOrderName = navigationUtils.formatNavigationName(
    navigationRegistryEntry.name,
    parentName ?? navigationRegistryEntry.parentName,
  );
  if (hiddenItems?.includes(itemOrderName)) {
    navigationRegistryEntry.hidden = true;
  } else if (parentName !== undefined || navigationRegistryEntry.parentName !== undefined) {
    navigationRegistryEntry.hidden = navigationRegistryEntry.index === undefined;
  } else {
    navigationRegistryEntry.hidden = false;
  }

  // iterate on all the items
  if (navigationRegistryEntry.items) {
    navigationRegistryEntry.items.forEach(item => {
      const childParentName =
        navigationRegistryEntry.type === 'submenu' ? itemOrderName : (parentName ?? navigationRegistryEntry.parentName);
      hideSingleItem(item, childParentName);
    });
  }
}

async function hideItems(): Promise<void> {
  const defaultOrder = navigationUtils
    .flattenNavigationEntries(values)
    .filter(entry => entry.parentName === undefined)
    .map(entry => entry.name);
  const order = [...itemOrder, ...defaultOrder.filter(name => !itemOrder.includes(name))];
  values.forEach(item => assignNavigationIndices(item, order));

  values.forEach(item => {
    hideSingleItem(item);
  });

  // send to the main side the list of all items, items being displayed or hidden
  const navItems: DisplayItem[] = [];
  values.forEach(item => {
    collecItem(item, navItems);
  });

  await window.sendNavigationItems(navItems);
  values = [...values];
  navigationRegistry.set(values);
}

// Update navbar item order in-memory and persist (avoids stale UI before config round-trip).
export function setNavigationItemOrder(ids: string[], pinPayload?: DragPayload): void {
  if (pinPayload && !navigationUtils.findNavigationEntryByLink(values, pinPayload.link)) {
    return;
  }
  // The UI submits visible entries. Preserve the slots belonging to hidden or unavailable entries.
  const visibleNames = navigationUtils
    .getVisibleOrderedEntries(values)
    .map(entry => navigationUtils.formatNavigationName(entry.name, entry.parentName));
  const currentOrder = [...itemOrder, ...visibleNames.filter(name => !itemOrder.includes(name))];
  let next = 0;
  const order = currentOrder.flatMap(name => {
    if (visibleNames.includes(name) || ids.includes(name)) {
      return next < ids.length ? [ids[next++]] : [];
    }
    return [name];
  });
  itemOrder = ids.length > 0 ? [...order, ...ids.slice(next)] : [];
  hideItems().catch((err: unknown) => console.error('Error applying navigation item order', err));
  window.updateConfigurationValue('navbar.itemOrder', itemOrder)?.catch(console.error);
}

// update the items by looking at the disabled items each time we update the configuration properties
configurationProperties.subscribe(() => {
  if (window.getConfigurationValue) {
    window
      .getConfigurationValue<string[]>('navbar.disabledItems')
      ?.then(value => {
        if (value) {
          hiddenItems = value;
        }
      })
      .then(() => hideItems())
      .catch((err: unknown) => console.error('Error getting configuration value navbar.disabledItems', err));

    window
      .getConfigurationValue<string[]>('navbar.itemOrder')
      ?.then(value => {
        itemOrder = value ?? [];
      })
      .then(() => hideItems())
      .catch((err: unknown) => console.error('Error getting configuration value navbar.itemOrder', err));

    handleKubernetesGroup();
  }
});

function handleKubernetesGroup(): void {
  window
    .getConfigurationValue<boolean>('kubernetes.useInternalKubernetes')
    ?.then(value => {
      if (value) {
        if (!values.find(item => item.name === 'Kubernetes' && item.parentName === undefined)) {
          const extensionsIndex = values.findIndex(item => item.name === 'Extensions');
          if (extensionsIndex !== -1) {
            values.splice(extensionsIndex, 0, createNavigationKubernetesGroup());
          }
        }
      } else {
        values = values.filter(item => item.name !== 'Kubernetes' || item.parentName !== undefined);
      }
    })
    .then(() => hideItems())
    .catch((err: unknown) => {
      console.error('Error getting configuration value kubernetes.useInternalKubernetes', err);
    });
}
