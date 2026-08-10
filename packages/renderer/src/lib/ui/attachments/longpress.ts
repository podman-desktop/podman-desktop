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

export function longPress(cb: () => void, button = 0, threshold = 500, moveCancelPx = 5): Attachment {
  return node => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    let startX = 0;
    let startY = 0;

    const handleCancel = (): void => {
      if (!timeout) return;
      clearTimeout(timeout);
      timeout = undefined;
      window.removeEventListener('pointermove', handlePointerMove);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (!timeout) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (dx * dx + dy * dy > moveCancelPx * moveCancelPx) {
        handleCancel();
      }
    };

    const handleMouseDown = (event: Event): void => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button !== button) return;
      startX = mouseEvent.clientX;
      startY = mouseEvent.clientY;
      handleCancel();
      timeout = setTimeout(() => {
        timeout = undefined;
        window.removeEventListener('pointermove', handlePointerMove);
        cb();
      }, threshold);
      window.addEventListener('pointermove', handlePointerMove);
    };

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mouseup', handleCancel);
    node.addEventListener('mouseleave', handleCancel);
    node.addEventListener('pointerleave', handleCancel);
    node.addEventListener('pointercancel', handleCancel);

    return () => {
      handleCancel();
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseup', handleCancel);
      node.removeEventListener('mouseleave', handleCancel);
      node.removeEventListener('pointerleave', handleCancel);
      node.removeEventListener('pointercancel', handleCancel);
    };
  };
}
