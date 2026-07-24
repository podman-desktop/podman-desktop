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

import type { ContributionInfo, WebviewInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';

import { buildExtensionNewNavigationTooltip } from '/@/lib/extensions/extension-badge-styles';
import { resolveExtensionPostInstallLocation } from '/@/lib/extensions/extension-post-install-locations';
import { findPrototypeSidebarEntry } from '/@/lib/extensions/extension-prototype-use-cases';
import { toCatalogIdentities } from '/@/lib/extensions/extension-runtime-id';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { contributions } from '/@/stores/contribs';
import {
  type CatalogExtensionIdentity,
  resolveInstalledExtensionIdFromWebview,
} from '/@/stores/extension-webview-installed';
import { refreshExtensionNavigationItems } from '/@/stores/navigation/navigation-registry-extension.svelte';
import { fetchWebviews, webviews } from '/@/stores/webviews';

export interface ExtensionNavPointerTarget {
  extensionId: string;
  link: string;
  label: string;
  tooltip: string;
}

export const extensionNavPointerState = $state<{ value: ExtensionNavPointerTarget | null }>({ value: null });

/** FIFO queue of extension ids waiting for a post-install nav pointer. */
const pendingExtensionQueue: string[] = [];
const pendingExtensionIds = new Set<string>();
/** Optional display names for fallback tooltip copy when catalog metadata is not loaded yet. */
const pendingExtensionDisplayNames = new Map<string, string>();

/** Background upgrade from Extensions fallback → real webview/contrib after install. */
const NAV_POINTER_POLL_INTERVAL_MS = 400;
const NAV_POINTER_MAX_ATTEMPTS = 30;
/** Best-effort sync only — tooltip must not wait on this. */
const POST_INSTALL_SYNC_INTERVAL_MS = 200;
const POST_INSTALL_SYNC_MAX_ATTEMPTS = 15;

const AI_LAB_EXTENSION_ID = 'redhat.ai-lab';
const AI_LAB_NAV_NAME = 'AI Lab';
const EXTENSIONS_NAV_LINK = '/extensions';

let pollTimeout: ReturnType<typeof setTimeout> | undefined;
let pollAttempts = 0;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function setExtensionNavPointer(pointer: ExtensionNavPointerTarget | null): void {
  extensionNavPointerState.value = pointer;
}

function enqueueExtensionNavPointer(extensionId: string, displayName?: string): void {
  if (displayName?.trim()) {
    pendingExtensionDisplayNames.set(extensionId, displayName.trim());
  }
  if (pendingExtensionIds.has(extensionId)) {
    return;
  }
  pendingExtensionIds.add(extensionId);
  pendingExtensionQueue.push(extensionId);
}

function dequeueExtensionNavPointer(extensionId: string): void {
  pendingExtensionIds.delete(extensionId);
  pendingExtensionDisplayNames.delete(extensionId);
  const index = pendingExtensionQueue.indexOf(extensionId);
  if (index >= 0) {
    pendingExtensionQueue.splice(index, 1);
  }
}

function extensionIdsMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }

  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

function getCatalogIdentities(): CatalogExtensionIdentity[] {
  return toCatalogIdentities(get(catalogExtensionInfos) ?? []);
}

export function findWebviewForExtension(
  extensionId: string,
  allWebviews: WebviewInfo[],
  catalogIdentities: CatalogExtensionIdentity[] = getCatalogIdentities(),
): WebviewInfo | undefined {
  const byExtensionId = allWebviews.find(item => item.extensionId === extensionId);
  if (byExtensionId) {
    return byExtensionId;
  }

  // Match webviews whose runtime extensionId differs from the catalog id
  // (e.g. AI Lab webview is registered under redhat.redhat-pack).
  const byCatalogIdentity = allWebviews.find(webview => {
    const resolved = resolveInstalledExtensionIdFromWebview(webview, catalogIdentities);
    return resolved !== undefined && extensionIdsMatch(resolved, extensionId);
  });
  if (byCatalogIdentity) {
    return byCatalogIdentity;
  }

  if (extensionId === AI_LAB_EXTENSION_ID) {
    return allWebviews.find(item => item.name === AI_LAB_NAV_NAME || item.viewType === 'studio');
  }

  return undefined;
}

function findContribForExtension(extensionId: string, allContribs: ContributionInfo[]): ContributionInfo | undefined {
  // Only match by extension id — name-only matching can steal the pointer for
  // catalog extensions like minikube when an unrelated contrib shares the name.
  return allContribs.find(item => item.extensionId === extensionId || extensionIdsMatch(item.extensionId, extensionId));
}

/** Sidebar anchors that always exist in AppNavigation chrome (outside the scroll list). */
const ALWAYS_AVAILABLE_NAV_LINKS = new Set(['/', '/preferences', EXTENSIONS_NAV_LINK]);

/** Test-only override so unit tests can assert Kubernetes/etc. without mounting AppNavigation. */
let sidebarNavLinkAvailabilityOverride: ((link: string) => boolean) | undefined;

/** @internal Test helper */
export function setSidebarNavLinkAvailabilityForTests(checker: ((link: string) => boolean) | undefined): void {
  sidebarNavLinkAvailabilityOverride = checker;
}

/**
 * True when a `data-nav-link` for this route exists (or is known to always exist).
 * Avoids pointing the post-install callout at missing anchors (e.g. Kubernetes when
 * internal Kubernetes nav is disabled) — that left the tooltip stuck at opacity-0.
 *
 * Uses the live DOM rather than importing `navigationRegistry` (circular init risk).
 */
export function isSidebarNavLinkAvailable(link: string): boolean {
  if (ALWAYS_AVAILABLE_NAV_LINKS.has(link)) {
    return true;
  }
  if (sidebarNavLinkAvailabilityOverride) {
    return sidebarNavLinkAvailabilityOverride(link);
  }
  if (typeof document === 'undefined') {
    return false;
  }
  return document.querySelector(`[data-nav-link="${link}"]`) !== null;
}

function buildExtensionsFallbackPointer(extensionId: string): ExtensionNavPointerTarget {
  const catalogIdentities = getCatalogIdentities();
  const catalog = catalogIdentities.find(item => item.id === extensionId || extensionIdsMatch(item.id, extensionId));
  const label =
    pendingExtensionDisplayNames.get(extensionId) ??
    catalog?.displayName ??
    extensionId.split('.').pop() ??
    'extension';
  return {
    extensionId,
    link: EXTENSIONS_NAV_LINK,
    label: 'Extensions',
    tooltip: `Open Extensions from the sidebar to get started with ${label}.`,
  };
}

function resolvePointerForExtension(
  extensionId: string,
  allWebviews: WebviewInfo[],
  allContribs: ContributionInfo[],
  options: { allowFallback?: boolean } = {},
): ExtensionNavPointerTarget | null {
  const catalogIdentities = getCatalogIdentities();
  const webview = findWebviewForExtension(extensionId, allWebviews, catalogIdentities);
  if (webview) {
    return {
      extensionId,
      link: `/webviews/${webview.id}`,
      label: webview.name,
      tooltip: buildExtensionNewNavigationTooltip(webview.name),
    };
  }

  const contrib = findContribForExtension(extensionId, allContribs);
  if (contrib) {
    return {
      extensionId,
      link: `/contribs/${contrib.name}`,
      label: contrib.name,
      tooltip: buildExtensionNewNavigationTooltip(contrib.name),
    };
  }

  const prototypeSidebar = findPrototypeSidebarEntry(extensionId);
  if (prototypeSidebar) {
    return {
      extensionId,
      link: prototypeSidebar.link,
      label: prototypeSidebar.name,
      tooltip: buildExtensionNewNavigationTooltip(prototypeSidebar.name),
    };
  }

  const knownLocation = resolveExtensionPostInstallLocation(extensionId);
  // Only anchor on known pages when the sidebar actually has that item.
  // Otherwise the callout stays opacity-0 forever (no `data-nav-link` target).
  if (knownLocation && isSidebarNavLinkAvailable(knownLocation.link)) {
    return {
      extensionId,
      link: knownLocation.link,
      label: knownLocation.navLabel,
      tooltip: knownLocation.tooltip,
    };
  }

  if (options.allowFallback) {
    return buildExtensionsFallbackPointer(extensionId);
  }

  return null;
}

/** Retarget a stuck/invisible pointer to the always-present Extensions nav item. */
export function retargetExtensionNavPointerToExtensionsFallback(): boolean {
  const currentPointer = extensionNavPointerState.value;
  if (!currentPointer || !pendingExtensionIds.has(currentPointer.extensionId)) {
    return false;
  }
  if (currentPointer.link === EXTENSIONS_NAV_LINK) {
    return false;
  }

  setExtensionNavPointer(buildExtensionsFallbackPointer(currentPointer.extensionId));
  refreshExtensionNavigationItems();
  return true;
}

function hasExtensionNavigationTarget(extensionId: string): boolean {
  const allWebviews = get(webviews) ?? [];
  const allContribs = get(contributions) ?? [];
  // Do not count the Extensions fallback — sync must wait for a real sidebar target when possible.
  return resolvePointerForExtension(extensionId, allWebviews, allContribs, { allowFallback: false }) !== null;
}

/**
 * Best-effort wait for a dedicated sidebar target after install.
 * Callers should show the post-install tooltip first (Extensions fallback is fine);
 * this only helps refresh nav / upgrade the pointer when a webview appears.
 */
export async function syncExtensionNavigationAfterInstall(extensionId: string): Promise<boolean> {
  await fetchWebviews();
  refreshExtensionNavigationItems();
  if (hasExtensionNavigationTarget(extensionId)) {
    return true;
  }

  for (let attempt = 1; attempt < POST_INSTALL_SYNC_MAX_ATTEMPTS; attempt += 1) {
    await delay(POST_INSTALL_SYNC_INTERVAL_MS);
    await fetchWebviews();
    refreshExtensionNavigationItems();

    if (hasExtensionNavigationTarget(extensionId)) {
      return true;
    }
  }

  refreshExtensionNavigationItems();
  return false;
}

function tryUpgradeExtensionsFallbackPointer(): boolean {
  const currentPointer = extensionNavPointerState.value;
  if (currentPointer?.link !== EXTENSIONS_NAV_LINK) {
    return false;
  }
  if (!pendingExtensionIds.has(currentPointer.extensionId)) {
    return false;
  }

  const allWebviews = get(webviews) ?? [];
  const allContribs = get(contributions) ?? [];
  const better = resolvePointerForExtension(currentPointer.extensionId, allWebviews, allContribs, {
    allowFallback: false,
  });
  if (!better) {
    return false;
  }

  setExtensionNavPointer(better);
  refreshExtensionNavigationItems();
  stopNavPointerPolling();
  return true;
}

function resolveNavPointer(options: { allowFallback?: boolean } = {}): boolean {
  if (tryUpgradeExtensionsFallbackPointer()) {
    return true;
  }

  const currentPointer = extensionNavPointerState.value;
  if (currentPointer && pendingExtensionIds.has(currentPointer.extensionId)) {
    return true;
  }

  const allWebviews = get(webviews) ?? [];
  const allContribs = get(contributions) ?? [];

  for (const extensionId of pendingExtensionQueue) {
    const pointer = resolvePointerForExtension(extensionId, allWebviews, allContribs, {
      allowFallback: options.allowFallback === true,
    });
    if (pointer) {
      setExtensionNavPointer(pointer);
      refreshExtensionNavigationItems();
      // Keep polling when we only have the Extensions fallback — a dedicated
      // webview/contrib may still appear shortly after install.
      if (pointer.link === EXTENSIONS_NAV_LINK) {
        scheduleNavPointerPoll();
      } else {
        stopNavPointerPolling();
      }
      return true;
    }
  }

  if (currentPointer && !pendingExtensionIds.has(currentPointer.extensionId)) {
    setExtensionNavPointer(null);
  }

  return false;
}

function stopNavPointerPolling(): void {
  if (pollTimeout !== undefined) {
    clearTimeout(pollTimeout);
    pollTimeout = undefined;
  }
  pollAttempts = 0;
}

function scheduleNavPointerPoll(): void {
  if (pendingExtensionQueue.length === 0) {
    stopNavPointerPolling();
    return;
  }

  if (pollTimeout !== undefined) {
    return;
  }

  if (pollAttempts >= NAV_POINTER_MAX_ATTEMPTS) {
    stopNavPointerPolling();
    return;
  }

  pollAttempts += 1;
  pollTimeout = setTimeout(() => {
    pollTimeout = undefined;
    fetchWebviews()
      .finally(() => {
        if (tryUpgradeExtensionsFallbackPointer()) {
          return;
        }
        if (!extensionNavPointerState.value) {
          resolveNavPointer({ allowFallback: true });
        }
        scheduleNavPointerPoll();
      })
      .catch((error: unknown) => {
        console.error('Unable to fetch webviews while polling nav pointer', error);
      });
  }, NAV_POINTER_POLL_INTERVAL_MS);
}

function showNextNavPointer(): void {
  if (pendingExtensionQueue.length === 0) {
    stopNavPointerPolling();
    return;
  }

  pollAttempts = 0;
  if (resolveNavPointer({ allowFallback: false })) {
    return;
  }
  resolveNavPointer({ allowFallback: true });
}

function refreshExtensionNavigation(): void {
  fetchWebviews()
    .finally(() => {
      refreshExtensionNavigationItems();
      if (tryUpgradeExtensionsFallbackPointer()) {
        return;
      }
      if (!extensionNavPointerState.value) {
        if (!resolveNavPointer({ allowFallback: false })) {
          resolveNavPointer({ allowFallback: true });
        }
      }
    })
    .catch((error: unknown) => {
      console.error('Unable to refresh extension navigation', error);
    });
}

webviews.subscribe(() => {
  if (!tryUpgradeExtensionsFallbackPointer()) {
    resolveNavPointer({ allowFallback: false });
  }
});

contributions.subscribe(() => {
  if (!tryUpgradeExtensionsFallbackPointer()) {
    resolveNavPointer({ allowFallback: false });
  }
});

if (typeof window !== 'undefined' && window.events) {
  for (const eventName of ['extension-started', 'extensions-started', 'webview-create', 'webview-update'] as const) {
    window.events.receive(eventName, () => {
      refreshExtensionNavigation();
    });
  }
}

export function queueExtensionNavPointer(extensionId: string, displayName?: string): void {
  enqueueExtensionNavPointer(extensionId, displayName);
  pollAttempts = 0;

  // Another install callout is already visible — stay queued until it is dismissed.
  if (extensionNavPointerState.value) {
    return;
  }

  // Prefer a dedicated sidebar target; otherwise show the Extensions fallback
  // immediately so every Catalog install gets a post-install tooltip.
  if (resolveNavPointer({ allowFallback: false })) {
    return;
  }
  resolveNavPointer({ allowFallback: true });
}

export function onExtensionNewlyInstalled(extensionId: string, displayName?: string): void {
  queueExtensionNavPointer(extensionId, displayName);
}

export function dismissExtensionNavPointer(): void {
  const currentPointer = extensionNavPointerState.value;
  if (currentPointer) {
    dequeueExtensionNavPointer(currentPointer.extensionId);
  }
  setExtensionNavPointer(null);
  showNextNavPointer();
}

export function clearExtensionNavPointerForLink(link: string): void {
  const currentPointer = extensionNavPointerState.value;
  if (currentPointer?.link !== link) {
    return;
  }
  dequeueExtensionNavPointer(currentPointer.extensionId);
  setExtensionNavPointer(null);
  showNextNavPointer();
}

export function isExtensionNavPointerActive(link: string): boolean {
  return extensionNavPointerState.value?.link === link;
}

export function getExtensionNavPointer(): ExtensionNavPointerTarget | null {
  return extensionNavPointerState.value;
}

/** @internal Test helper */
export function resetExtensionNavPointerQueueForTests(): void {
  pendingExtensionQueue.length = 0;
  pendingExtensionIds.clear();
  pendingExtensionDisplayNames.clear();
  setExtensionNavPointer(null);
  stopNavPointerPolling();
  sidebarNavLinkAvailabilityOverride = undefined;
}
