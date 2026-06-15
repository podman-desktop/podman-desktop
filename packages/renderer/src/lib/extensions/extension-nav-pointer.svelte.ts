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
import { contributions } from '/@/stores/contribs';
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

const NAV_POINTER_POLL_INTERVAL_MS = 500;
const NAV_POINTER_MAX_ATTEMPTS = 60;
const POST_INSTALL_SYNC_INTERVAL_MS = 250;
const POST_INSTALL_SYNC_MAX_ATTEMPTS = 40;

const AI_LAB_EXTENSION_ID = 'redhat.ai-lab';
const AI_LAB_NAV_NAME = 'AI Lab';

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

function enqueueExtensionNavPointer(extensionId: string): void {
  if (pendingExtensionIds.has(extensionId)) {
    return;
  }
  pendingExtensionIds.add(extensionId);
  pendingExtensionQueue.push(extensionId);
}

function dequeueExtensionNavPointer(extensionId: string): void {
  pendingExtensionIds.delete(extensionId);
  const index = pendingExtensionQueue.indexOf(extensionId);
  if (index >= 0) {
    pendingExtensionQueue.splice(index, 1);
  }
}

export function findWebviewForExtension(extensionId: string, allWebviews: WebviewInfo[]): WebviewInfo | undefined {
  const byExtensionId = allWebviews.find(item => item.extensionId === extensionId);
  if (byExtensionId) {
    return byExtensionId;
  }

  if (extensionId === AI_LAB_EXTENSION_ID) {
    return allWebviews.find(item => item.name === AI_LAB_NAV_NAME || item.viewType === 'studio');
  }

  return undefined;
}

function resolvePointerForExtension(
  extensionId: string,
  allWebviews: WebviewInfo[],
  allContribs: ContributionInfo[],
): ExtensionNavPointerTarget | null {
  const webview = findWebviewForExtension(extensionId, allWebviews);
  if (webview) {
    return {
      extensionId,
      link: `/webviews/${webview.id}`,
      label: webview.name,
      tooltip: buildExtensionNewNavigationTooltip(webview.name),
    };
  }

  const contrib = allContribs.find(item => item.extensionId === extensionId);
  if (contrib) {
    return {
      extensionId,
      link: `/contribs/${contrib.name}`,
      label: contrib.name,
      tooltip: buildExtensionNewNavigationTooltip(contrib.name),
    };
  }

  const knownLocation = resolveExtensionPostInstallLocation(extensionId);
  if (knownLocation) {
    return {
      extensionId,
      link: knownLocation.link,
      label: knownLocation.navLabel,
      tooltip: knownLocation.tooltip,
    };
  }

  return null;
}

function hasExtensionNavigationTarget(extensionId: string): boolean {
  const allWebviews = get(webviews) ?? [];
  const allContribs = get(contributions) ?? [];
  return resolvePointerForExtension(extensionId, allWebviews, allContribs) !== null;
}

/** Wait until the extension webview/contrib is registered, then refresh sidebar nav. */
export async function syncExtensionNavigationAfterInstall(extensionId: string): Promise<boolean> {
  for (let attempt = 0; attempt < POST_INSTALL_SYNC_MAX_ATTEMPTS; attempt += 1) {
    await fetchWebviews();
    refreshExtensionNavigationItems();

    if (hasExtensionNavigationTarget(extensionId)) {
      return true;
    }

    await delay(POST_INSTALL_SYNC_INTERVAL_MS);
  }

  refreshExtensionNavigationItems();
  return false;
}

function resolveNavPointer(): boolean {
  const currentPointer = extensionNavPointerState.value;
  if (currentPointer && pendingExtensionIds.has(currentPointer.extensionId)) {
    return true;
  }

  const allWebviews = get(webviews) ?? [];
  const allContribs = get(contributions) ?? [];

  for (const extensionId of pendingExtensionQueue) {
    const pointer = resolvePointerForExtension(extensionId, allWebviews, allContribs);
    if (pointer) {
      setExtensionNavPointer(pointer);
      refreshExtensionNavigationItems();
      stopNavPointerPolling();
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

  if (resolveNavPointer()) {
    return;
  }

  if (pollAttempts >= NAV_POINTER_MAX_ATTEMPTS) {
    stopNavPointerPolling();
    return;
  }

  pollAttempts += 1;
  pollTimeout = setTimeout(() => {
    fetchWebviews()
      .finally(() => {
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
  if (!resolveNavPointer()) {
    scheduleNavPointerPoll();
  }
}

function refreshExtensionNavigation(): void {
  fetchWebviews()
    .finally(() => {
      refreshExtensionNavigationItems();
      if (!extensionNavPointerState.value) {
        if (!resolveNavPointer()) {
          scheduleNavPointerPoll();
        }
        return;
      }
      resolveNavPointer();
    })
    .catch((error: unknown) => {
      console.error('Unable to refresh extension navigation', error);
    });
}

webviews.subscribe(() => {
  resolveNavPointer();
});

contributions.subscribe(() => {
  resolveNavPointer();
});

if (typeof window !== 'undefined' && window.events) {
  for (const eventName of ['extension-started', 'extensions-started', 'webview-create', 'webview-update'] as const) {
    window.events.receive(eventName, () => {
      refreshExtensionNavigation();
    });
  }
}

export function queueExtensionNavPointer(extensionId: string): void {
  enqueueExtensionNavPointer(extensionId);
  pollAttempts = 0;

  if (extensionNavPointerState.value) {
    return;
  }

  if (resolveNavPointer()) {
    return;
  }

  refreshExtensionNavigation();
}

export function onExtensionNewlyInstalled(extensionId: string): void {
  queueExtensionNavPointer(extensionId);
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
  setExtensionNavPointer(null);
  stopNavPointerPolling();
}
