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

import type { CatalogExtension } from '@podman-desktop/core-api';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import { EXAMPLE_CUSTOM_EXTENSION_OCI } from './extension-install-examples';
import { isBuiltInExtension } from './extension-origin-utils';
import {
  isExplicitlyPrototypeRemoved,
  isPrototypeRestoredExtension,
  prototypeRestoreExtension,
} from './extension-prototype-use-cases';

const STORAGE_KEY = 'podman-desktop-custom-installed-extensions';

/** Bumped when the remembered custom-install set changes (UI reactivity). */
export const customInstalledRevision = { value: 0 };

function bumpCustomInstalledRevision(): void {
  customInstalledRevision.value += 1;
}

function readStoredIds(): Set<string> {
  if (typeof localStorage === 'undefined') {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

function writeStoredIds(ids: Set<string>): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  bumpCustomInstalledRevision();
}

/**
 * Normalize ids / OCI image names so
 * `podman-desktop.kubernetes-dashboard` and
 * `podman-desktop-extension-kubernetes-dashboard` compare equal.
 */
export function normalizeCustomExtensionKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^.*\//, '')
    .replace(/:.*$/, '')
    .replace(/^podman-desktop-extension-/, '')
    .replace(/^podman-desktop\./, '')
    .replace(/[^a-z0-9]+/g, '');
}

export function getCustomInstalledExtensionIds(): Set<string> {
  return readStoredIds();
}

export function rememberCustomInstalledExtension(...extensionIds: string[]): void {
  const ids = readStoredIds();
  let changed = false;
  for (const extensionId of extensionIds) {
    const trimmed = extensionId.trim();
    if (!trimmed || ids.has(trimmed)) {
      continue;
    }
    ids.add(trimmed);
    changed = true;
  }
  if (changed) {
    writeStoredIds(ids);
  }
}

export function forgetCustomInstalledExtension(extensionId: string): void {
  const ids = readStoredIds();
  const key = normalizeCustomExtensionKey(extensionId);
  let changed = false;
  for (const stored of [...ids]) {
    if (stored === extensionId || normalizeCustomExtensionKey(stored) === key) {
      ids.delete(stored);
      changed = true;
    }
  }
  if (changed) {
    writeStoredIds(ids);
  }
}

export function isRememberedCustomExtension(extension: Pick<CombinedExtensionInfoUI, 'id' | 'name'>): boolean {
  const remembered = getCustomInstalledExtensionIds();
  if (remembered.size === 0) {
    return false;
  }

  const candidates = [extension.id, extension.name].filter(Boolean).map(value => normalizeCustomExtensionKey(value));

  for (const stored of remembered) {
    const key = normalizeCustomExtensionKey(stored);
    if (!key) {
      continue;
    }
    if (candidates.some(candidate => candidate === key || candidate.includes(key) || key.includes(candidate))) {
      return true;
    }
  }
  return false;
}

function hasCatalogMatch(extension: CombinedExtensionInfoUI, catalogExtensions: readonly CatalogExtension[]): boolean {
  return catalogExtensions.some(
    catalogExtension =>
      catalogExtension.id === extension.id ||
      catalogExtension.extensionName === extension.name ||
      extension.id.endsWith(`.${catalogExtension.extensionName}`),
  );
}

/**
 * OCI installs from Install custom (not from catalog / not local-dev folders).
 * Uses remembered IDs from the install modal, with a heuristic fallback.
 */
export function isCustomInstalledExtension(
  extension: CombinedExtensionInfoUI,
  catalogExtensions: readonly CatalogExtension[] = [],
): boolean {
  if (extension.devMode || extension.type === 'dd' || isBuiltInExtension(extension)) {
    return false;
  }

  if (isRememberedCustomExtension(extension)) {
    return true;
  }

  // Avoid treating every removable install as custom before the catalog has loaded.
  if (catalogExtensions.length === 0) {
    return false;
  }

  // Heuristic: removable PD extension with no catalog entry (typical manual OCI install).
  return extension.removable === true && !hasCatalogMatch(extension, catalogExtensions);
}

/** Extensions that belong on the Install custom/local tab (Suggestion scope). */
export function isCustomOrLocalTabExtension(
  extension: CombinedExtensionInfoUI,
  catalogExtensions: readonly CatalogExtension[] = [],
): boolean {
  if (extension.devMode) {
    return true;
  }
  return isCustomInstalledExtension(extension, catalogExtensions);
}

/**
 * Ensure the documented Install-custom example (and any already-remembered tokens)
 * map to the runtime extension id after install/reload.
 */
export function reconcileCustomInstalledExtensions(extensions: readonly CombinedExtensionInfoUI[]): void {
  const exampleKey = normalizeCustomExtensionKey(EXAMPLE_CUSTOM_EXTENSION_OCI);
  for (const extension of extensions) {
    if (extension.devMode || extension.type === 'dd' || isBuiltInExtension(extension)) {
      continue;
    }
    const matchesExample =
      normalizeCustomExtensionKey(extension.id) === exampleKey ||
      normalizeCustomExtensionKey(extension.name) === exampleKey;
    if (matchesExample || isRememberedCustomExtension(extension)) {
      rememberCustomInstalledExtension(extension.id, EXAMPLE_CUSTOM_EXTENSION_OCI);
      // Suggestion scope hides non-built-ins until restored for this session.
      // Do not undo an explicit Uninstall from this tab.
      // Skip when already restored so $effect reconcile cannot loop on store bumps.
      if (!isExplicitlyPrototypeRemoved(extension.id) && !isPrototypeRestoredExtension(extension.id)) {
        prototypeRestoreExtension(extension.id);
      }
    }
  }
}
