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

import type { DropSlotRect } from '@podman-desktop/core-api';
import { describe, expect, test } from 'vitest';

import { applyExternalInsert, applyInsertSlotReorder, computeDropSlot, isNoOpInsert } from './nav-drop-slot';

function rect(top: number, height = 40): DropSlotRect {
  return { top, height, bottom: top + height };
}

describe('computeDropSlot', () => {
  const rects = [rect(100), rect(150), rect(200)];
  const containerTop = 100;

  test('returns insert-before index and indicator at item top when pointer is above midpoint', () => {
    expect(computeDropSlot(110, rects, containerTop)).toEqual({ index: 0, indicatorY: 0 });
    expect(computeDropSlot(160, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
  });

  test('returns next slot when pointer is at or past an item midpoint', () => {
    expect(computeDropSlot(120, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
    expect(computeDropSlot(170, rects, containerTop)).toEqual({ index: 2, indicatorY: 100 });
  });

  test('returns after-last slot with indicator at last bottom', () => {
    expect(computeDropSlot(300, rects, containerTop)).toEqual({ index: 3, indicatorY: 140 });
  });

  test('returns slot 0 when there are no items', () => {
    expect(computeDropSlot(50, [], 0)).toEqual({ index: 0, indicatorY: 0 });
  });
});

describe('isNoOpInsert', () => {
  test('treats insert before self and insert after self as no-ops', () => {
    expect(isNoOpInsert(2, 2)).toBe(true);
    expect(isNoOpInsert(2, 3)).toBe(true);
    expect(isNoOpInsert(2, 1)).toBe(false);
    expect(isNoOpInsert(2, 4)).toBe(false);
  });
});

describe('applyInsertSlotReorder', () => {
  test('moves an item down within the list', () => {
    expect(applyInsertSlotReorder(['A', 'B', 'C'], 'A', 0, 3)).toEqual(['B', 'C', 'A']);
  });

  test('moves an item up within the list', () => {
    expect(applyInsertSlotReorder(['A', 'B', 'C'], 'C', 2, 0)).toEqual(['C', 'A', 'B']);
  });

  test('swaps two adjacent items when inserting after the neighbor', () => {
    expect(applyInsertSlotReorder(['A', 'B'], 'A', 0, 2)).toEqual(['B', 'A']);
  });

  test('returns unchanged ids for no-op inserts', () => {
    expect(applyInsertSlotReorder(['A', 'B'], 'A', 0, 0)).toEqual(['A', 'B']);
    expect(applyInsertSlotReorder(['A', 'B'], 'A', 0, 1)).toEqual(['A', 'B']);
  });
});

describe('applyExternalInsert', () => {
  test('inserts at the drop-line index in the full visible list', () => {
    expect(applyExternalInsert(['A', 'B', 'C'], 'X', 1)).toEqual(['A', 'X', 'B', 'C']);
    expect(applyExternalInsert(['A', 'B', 'C'], 'X', 0)).toEqual(['X', 'A', 'B', 'C']);
    expect(applyExternalInsert(['A', 'B', 'C'], 'X', 3)).toEqual(['A', 'B', 'C', 'X']);
  });

  test('moves an already-visible link to the drop index instead of duplicating', () => {
    expect(applyExternalInsert(['A', 'B', 'C'], 'B', 0)).toEqual(['B', 'A', 'C']);
  });

  test('clamps past the end to append', () => {
    expect(applyExternalInsert(['A', 'B'], 'X', 99)).toEqual(['A', 'B', 'X']);
  });

  test('inserts into an empty list', () => {
    expect(applyExternalInsert([], 'X', 5)).toEqual(['X']);
  });
});
