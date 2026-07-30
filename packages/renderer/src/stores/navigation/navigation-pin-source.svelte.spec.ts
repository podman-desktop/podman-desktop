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

import { navigationDragState } from './navigation-drag-state.svelte';
import {
  beginPin,
  consumePinClick,
  navigationPinSource,
  onPinPointerDown,
  resetPin,
} from './navigation-pin-source.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  resetPin();
});

describe('beginPin', () => {
  test('sets payload and draggingLink from last pointer position', () => {
    const target = document.createElement('div');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      right: 50,
      bottom: 60,
      width: 40,
      height: 40,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    });
    const down = new PointerEvent('pointerdown', { button: 0, clientX: 22, clientY: 34 });
    Object.defineProperty(down, 'currentTarget', { value: target });
    onPinPointerDown(down);

    beginPin({
      name: 'Kubernetes > Nodes',
      link: '/kubernetes/nodes',
    });

    expect(navigationPinSource.draggingLink).toBe('/kubernetes/nodes');
    expect(navigationDragState.payload).toMatchObject({
      name: 'Kubernetes > Nodes',
      link: '/kubernetes/nodes',
    });
    expect(navigationDragState.pointerX).toBe(22);
    expect(navigationDragState.pointerY).toBe(34);
    expect(navigationDragState.grabOffsetX).toBe(12);
    expect(navigationDragState.grabOffsetY).toBe(14);
    expect(document.body.style.cursor).toBe('grabbing');

    resetPin();
    expect(navigationPinSource.draggingLink).toBeUndefined();
    expect(navigationDragState.payload).toBeUndefined();
    expect(navigationDragState.grabOffsetX).toBe(0);
    expect(navigationDragState.grabOffsetY).toBe(0);
    expect(document.body.style.cursor).toBe('');
  });
});

describe('consumePinClick', () => {
  test('does not swallow clicks before a long-press', () => {
    const event = new MouseEvent('click', { cancelable: true });

    expect(consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('does not swallow clicks after a still beginPin with no movement', () => {
    onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    beginPin({ name: 'Kubernetes > Nodes', link: '/kubernetes/nodes' });

    const event = new MouseEvent('click', { cancelable: true });
    expect(consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('swallows the click after beginPin with pointer movement and allows the next click', () => {
    onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    beginPin({ name: 'Kubernetes > Nodes', link: '/kubernetes/nodes' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }));

    const suppressed = new MouseEvent('click', { cancelable: true });
    expect(consumePinClick(suppressed)).toBe(true);
    expect(suppressed.defaultPrevented).toBe(true);

    const next = new MouseEvent('click', { cancelable: true });
    expect(consumePinClick(next)).toBe(false);
    expect(next.defaultPrevented).toBe(false);
  });
});

describe('onPinPointerDown', () => {
  test('ignores non-primary buttons', () => {
    onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 1, clientY: 2 }));
    onPinPointerDown(new PointerEvent('pointerdown', { button: 2, clientX: 99, clientY: 99 }));
    beginPin({ name: 'Settings > X', link: '/x' });

    expect(navigationDragState.pointerX).toBe(1);
    expect(navigationDragState.pointerY).toBe(2);
  });
});
