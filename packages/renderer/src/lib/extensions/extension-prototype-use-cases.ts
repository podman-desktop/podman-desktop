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

import type { ExtensionError } from '@podman-desktop/core-api';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { isExtensionUserDisabled, isExtensionUserEnabled } from './extension-lifecycle-user-toggle';
import { isBuiltInExtensionId } from './extension-origin-utils';
import {
  getPrototypeTransientLifecycleState,
  prototypeLifecycleOverlayRevisionStore,
  setPrototypeLifecycleDemosEnabled,
  startPrototypeActivatingOverlay,
} from './extension-prototype-lifecycle-overlay.svelte';

/**
 * Synthetic sidebar entries for prototype-restored extensions whose real webview
 * is missing (e.g. AI Lab failed and disposed its panel). Ensures the nav icon
 * and post-install tooltip always have an anchor after a demo re-install.
 */
export interface PrototypeSidebarEntry {
  extensionId: string;
  name: string;
  link: string;
  /** Catalog or installed extension icon (data URL / http URL). */
  iconHref?: string;
}

// Use var so circular imports can call getters during module load without TDZ errors.
// eslint-disable-next-line no-var
var prototypeSidebarEntries: Map<string, PrototypeSidebarEntry> | undefined;
let prototypeUseCasesEnabled = false;
const prototypeRemovedExtensionIds = new Set<string>();
const prototypeRestoredExtensionIds = new Set<string>();

const PROTOTYPE_SIDEBAR_DEFAULT_NAMES: Record<string, string> = {
  'redhat.ai-lab': 'AI Lab',
  'redhat.bootable-containers': 'Bootable Containers',
};

function getPrototypeSidebarEntriesMap(): Map<string, PrototypeSidebarEntry> {
  prototypeSidebarEntries ??= new Map();
  return prototypeSidebarEntries;
}

/** Real bundled / catalog extension IDs used to demo DTUX-2849 UI states. */
export const USE_CASE_EXTENSION_IDS = {
  builtIn: 'podman-desktop.compose',
  /** Installed-tab demo: upgrade available with manual version installation (auto-update off). */
  communityActiveWithUpdate: 'podman-desktop.kind',
  /** Second installed-tab demo row with an available update. */
  communityActiveWithUpdateSecondary: 'podman-desktop.compose',
  communityDisabled: 'podman-desktop.registries',
  communityFailed: 'podman-desktop.kube-context',
  activating: 'podman-desktop.kubectl-cli',
  disabling: 'podman-desktop.lima',
  incompatibleVersion: 'podman-desktop.podman-docker-context',
  missingDependency: 'podman-desktop.kind',
  /** Install Podman AI Lab, then use Preview install tooltip on the Catalog tab. */
  postInstallTooltipWithOnboarding: 'redhat.ai-lab',
} as const;

export const PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS = [
  USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
  USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
] as const;

export function isPrototypeUpdateDemoExtension(extensionId: string): boolean {
  return (PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS as readonly string[]).includes(extensionId);
}

function extensionIdsLooselyMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }
  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

export function ensurePrototypeSidebarEntry(
  extensionId: string,
  displayName?: string,
  iconHref?: string,
): PrototypeSidebarEntry {
  const existing = findPrototypeSidebarEntry(extensionId);
  if (existing) {
    if (displayName?.trim() && existing.name !== displayName.trim()) {
      existing.name = displayName.trim();
    }
    if (iconHref && existing.iconHref !== iconHref) {
      existing.iconHref = iconHref;
    }
    return existing;
  }

  const trimmedName = displayName?.trim();
  // Prefer short sidebar labels for known extensions (e.g. "AI Lab" over "Podman AI Lab").
  const name =
    PROTOTYPE_SIDEBAR_DEFAULT_NAMES[extensionId] ??
    (trimmedName && trimmedName.length > 0 ? trimmedName : undefined) ??
    extensionId.split('.').pop()?.replace(/-/g, ' ') ??
    extensionId;

  const entry: PrototypeSidebarEntry = {
    extensionId,
    name,
    link: `/webviews/prototype-${extensionId.replace(/[^a-zA-Z0-9._-]/g, '-')}`,
    iconHref,
  };
  getPrototypeSidebarEntriesMap().set(extensionId, entry);
  return entry;
}

export function removePrototypeSidebarEntry(extensionId: string): void {
  const entries = getPrototypeSidebarEntriesMap();
  for (const key of Array.from(entries.keys())) {
    if (extensionIdsLooselyMatch(key, extensionId)) {
      entries.delete(key);
    }
  }
}

export function findPrototypeSidebarEntry(extensionId: string): PrototypeSidebarEntry | undefined {
  const entries = getPrototypeSidebarEntriesMap();
  const direct = entries.get(extensionId);
  if (direct) {
    return direct;
  }
  for (const entry of entries.values()) {
    if (extensionIdsLooselyMatch(entry.extensionId, extensionId)) {
      return entry;
    }
  }
  return undefined;
}

export function getPrototypeSidebarEntries(): PrototypeSidebarEntry[] {
  return Array.from(getPrototypeSidebarEntriesMap().values());
}

export function clearPrototypeSidebarEntries(): void {
  getPrototypeSidebarEntriesMap().clear();
}

export function isPrototypeRestoredExtension(extensionId: string): boolean {
  if (prototypeRestoredExtensionIds.has(extensionId)) {
    return true;
  }
  for (const restoredId of prototypeRestoredExtensionIds) {
    if (extensionIdsLooselyMatch(restoredId, extensionId)) {
      return true;
    }
  }
  return false;
}

export function setPrototypeUseCasesEnabled(enabled: boolean): void {
  prototypeUseCasesEnabled = enabled;
  setPrototypeLifecycleDemosEnabled(enabled);
  if (enabled) {
    startPrototypeActivatingOverlay();
  }
}

export function arePrototypeUseCasesEnabled(): boolean {
  return prototypeUseCasesEnabled;
}

function isExplicitlyPrototypeRemoved(extensionId: string): boolean {
  if (prototypeRemovedExtensionIds.has(extensionId)) {
    return true;
  }

  const extensionName = extensionId.includes('.') ? extensionId.split('.').slice(1).join('.') : extensionId;
  for (const removedId of prototypeRemovedExtensionIds) {
    if (removedId === extensionId) {
      return true;
    }
    const removedName = removedId.includes('.') ? removedId.split('.').slice(1).join('.') : removedId;
    if (
      removedName === extensionName ||
      removedId.endsWith(`.${extensionName}`) ||
      extensionId.endsWith(`.${removedName}`)
    ) {
      return true;
    }
  }

  return false;
}

/** Mark an extension as uninstalled in the prototype (no backend call). */
export function prototypeRemoveExtension(extensionId: string, relatedIds: string[] = []): void {
  const ids = [extensionId, ...relatedIds.filter(Boolean)];
  for (const id of ids) {
    prototypeRemovedExtensionIds.add(id);
    prototypeRestoredExtensionIds.delete(id);
  }
  removePrototypeSidebarEntry(extensionId);
  for (const relatedId of relatedIds) {
    removePrototypeSidebarEntry(relatedId);
  }
  prototypeLifecycleOverlayRevisionStore.update(r => r + 1);
}

/**
 * Restore a prototype-removed extension (undo the demo uninstall, no backend call).
 * Also marks the extension as "freshly installed" so it shows Active regardless of
 * the real backend state (e.g. a pre-existing failed state).
 */
export function prototypeRestoreExtension(
  extensionId: string,
  relatedIds: string[] = [],
  displayName?: string,
  iconHref?: string,
): void {
  const ids = collectRelatedPrototypeIds(extensionId);
  for (const relatedId of relatedIds) {
    if (relatedId) {
      ids.push(relatedId);
    }
  }
  for (const id of ids) {
    prototypeRemovedExtensionIds.delete(id);
    prototypeRestoredExtensionIds.add(id);
  }
  // Ensure a sidebar anchor exists even when the real webview was disposed (failed extension).
  ensurePrototypeSidebarEntry(extensionId, displayName, iconHref);
  prototypeLifecycleOverlayRevisionStore.update(r => r + 1);
}

/**
 * Whether the extension should appear uninstalled in suggestion-scope UI.
 * Explicit uninstalls always hide. Non-built-ins are hidden by default on each
 * app refresh unless restored via a prototype install in this session.
 */
export function isPrototypeRemovedExtension(extensionId: string): boolean {
  if (isExplicitlyPrototypeRemoved(extensionId)) {
    return true;
  }

  if (isPrototypeRestoredExtension(extensionId)) {
    return false;
  }

  // Fresh session / refresh: only built-ins start as installed.
  return prototypeUseCasesEnabled && !isBuiltInExtensionId(extensionId);
}

function collectRelatedPrototypeIds(extensionId: string): string[] {
  const related = new Set<string>([extensionId]);
  const extensionName = extensionId.includes('.') ? extensionId.split('.').slice(1).join('.') : extensionId;
  for (const removedId of prototypeRemovedExtensionIds) {
    const removedName = removedId.includes('.') ? removedId.split('.').slice(1).join('.') : removedId;
    if (
      removedId === extensionId ||
      removedName === extensionName ||
      removedId.endsWith(`.${extensionName}`) ||
      extensionId.endsWith(`.${removedName}`)
    ) {
      related.add(removedId);
    }
  }
  return Array.from(related);
}

export function clearPrototypeRemovedExtensions(): void {
  prototypeRemovedExtensionIds.clear();
  prototypeRestoredExtensionIds.clear();
  clearPrototypeSidebarEntries();
}

interface InstalledUseCaseOverlay {
  state?: string;
  error?: ExtensionError;
}

const INSTALLED_STATE_OVERLAYS: Record<string, InstalledUseCaseOverlay> = {
  [USE_CASE_EXTENSION_IDS.communityDisabled]: { state: 'stopped' },
  [USE_CASE_EXTENSION_IDS.communityFailed]: {
    state: 'failed',
    error: {
      message: 'Failed to activate extension: connection timeout while contacting registry.local:5000.',
    },
  },
  [USE_CASE_EXTENSION_IDS.activating]: { state: 'starting' },
  [USE_CASE_EXTENSION_IDS.disabling]: { state: 'stopping' },
};

/**
 * Apply prototype display overlays to installed extensions that are already present.
 * Does not inject fake extension rows.
 */
export function applyPrototypeUseCaseOverlays(extensions: CombinedExtensionInfoUI[]): CombinedExtensionInfoUI[] {
  if (!prototypeUseCasesEnabled) {
    return extensions;
  }

  return extensions
    .filter(extension => !isPrototypeRemovedExtension(extension.id))
    .map(extension => {
      const overlay = INSTALLED_STATE_OVERLAYS[extension.id];
      const transientState = getPrototypeTransientLifecycleState(extension.id);

      if (transientState) {
        return {
          ...extension,
          state: transientState,
          error: undefined,
        };
      }

      // User-toggled disable takes priority over every other overlay.
      if (isExtensionUserDisabled(extension.id)) {
        return {
          ...extension,
          state: extension.state === 'stopping' ? 'stopping' : 'stopped',
          error: undefined,
        };
      }

      // Extensions that were "re-installed" via the prototype demo show as Active,
      // overriding any real backend error state (but only when not manually disabled).
      if (prototypeRestoredExtensionIds.has(extension.id)) {
        return {
          ...extension,
          state: 'started',
          error: undefined,
        };
      }

      if (!overlay) {
        return extension;
      }

      if (overlay.state === 'stopped' && isExtensionUserEnabled(extension.id)) {
        return {
          ...extension,
          error: undefined,
        };
      }

      if (extension.state === 'stopped' || extension.state === 'stopping') {
        return {
          ...extension,
          state: extension.state,
          error: undefined,
        };
      }

      if (overlay.state === 'starting' && getPrototypeTransientLifecycleState(extension.id) !== 'starting') {
        return {
          ...extension,
          error: undefined,
        };
      }

      return {
        ...extension,
        state: overlay.state ?? extension.state,
        error: overlay.error ?? extension.error,
      };
    });
}

/** Bump patch segment for prototype update demos (supports semver suffixes like -next). */
export function bumpPrototypePatchVersion(version: string): string {
  const normalized = version.replace(/^v/i, '').trim();
  const versionPattern = /^(\d+)\.(\d+)\.(\d+)(.*)$/;
  const match = versionPattern.exec(normalized);
  if (match) {
    const patch = Number.parseInt(match[3], 10) + 1;
    return `${match[1]}.${match[2]}.${patch}${match[4]}`;
  }

  const legacyParts = normalized.split('.').map(part => Number.parseInt(part, 10));
  if (legacyParts.length > 0 && !legacyParts.some(Number.isNaN)) {
    legacyParts[legacyParts.length - 1] += 1;
    return legacyParts.join('.');
  }

  return `${normalized}.1`;
}

/** Bump minor segment for prototype update demos (supports semver suffixes like -next). */
export function bumpPrototypeMinorVersion(version: string): string {
  const normalized = version.replace(/^v/i, '').trim();
  const versionPattern = /^(\d+)\.(\d+)\.(\d+)(.*)$/;
  const match = versionPattern.exec(normalized);
  if (match) {
    const minor = Number.parseInt(match[2], 10) + 1;
    return `${match[1]}.${minor}.0${match[4]}`;
  }

  const legacyParts = normalized.split('.').map(part => Number.parseInt(part, 10));
  if (legacyParts.length > 1 && !legacyParts.some(Number.isNaN)) {
    legacyParts[legacyParts.length - 2] += 1;
    legacyParts[legacyParts.length - 1] = 0;
    return legacyParts.join('.');
  }

  return bumpPrototypePatchVersion(version);
}

export function getPrototypeUpdateTargetVersion(extensionId: string, installedVersion: string): string {
  if (extensionId === USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary) {
    return bumpPrototypeMinorVersion(installedVersion);
  }

  return bumpPrototypePatchVersion(installedVersion);
}

function applyPrototypeUpdateOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  const installedVersion = catalogInfo.installedVersion ?? catalogInfo.fetchVersion ?? '1.0.0';
  const newerVersion = getPrototypeUpdateTargetVersion(catalogInfo.id, installedVersion);
  const versionOptions = [
    { version: newerVersion, ociUri: catalogInfo.fetchLink ?? '', preview: false },
    { version: installedVersion, ociUri: catalogInfo.fetchLink ?? '', preview: false },
  ];

  return {
    ...catalogInfo,
    availableVersions: versionOptions,
    installedVersion,
    fetchVersion: newerVersion,
    hasUpdate: true,
  };
}

/** Enrich catalog metadata for real extensions used in prototype review. */
export function applyPrototypeCatalogUseCaseOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  if (!prototypeUseCasesEnabled) {
    return catalogInfo;
  }

  if (isPrototypeUpdateDemoExtension(catalogInfo.id)) {
    return applyPrototypeUpdateOverlay(catalogInfo);
  }

  if (catalogInfo.publisherDisplayName.toLowerCase().includes('red hat')) {
    return {
      ...catalogInfo,
      isVerified: true,
      isSupportedByRedHat: true,
    };
  }

  return catalogInfo;
}

/** Keep auto-update disabled on installed-tab manual update demo extensions. */
export function ensurePrototypeManualUpdateSettings(extensions: CatalogExtensionInfoUI[]): void {
  if (!prototypeUseCasesEnabled) {
    return;
  }

  for (const demoId of PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS) {
    const demoExtension = extensions.find(extension => extension.isInstalled && extension.id === demoId);
    if (demoExtension) {
      setAutoUpdateEnabled(demoExtension.id, false);
    }
  }
}
