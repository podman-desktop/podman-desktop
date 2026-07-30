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

import type { DragPayload } from '@podman-desktop/core-api';

import { navigationDragState } from './navigation-drag-state.svelte';

/** Suppress the following click only after the pointer actually moves while pinning. */
const MOVE_SUPPRESS_PX = 5;

/**
 * Shared long-press → pin-drag session for submenu and settings sidebars.
 * Same pattern as navigation-history: module state + exported functions.
 */
export const navigationPinSource = $state<{
  draggingLink?: string;
}>({});

let lastPointerX = 0;
let lastPointerY = 0;
let suppressClick = false;
let pinStartX = 0;
let pinStartY = 0;

function onWindowDragMove(e: PointerEvent): void {
  navigationDragState.pointerX = e.clientX;
  navigationDragState.pointerY = e.clientY;
  if (!suppressClick) {
    const dx = e.clientX - pinStartX;
    const dy = e.clientY - pinStartY;
    if (dx * dx + dy * dy > MOVE_SUPPRESS_PX * MOVE_SUPPRESS_PX) {
      suppressClick = true;
    }
  }
}

export function resetPin(): void {
  window.removeEventListener('pointermove', onWindowDragMove);
  window.removeEventListener('pointerup', resetPin);
  navigationPinSource.draggingLink = undefined;
  navigationDragState.payload = undefined;
  navigationDragState.grabOffsetX = 0;
  navigationDragState.grabOffsetY = 0;
  document.body.style.cursor = '';
}

export function onPinPointerDown(e: PointerEvent): void {
  if (e.button > 0) return;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
  const target = e.currentTarget as HTMLElement | null;
  const rect = target?.getBoundingClientRect();
  if (rect) {
    navigationDragState.grabOffsetX = e.clientX - rect.left;
    navigationDragState.grabOffsetY = e.clientY - rect.top;
  }
  suppressClick = false;
}

export function beginPin(payload: DragPayload): void {
  navigationPinSource.draggingLink = payload.link;
  // Do not set suppressClick here — a still long-press must still navigate.
  suppressClick = false;
  pinStartX = lastPointerX;
  pinStartY = lastPointerY;
  navigationDragState.payload = payload;
  navigationDragState.pointerX = lastPointerX;
  navigationDragState.pointerY = lastPointerY;
  document.body.style.cursor = 'grabbing';
  window.addEventListener('pointermove', onWindowDragMove);
  window.addEventListener('pointerup', resetPin);
  navigator.vibrate?.(15);
}

/** Returns true when the click was swallowed after a long-press drag with movement. */
export function consumePinClick(e: MouseEvent): boolean {
  if (!suppressClick) {
    return false;
  }
  e.preventDefault();
  e.stopPropagation();
  suppressClick = false;
  return true;
}
