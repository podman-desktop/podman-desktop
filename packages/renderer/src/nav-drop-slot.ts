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

import type { DropSlot, DropSlotRect } from '@podman-desktop/core-api';

/**
 * Compute an insert-slot index from a pointer Y, using each item's vertical midpoint.
 * Index `i` means "insert before item i"; index `rects.length` means "insert after the last item".
 */
export function computeDropSlot(clientY: number, rects: DropSlotRect[], containerTop: number): DropSlot {
  for (let i = 0; i < rects.length; i++) {
    if (clientY < rects[i].top + rects[i].height / 2) {
      return { index: i, indicatorY: rects[i].top - containerTop };
    }
  }
  const lastBottom = rects.length > 0 ? rects[rects.length - 1].bottom - containerTop : 0;
  return { index: rects.length, indicatorY: lastBottom };
}

/** True when the insert slot leaves the item in the same place. */
export function isNoOpInsert(fromIndex: number, insertIndex: number): boolean {
  return insertIndex === fromIndex || insertIndex === fromIndex + 1;
}

/**
 * Insert a link into the visible nav order at the drop-line index.
 * `visualIds` is the current top-to-bottom list of entry links.
 */
export function applyExternalInsert(visualIds: string[], link: string, visualDropIndex: number): string[] {
  const result = visualIds.filter(id => id !== link);
  const insertIdx = Math.min(Math.max(0, visualDropIndex), result.length);
  result.splice(insertIdx, 0, link);
  return result;
}

/** Move `movedId` from `fromIndex` to insert-before `insertIndex` within the full nav id list. */
export function applyInsertSlotReorder(
  ids: string[],
  movedId: string,
  fromIndex: number,
  insertIndex: number,
): string[] {
  if (isNoOpInsert(fromIndex, insertIndex)) {
    return [...ids];
  }
  const result = [...ids];
  const [removed] = result.splice(fromIndex, 1);
  let at = insertIndex;
  if (fromIndex < insertIndex) {
    at--;
  }
  result.splice(at, 0, removed ?? movedId);
  return result;
}
