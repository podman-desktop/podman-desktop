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

import type { CatalogViewMode } from './catalog-extension-info-ui';

/**
 * Prototype-only settings for extension catalog UX (DTUX-2849).
 * Replace with real backend persistence when implementing in main/preload.
 */
const autoUpdateEnabled = new SvelteMap<string, boolean>();

// Use SvelteSet for reactivity - components will re-render when this changes
export const newlyInstalled = new SvelteSet<string>();

// Catalog view mode preference (persists across tab switches)
export const catalogViewMode = $state<{ mode: CatalogViewMode }>({ mode: 'grid' });

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
  console.log(`[DTUX-2854] markNewlyInstalled called for: ${extensionId}`);
  newlyInstalled.add(extensionId);
  console.log(`[DTUX-2854] newlyInstalled set now contains:`, Array.from(newlyInstalled));
  console.log(`[DTUX-2854] Set size:`, newlyInstalled.size);
}

export function isNewlyInstalled(extensionId: string): boolean {
  // Access the set directly to trigger reactivity
  const result = newlyInstalled.has(extensionId);
  console.log(`[DTUX-2854] isNewlyInstalled(${extensionId}): ${result}, set size: ${newlyInstalled.size}`);
  return result;
}

export function clearNewBadge(extensionId: string): void {
  console.log(`[DTUX-2854] clearNewBadge called for: ${extensionId}`);
  newlyInstalled.delete(extensionId);
}

export function getCatalogViewMode(): CatalogViewMode {
  return catalogViewMode.mode;
}

export function setCatalogViewMode(mode: CatalogViewMode): void {
  catalogViewMode.mode = mode;
}
