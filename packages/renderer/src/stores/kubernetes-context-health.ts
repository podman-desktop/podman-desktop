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

import { type Writable, writable } from 'svelte/store';

import type { ContextHealth } from '/@api/kubernetes-contexts-healths';

import { EventStore } from './event-store';

const windowEvents = ['kubernetes-contexts-healths', 'extension-stopped', 'extensions-started'];
const windowListeners = ['extensions-already-started'];

let readyToUpdate = false;

export async function checkForUpdate(eventName: string): Promise<boolean> {
  // check for update only in experimental states mode
  const enabled = await window.isExperimentalConfigurationEnabled('kubernetes.statesExperimental');
  if (!enabled) {
    return false;
  }

  if ('extensions-already-started' === eventName) {
    readyToUpdate = true;
  }
  // do not fetch until extensions are all started
  return readyToUpdate;
}

export const kubernetesContextsHealths: Writable<ContextHealth[]> = writable([]);

// use helper here as window methods are initialized after the store in tests
const listContextsHealths = (): Promise<ContextHealth[]> => {
  return window.kubernetesGetContextsHealths();
};

export const kubernetesContextsHealthsStore = new EventStore<ContextHealth[]>(
  'contexts healths',
  kubernetesContextsHealths,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listContextsHealths,
);
kubernetesContextsHealthsStore.setup();
