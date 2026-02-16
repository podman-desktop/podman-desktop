/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import type { PodInfo } from '@podman-desktop/core-api';
import { derived, type Writable, writable } from 'svelte/store';

import PodIcon from '/@/lib/images/PodIcon.svelte';

import { EventStore } from './event-store';
import { findMatchInLeaves } from './search-util';

const windowEvents = [
  'extension-started',
  'extension-stopped',
  'container-stopped-event',
  'container-die-event',
  'container-kill-event',
  'container-init-event',
  'container-removed-event',
  'container-created-event',
  'container-started-event',
  'provider-change',
  'provider-container-connection-update-status',
  'pod-event',
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

export const podsInfos: Writable<PodInfo[]> = writable([]);

export const searchPattern = writable('');

export const filtered = derived([searchPattern, podsInfos], ([$searchPattern, $imagesInfos]) => {
  return $imagesInfos
    .filter(podInfo =>
      findMatchInLeaves(
        podInfo,
        $searchPattern
          .split(' ')
          .filter(pattern => !pattern.startsWith('is:'))
          .join(' ')
          .toLowerCase(),
      ),
    )
    .filter(pod => {
      if ($searchPattern.includes('is:running')) {
        return pod.Status === 'Running';
      }
      if ($searchPattern.includes('is:stopped')) {
        return pod.Status !== 'Running';
      }
      return true;
    });
});

const listPods = (): Promise<PodInfo[]> => {
  return window.listPods();
};

export const podsEventStore = new EventStore<PodInfo[]>(
  'pods',
  podsInfos,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listPods,
  PodIcon,
);
podsEventStore.setupWithDebounce();
