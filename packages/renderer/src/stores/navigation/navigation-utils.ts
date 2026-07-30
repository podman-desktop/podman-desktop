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
import { get, type Readable } from 'svelte/store';

import { navigationDragState } from './navigation-drag-state.svelte';
import type { NavigationRegistryEntry } from './navigation-registry';

interface NavigationPinContext {
  navigationRegistry: Readable<NavigationRegistryEntry[]>;
  pinToNavbar: (payload: DragPayload) => number | undefined;
}

export class NavigationUtils {
  static readonly KEY_SHORTCUTS = 'Control+ArrowLeft Meta+ArrowLeft';

  private static readonly MOVE_SUPPRESS_PX = 5;

  private lastPointerX = 0;
  private lastPointerY = 0;
  private suppressClick = false;
  private pinStartX = 0;
  private pinStartY = 0;

  constructor(private readonly pinContext?: NavigationPinContext) {}

  formatNavigationName(name: string, parentName?: string): string {
    return parentName ? `${parentName} > ${name}` : name;
  }

  flattenNavigationEntries(entries: NavigationRegistryEntry[], parentName?: string): NavigationRegistryEntry[] {
    const flat: NavigationRegistryEntry[] = [];
    for (const entry of entries) {
      const resolvedParentName = parentName ?? entry.parentName;
      if (entry.type === 'group') {
        flat.push(...this.flattenNavigationEntries(entry.items ?? [], resolvedParentName));
        continue;
      }

      flat.push(resolvedParentName === entry.parentName ? entry : { ...entry, parentName: resolvedParentName });
      if (entry.type === 'submenu') {
        flat.push(
          ...this.flattenNavigationEntries(
            entry.items ?? [],
            this.formatNavigationName(entry.name, resolvedParentName),
          ),
        );
      }
    }
    return flat;
  }

  findNavigationEntryByLink(
    entries: NavigationRegistryEntry[],
    link: string,
    parentName?: string,
  ): NavigationRegistryEntry | undefined {
    for (const entry of entries) {
      const resolvedParentName = parentName ?? entry.parentName;
      if (entry.type !== 'group' && entry.link === link) {
        return resolvedParentName === entry.parentName ? entry : { ...entry, parentName: resolvedParentName };
      }
      const childParentName =
        entry.type === 'submenu' ? this.formatNavigationName(entry.name, resolvedParentName) : resolvedParentName;
      const child = this.findNavigationEntryByLink(entry.items ?? [], link, childParentName);
      if (child) {
        return child;
      }
    }
    return undefined;
  }

  getVisibleOrderedEntries(entries: NavigationRegistryEntry[]): NavigationRegistryEntry[] {
    return this.flattenNavigationEntries(entries)
      .filter(entry => !entry.hidden && entry.index !== undefined)
      .toSorted((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }

  private onWindowDragMove = (e: PointerEvent): void => {
    navigationDragState.pointerX = e.clientX;
    navigationDragState.pointerY = e.clientY;
    if (!this.suppressClick) {
      const dx = e.clientX - this.pinStartX;
      const dy = e.clientY - this.pinStartY;
      if (dx * dx + dy * dy > NavigationUtils.MOVE_SUPPRESS_PX * NavigationUtils.MOVE_SUPPRESS_PX) {
        this.suppressClick = true;
      }
    }
  };

  resetPin = (): void => {
    window.removeEventListener('pointermove', this.onWindowDragMove);
    window.removeEventListener('pointerup', this.resetPin);
    navigationDragState.payload = undefined;
    navigationDragState.grabOffsetX = 0;
    navigationDragState.grabOffsetY = 0;
    document.body.style.cursor = '';
  };

  onPinPointerDown = (e: PointerEvent): void => {
    if (e.button > 0) return;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    const target = e.currentTarget as HTMLElement | null;
    const rect = target?.getBoundingClientRect();
    if (rect) {
      navigationDragState.grabOffsetX = e.clientX - rect.left;
      navigationDragState.grabOffsetY = e.clientY - rect.top;
    }
    this.suppressClick = false;
  };

  beginPin = (payload: DragPayload): void => {
    const pinContext = this.pinContext;
    if (!pinContext) {
      return;
    }
    const entry = this.findNavigationEntryByLink(get(pinContext.navigationRegistry), payload.link);
    if (!entry) {
      return;
    }
    // Do not set suppressClick here — a still long-press must still navigate.
    this.suppressClick = false;
    this.pinStartX = this.lastPointerX;
    this.pinStartY = this.lastPointerY;
    navigationDragState.payload = { name: entry.name, parentName: entry.parentName, link: entry.link };
    navigationDragState.pointerX = this.lastPointerX;
    navigationDragState.pointerY = this.lastPointerY;
    document.body.style.cursor = 'grabbing';
    window.addEventListener('pointermove', this.onWindowDragMove);
    window.addEventListener('pointerup', this.resetPin);
    navigator.vibrate?.(15);
  };

  consumePinClick = (e: MouseEvent): boolean => {
    if (!this.suppressClick) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    this.suppressClick = false;
    return true;
  };

  onPinKeyDown = (payload: DragPayload, event: KeyboardEvent): void => {
    if (event.key !== 'ArrowLeft' || (!event.ctrlKey && !event.metaKey)) {
      return;
    }
    const pinContext = this.pinContext;
    if (!pinContext) {
      return;
    }
    event.preventDefault();
    const entry = this.findNavigationEntryByLink(get(pinContext.navigationRegistry), payload.link);
    if (!entry) {
      return;
    }
    const result = pinContext.pinToNavbar(payload);
    if (result === undefined) {
      return;
    }
    const name = this.formatNavigationName(entry.name, entry.parentName);
    navigationDragState.announcement = `Pinned ${name} to main navigation at position ${result}`;
  };
}
