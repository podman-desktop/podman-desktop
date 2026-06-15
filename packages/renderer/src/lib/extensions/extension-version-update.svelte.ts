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

import { get, type Writable, writable } from 'svelte/store';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  completePrototypeVersionUpdateTask,
  failPrototypeVersionUpdateTask,
  resetPrototypeVersionUpdateTasksForTests,
  startPrototypeVersionUpdateTask,
} from './extension-version-update-task';

export interface ExtensionVersionUpdateState {
  status: 'updating' | 'error';
  message: string;
  targetVersion: string;
}

export const EXTENSION_VERSION_UI_CHANGE_EVENT = 'extension-version-ui-change';

const PROTOTYPE_MIN_LOADING_MS = 3000;
let prototypeVersionChangesEnabled = true;

interface ExtensionVersionUiGlobal {
  versionUpdateStatesStore: Writable<Record<string, ExtensionVersionUpdateState>>;
  optimisticInstalledVersionsStore: Writable<Record<string, string>>;
  pendingCompletionTimers: Map<string, ReturnType<typeof setTimeout>>;
}

const EXTENSION_VERSION_UI_GLOBAL_KEY = '__podmanDesktopExtensionVersionUi';

function getExtensionVersionUiGlobal(): ExtensionVersionUiGlobal {
  const globalScope = globalThis as typeof globalThis & {
    [EXTENSION_VERSION_UI_GLOBAL_KEY]?: ExtensionVersionUiGlobal;
  };

  globalScope[EXTENSION_VERSION_UI_GLOBAL_KEY] ??= {
    versionUpdateStatesStore: writable<Record<string, ExtensionVersionUpdateState>>({}),
    optimisticInstalledVersionsStore: writable<Record<string, string>>({}),
    pendingCompletionTimers: new Map<string, ReturnType<typeof setTimeout>>(),
  };

  return globalScope[EXTENSION_VERSION_UI_GLOBAL_KEY];
}

export const versionUpdateStatesStore = getExtensionVersionUiGlobal().versionUpdateStatesStore;
export const optimisticInstalledVersionsStore = getExtensionVersionUiGlobal().optimisticInstalledVersionsStore;

function notifyVersionUiChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EXTENSION_VERSION_UI_CHANGE_EVENT));
  }
}

export function setPrototypeVersionChangesEnabled(enabled: boolean): void {
  prototypeVersionChangesEnabled = enabled;
}

export function arePrototypeVersionChangesEnabled(): boolean {
  return prototypeVersionChangesEnabled;
}

export function getExtensionVersionUpdateState(extensionId: string): ExtensionVersionUpdateState | undefined {
  return get(versionUpdateStatesStore)[extensionId];
}

export function getOptimisticInstalledVersion(extensionId: string): string | undefined {
  return get(optimisticInstalledVersionsStore)[extensionId];
}

export function clearExtensionVersionUpdateState(extensionId: string): void {
  versionUpdateStatesStore.update(states => {
    if (!(extensionId in states)) {
      return states;
    }
    const next = { ...states };
    delete next[extensionId];
    return next;
  });
  notifyVersionUiChange();
}

export function clearOptimisticInstalledVersion(extensionId: string): void {
  optimisticInstalledVersionsStore.update(versions => {
    if (!(extensionId in versions)) {
      return versions;
    }
    const next = { ...versions };
    delete next[extensionId];
    return next;
  });
  notifyVersionUiChange();
}

export function resetVersionUpdateStateForTests(): void {
  const globalState = getExtensionVersionUiGlobal();
  for (const timer of globalState.pendingCompletionTimers.values()) {
    clearTimeout(timer);
  }
  globalState.pendingCompletionTimers.clear();
  resetPrototypeVersionUpdateTasksForTests();
  versionUpdateStatesStore.set({});
  optimisticInstalledVersionsStore.set({});
  notifyVersionUiChange();
}

export function normalizeVersionValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.replace(/^v/i, '').trim();
  }
  if (value && typeof value === 'object' && 'version' in value) {
    return normalizeVersionValue((value as { version: unknown }).version);
  }
  return '';
}

export function getLatestAvailableVersion(extension: CatalogExtensionInfoUI): string {
  const versions = new Set<string>();

  for (const version of extension.availableVersions) {
    const normalized = normalizeVersionValue(version.version);
    if (normalized) {
      versions.add(normalized);
    }
  }

  const fetchVersion = normalizeVersionValue(extension.fetchVersion);
  if (fetchVersion) {
    versions.add(fetchVersion);
  }

  return [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0] ?? '';
}

export function getDisplayInstalledVersion(extensionId: string, actualVersion?: string): string | undefined {
  const normalizedActual = normalizeVersionValue(actualVersion);
  const optimistic = get(optimisticInstalledVersionsStore)[extensionId];

  if (optimistic) {
    if (normalizedActual && normalizedActual === optimistic) {
      clearOptimisticInstalledVersion(extensionId);
      return actualVersion;
    }

    const updateState = get(versionUpdateStatesStore)[extensionId];
    if (updateState?.status !== 'updating') {
      return optimistic;
    }
  }

  return actualVersion;
}

export function withDisplayInstalledVersion(extension: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  const installedVersion = getDisplayInstalledVersion(extension.id, extension.installedVersion);
  if (!installedVersion || installedVersion === extension.installedVersion) {
    return extension;
  }

  return {
    ...extension,
    installedVersion,
    hasUpdate: extensionHasUpdateForVersion(extension, installedVersion),
  };
}

function extensionHasUpdateForVersion(extension: CatalogExtensionInfoUI, installedVersion: string): boolean {
  const latest = getLatestAvailableVersion(extension);
  const installed = normalizeVersionValue(installedVersion);
  return !!latest && !!installed && latest !== installed;
}

export function resolveVersionChangeTarget(extension: CatalogExtensionInfoUI): string | undefined {
  if (!extension.isInstalled || isAutoUpdateEnabled(extension.id)) {
    return undefined;
  }

  const installed = normalizeVersionValue(
    getDisplayInstalledVersion(extension.id, extension.installedVersion) ?? extension.installedVersion,
  );
  const latest = getLatestAvailableVersion(extension);

  if (!installed || !latest) {
    return undefined;
  }

  const comparison = latest.localeCompare(installed, undefined, { numeric: true });
  return comparison > 0 ? latest : undefined;
}

export function isExtensionVersionUpdating(extensionId: string): boolean {
  return get(versionUpdateStatesStore)[extensionId]?.status === 'updating';
}

export function shouldShowVersionChangeLink(extension: CatalogExtensionInfoUI): boolean {
  if (isExtensionVersionUpdating(extension.id)) {
    return false;
  }
  return !!resolveVersionChangeTarget(withDisplayInstalledVersion(extension));
}

export function getVersionChangeLinkLabel(installedVersion: string | undefined, targetVersion: string): string {
  const installed = normalizeVersionValue(installedVersion);
  const target = normalizeVersionValue(targetVersion);
  if (!installed || !target) {
    return `Change to v${targetVersion}`;
  }

  const comparison = target.localeCompare(installed, undefined, { numeric: true });
  if (comparison > 0) {
    return `Upgrade to v${target}`;
  }
  if (comparison < 0) {
    return `Downgrade to v${target}`;
  }
  return `Change to v${target}`;
}

export function resolveExtensionVersionOciUri(
  extension: CatalogExtensionInfoUI,
  normalizedTarget: string,
): string | undefined {
  const matchingVersion = extension.availableVersions.find(
    version => normalizeVersionValue(version.version) === normalizedTarget,
  );
  if (matchingVersion?.ociUri) {
    return matchingVersion.ociUri;
  }

  if (normalizeVersionValue(extension.fetchVersion) === normalizedTarget && extension.fetchLink) {
    return extension.fetchLink;
  }

  return undefined;
}

function setUpdateState(extensionId: string, state: ExtensionVersionUpdateState): void {
  versionUpdateStatesStore.update(states => ({ ...states, [extensionId]: state }));
  notifyVersionUiChange();
}

function setOptimisticVersion(extensionId: string, version: string): void {
  optimisticInstalledVersionsStore.update(versions => ({ ...versions, [extensionId]: version }));
  notifyVersionUiChange();
}

function completeVersionChange(
  extensionId: string,
  normalizedTarget: string,
  extension?: CatalogExtensionInfoUI,
): void {
  if (prototypeVersionChangesEnabled && extension) {
    completePrototypeVersionUpdateTask(extensionId);
  }
  setOptimisticVersion(extensionId, normalizedTarget);
  clearExtensionVersionUpdateState(extensionId);
  getExtensionVersionUiGlobal().pendingCompletionTimers.delete(extensionId);
}

function schedulePrototypeCompletion(extension: CatalogExtensionInfoUI, normalizedTarget: string): void {
  const globalState = getExtensionVersionUiGlobal();
  const existingTimer = globalState.pendingCompletionTimers.get(extension.id);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Prototype mode is UI-only: do not call updateExtension here. The backend
  // uninstalls the extension first, which removes the installed row and often
  // leaves the list in the previous version if installation fails.
  const timer = globalThis.setTimeout(() => {
    completeVersionChange(extension.id, normalizedTarget, extension);
  }, PROTOTYPE_MIN_LOADING_MS);

  globalState.pendingCompletionTimers.set(extension.id, timer);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function applyExtensionVersionChange(
  extension: CatalogExtensionInfoUI,
  targetVersion: string,
  autoUpdateEnabled?: boolean,
): void {
  const normalizedTarget = normalizeVersionValue(targetVersion);
  const ociUri = resolveExtensionVersionOciUri(extension, normalizedTarget);

  if (!ociUri && !prototypeVersionChangesEnabled) {
    setUpdateState(extension.id, {
      status: 'error',
      message: 'Selected version is not available for installation.',
      targetVersion: normalizedTarget,
    });
    return;
  }

  if (autoUpdateEnabled !== undefined) {
    setAutoUpdateEnabled(extension.id, autoUpdateEnabled);
  }

  setUpdateState(extension.id, {
    status: 'updating',
    message: `Updating to v${normalizedTarget}...`,
    targetVersion: normalizedTarget,
  });

  if (prototypeVersionChangesEnabled) {
    startPrototypeVersionUpdateTask(extension.id, extension.displayName, normalizedTarget, PROTOTYPE_MIN_LOADING_MS);
    schedulePrototypeCompletion(extension, normalizedTarget);
    return;
  }

  void runProductionVersionChange(extension, normalizedTarget, ociUri).catch(() => {});
}

async function runProductionVersionChange(
  extension: CatalogExtensionInfoUI,
  normalizedTarget: string,
  ociUri?: string,
): Promise<void> {
  const loadingDelay = delay(PROTOTYPE_MIN_LOADING_MS);
  let updateError: Error | undefined;

  if (ociUri) {
    try {
      await runBackendVersionChange(extension, ociUri);
    } catch (error) {
      updateError = error instanceof Error ? error : new Error(String(error));
    }
  }

  await loadingDelay;

  if (updateError) {
    if (prototypeVersionChangesEnabled) {
      failPrototypeVersionUpdateTask(extension.id, updateError.message);
    }
    setUpdateState(extension.id, {
      status: 'error',
      message: updateError.message,
      targetVersion: normalizedTarget,
    });
    return;
  }

  completeVersionChange(extension.id, normalizedTarget, extension);
}

async function runBackendVersionChange(extension: CatalogExtensionInfoUI, ociUri: string): Promise<void> {
  if (extension.isInstalled) {
    await window.updateExtension(extension.id, ociUri);
    return;
  }

  await window.extensionInstallFromImage(
    ociUri,
    () => {},
    (error: string) => {
      throw new Error(error);
    },
    extension.id,
  );
}

export function applyResolvedVersionChange(extension: CatalogExtensionInfoUI): void {
  const target = resolveVersionChangeTarget(withDisplayInstalledVersion(extension));
  if (!target) {
    return;
  }

  applyExtensionVersionChange(extension, target, isAutoUpdateEnabled(extension.id));
}
