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
import { navigationRegistry, type NavigationRegistryEntry, pinToNavbar } from './navigation-registry';
import { NavigationUtils } from './navigation-utils';

vi.mock(import('./navigation-registry'), async () => {
  const { writable } = await import('svelte/store');
  function entry(name: string, link: string, parentName?: string): NavigationRegistryEntry {
    return { name, link, parentName, tooltip: name, icon: {}, counter: 0, destinations: [], type: 'entry' };
  }
  return {
    pinToNavbar: vi.fn(),
    navigationRegistry: writable([
      { ...entry('Kubernetes', '/kubernetes'), type: 'submenu', items: [entry('Nodes', '/kubernetes/nodes')] },
      { ...entry('Tools', '/tools'), type: 'submenu', items: [entry('Nodes', '/tools/nodes')] },
      entry('Resources', '/preferences/resources', 'Settings'),
      entry('X', '/x', 'Settings'),
    ] satisfies NavigationRegistryEntry[]),
  };
});

const navigationUtils = new NavigationUtils();
const pinningContext = { navigationRegistry, pinToNavbar };
let pinningUtils = new NavigationUtils(pinningContext);

beforeEach(() => {
  vi.resetAllMocks();
  pinningUtils.resetPin();
  navigationDragState.announcement = '';
  pinningUtils = new NavigationUtils(pinningContext);
  vi.mocked(pinToNavbar).mockReturnValue(1);
});

function makeEntry(
  name: string,
  link: string,
  overrides: Partial<NavigationRegistryEntry> = {},
): NavigationRegistryEntry {
  return {
    name,
    icon: {},
    tooltip: name,
    link,
    counter: 0,
    destinations: [],
    type: 'entry',
    ...overrides,
  };
}

describe('formatNavigationName', () => {
  test('returns the name alone or prefixed with its parent name', () => {
    expect(navigationUtils.formatNavigationName('Pods')).toBe('Pods');
    expect(navigationUtils.formatNavigationName('Pods', 'Kubernetes')).toBe('Kubernetes > Pods');
  });
});

describe('flattenNavigationEntries', () => {
  test('flattens groups and qualifies both pinned and unpinned submenu children', () => {
    const entries: NavigationRegistryEntry[] = [
      makeEntry('Pods', '/pods', { index: 0 }),
      makeEntry('Extensions', '/extensions', {
        type: 'group',
        items: [makeEntry('Images', '/images', { index: 1 })],
      }),
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        index: 2,
        items: [makeEntry('Pods', '/kubernetes/pods', { index: 3 }), makeEntry('Services', '/kubernetes/services')],
      }),
    ];

    const flattened = navigationUtils.flattenNavigationEntries(entries);

    expect(flattened.map(entry => entry.name)).toEqual(['Pods', 'Images', 'Kubernetes', 'Pods', 'Services']);
    expect(flattened[3]).toMatchObject({
      link: '/kubernetes/pods',
      name: 'Pods',
      parentName: 'Kubernetes',
      tooltip: 'Pods',
    });
  });

  test('derives a complete parent path through nested submenus and transparent groups', () => {
    const nodes = makeEntry('Nodes', '/tools/cluster/nodes', { index: 0 });
    const entries = [
      makeEntry('Tools', '/tools', {
        type: 'submenu',
        items: [
          makeEntry('Resources', '/resources', {
            type: 'group',
            items: [makeEntry('Cluster', '/tools/cluster', { type: 'submenu', items: [nodes] })],
          }),
        ],
      }),
    ];

    expect(navigationUtils.getVisibleOrderedEntries(entries)).toEqual([
      expect.objectContaining({ name: 'Nodes', parentName: 'Tools > Cluster', index: 0 }),
    ]);
    expect(nodes.parentName).toBeUndefined();
  });
});

describe('findNavigationEntryByLink', () => {
  test('finds nested entries and returns undefined for an unknown link', () => {
    const pods = makeEntry('Pods', '/kubernetes/pods');
    const entries = [
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        items: [pods],
      }),
    ];

    expect(navigationUtils.findNavigationEntryByLink(entries, '/kubernetes/pods')).toEqual({
      ...pods,
      parentName: 'Kubernetes',
    });
    expect(navigationUtils.findNavigationEntryByLink(entries, '/unknown')).toBeUndefined();
  });
});

describe('pinning without a registry context', () => {
  test('pin methods are inert when no pin context is provided', () => {
    const utility = new NavigationUtils();
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true });

    utility.beginPin({ name: 'Nodes', link: '/kubernetes/nodes' });
    utility.onPinKeyDown({ name: 'Nodes', link: '/kubernetes/nodes' }, event);

    expect(navigationDragState.payload).toBeUndefined();
    expect(event.defaultPrevented).toBe(false);
    expect(pinToNavbar).not.toHaveBeenCalled();
  });
});

describe('beginPin', () => {
  test('uses registered parent and name rather than payload labels', () => {
    pinningUtils.beginPin({ name: 'Different tooltip', parentName: 'Wrong parent', link: '/tools/nodes' });
    expect(navigationDragState.payload).toEqual({ name: 'Nodes', parentName: 'Tools', link: '/tools/nodes' });
  });

  test('ignores unregistered destinations', () => {
    pinningUtils.beginPin({ name: 'Unknown', link: '/unknown' });
    expect(navigationDragState.payload).toBeUndefined();
    expect(document.body.style.cursor).toBe('');
  });

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
    pinningUtils.onPinPointerDown(down);

    pinningUtils.beginPin({
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

    expect(pinningUtils.consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('does not swallow clicks after a still beginPin with no movement', () => {
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    pinningUtils.beginPin({ parentName: 'Kubernetes', name: 'Nodes', link: '/kubernetes/nodes' });

    const event = new MouseEvent('click', { cancelable: true });
    expect(pinningUtils.consumePinClick(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  test('swallows the click after beginPin with pointer movement and allows the next click', () => {
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    pinningUtils.beginPin({ parentName: 'Kubernetes', name: 'Nodes', link: '/kubernetes/nodes' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }));

    const suppressed = new MouseEvent('click', { cancelable: true });
    expect(pinningUtils.consumePinClick(suppressed)).toBe(true);
    expect(suppressed.defaultPrevented).toBe(true);

    const next = new MouseEvent('click', { cancelable: true });
    expect(pinningUtils.consumePinClick(next)).toBe(false);
    expect(next.defaultPrevented).toBe(false);
  });

  test('keeps click suppression local to each sidebar instance', () => {
    const otherSidebar = new NavigationUtils(pinningContext);
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    pinningUtils.beginPin({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 30, clientY: 20 }));

    expect(pinningUtils.consumePinClick(new MouseEvent('click', { cancelable: true }))).toBe(true);
    expect(otherSidebar.consumePinClick(new MouseEvent('click', { cancelable: true }))).toBe(false);

    otherSidebar.resetPin();
  });

  test.each([
    { distance: 5, shouldSuppress: false },
    { distance: 6, shouldSuppress: true },
  ])('uses the movement threshold at $distance pixels', ({ distance, shouldSuppress }) => {
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 20 }));
    pinningUtils.beginPin({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' });
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 10 + distance, clientY: 20 }));

    const event = new MouseEvent('click', { cancelable: true });
    expect(pinningUtils.consumePinClick(event)).toBe(shouldSuppress);
    expect(event.defaultPrevented).toBe(shouldSuppress);
  });
});

describe('onPinPointerDown', () => {
  test('ignores non-primary buttons', () => {
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 0, clientX: 1, clientY: 2 }));
    pinningUtils.onPinPointerDown(new PointerEvent('pointerdown', { button: 2, clientX: 99, clientY: 99 }));
    pinningUtils.beginPin({ parentName: 'Settings', name: 'X', link: '/x' });

    expect(navigationDragState.pointerX).toBe(1);
    expect(navigationDragState.pointerY).toBe(2);
  });
});

describe('onPinKeyDown', () => {
  test('announces the registered destination and ignores unsuccessful pins', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true });
    pinningUtils.onPinKeyDown({ name: 'Other label', link: '/tools/nodes' }, event);
    expect(navigationDragState.announcement).toBe('Pinned Tools > Nodes to main navigation at position 1');

    navigationDragState.announcement = '';
    vi.mocked(pinToNavbar).mockReturnValue(undefined);
    pinningUtils.onPinKeyDown({ name: 'Nodes', link: '/tools/nodes' }, event);
    expect(navigationDragState.announcement).toBe('');
    pinningUtils.onPinKeyDown({ name: 'Unknown', link: '/unknown' }, event);
    expect(pinToNavbar).toHaveBeenCalledTimes(2);
  });

  test('pins with Ctrl+ArrowLeft and announces the result', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true });

    pinningUtils.onPinKeyDown({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(true);
    expect(navigationDragState.announcement).toContain('Settings > Resources');
  });

  test('ignores ArrowLeft without a modifier', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });

    pinningUtils.onPinKeyDown({ parentName: 'Settings', name: 'Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(false);
  });
});
