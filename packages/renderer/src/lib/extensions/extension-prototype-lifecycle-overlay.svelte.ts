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

import { writable } from 'svelte/store';

export const PROTOTYPE_TRANSIENT_LIFECYCLE_MS = 3000;

/** Matches USE_CASE_EXTENSION_IDS.activating without importing prototype use cases. */
export const PROTOTYPE_ACTIVATING_EXTENSION_ID = 'podman-desktop.kubectl-cli';

/** Matches USE_CASE_EXTENSION_IDS.disabling without importing prototype use cases. */
export const PROTOTYPE_DISABLING_EXTENSION_ID = 'podman-desktop.lima';

export type PrototypeTransientLifecycleState = 'starting' | 'stopping';

export const prototypeLifecycleOverlayRevisionStore = writable(0);

/** @deprecated Use prototypeLifecycleOverlayRevisionStore */
export const prototypeActivatingOverlayRevisionStore = prototypeLifecycleOverlayRevisionStore;

interface TransientLifecycleOverlay {
  state: PrototypeTransientLifecycleState;
  timer: ReturnType<typeof setTimeout>;
}

const transientLifecycleOverlays = new Map<string, TransientLifecycleOverlay>();
let prototypeLifecycleDemosEnabled = false;

function notifyLifecycleOverlayRevision(): void {
  prototypeLifecycleOverlayRevisionStore.update(revision => revision + 1);
}

function clearTransientLifecycleOverlay(extensionId: string): void {
  const existing = transientLifecycleOverlays.get(extensionId);
  if (!existing) {
    return;
  }

  clearTimeout(existing.timer);
  transientLifecycleOverlays.delete(extensionId);
}

export function setPrototypeLifecycleDemosEnabled(enabled: boolean): void {
  prototypeLifecycleDemosEnabled = enabled;
  if (!enabled) {
    resetPrototypeLifecycleOverlaysForTests();
  }
}

function extensionIdsLooselyMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }
  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

export function getPrototypeTransientLifecycleState(extensionId: string): PrototypeTransientLifecycleState | undefined {
  const direct = transientLifecycleOverlays.get(extensionId)?.state;
  if (direct) {
    return direct;
  }
  for (const [id, overlay] of transientLifecycleOverlays) {
    if (extensionIdsLooselyMatch(id, extensionId)) {
      return overlay.state;
    }
  }
  return undefined;
}

export function isPrototypeActivatingOverlayActive(): boolean {
  return getPrototypeTransientLifecycleState(PROTOTYPE_ACTIVATING_EXTENSION_ID) === 'starting';
}

function startPrototypeTransientLifecycle(extensionId: string, state: PrototypeTransientLifecycleState): void {
  if (!prototypeLifecycleDemosEnabled) {
    return;
  }

  clearTransientLifecycleOverlay(extensionId);

  const timer = globalThis.setTimeout(() => {
    clearTransientLifecycleOverlay(extensionId);
    notifyLifecycleOverlayRevision();
  }, PROTOTYPE_TRANSIENT_LIFECYCLE_MS);

  transientLifecycleOverlays.set(extensionId, { state, timer });
  notifyLifecycleOverlayRevision();
}

export function startPrototypeActivatingTransient(extensionId: string): void {
  startPrototypeTransientLifecycle(extensionId, 'starting');
}

export function startPrototypeDisablingTransient(extensionId: string): void {
  startPrototypeTransientLifecycle(extensionId, 'stopping');
}

export function startPrototypeActivatingOverlay(): void {
  startPrototypeActivatingTransient(PROTOTYPE_ACTIVATING_EXTENSION_ID);
}

export function startPrototypeDisablingOverlay(): void {
  startPrototypeDisablingTransient(PROTOTYPE_DISABLING_EXTENSION_ID);
}

/** @deprecated Use startPrototypeActivatingTransient */
export function restartActivatingDemoForExtension(extensionId: string): void {
  startPrototypeActivatingTransient(extensionId);
}

export function resetPrototypeLifecycleOverlaysForTests(): void {
  for (const extensionId of [...transientLifecycleOverlays.keys()]) {
    clearTransientLifecycleOverlay(extensionId);
  }
  prototypeLifecycleOverlayRevisionStore.set(0);
}

/** @deprecated Use resetPrototypeLifecycleOverlaysForTests */
export function resetPrototypeActivatingOverlayForTests(): void {
  resetPrototypeLifecycleOverlaysForTests();
}

/** @deprecated Use PROTOTYPE_TRANSIENT_LIFECYCLE_MS */
export const PROTOTYPE_ACTIVATING_OVERLAY_MS = PROTOTYPE_TRANSIENT_LIFECYCLE_MS;

/** @deprecated Transient overlays are tracked per extension */
export const prototypeActivatingOverlayActiveStore = prototypeLifecycleOverlayRevisionStore;
