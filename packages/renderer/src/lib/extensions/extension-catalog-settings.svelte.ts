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

import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/**
 * Prototype-only settings for extension catalog UX (DTUX-2849).
 * Replace with real backend persistence when implementing in main/preload.
 */
const autoUpdateEnabled = new SvelteMap<string, boolean>();
const newlyInstalled = new SvelteSet<string>();

export function isAutoUpdateEnabled(extensionId: string): boolean {
  return autoUpdateEnabled.get(extensionId) ?? false;
}

export function setAutoUpdateEnabled(extensionId: string, enabled: boolean): void {
  autoUpdateEnabled.set(extensionId, enabled);
}

export function toggleAutoUpdate(extensionId: string): boolean {
  const next = !isAutoUpdateEnabled(extensionId);
  setAutoUpdateEnabled(extensionId, next);
  return next;
}

export function markNewlyInstalled(extensionId: string): void {
  newlyInstalled.add(extensionId);
}

export function isNewlyInstalled(extensionId: string): boolean {
  return newlyInstalled.has(extensionId);
}

export function clearNewBadge(extensionId: string): void {
  newlyInstalled.delete(extensionId);
}
