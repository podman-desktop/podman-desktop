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

export function longPress(cb: () => void, button = 0, threshold = 500): Attachment {
  return node => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    const handleMouseDown = (event: Event): void => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button !== button) return;
      timeout = setTimeout(cb, threshold);
    };

    const handleCancel = (): void => {
      if (!timeout) return;
      clearTimeout(timeout);
      timeout = undefined;
    };

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mouseup', handleCancel);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseup', handleCancel);
    };
  };
}
