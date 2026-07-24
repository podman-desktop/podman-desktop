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

import {
  getPrototypeTransientLifecycleState,
  prototypeLifecycleOverlayRevisionStore,
  startPrototypeActivatingTransient,
  startPrototypeDisablingTransient,
} from './extension-prototype-lifecycle-overlay.svelte';

export const EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT = 'extension-lifecycle-user-toggle';

const userDisabledExtensionIds = new Set<string>();
const userEnabledExtensionIds = new Set<string>();

function extensionIdsMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }
  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

function setHasMatchingId(set: Set<string>, extensionId: string): boolean {
  if (set.has(extensionId)) {
    return true;
  }
  for (const id of set) {
    if (extensionIdsMatch(id, extensionId)) {
      return true;
    }
  }
  return false;
}

function notifyLifecycleUserToggle(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT));
  }
}

function ensureLifecycleOverlayRevision(extensionId: string): void {
  // Transient start already bumps when demos are enabled. When demos are off,
  // bump so Status/Actions still re-render for Disabled/Installed.
  if (!getPrototypeTransientLifecycleState(extensionId)) {
    prototypeLifecycleOverlayRevisionStore.update(revision => revision + 1);
  }
}

export function markExtensionUserDisabled(extensionId: string): void {
  userDisabledExtensionIds.add(extensionId);
  userEnabledExtensionIds.delete(extensionId);
  startPrototypeDisablingTransient(extensionId);
  ensureLifecycleOverlayRevision(extensionId);
  notifyLifecycleUserToggle();
}

export function markExtensionUserEnabled(extensionId: string): void {
  userEnabledExtensionIds.add(extensionId);
  userDisabledExtensionIds.delete(extensionId);
  startPrototypeActivatingTransient(extensionId);
  ensureLifecycleOverlayRevision(extensionId);
  notifyLifecycleUserToggle();
}

export function isExtensionUserDisabled(extensionId: string): boolean {
  return setHasMatchingId(userDisabledExtensionIds, extensionId);
}

export function isExtensionUserEnabled(extensionId: string): boolean {
  return setHasMatchingId(userEnabledExtensionIds, extensionId);
}

export function resetExtensionLifecycleUserTogglesForTests(): void {
  userDisabledExtensionIds.clear();
  userEnabledExtensionIds.clear();
}
