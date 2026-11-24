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

import type { Placement } from '@floating-ui/dom';
import { mount, unmount } from 'svelte';
import type { Attachment } from 'svelte/attachments';

import { addAriaDescribedBy, getTooltipAriaTarget, removeAriaDescribedBy } from './tooltip-aria';
import { tooltipHidden } from './tooltip-store';
import TooltipPopup, { nextTooltipId } from './TooltipPopup.svelte';

export interface TooltipOptions {
  placement?: Placement;
}

/**
 * Tooltip attachment, to be used with `{@attach tooltip(...)}`.
 *
 * When the tip can change, pass a getter (`{@attach tooltip(() => status)}`): a visible tooltip
 * then updates its text in place, whereas a changing string recreates the attachment and hides it.
 */
export function tooltip(tip: string | (() => string), options?: TooltipOptions): Attachment<HTMLElement> {
  const getTip = typeof tip === 'function' ? tip : (): string => tip;

  return (el: HTMLElement) => {
    const tooltipId = nextTooltipId();
    // tip is a getter, so the mounted popup reads it reactively and updates its text in place
    const popupProps = {
      reference: el,
      id: tooltipId,
      placement: options?.placement ?? 'top',
      get tip(): string {
        return getTip();
      },
    };

    let isHidden = false;
    let popup: ReturnType<typeof mount> | undefined;
    let ariaTarget: HTMLElement | undefined;

    const unsubscribe = tooltipHidden.subscribe(hidden => {
      isHidden = hidden;
      if (hidden) {
        hide();
      }
    });

    const stopTipUpdates = $effect.root(() => {
      $effect(() => {
        const currentTip = getTip();
        if (!currentTip) {
          hide();
        } else if (popup) {
          updateAriaDescribedBy(currentTip);
        }
      });
    });

    // Reference the tooltip from aria-describedby, unless it only repeats the element's aria-label
    function updateAriaDescribedBy(currentTip: string): void {
      if (!ariaTarget) return;

      if (currentTip.trim() === ariaTarget.getAttribute('aria-label')?.trim()) {
        removeAriaDescribedBy(ariaTarget, tooltipId);
      } else {
        addAriaDescribedBy(ariaTarget, tooltipId);
      }
    }

    function show(): void {
      const currentTip = getTip();
      if (isHidden || !currentTip || popup) return;

      popup = mount(TooltipPopup, { target: document.body, props: popupProps });
      ariaTarget = getTooltipAriaTarget(el);
      updateAriaDescribedBy(currentTip);
      // Escape dismisses the tooltip without moving the pointer or focus
      document.addEventListener('keydown', handleKeyDown);
    }

    function hide(): void {
      if (!popup) return;

      if (ariaTarget) {
        removeAriaDescribedBy(ariaTarget, tooltipId);
        ariaTarget = undefined;
      }
      document.removeEventListener('keydown', handleKeyDown);
      unmount(popup).catch(console.error);
      popup = undefined;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        hide();
      }
    }

    function handleFocusOut(event: FocusEvent): void {
      if (event.relatedTarget instanceof Node && el.contains(event.relatedTarget)) return;
      hide();
    }

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focusin', show);
    el.addEventListener('focusout', handleFocusOut);

    return () => {
      hide();
      unsubscribe();
      stopTipUpdates();
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hide);
      el.removeEventListener('focusin', show);
      el.removeEventListener('focusout', handleFocusOut);
    };
  };
}
