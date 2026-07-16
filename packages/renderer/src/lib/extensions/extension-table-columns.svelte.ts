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

import { type ListOrganizerItem, tablePersistence } from '@podman-desktop/ui-svelte';
import { SvelteMap } from 'svelte/reactivity';

export type CatalogTableColumnId = 'Publisher' | 'Version' | 'Status';
export type InstalledTableColumnId = 'Version' | 'Status';

const CATALOG_KIND = 'catalog-extension';
const INSTALLED_KIND = 'installed-extension';

const CATALOG_DEFAULT: ListOrganizerItem[] = [
  { id: 'Publisher', label: 'Publisher', enabled: true, originalOrder: 0 },
  { id: 'Version', label: 'Version', enabled: true, originalOrder: 1 },
  { id: 'Status', label: 'Status', enabled: true, originalOrder: 2 },
];

const INSTALLED_DEFAULT: ListOrganizerItem[] = [
  { id: 'Version', label: 'Version', enabled: true, originalOrder: 0 },
  { id: 'Status', label: 'Status', enabled: true, originalOrder: 1 },
];

export const catalogTableColumnItems = $state<ListOrganizerItem[]>([...CATALOG_DEFAULT]);
export const catalogTableColumnOrdering = new SvelteMap<string, number>();

export const installedTableColumnItems = $state<ListOrganizerItem[]>([...INSTALLED_DEFAULT]);
export const installedTableColumnOrdering = new SvelteMap<string, number>();

/** Columns the user explicitly enabled via the organizer (bypass viewport auto-hide). */
const catalogUserForcedVisible = new Set<string>();
const installedUserForcedVisible = new Set<string>();

/** Viewport flags for responsive column hiding (suggestion scope). */
export const extensionTableViewport = $state({
  hidePublisher: false,
  hideVersion: false,
  /** Custom/local tab: hide Origin (Type) on narrow viewports. */
  hideOrigin: false,
  /** Custom/local tab: hide Status on very small viewports. */
  hideStatus: false,
  /** Installed tab: shrink Status so Name can grow; status text truncates with ellipsis. */
  compactInstalledStatus: false,
});

let viewportListenersReady = false;

export function ensureExtensionTableViewportListeners(): void {
  if (viewportListenersReady || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }
  viewportListenersReady = true;

  const publisherMq = window.matchMedia('(max-width: 1279px)');
  const versionMq = window.matchMedia('(max-width: 1023px)');
  const originMq = window.matchMedia('(max-width: 1023px)');
  const statusMq = window.matchMedia('(max-width: 767px)');
  const compactInstalledStatusMq = window.matchMedia('(max-width: 1023px)');

  const sync = (): void => {
    extensionTableViewport.hidePublisher = publisherMq.matches;
    extensionTableViewport.hideVersion = versionMq.matches;
    extensionTableViewport.hideOrigin = originMq.matches;
    extensionTableViewport.hideStatus = statusMq.matches;
    extensionTableViewport.compactInstalledStatus = compactInstalledStatusMq.matches;
  };
  sync();
  publisherMq.addEventListener('change', sync);
  versionMq.addEventListener('change', sync);
  originMq.addEventListener('change', sync);
  statusMq.addEventListener('change', sync);
  compactInstalledStatusMq.addEventListener('change', sync);
}

function isColumnEnabled(items: ListOrganizerItem[], id: string): boolean {
  return items.find(item => item.id === id)?.enabled !== false;
}

/** User-enabled and not auto-hidden by viewport (unless user forced the column on). */
export function isCatalogTableColumnVisible(id: CatalogTableColumnId): boolean {
  if (!isColumnEnabled(catalogTableColumnItems, id)) {
    return false;
  }
  if (catalogUserForcedVisible.has(id)) {
    return true;
  }
  if (id === 'Publisher' && extensionTableViewport.hidePublisher) {
    return false;
  }
  if (id === 'Version' && extensionTableViewport.hideVersion) {
    return false;
  }
  return true;
}

export function isInstalledTableColumnVisible(id: InstalledTableColumnId): boolean {
  if (!isColumnEnabled(installedTableColumnItems, id)) {
    return false;
  }
  if (installedUserForcedVisible.has(id)) {
    return true;
  }
  if (id === 'Version' && extensionTableViewport.hideVersion) {
    return false;
  }
  return true;
}

async function loadColumnConfig(kind: string, defaults: ListOrganizerItem[]): Promise<ListOrganizerItem[]> {
  if (!tablePersistence.storage) {
    return defaults.map(item => ({ ...item }));
  }
  const names = defaults.map(item => item.id);
  const loaded = await tablePersistence.storage.load(kind, names);
  if (loaded.length === 0) {
    return defaults.map(item => ({ ...item }));
  }

  // Preserve persisted sequence (drag order), then append any new default columns.
  const defaultById = new Map(defaults.map(item => [item.id, item]));
  const result: ListOrganizerItem[] = [];
  for (const loadedItem of loaded) {
    const defaultItem = defaultById.get(loadedItem.id);
    if (!defaultItem) {
      continue;
    }
    result.push({
      ...defaultItem,
      enabled: loadedItem.enabled ?? defaultItem.enabled,
      originalOrder: defaultItem.originalOrder,
    });
  }
  for (const defaultItem of defaults) {
    if (!result.some(item => item.id === defaultItem.id)) {
      result.push({ ...defaultItem });
    }
  }
  return result;
}

async function saveColumnConfig(kind: string, items: ListOrganizerItem[]): Promise<void> {
  if (!tablePersistence.storage) {
    return;
  }
  await tablePersistence.storage.save(
    kind,
    items.map(item => ({
      id: item.id,
      label: item.label,
      enabled: item.enabled,
      originalOrder: item.originalOrder,
    })),
  );
}

function restoreOrderingFromItems(items: ListOrganizerItem[], ordering: SvelteMap<string, number>): void {
  ordering.clear();
  const reordered = items.some((item, index) => item.originalOrder !== index);
  if (!reordered) {
    return;
  }
  items.forEach((item, index) => {
    ordering.set(item.id, index);
  });
}

export async function initCatalogTableColumns(): Promise<void> {
  ensureExtensionTableViewportListeners();
  const loaded = await loadColumnConfig(CATALOG_KIND, CATALOG_DEFAULT);
  catalogTableColumnItems.splice(0, catalogTableColumnItems.length, ...loaded);
  restoreOrderingFromItems(catalogTableColumnItems, catalogTableColumnOrdering);
}

export async function initInstalledTableColumns(): Promise<void> {
  ensureExtensionTableViewportListeners();
  const loaded = await loadColumnConfig(INSTALLED_KIND, INSTALLED_DEFAULT);
  installedTableColumnItems.splice(0, installedTableColumnItems.length, ...loaded);
  restoreOrderingFromItems(installedTableColumnItems, installedTableColumnOrdering);
}

export function handleCatalogColumnToggle(itemId: string, enabled: boolean): void {
  const index = catalogTableColumnItems.findIndex(item => item.id === itemId);
  if (index < 0) {
    return;
  }
  catalogTableColumnItems[index] = { ...catalogTableColumnItems[index], enabled };
  if (enabled) {
    catalogUserForcedVisible.add(itemId);
  } else {
    catalogUserForcedVisible.delete(itemId);
  }
  saveColumnConfig(CATALOG_KIND, catalogTableColumnItems).catch((error: unknown) => {
    console.error(error);
  });
}

export function handleInstalledColumnToggle(itemId: string, enabled: boolean): void {
  const index = installedTableColumnItems.findIndex(item => item.id === itemId);
  if (index < 0) {
    return;
  }
  installedTableColumnItems[index] = { ...installedTableColumnItems[index], enabled };
  if (enabled) {
    installedUserForcedVisible.add(itemId);
  } else {
    installedUserForcedVisible.delete(itemId);
  }
  saveColumnConfig(INSTALLED_KIND, installedTableColumnItems).catch((error: unknown) => {
    console.error(error);
  });
}

export function handleCatalogColumnOrderChange(newOrdering: SvelteMap<string, number>): void {
  catalogTableColumnOrdering.clear();
  for (const [id, order] of newOrdering) {
    catalogTableColumnOrdering.set(id, order);
  }
  // Persist in organizer order so reload restores column sequence.
  const ordered = [...catalogTableColumnItems].toSorted(
    (a, b) => (newOrdering.get(a.id) ?? a.originalOrder) - (newOrdering.get(b.id) ?? b.originalOrder),
  );
  catalogTableColumnItems.splice(0, catalogTableColumnItems.length, ...ordered);
  saveColumnConfig(CATALOG_KIND, catalogTableColumnItems).catch((error: unknown) => {
    console.error(error);
  });
}

export function handleInstalledColumnOrderChange(newOrdering: SvelteMap<string, number>): void {
  installedTableColumnOrdering.clear();
  for (const [id, order] of newOrdering) {
    installedTableColumnOrdering.set(id, order);
  }
  const ordered = [...installedTableColumnItems].toSorted(
    (a, b) => (newOrdering.get(a.id) ?? a.originalOrder) - (newOrdering.get(b.id) ?? b.originalOrder),
  );
  installedTableColumnItems.splice(0, installedTableColumnItems.length, ...ordered);
  saveColumnConfig(INSTALLED_KIND, installedTableColumnItems).catch((error: unknown) => {
    console.error(error);
  });
}

export async function resetCatalogTableColumns(): Promise<void> {
  catalogUserForcedVisible.clear();
  if (tablePersistence.storage) {
    catalogTableColumnItems.splice(
      0,
      catalogTableColumnItems.length,
      ...(await tablePersistence.storage.reset(
        CATALOG_KIND,
        CATALOG_DEFAULT.map(item => item.id),
      )),
    );
  } else {
    catalogTableColumnItems.splice(0, catalogTableColumnItems.length, ...CATALOG_DEFAULT.map(item => ({ ...item })));
  }
  catalogTableColumnOrdering.clear();
}

export async function resetInstalledTableColumns(): Promise<void> {
  installedUserForcedVisible.clear();
  if (tablePersistence.storage) {
    installedTableColumnItems.splice(
      0,
      installedTableColumnItems.length,
      ...(await tablePersistence.storage.reset(
        INSTALLED_KIND,
        INSTALLED_DEFAULT.map(item => item.id),
      )),
    );
  } else {
    installedTableColumnItems.splice(
      0,
      installedTableColumnItems.length,
      ...INSTALLED_DEFAULT.map(item => ({ ...item })),
    );
  }
  installedTableColumnOrdering.clear();
}

const CATALOG_OPTIONAL_COLUMN_WIDTH: Record<CatalogTableColumnId, string> = {
  Publisher: 'minmax(0, 0.9fr)',
  Version: 'minmax(0, 1fr)',
  Status: 'minmax(5.5rem, 0.85fr)',
};

const INSTALLED_OPTIONAL_COLUMN_WIDTH: Record<InstalledTableColumnId, string> = {
  Version: 'minmax(0, 1.15fr)',
  // Wide enough for longest labels (e.g. "Missing dependency") plus status icon.
  Status: 'minmax(11rem, max-content)',
};

function catalogColumnSortKey(id: CatalogTableColumnId): number {
  return catalogTableColumnOrdering.get(id) ?? CATALOG_DEFAULT.find(item => item.id === id)?.originalOrder ?? 0;
}

function installedColumnSortKey(id: InstalledTableColumnId): number {
  return installedTableColumnOrdering.get(id) ?? INSTALLED_DEFAULT.find(item => item.id === id)?.originalOrder ?? 0;
}

/** Visible optional catalog columns in ListOrganizer order. */
export function getOrderedVisibleCatalogColumns(): CatalogTableColumnId[] {
  const ids: CatalogTableColumnId[] = ['Publisher', 'Version', 'Status'];
  return ids
    .filter(id => isCatalogTableColumnVisible(id))
    .toSorted((a, b) => catalogColumnSortKey(a) - catalogColumnSortKey(b));
}

/** Visible optional installed columns in ListOrganizer order. */
export function getOrderedVisibleInstalledColumns(): InstalledTableColumnId[] {
  const ids: InstalledTableColumnId[] = ['Version', 'Status'];
  return ids
    .filter(id => isInstalledTableColumnVisible(id))
    .toSorted((a, b) => installedColumnSortKey(a) - installedColumnSortKey(b));
}

export function buildCatalogGridTemplateColumns(): string {
  const parts = ['56px', 'minmax(0, 3fr)'];
  for (const id of getOrderedVisibleCatalogColumns()) {
    parts.push(CATALOG_OPTIONAL_COLUMN_WIDTH[id]);
  }
  parts.push('minmax(140px, max-content)');
  return parts.join(' ');
}

export function buildInstalledGridTemplateColumns(): string {
  const narrow = extensionTableViewport.compactInstalledStatus;
  // Each row is its own grid — optional columns must use fixed tracks on small screens
  // so Status aligns across rows. Keep Status/Actions tight so Name (1fr) gets the width.
  const parts = ['56px', narrow ? 'minmax(0, 1fr)' : 'minmax(0, 3fr)'];
  for (const id of getOrderedVisibleInstalledColumns()) {
    if (narrow && id === 'Version') {
      parts.push('4.5rem');
    } else if (narrow && id === 'Status') {
      // Longest label ellipsizes with tooltip; fixed width keeps column aligned and frees Name.
      parts.push('8.5rem');
    } else {
      parts.push(INSTALLED_OPTIONAL_COLUMN_WIDTH[id]);
    }
  }
  // Actions: toggle + uninstall + kebab only — do not leave a wide empty track before them.
  parts.push(narrow ? '6.75rem' : 'minmax(140px, max-content)');
  return parts.join(' ');
}
