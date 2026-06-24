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

import { SvelteMap } from 'svelte/reactivity';

import type { CatalogViewMode } from './catalog-extension-info-ui';
import { onExtensionNewlyInstalled } from './extension-nav-pointer.svelte';

const NEW_BADGE_STORAGE_KEY = 'podman-desktop-extension-new-badges';
export const NEW_BADGE_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Prototype-only settings for extension catalog UX (DTUX-2849).
 * Replace with real backend persistence when implementing in main/preload.
 */
const autoUpdateEnabled = new SvelteMap<string, boolean>();

/** extension id -> installation timestamp (ms) */
export const newlyInstalledAt = new SvelteMap<string, number>();

// Catalog view mode preference (persists across tab switches)
let catalogViewModeState = $state<CatalogViewMode>('grid');

/** Bumped when new-badge membership changes so navigation tooltips can refresh. */
export const newBadgeRevision = $state<{ value: number }>({ value: 0 });

function bumpNewBadgeRevision(): void {
  newBadgeRevision.value += 1;
  import('/@/stores/navigation/navigation-registry-extension.svelte')
    .then(module => {
      module.refreshExtensionNavigationItems();
    })
    .catch((error: unknown) => {
      console.error('Unable to refresh extension navigation items', error);
    });
}

function readStoredNewBadges(): Record<string, number> {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(NEW_BADGE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

function persistNewBadges(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const payload: Record<string, number> = {};
  for (const [extensionId, installedAt] of newlyInstalledAt) {
    payload[extensionId] = installedAt;
  }
  localStorage.setItem(NEW_BADGE_STORAGE_KEY, JSON.stringify(payload));
}

function purgeExpiredNewBadges(now = Date.now()): void {
  let changed = false;
  for (const [extensionId, installedAt] of newlyInstalledAt) {
    if (now - installedAt >= NEW_BADGE_DURATION_MS) {
      newlyInstalledAt.delete(extensionId);
      changed = true;
    }
  }
  if (changed) {
    bumpNewBadgeRevision();
  }
}

function hydrateNewBadgesFromStorage(): void {
  const now = Date.now();
  for (const [extensionId, installedAt] of Object.entries(readStoredNewBadges())) {
    if (typeof installedAt === 'number' && now - installedAt < NEW_BADGE_DURATION_MS) {
      newlyInstalledAt.set(extensionId, installedAt);
    }
  }
}

hydrateNewBadgesFromStorage();

let expiryTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleNewBadgeExpiryCheck(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (expiryTimer !== undefined) {
    clearTimeout(expiryTimer);
    expiryTimer = undefined;
  }

  const now = Date.now();
  let nextExpiryMs: number | undefined;

  for (const installedAt of newlyInstalledAt.values()) {
    const remaining = installedAt + NEW_BADGE_DURATION_MS - now;
    if (remaining <= 0) {
      purgeExpiredNewBadges();
      persistNewBadges();
      scheduleNewBadgeExpiryCheck();
      return;
    }
    nextExpiryMs = nextExpiryMs === undefined ? remaining : Math.min(nextExpiryMs, remaining);
  }

  if (nextExpiryMs === undefined) {
    return;
  }

  expiryTimer = setTimeout(() => {
    expiryTimer = undefined;
    purgeExpiredNewBadges();
    persistNewBadges();
    scheduleNewBadgeExpiryCheck();
  }, nextExpiryMs + 50);
}

scheduleNewBadgeExpiryCheck();

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

export function getNewBadgeInstalledAt(extensionId: string): number | undefined {
  const installedAt = newlyInstalledAt.get(extensionId);
  if (installedAt === undefined) {
    return undefined;
  }
  if (Date.now() - installedAt >= NEW_BADGE_DURATION_MS) {
    clearNewBadge(extensionId);
    return undefined;
  }
  return installedAt;
}

export function isNewBadgeActive(extensionId: string): boolean {
  return getNewBadgeInstalledAt(extensionId) !== undefined;
}

export function markNewlyInstalled(extensionId: string): void {
  newlyInstalledAt.set(extensionId, Date.now());
  persistNewBadges();
  bumpNewBadgeRevision();
  scheduleNewBadgeExpiryCheck();
  onExtensionNewlyInstalled(extensionId);
}

export function clearNewBadge(extensionId: string): void {
  if (!newlyInstalledAt.has(extensionId)) {
    return;
  }
  newlyInstalledAt.delete(extensionId);
  persistNewBadges();
  bumpNewBadgeRevision();
  scheduleNewBadgeExpiryCheck();
}

export function getCatalogViewMode(): CatalogViewMode {
  return catalogViewModeState;
}

export function setCatalogViewMode(mode: CatalogViewMode): void {
  catalogViewModeState = mode;
}

export function refreshNewBadges(): void {
  purgeExpiredNewBadges();
  persistNewBadges();
  scheduleNewBadgeExpiryCheck();
}

export function isExtensionPinnedRow(_extensionId: string, _userSortApplied: boolean): boolean {
  return false;
}
