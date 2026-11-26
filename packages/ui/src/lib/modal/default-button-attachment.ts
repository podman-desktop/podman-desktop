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

// Attached modals in mount order, so only the topmost one handles Enter when modals are stacked.
const openModals: HTMLElement[] = [];

/**
 * Enter activates the button marked `data-default`, like a native desktop dialog. Controls that consume Enter
 * themselves (buttons, links, textareas, selects, contenteditable) keep their native behavior.
 * A body target means focus was dropped (e.g. a click on the dialog text), so the modal still owns the key.
 */
export const defaultButtonOnEnter: Attachment<HTMLElement> = modal => {
  const onKeydown = (e: KeyboardEvent): void => {
    if (
      e.key !== 'Enter' ||
      openModals.at(-1) !== modal ||
      e.defaultPrevented ||
      e.isComposing ||
      e.repeat ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    ) {
      return;
    }
    if (
      !(e.target instanceof HTMLElement) ||
      (e.target !== document.body && !modal.contains(e.target)) ||
      e.target.isContentEditable ||
      e.target.closest('button, a, textarea, select, input[type="button"], input[type="submit"], input[type="reset"]')
    ) {
      return;
    }
    const defaultButton = modal.querySelector<HTMLButtonElement>('button[data-default]:enabled');
    if (defaultButton) {
      e.preventDefault();
      defaultButton.click();
    }
  };

  openModals.push(modal);
  window.addEventListener('keydown', onKeydown);

  return (): void => {
    window.removeEventListener('keydown', onKeydown);
    openModals.splice(openModals.indexOf(modal), 1);
  };
};
