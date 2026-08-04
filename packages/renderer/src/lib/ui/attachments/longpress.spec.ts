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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { longPress } from '/@/lib/ui/attachments/longpress';

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

function attachLongPress(
  cb: () => void,
  button = 0,
  threshold = 350,
  moveCancelPx = 5,
): { node: HTMLDivElement; destroy: () => void } {
  const node = document.createElement('div');
  const destroy = longPress(cb, button, threshold, moveCancelPx)(node)!;
  return { node, destroy };
}

function mouseDown(node: HTMLElement, clientX = 10, clientY = 20, button = 0): void {
  node.dispatchEvent(new MouseEvent('mousedown', { button, clientX, clientY, bubbles: true }));
}

describe('longPress', () => {
  describe('original behavior', () => {
    test('fires callback after the configured threshold', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350);

      mouseDown(node);
      expect(cb).not.toHaveBeenCalled();

      vi.advanceTimersByTime(349);
      expect(cb).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test('uses the default 500ms threshold when none is provided', () => {
      const cb = vi.fn();
      const node = document.createElement('div');
      const destroy = longPress(cb)(node)!;

      mouseDown(node);
      vi.advanceTimersByTime(499);
      expect(cb).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test('does not fire when mouseup happens before the threshold', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb);

      mouseDown(node);
      node.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      vi.advanceTimersByTime(400);
      expect(cb).not.toHaveBeenCalled();

      destroy();
    });

    test('ignores mousedown from a different mouse button', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350);

      mouseDown(node, 10, 20, 2);
      vi.advanceTimersByTime(400);
      expect(cb).not.toHaveBeenCalled();

      destroy();
    });

    test('respects a custom button index', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 2, 350);

      mouseDown(node, 10, 20, 2);
      vi.advanceTimersByTime(350);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test('destroy clears a pending long-press', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb);

      mouseDown(node);
      destroy();

      vi.advanceTimersByTime(400);
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('cancel on movement and leave', () => {
    test('fires when the pointer stays still until the threshold', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350);

      mouseDown(node, 10, 20);
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 20, bubbles: true }));

      vi.advanceTimersByTime(350);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test('fires when the pointer moves within the cancel distance', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350, 5);

      mouseDown(node, 10, 20);
      // 3px < default 5px cancel threshold
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 13, clientY: 20, bubbles: true }));

      vi.advanceTimersByTime(350);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test('does not fire when the pointer moves beyond the cancel distance', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350, 5);

      mouseDown(node, 10, 20);
      // 10px > 5px cancel threshold
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, bubbles: true }));

      vi.advanceTimersByTime(400);
      expect(cb).not.toHaveBeenCalled();

      destroy();
    });

    test('respects a custom move cancel distance', () => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb, 0, 350, 20);

      mouseDown(node, 10, 20);
      // 10px is beyond the default 5px but within the custom 20px threshold
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20, bubbles: true }));

      vi.advanceTimersByTime(350);
      expect(cb).toHaveBeenCalledOnce();

      destroy();
    });

    test.each([
      { event: 'mouseleave', create: (): Event => new MouseEvent('mouseleave', { bubbles: true }) },
      { event: 'pointerleave', create: (): Event => new PointerEvent('pointerleave', { bubbles: true }) },
      { event: 'pointercancel', create: (): Event => new PointerEvent('pointercancel', { bubbles: true }) },
    ])('does not fire when $event happens before the threshold', ({ create }) => {
      const cb = vi.fn();
      const { node, destroy } = attachLongPress(cb);

      mouseDown(node);
      node.dispatchEvent(create());

      vi.advanceTimersByTime(400);
      expect(cb).not.toHaveBeenCalled();

      destroy();
    });
  });
});
