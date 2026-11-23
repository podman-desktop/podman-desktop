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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * The element that should be described by the tooltip: the first focusable descendant
 * of the trigger, so screen readers announce the tooltip when it gets focus, or the trigger itself.
 */
export function getTooltipAriaTarget(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? root;
}

function getDescribedByIds(target: HTMLElement): string[] {
  return (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
}

/** Adds the id to the target's aria-describedby, keeping any ids already referenced. */
export function addAriaDescribedBy(target: HTMLElement, id: string): void {
  const ids = getDescribedByIds(target);
  if (!ids.includes(id)) {
    target.setAttribute('aria-describedby', [...ids, id].join(' '));
  }
}

/** Removes only the id from the target's aria-describedby, leaving ids set by others untouched. */
export function removeAriaDescribedBy(target: HTMLElement, id: string): void {
  const ids = getDescribedByIds(target).filter(describedById => describedById !== id);
  if (ids.length) {
    target.setAttribute('aria-describedby', ids.join(' '));
  } else {
    target.removeAttribute('aria-describedby');
  }
}
