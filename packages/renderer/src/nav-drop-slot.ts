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

export class NavDropSlot {
  // Index `i` inserts before item `i`; `rects.length` inserts after the last item.
  getDropSlot(clientY: number, rects: DropSlotRect[], containerTop: number): DropSlot {
    for (const [index, rect] of rects.entries()) {
      if (clientY < rect.top + rect.height / 2) {
        return { index, indicatorY: rect.top - containerTop };
      }
    }
    const lastRect = rects.at(-1);
    return { index: rects.length, indicatorY: lastRect ? lastRect.bottom - containerTop : 0 };
  }

  // The slots immediately before and after an item leave its position unchanged.
  keepsItemInPlace(sourceIndex: number, dropSlotIndex: number): boolean {
    return dropSlotIndex === sourceIndex || dropSlotIndex === sourceIndex + 1;
  }

  // Add a new item or move an existing item to an insert-before slot.
  insertOrMoveAtSlot(itemNames: string[], itemName: string, dropSlotIndex: number): string[] {
    const result = [...itemNames];
    const sourceIndex = result.indexOf(itemName);
    if (sourceIndex !== -1) {
      result.splice(sourceIndex, 1);
    }
    const targetIndex = sourceIndex !== -1 && sourceIndex < dropSlotIndex ? dropSlotIndex - 1 : dropSlotIndex;
    result.splice(Math.max(0, Math.min(targetIndex, result.length)), 0, itemName);
    return result;
  }
}
