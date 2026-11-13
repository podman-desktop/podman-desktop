/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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

import type { Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';
import { VolumeUtils } from '/@/lib/volume/volume-utils';
import type { VolumeInfoUI } from '/@/lib/volume/VolumeInfoUI';

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
  'volume-event',
  'extensions-started',
];
const windowListeners = ['extensions-already-started'];

let readyToUpdate = false;

async function checkForUpdate(eventName: string): Promise<boolean> {
  if ('extensions-already-started' === eventName) {
    readyToUpdate = true;
  }

  // do not fetch until extensions are all started
  return readyToUpdate;
}

export const volumeListInfos: Writable<VolumeInfoUI[]> = writable([]);

const volumeUtils = new VolumeUtils();

// use helper here as window methods are initialized after the store in tests
const listVolumes = async (...args: unknown[]): Promise<VolumeInfoUI[]> => {
  const fetchUsage = args?.length > 0 && args[0] === 'fetchUsage';

  return (await window.listVolumes(fetchUsage))
    .map(volumeListInfo => volumeListInfo.Volumes)
    .flat()
    .map(volume => volumeUtils.toVolumeInfoUI(volume));
};

export function setVolumeStatus(engineId: string, volumeName: string, status: VolumeInfoUI['status']): void {
  volumeListInfos.update(volumes =>
    volumes.map(volume =>
      volume.name === volumeName && volume.engineId === engineId ? { ...volume, status } : volume,
    ),
  );
}

export const volumesEventStore = new EventStore<VolumeInfoUI[]>(
  'volumes',
  volumeListInfos,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listVolumes,
  VolumeIcon,
);
const volumesEventStoreInfo = volumesEventStore.setupWithDebounce();

export const searchPattern = writable('');

export const filtered = derived([searchPattern, volumeListInfos], ([$searchPattern, $volumeListInfos]) =>
  $volumeListInfos.filter(volume => findMatchInLeaves(volume, $searchPattern.toLowerCase())),
);

export const fetchVolumesWithData = async (): Promise<void> => {
  await volumesEventStoreInfo.fetch('fetchUsage');
};
