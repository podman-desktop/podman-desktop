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

import type { Attachment } from 'svelte/attachments';

import { NavDropSlot } from '/@/lib/navigation/drop-slot';

/**
 * Reorders the main navigation rows with a long-press pointer drag or with modifier+Arrow keys.
 * Rows are marked with `data-nav-drag-item="<link>"` inside a container element.
 * Methods committing a move return the new order of item names; the caller persists it.
 */
export class NavReorder {
  static readonly LONG_PRESS_MS = 350;
  protected static readonly ITEM_SELECTOR = '[data-nav-drag-item]';
  protected static readonly EDGE_SCROLL_PX = 40;
  protected static readonly EDGE_SCROLL_STEP = 12;

  readonly #navDropSlot = new NavDropSlot();

  sourceIndex = $state<number>();
  dropSlotIndex = $state<number>();
  dropIndicatorOffsetY = $state(0);
  pointerClientY = $state(0);
  pointerOffsetY = $state(0);
  /** Live-region message announced after a reorder. */
  announcement = $state('');

  readonly isDragging = $derived(this.sourceIndex !== undefined);
  readonly showDropLine = $derived(
    this.sourceIndex !== undefined &&
      this.dropSlotIndex !== undefined &&
      !this.#navDropSlot.keepsItemInPlace(this.sourceIndex, this.dropSlotIndex),
  );
  readonly ghostY = $derived(this.pointerClientY - this.pointerOffsetY);

  #pressedItem: HTMLElement | undefined;
  #pointerId = 0;
  // The registry re-renders after an async IPC round-trip, and moving the keyed row drops focus.
  #pendingFocus = $state<{ link: string; fromIndex: number }>();

  onPointerDown = (e: PointerEvent): void => {
    const target = e.currentTarget;
    if (e.button > 0 || !(target instanceof HTMLElement)) return;
    this.#pressedItem = target;
    this.#pointerId = e.pointerId;
    this.pointerClientY = e.clientY;
    this.pointerOffsetY = e.clientY - target.getBoundingClientRect().top;
  };

  start(sourceIndex: number, container: HTMLElement | undefined): void {
    if (!container) return;
    // A pointer drag must not steal the focus left pending by a keyboard move.
    this.#pendingFocus = undefined;
    this.sourceIndex = sourceIndex;
    this.#updateDropTarget(container, this.pointerClientY);
    document.body.style.cursor = 'grabbing';
    this.#pressedItem?.setPointerCapture(this.#pointerId);
  }

  onPointerMove(e: PointerEvent, container: HTMLElement | undefined, scrollRegion: HTMLElement | undefined): void {
    if (this.sourceIndex === undefined || !container) return;
    this.pointerClientY = e.clientY;
    if (scrollRegion) this.#scrollAtEdge(scrollRegion, e.clientY);
    this.#updateDropTarget(container, e.clientY);
  }

  onPointerUp(itemNames: string[]): string[] | undefined {
    if (this.sourceIndex === undefined) return undefined;
    const pressedItem = this.#pressedItem;
    const fromIndex = this.sourceIndex;
    const newOrder =
      this.showDropLine && this.dropSlotIndex !== undefined
        ? this.#moveToSlot(itemNames, this.sourceIndex, this.dropSlotIndex)
        : undefined;
    this.cancel();

    // The registry re-renders after the IPC round-trip and moving the keyed row blurs it,
    // so hand focus back the same way keyboard moves do. Without a committed move no
    // re-render follows, so refocus the row directly (the press blurred it).
    const link = pressedItem?.dataset.navDragItem;
    if (newOrder !== undefined && link !== undefined) {
      this.#pendingFocus = { link, fromIndex };
    } else {
      pressedItem?.querySelector<HTMLElement>('a')?.focus();
    }
    return newOrder;
  }

  cancel = (): void => {
    this.sourceIndex = undefined;
    this.dropSlotIndex = undefined;
    this.#pressedItem = undefined;
    this.pointerOffsetY = 0;
    document.body.style.cursor = '';
  };

  onContextMenu = (e: Event): void => {
    if (this.isDragging) e.preventDefault();
  };

  // Escape aborts an in-progress pointer drag; modifier+ArrowUp/Down moves the focused row.
  onKeyDown(e: KeyboardEvent, container: HTMLElement | undefined, itemNames: string[]): string[] | undefined {
    if (e.key === 'Escape' && this.isDragging) {
      e.preventDefault();
      this.cancel();
      return undefined;
    }
    if (!e.ctrlKey && !e.metaKey) return undefined;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return undefined;

    const focused = document.activeElement;
    if (!container || !(focused instanceof HTMLElement) || !container.contains(focused)) return undefined;

    const itemEl = focused.closest<HTMLElement>(NavReorder.ITEM_SELECTOR);
    const link = itemEl?.dataset.navDragItem;
    if (!itemEl || !link) return undefined;

    const items = this.#getItems(container);
    const sourceIndex = items.indexOf(itemEl);
    if (sourceIndex === -1) return undefined;

    const direction = e.key === 'ArrowUp' ? 'up' : 'down';
    const dropSlotIndex = this.#navDropSlot.getAdjacentDropSlot(sourceIndex, direction, items.length);
    if (dropSlotIndex === undefined) return undefined;

    e.preventDefault();
    this.#pendingFocus = { link, fromIndex: sourceIndex };
    return this.#moveToSlot(itemNames, sourceIndex, dropSlotIndex);
  }

  // Runs again after Svelte moved the row: once its index is no longer the one it started from,
  // the row takes focus back.
  focusPendingRow(link: string, index: number): Attachment {
    return node => {
      if (this.#pendingFocus?.link !== link || index === this.#pendingFocus.fromIndex) return;
      this.#pendingFocus = undefined;
      const target = node.querySelector<HTMLElement>('a');
      if (target && !target.contains(document.activeElement)) {
        target.focus();
      }
    };
  }

  // Move to the requested slot (before an item, or after the last item).
  #moveToSlot(itemNames: string[], sourceIndex: number, dropSlotIndex: number): string[] | undefined {
    const movedItemName = itemNames[sourceIndex];
    if (movedItemName === undefined) return undefined;

    const newOrder = this.#navDropSlot.moveToSlot(itemNames, sourceIndex, dropSlotIndex);
    const newPos = newOrder.indexOf(movedItemName) + 1;
    this.announcement = `Moved ${movedItemName} to position ${newPos} of ${newOrder.length}`;
    return newOrder;
  }

  #getItems(container: HTMLElement): HTMLElement[] {
    return [...container.querySelectorAll<HTMLElement>(NavReorder.ITEM_SELECTOR)];
  }

  // Update the drop line for an in-list reorder.
  #updateDropTarget(container: HTMLElement, pointerClientY: number): void {
    const rects = this.#getItems(container).map(item => item.getBoundingClientRect());
    const dropSlot = this.#navDropSlot.getDropSlot(pointerClientY, rects, container.getBoundingClientRect().top);
    this.dropSlotIndex = dropSlot.index;
    this.dropIndicatorOffsetY = dropSlot.indicatorY;
  }

  // Scroll the nav list when dragging near its top/bottom edge.
  #scrollAtEdge(scrollRegion: HTMLElement, pointerClientY: number): void {
    const rect = scrollRegion.getBoundingClientRect();
    if (pointerClientY < rect.top + NavReorder.EDGE_SCROLL_PX) {
      scrollRegion.scrollTop = Math.max(0, scrollRegion.scrollTop - NavReorder.EDGE_SCROLL_STEP);
    } else if (pointerClientY > rect.bottom - NavReorder.EDGE_SCROLL_PX) {
      scrollRegion.scrollTop = Math.min(
        scrollRegion.scrollHeight - scrollRegion.clientHeight,
        scrollRegion.scrollTop + NavReorder.EDGE_SCROLL_STEP,
      );
    }
  }
}
