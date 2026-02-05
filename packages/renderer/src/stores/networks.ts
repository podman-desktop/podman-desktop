/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import type { Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

import type { NetworkInspectInfo } from '/@api/network-info';

import { EventStore } from './event-store';
import { findMatchInLeaves } from './search-util';

const windowEvents = [
  'extension-started',
  'extension-stopped',
  'provider-change',
  'provider-container-connection-update-status',
  'container-stopped-event',
  'container-die-event',
  'container-kill-event',
  'container-init-event',
  'container-created-event',
  'container-started-event',
  'container-removed-event',
  'network-event',
  'extensions-started',
];
const windowListeners = ['extensions-already-started'];

let readyToUpdate = false;

async function checkForUpdate(eventName: string): Promise<boolean> {
  if ('extensions-already-started' === eventName) {
    readyToUpdate = true;
  }

  return readyToUpdate;
}

export const networksListInfo: Writable<NetworkInspectInfo[]> = writable([]);

const listNetworks = (): Promise<NetworkInspectInfo[]> => {
  return window.listNetworks();
};

export const networksEventStore = new EventStore<NetworkInspectInfo[]>(
  'networks',
  networksListInfo,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listNetworks,
  ContainerIcon,
);
networksEventStore.setupWithDebounce();

export const searchPattern = writable('');

export const filtered = derived([searchPattern, networksListInfo], ([$searchPattern, $networksList]) =>
  $networksList.filter(network => findMatchInLeaves(network, $searchPattern.toLowerCase())),
);
