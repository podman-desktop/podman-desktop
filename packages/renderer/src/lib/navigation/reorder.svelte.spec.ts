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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { NavReorder } from '/@/lib/navigation/reorder.svelte';

const ITEM_NAMES = ['A', 'B', 'C'];

let container: HTMLDivElement;
let rows: HTMLDivElement[];
let navReorder: NavReorder;

beforeEach(() => {
  container = document.createElement('div');
  rows = ITEM_NAMES.map((name, index) => {
    const row = document.createElement('div');
    row.dataset.navDragItem = `/${name}`;
    row.getBoundingClientRect = (): DOMRect => new DOMRect(0, index * 40, 100, 40);
    row.setPointerCapture = vi.fn();
    const link = document.createElement('a');
    link.href = `/${name}`;
    row.appendChild(link);
    container.appendChild(row);
    return row;
  });
  document.body.appendChild(container);
  navReorder = new NavReorder();
});

afterEach(() => {
  container.remove();
});

function pressOnRow(index: number, clientY: number): void {
  rows[index].addEventListener('pointerdown', navReorder.onPointerDown);
  rows[index].dispatchEvent(new PointerEvent('pointerdown', { button: 0, clientY, pointerId: 7 }));
  navReorder.start(index, container);
}

describe('pointer reorder', () => {
  test('returns the order at the drop slot on release', () => {
    pressOnRow(0, 20);
    expect(navReorder.isDragging).toBe(true);
    expect(rows[0].setPointerCapture).toHaveBeenCalledWith(7);

    // Past the middle of the last row: the slot after it.
    navReorder.onPointerMove(new PointerEvent('pointermove', { clientY: 110 }), container, undefined);
    expect(navReorder.showDropLine).toBe(true);
    expect(navReorder.dropIndicatorOffsetY).toBe(120);
    expect(navReorder.ghostY).toBe(90);

    expect(navReorder.onPointerUp(ITEM_NAMES)).toEqual(['B', 'C', 'A']);
    expect(navReorder.announcement).toBe('Moved A to position 3 of 3');
    expect(navReorder.isDragging).toBe(false);
  });

  test('returns undefined when released on a slot that keeps the item in place', () => {
    pressOnRow(1, 60);

    navReorder.onPointerMove(new PointerEvent('pointermove', { clientY: 70 }), container, undefined);
    expect(navReorder.showDropLine).toBe(false);

    expect(navReorder.onPointerUp(ITEM_NAMES)).toBeUndefined();
  });

  test('refocuses the moved row once the registry renders it at its new index', () => {
    pressOnRow(0, 20);
    navReorder.onPointerMove(new PointerEvent('pointermove', { clientY: 110 }), container, undefined);
    expect(navReorder.onPointerUp(ITEM_NAMES)).toEqual(['B', 'C', 'A']);

    // Still at its old index: nothing to focus yet.
    navReorder.focusPendingRow('/A', 0)(rows[0]);
    expect(document.activeElement).not.toBe(rows[0].querySelector('a'));

    // Re-rendered at its new index: takes focus back.
    navReorder.focusPendingRow('/A', 2)(rows[0]);
    expect(document.activeElement).toBe(rows[0].querySelector('a'));
  });

  test('focuses the pressed row when the drop keeps it in place', () => {
    pressOnRow(1, 60);
    navReorder.onPointerMove(new PointerEvent('pointermove', { clientY: 70 }), container, undefined);

    expect(navReorder.onPointerUp(ITEM_NAMES)).toBeUndefined();
    expect(document.activeElement).toBe(rows[1].querySelector('a'));
  });

  test('does not start without a container', () => {
    navReorder.start(0, undefined);

    expect(navReorder.isDragging).toBe(false);
  });

  test('Escape cancels the drag without a new order', () => {
    pressOnRow(0, 20);
    navReorder.onPointerMove(new PointerEvent('pointermove', { clientY: 110 }), container, undefined);

    const escape = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    expect(navReorder.onKeyDown(escape, container, ITEM_NAMES)).toBeUndefined();

    expect(escape.defaultPrevented).toBe(true);
    expect(navReorder.isDragging).toBe(false);
    expect(navReorder.onPointerUp(ITEM_NAMES)).toBeUndefined();
  });
});

describe('keyboard reorder', () => {
  function pressOnFocusedRow(index: number, key: string): { event: KeyboardEvent; newOrder?: string[] } {
    rows[index].querySelector('a')?.focus();
    const event = new KeyboardEvent('keydown', { key, ctrlKey: true, cancelable: true });
    return { event, newOrder: navReorder.onKeyDown(event, container, ITEM_NAMES) };
  }

  test('Ctrl+ArrowDown moves the focused item down', () => {
    const { event, newOrder } = pressOnFocusedRow(0, 'ArrowDown');

    expect(event.defaultPrevented).toBe(true);
    expect(newOrder).toEqual(['B', 'A', 'C']);
  });

  test('Ctrl+ArrowUp moves the focused item up', () => {
    expect(pressOnFocusedRow(2, 'ArrowUp').newOrder).toEqual(['A', 'C', 'B']);
  });

  test('does nothing for the first item up or the last item down', () => {
    const first = pressOnFocusedRow(0, 'ArrowUp');
    const last = pressOnFocusedRow(2, 'ArrowDown');

    expect(first.newOrder).toBeUndefined();
    expect(first.event.defaultPrevented).toBe(false);
    expect(last.newOrder).toBeUndefined();
    expect(last.event.defaultPrevented).toBe(false);
  });

  test('ignores arrows without a modifier', () => {
    rows[0].querySelector('a')?.focus();

    expect(
      navReorder.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }), container, ITEM_NAMES),
    ).toBeUndefined();
  });
});
