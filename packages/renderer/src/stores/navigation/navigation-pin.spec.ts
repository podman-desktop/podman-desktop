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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { navigationDragState } from './navigation-drag-state.svelte';
import { NavigationPin } from './navigation-pin';

let navigationPin = new NavigationPin();

beforeEach(() => {
  vi.resetAllMocks();
  navigationPin = new NavigationPin();
  navigationPin.resetPin();
});

afterEach(() => {
  navigationPin.resetPin();
});

describe('beginPin', () => {
  test('sets payload from last pointer position', () => {
    const target = document.createElement('div');
    target.getBoundingClientRect = (): DOMRect => ({
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
    navigationPin.onPinPointerDown(down);

    navigationPin.beginPin({
      parentName: 'Kubernetes',
      name: 'Nodes',
      link: '/kubernetes/nodes',
    });

    expect(navigationDragState.payload).toMatchObject({
      parentName: 'Kubernetes',
      name: 'Nodes',
      link: '/kubernetes/nodes',
    });
    expect(navigationDragState.pointerX).toBe(22);
    expect(navigationDragState.pointerY).toBe(34);
    expect(navigationDragState.grabOffsetX).toBe(12);
    expect(navigationDragState.grabOffsetY).toBe(14);
    expect(document.body.style.cursor).toBe('grabbing');

    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 45, clientY: 55 }));
    expect(navigationDragState.pointerX).toBe(45);
    expect(navigationDragState.pointerY).toBe(55);

    window.dispatchEvent(new PointerEvent('pointerup'));
    expect(navigationDragState.payload).toBeUndefined();
    expect(navigationDragState.grabOffsetX).toBe(0);
    expect(navigationDragState.grabOffsetY).toBe(0);
    expect(document.body.style.cursor).toBe('');
  });
});

describe('consumePinClick', () => {
  test('does not swallow clicks before a long-press', () => {
    const event = new MouseEvent('click', { cancelable: true });

    expect(navigationPin.consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('does not swallow clicks after a still beginPin with no movement', () => {
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    navigationPin.beginPin({ parentName: 'Kubernetes', name: 'Nodes', link: '/kubernetes/nodes' });

    const event = new MouseEvent('click', { cancelable: true });
    expect(navigationPin.consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('swallows the click after beginPin with pointer movement and allows the next click', () => {
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    navigationPin.beginPin({ parentName: 'Kubernetes', name: 'Nodes', link: '/kubernetes/nodes' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }));

    const suppressed = new MouseEvent('click', { cancelable: true });
    expect(navigationPin.consumePinClick(suppressed)).toBe(true);
    expect(suppressed.defaultPrevented).toBe(true);

    const next = new MouseEvent('click', { cancelable: true });
    expect(navigationPin.consumePinClick(next)).toBe(false);
    expect(next.defaultPrevented).toBe(false);
  });

  test('keeps click suppression local to each sidebar instance', () => {
    const otherSidebar = new NavigationPin();
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    navigationPin.beginPin({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }));

    expect(navigationPin.consumePinClick(new MouseEvent('click', { cancelable: true }))).toBe(true);
    expect(otherSidebar.consumePinClick(new MouseEvent('click', { cancelable: true }))).toBe(false);

    otherSidebar.resetPin();
  });

  test.each([
    { distance: 5, shouldSuppress: false },
    { distance: 6, shouldSuppress: true },
  ])('uses the movement threshold at $distance pixels', ({ distance, shouldSuppress }) => {
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    navigationPin.beginPin({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10 + distance, clientY: 20 }));

    const event = new MouseEvent('click', { cancelable: true });
    expect(navigationPin.consumePinClick(event)).toBe(shouldSuppress);
    expect(event.defaultPrevented).toBe(shouldSuppress);
  });
});

describe('onPinPointerDown', () => {
  test('ignores non-primary buttons', () => {
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 1, clientY: 2 }));
    navigationPin.onPinPointerDown(new PointerEvent('pointerdown', { button: 2, clientX: 99, clientY: 99 }));
    navigationPin.beginPin({ parentName: 'Settings', name: 'X', link: '/x' });

    expect(navigationDragState.pointerX).toBe(1);
    expect(navigationDragState.pointerY).toBe(2);
  });
});

describe('onPinKeyDown', () => {
  test('pins with Ctrl+ArrowLeft and announces the result', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true });

    navigationPin.onPinKeyDown({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(true);
    expect(navigationDragState.announcement).toContain('Settings > Resources');
  });

  test('ignores ArrowLeft without a modifier', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });

    navigationPin.onPinKeyDown({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(false);
  });
});
