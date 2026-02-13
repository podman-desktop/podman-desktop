/**********************************************************************
 * Copyright (C) 2022-2026 Red Hat, Inc.
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

import type { CertificateInfo } from '@podman-desktop/core-api';
import type { Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

import type { CertificateSyncTargetInfo } from '/@api/certificate-sync-target';

import { EventStore } from './event-store';
import { findMatchInLeaves } from './search-util';

const windowEvents = ['extensions-started'];
const windowListeners = ['system-ready'];

async function checkForUpdate(_eventName: string): Promise<boolean> {
  return true;
}

export const certificatesInfos: Writable<CertificateInfo[]> = writable([]);

// use helper here as window methods are initialized after the store in tests
const listCertificates = (): Promise<CertificateInfo[]> => {
  return window.listCertificates();
};

export const certificatesEventStore = new EventStore<CertificateInfo[]>(
  'certificates',
  certificatesInfos,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listCertificates,
);
certificatesEventStore.setupWithDebounce();

export const searchPattern = writable('');

export const filtered = derived([searchPattern, certificatesInfos], ([$searchPattern, $certificatesInfos]) =>
  $certificatesInfos.filter(certificateInfo => findMatchInLeaves(certificateInfo, $searchPattern.toLowerCase())),
);

// Certificate sync targets store
export const certificateSyncTargets: Writable<CertificateSyncTargetInfo[]> = writable([]);

// use helper here as window methods are initialized after the store in tests
const getCertificateSyncTargets = (): Promise<CertificateSyncTargetInfo[]> => {
  return window.getCertificateSyncTargets();
};

// Sync targets need to update when extensions start/stop, targets change, or machine state changes
const syncTargetsWindowEvents = ['extensions-started', 'certificate-sync-targets-update'];

export const certificateSyncTargetsEventStore = new EventStore<CertificateSyncTargetInfo[]>(
  'certificate-sync-targets',
  certificateSyncTargets,
  checkForUpdate,
  syncTargetsWindowEvents,
  windowListeners,
  getCertificateSyncTargets,
);
certificateSyncTargetsEventStore.setupWithDebounce();
