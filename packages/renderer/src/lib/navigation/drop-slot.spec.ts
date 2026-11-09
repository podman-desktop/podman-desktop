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

import type { DropSlotRect } from '@desktop-framework/api';
import { describe, expect, test } from 'vitest';

import { NavDropSlot } from '/@/lib/navigation/drop-slot';

function rect(top: number, height = 40): DropSlotRect {
  return { top, height, bottom: top + height };
}

const navDropSlot = new NavDropSlot();

describe('NavDropSlot.getDropSlot', () => {
  const rects = [rect(100), rect(150), rect(200)];
  const containerTop = 100;

  test('returns insert-before index and indicator at item top when pointer is above midpoint', () => {
    expect(navDropSlot.getDropSlot(110, rects, containerTop)).toEqual({ index: 0, indicatorY: 0 });
    expect(navDropSlot.getDropSlot(160, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
  });

  test('returns next slot when pointer is at or past an item midpoint', () => {
    expect(navDropSlot.getDropSlot(120, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
    expect(navDropSlot.getDropSlot(170, rects, containerTop)).toEqual({ index: 2, indicatorY: 100 });
  });

  test('returns after-last slot with indicator at last bottom', () => {
    expect(navDropSlot.getDropSlot(300, rects, containerTop)).toEqual({ index: 3, indicatorY: 140 });
  });

  test('returns slot 0 when there are no items', () => {
    expect(navDropSlot.getDropSlot(50, [], 0)).toEqual({ index: 0, indicatorY: 0 });
  });
});

describe('NavDropSlot.getAdjacentDropSlot', () => {
  test('returns the slot before the upper neighbour when moving up', () => {
    expect(navDropSlot.getAdjacentDropSlot(2, 'up', 4)).toBe(1);
  });

  test('returns the slot after the lower neighbour when moving down', () => {
    expect(navDropSlot.getAdjacentDropSlot(1, 'down', 4)).toBe(3);
    expect(navDropSlot.getAdjacentDropSlot(2, 'down', 4)).toBe(4);
  });

  test('returns undefined when the item is already first or last', () => {
    expect(navDropSlot.getAdjacentDropSlot(0, 'up', 4)).toBeUndefined();
    expect(navDropSlot.getAdjacentDropSlot(3, 'down', 4)).toBeUndefined();
  });
});

describe('NavDropSlot.keepsItemInPlace', () => {
  test('returns true for either adjacent slot that leaves the item in place', () => {
    expect(navDropSlot.keepsItemInPlace(2, 2)).toBe(true);
    expect(navDropSlot.keepsItemInPlace(2, 3)).toBe(true);
    expect(navDropSlot.keepsItemInPlace(2, 1)).toBe(false);
    expect(navDropSlot.keepsItemInPlace(2, 4)).toBe(false);
  });
});

describe('NavDropSlot.moveToSlot', () => {
  test('moves items up and down within the list', () => {
    expect(navDropSlot.moveToSlot(['A', 'B', 'C'], 2, 0)).toEqual(['C', 'A', 'B']);
    expect(navDropSlot.moveToSlot(['A', 'B', 'C'], 0, 3)).toEqual(['B', 'C', 'A']);
  });

  test('leaves an item in place when moved to either adjacent slot', () => {
    expect(navDropSlot.moveToSlot(['A', 'B', 'C'], 1, 1)).toEqual(['A', 'B', 'C']);
    expect(navDropSlot.moveToSlot(['A', 'B', 'C'], 1, 2)).toEqual(['A', 'B', 'C']);
  });

  test('moves an item to a lower slot without an off-by-one shift', () => {
    expect(navDropSlot.moveToSlot(['A', 'B', 'C', 'D'], 1, 2)).toEqual(['A', 'B', 'C', 'D']);
    expect(navDropSlot.moveToSlot(['A', 'B', 'C', 'D'], 1, 3)).toEqual(['A', 'C', 'B', 'D']);
    expect(navDropSlot.moveToSlot(['A', 'B', 'C', 'D'], 1, 4)).toEqual(['A', 'C', 'D', 'B']);
  });
});
