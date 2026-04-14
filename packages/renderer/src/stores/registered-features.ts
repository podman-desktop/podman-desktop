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

import { type Writable, writable } from 'svelte/store';

import { EventStore } from './event-store';

const windowEvents = ['feature-registry:features-updated'];
const windowListeners = ['system-ready'];

async function checkForUpdate(): Promise<boolean> {
  return true;
}

export const registeredFeatures: Writable<string[]> = writable([]);

// use helper here as window methods are initialized after the store in tests
const getRegisteredFeatures = async (): Promise<string[]> => {
  return window.getRegisteredFeatures();
};

export const registeredFeaturesEventStore = new EventStore<string[]>(
  'registered features',
  registeredFeatures,
  checkForUpdate,
  windowEvents,
  windowListeners,
  getRegisteredFeatures,
);
export const registeredFeaturesEventStoreInfo = registeredFeaturesEventStore.setup();

class RegisteredFeaturesChange extends EventTarget {}
export const onDidChangeRegisteredFeatures = new RegisteredFeaturesChange();

class RegisteredFeaturesChangeEvent extends CustomEvent<boolean> {
  constructor(featureName: string, enabled: boolean) {
    super(featureName, { detail: enabled });
  }
}

let previousFeatures = new Set<string>();

export function setupRegisteredFeaturesListener(): void {
  previousFeatures = new Set<string>();
  window.events?.receive('feature-registry:features-updated', features => {
    const current = new Set(features);

    for (const feature of current) {
      if (!previousFeatures.has(feature)) {
        onDidChangeRegisteredFeatures.dispatchEvent(new RegisteredFeaturesChangeEvent(feature, true));
      }
    }

    for (const feature of previousFeatures) {
      if (!current.has(feature)) {
        onDidChangeRegisteredFeatures.dispatchEvent(new RegisteredFeaturesChangeEvent(feature, false));
      }
    }

    previousFeatures = current;
  });
}

setupRegisteredFeaturesListener();
