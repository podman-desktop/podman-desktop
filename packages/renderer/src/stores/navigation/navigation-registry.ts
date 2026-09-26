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
import { get, type Writable, writable } from 'svelte/store';
import type { IconSize } from 'svelte-fa';

import PreferencesIcon from '/@/lib/images/PreferencesIcon.svelte';
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
  name: string;
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
  values.push(...createNavigationSettingsEntries(get(configurationProperties)));
};

function collectItem(navigationRegistryEntry: NavigationRegistryEntry, items: DisplayItem[], groupName?: string): void {
  if (navigationRegistryEntry.items && navigationRegistryEntry.type === 'group') {
    navigationRegistryEntry.items.forEach(item => {
      collectItem(item, items, groupName);
    });
  } else if (navigationRegistryEntry.items && navigationRegistryEntry.type === 'submenu') {
    navigationRegistryEntry.items.forEach(item => {
      collectItem(item, items, navigationRegistryEntry.name);
    });
  }

  const displayName = navigationUtils.qualifyName(groupName, navigationRegistryEntry.name);
  const isPromotedName = groupName !== undefined || navigationRegistryEntry.parentName !== undefined;

  if (navigationRegistryEntry.index === undefined && !isPromotedName) {
    return;
  }

  if (items.find(i => i.name === displayName)) {
    return;
  }

  items.push({
    name: displayName,
    visible: !navigationRegistryEntry.hidden,
    index: navigationRegistryEntry.index,
  });
}

// use helper here as window methods are initialized after the store in tests
const grabList = async (): Promise<NavigationRegistryEntry[]> => {
  if (!initialized) {
    init();
    initialized = true;
    await syncKubernetesGroup();
    const migratedOrder = migrateItemOrder(itemOrder);
    if (migratedOrder.some((item, index) => item !== itemOrder[index])) {
      itemOrder = migratedOrder;
      window.updateConfigurationValue('navbar.itemOrder', migratedOrder)?.catch(console.error);
    }
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

function migrateItemOrder(order: string[]): string[] {
  const linksToNames = new Map<string, string>();
  const collectNames = (entries: NavigationRegistryEntry[], parentName?: string): void => {
    for (const entry of entries) {
      const fullName = entry.name.includes(' > ')
        ? entry.name
        : navigationUtils.qualifyName(parentName ?? entry.parentName, entry.name);
      linksToNames.set(entry.link, fullName);
      collectNames(entry.items ?? [], entry.type === 'submenu' ? fullName : parentName);
    }
  };
  collectNames(values);

  return order.map(identifier => linksToNames.get(identifier) ?? identifier);
}

function promoteToNavbar({ parentName, name, link }: DragPayload): void {
  if (!navigationUtils.findNavigationEntryByLink(values, link)) {
    const fullName = parentName ? `${parentName} > ${name}` : name;
    values.push({
      name: fullName,
      icon: { iconComponent: PreferencesIcon },
      tooltip: fullName,
      link,
      type: 'entry',
      counter: 0,
      destinations: [],
    });
  }
}

export function pinToNavbar(payload: DragPayload): number {
  const existingEntry = navigationUtils.findNavigationEntryByLink(values, payload.link);
  const identifier = existingEntry?.name.includes(' > ')
    ? existingEntry.name
    : navigationUtils.qualifyName(payload.parentName, payload.name);

  const currentEntries = navigationUtils
    .flattenNavigationEntries(values)
    .filter(entry => !entry.hidden && entry.index !== undefined);
  const currentOrder = currentEntries
    .map(entry => entry.name)
    .filter((entry, index, all) => all.indexOf(entry) === index);
  const existingIndex = currentOrder.indexOf(identifier);
  if (existingIndex !== -1) {
    return existingIndex + 1;
  }

  const order = [identifier, ...currentOrder];
  setNavigationItemOrder(order, existingEntry ? undefined : payload);
  return 1;
}

function clearIndices(navigationRegistryEntry: NavigationRegistryEntry): void {
  navigationRegistryEntry.index = undefined;
  for (const item of navigationRegistryEntry.items ?? []) {
    clearIndices(item);
  }
}

function applyConfiguredIndices(navigationRegistryEntry: NavigationRegistryEntry, parentName?: string): void {
  const name = navigationRegistryEntry.name.includes(' > ')
    ? navigationRegistryEntry.name
    : navigationUtils.qualifyName(parentName ?? navigationRegistryEntry.parentName, navigationRegistryEntry.name);
  const index = itemOrder.indexOf(name);
  navigationRegistryEntry.index = index === -1 ? undefined : index;

  const childParentName = navigationRegistryEntry.type === 'submenu' ? name : parentName;
  for (const item of navigationRegistryEntry.items ?? []) {
    applyConfiguredIndices(item, childParentName);
  }
}

/** When itemOrder is empty, top-level (non-settings) entries get contiguous 0..n-1. */
function assignDefaultIndices(): void {
  let next = 0;
  for (const entry of values) {
    if (entry.parentName !== undefined) {
      continue;
    }
    entry.index = next++;
  }
}

function hideSingleItem(navigationRegistryEntry: NavigationRegistryEntry): void {
  if (hiddenItems?.includes(navigationRegistryEntry.name)) {
    navigationRegistryEntry.hidden = true;
  } else if (navigationRegistryEntry.parentName !== undefined) {
    navigationRegistryEntry.hidden = navigationRegistryEntry.index === undefined;
  } else {
    navigationRegistryEntry.hidden = false;
  }

  // iterate on all the items
  if (navigationRegistryEntry.items) {
    navigationRegistryEntry.items.forEach(item => {
      hideSingleItem(item);
    });
  }
}

async function hideItems(): Promise<void> {
  // for each item, set the hidden property to true
  values.forEach(item => {
    clearIndices(item);
  });

  if (itemOrder.length > 0) {
    values.forEach(item => {
      applyConfiguredIndices(item);
    });
  } else {
    assignDefaultIndices();
  }

  values.forEach(item => {
    hideSingleItem(item);
  });

  // send to the main side the list of all items, items being displayed or hidden
  const navItems: DisplayItem[] = [];
  values.forEach(item => {
    collectItem(item, navItems);
  });

  await window.sendNavigationItems(navItems);
  values = [...values];
  navigationRegistry.set(values);
}

// Update navbar item order in-memory and persist (avoids stale UI before config round-trip).
export function setNavigationItemOrder(ids: string[], pinPayload?: DragPayload): void {
  if (pinPayload) {
    promoteToNavbar(pinPayload);
  }
  itemOrder = ids;
  hideItems().catch((err: unknown) => console.error('Error applying navigation item order', err));
  window.updateConfigurationValue('navbar.itemOrder', ids)?.catch(console.error);
}

// update the items by looking at the disabled items each time we update the configuration properties
configurationProperties.subscribe(properties => {
  if (window.getConfigurationValue) {
    if (initialized) {
      values = values.filter(item => item.parentName !== 'Settings');
      values.push(...createNavigationSettingsEntries(properties));
    }
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
        const migratedOrder = migrateItemOrder(value ?? []);
        itemOrder = migratedOrder;
        if (migratedOrder.some((item, index) => item !== value?.[index])) {
          window.updateConfigurationValue('navbar.itemOrder', migratedOrder)?.catch(console.error);
        }
      })
      .then(() => hideItems())
      .catch((err: unknown) => console.error('Error getting configuration value navbar.itemOrder', err));

    handleKubernetesGroup();
  }
});

async function syncKubernetesGroup(): Promise<void> {
  const value = await window.getConfigurationValue<boolean>('kubernetes.useInternalKubernetes');
  if (value) {
    if (!values.find(item => item.name === 'Kubernetes')) {
      const extensionsIndex = values.findIndex(item => item.name === 'Extensions');
      if (extensionsIndex !== -1) {
        values.splice(extensionsIndex, 0, createNavigationKubernetesGroup());
      }
    }
  } else {
    values = values.filter(item => item.name !== 'Kubernetes');
  }
}

function handleKubernetesGroup(): void {
  syncKubernetesGroup()
    .then(() => hideItems())
    .catch((err: unknown) => {
      console.error('Error getting configuration value kubernetes.useInternalKubernetes', err);
    });
}
