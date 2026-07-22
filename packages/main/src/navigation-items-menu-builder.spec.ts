/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import type { NavigationItemState } from '@podman-desktop/core-api';
import type { BrowserWindow, ContextMenuParams, MenuItem, MenuItemConstructorOptions } from 'electron';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { NavigationItemsMenuBuilder } from './navigation-items-menu-builder.js';
import type { ConfigurationRegistry } from './plugin/configuration-registry.js';

let navigationItemsMenuBuilder: TestNavigationItemsMenuBuilder;

const getConfigurationMock = vi.fn();
const configurationRegistryMock = {
  getConfiguration: getConfigurationMock,
  updateConfigurationValue: vi.fn(),
} as unknown as ConfigurationRegistry;

const browserWindowMock = {
  webContents: {},
} as unknown as BrowserWindow;

class TestNavigationItemsMenuBuilder extends NavigationItemsMenuBuilder {
  override buildHideMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    return super.buildHideMenuItem(linkText);
  }
  override buildPinMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    return super.buildPinMenuItem(linkText);
  }
  override findSubmenuItemByLinkURL(linkURL: string): NavigationItemState | undefined {
    return super.findSubmenuItemByLinkURL(linkURL);
  }
  override buildSubmenuPinMenuItem(linkURL: string): MenuItemConstructorOptions | undefined {
    return super.buildSubmenuPinMenuItem(linkURL);
  }
  override updateNavbarPinnedItem(itemName: string, pin: boolean): Promise<void> {
    return super.updateNavbarPinnedItem(itemName, pin);
  }
  override buildNavigationToggleMenuItems(): MenuItemConstructorOptions[] {
    return super.buildNavigationToggleMenuItems();
  }
  override buildUnpinAllMenuItem(): MenuItemConstructorOptions | undefined {
    return super.buildUnpinAllMenuItem();
  }
}

beforeEach(() => {
  vi.resetAllMocks();
  navigationItemsMenuBuilder = new TestNavigationItemsMenuBuilder(configurationRegistryMock);
});

describe('buildHideMenuItem', async () => {
  test.each([
    { desc: 'plain item', input: 'Hello', expectedLabel: 'Hide Hello', expectedDisabledName: 'Hello' },
    { desc: 'item with line feed', input: 'Hello\nHallo', expectedLabel: 'Hide Hello', expectedDisabledName: 'Hello' },
  ])('builds hide item and clicking disables it ($desc)', async ({ input, expectedLabel, expectedDisabledName }) => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    const menu = navigationItemsMenuBuilder.buildHideMenuItem(input);
    expect(menu?.label).toBe(expectedLabel);
    expect(menu?.click).toBeDefined();
    expect(menu?.visible).toBe(true);

    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(getConfigurationMock).toBeCalled();
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.disabledItems',
      [expectedDisabledName],
      'DEFAULT',
    );
  });

  test('should not create a menu item if in excluded list', async () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Accounts');
    expect(menu).toBeUndefined();
  });

  // see podman-desktop/podman-desktop#16803
  test.each([
    {
      desc: 'pinned item is also removed from pinnedItems',
      pinnedItems: ['Pods', 'Volumes'],
      hideName: 'Pods',
      expectedPinned: ['Volumes'],
    },
    {
      desc: 'non-pinned item leaves pinnedItems unchanged',
      pinnedItems: ['Volumes'],
      hideName: 'Pods',
      expectedPinned: ['Volumes'],
    },
  ])('hiding side-effect on pinnedItems: $desc', async ({ pinnedItems, hideName, expectedPinned }) => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'pinnedItems' ? pinnedItems : []),
    } as unknown as ConfigurationRegistry);

    const menu = navigationItemsMenuBuilder.buildHideMenuItem(hideName);
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.pinnedItems',
      expectedPinned,
      'DEFAULT',
    );
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.disabledItems',
      [hideName],
      'DEFAULT',
    );
  });
});

describe('buildPinMenuItem', async () => {
  test.each([
    {
      desc: 'pin an unpinned item',
      pinned: false,
      existingPinned: [] as string[],
      expectedLabel: 'Pin Pods to Top',
      expectedPinned: ['Pods'],
    },
    {
      desc: 'unpin a pinned item',
      pinned: true,
      existingPinned: ['Pods', 'Volumes'],
      expectedLabel: 'Unpin Pods',
      expectedPinned: ['Volumes'],
    },
  ])('$desc', async ({ pinned, existingPinned, expectedLabel, expectedPinned }) => {
    getConfigurationMock.mockReturnValue({ get: () => existingPinned } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([{ name: 'Pods', link: '', visible: true, pinned }]);

    const menu = navigationItemsMenuBuilder.buildPinMenuItem('Pods');
    expect(menu?.label).toBe(expectedLabel);
    expect(menu?.enabled).toBeTruthy();

    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.pinnedItems',
      expectedPinned,
      'DEFAULT',
    );
  });

  test('sanitizes labels: escapes & and filters line feeds', async () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'A & A', link: '', visible: true, pinned: false },
      { name: 'Pods', link: '', visible: true, pinned: false },
    ]);

    expect(navigationItemsMenuBuilder.buildPinMenuItem('A & A')?.label).toBe('Pin A && A to Top');
    expect(navigationItemsMenuBuilder.buildPinMenuItem('Pods\nSub-item')?.label).toBe('Pin Pods to Top');
  });

  test('should return undefined for an item we do not know about', async () => {
    navigationItemsMenuBuilder.receiveNavigationItems([]);

    const menu = navigationItemsMenuBuilder.buildPinMenuItem('Unknown');
    expect(menu).toBeUndefined();
  });

  test('respects the 10-item pin cap: disables pin but still allows unpin', async () => {
    const pinnedNames = Array.from({ length: 10 }, (_, i) => `Pinned${i}`);
    getConfigurationMock.mockReturnValue({ get: () => pinnedNames } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      ...pinnedNames.map(name => ({ name, link: '', visible: true, pinned: true })),
      { name: 'Pods', link: '', visible: true, pinned: false },
    ]);

    const pinMenu = navigationItemsMenuBuilder.buildPinMenuItem('Pods');
    expect(pinMenu?.label).toBe('Pin Pods to Top');
    expect(pinMenu?.enabled).toBeFalsy();

    const unpinMenu = navigationItemsMenuBuilder.buildPinMenuItem('Pinned0');
    expect(unpinMenu?.label).toBe('Unpin Pinned0');
    expect(unpinMenu?.enabled).toBeTruthy();
  });

  test('a same-named submenu child is ignored, so the top-level item is still matched by name', async () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: true },
      { name: 'Pods', link: '', visible: true, pinned: false },
    ]);

    const menu = navigationItemsMenuBuilder.buildPinMenuItem('Pods');
    expect(menu?.label).toBe('Pin Pods to Top');
  });
});

describe('findSubmenuItemByLinkURL', async () => {
  test('finds a submenu child by the pathname of the linkURL, regardless of scheme/host', async () => {
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: false },
    ]);

    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('file:///kubernetes/pods')?.name).toBe(
      'Kubernetes > Pods',
    );
    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('http://localhost:5173/kubernetes/pods')?.name).toBe(
      'Kubernetes > Pods',
    );
  });

  test('returns undefined for non-matching cases', async () => {
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', link: '/pods', visible: true, pinned: false },
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: false },
    ]);

    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('file:///pods')).toBeUndefined();
    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('')).toBeUndefined();
    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('not a url')).toBeUndefined();
    expect(navigationItemsMenuBuilder.findSubmenuItemByLinkURL('file:///kubernetes/nodes')).toBeUndefined();
  });
});

describe('buildSubmenuPinMenuItem', async () => {
  test.each([
    {
      desc: 'pin an unpinned submenu child',
      pinned: false,
      existingPinned: [] as string[],
      expectedLabel: 'Pin Pods to Top',
      expectedPinned: ['/kubernetes/pods'],
    },
    {
      desc: 'unpin a pinned submenu child',
      pinned: true,
      existingPinned: ['/kubernetes/pods', 'Volumes'],
      expectedLabel: 'Unpin Pods',
      expectedPinned: ['Volumes'],
    },
  ])('$desc', async ({ pinned, existingPinned, expectedLabel, expectedPinned }) => {
    getConfigurationMock.mockReturnValue({ get: () => existingPinned } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned },
    ]);

    const menu = navigationItemsMenuBuilder.buildSubmenuPinMenuItem('file:///kubernetes/pods');
    expect(menu?.label).toBe(expectedLabel);
    expect(menu?.enabled).toBeTruthy();

    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.pinnedItems',
      expectedPinned,
      'DEFAULT',
    );
  });

  test('should disable the menu item when the 10-item pin cap is reached', async () => {
    const pinnedLinks = Array.from({ length: 10 }, (_, i) => `/pinned${i}`);
    navigationItemsMenuBuilder.receiveNavigationItems([
      ...pinnedLinks.map(link => ({ name: link, link, visible: true, pinned: true })),
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: false },
    ]);

    const menu = navigationItemsMenuBuilder.buildSubmenuPinMenuItem('file:///kubernetes/pods');
    expect(menu?.label).toBe('Pin Pods to Top');
    expect(menu?.enabled).toBeFalsy();
  });

  test('should return undefined when the linkURL does not match a known submenu child', async () => {
    navigationItemsMenuBuilder.receiveNavigationItems([]);

    const menu = navigationItemsMenuBuilder.buildSubmenuPinMenuItem('file:///unknown');
    expect(menu).toBeUndefined();
  });
});

describe('updateNavbarPinnedItem', async () => {
  test.each([
    {
      desc: 'pinning unshifts the item to the top',
      existingPinned: ['existing'],
      itemName: 'newItem',
      pin: true,
      expectedPinned: ['newItem', 'existing'],
    },
    {
      desc: 'unpinning filters the item out',
      existingPinned: ['existing', 'toRemove'],
      itemName: 'toRemove',
      pin: false,
      expectedPinned: ['existing'],
    },
  ])('$desc', async ({ existingPinned, itemName, pin, expectedPinned }) => {
    getConfigurationMock.mockReturnValue({ get: () => existingPinned } as unknown as ConfigurationRegistry);

    await navigationItemsMenuBuilder.updateNavbarPinnedItem(itemName, pin);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.pinnedItems',
      expectedPinned,
      'DEFAULT',
    );
  });

  test('edge cases: does not pin past cap, pinning already-pinned is a no-op', async () => {
    const items = Array.from({ length: 10 }, (_, i) => `item${i}`);
    getConfigurationMock.mockReturnValue({ get: () => items } as unknown as ConfigurationRegistry);

    await navigationItemsMenuBuilder.updateNavbarPinnedItem('overCap', true);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.pinnedItems', items, 'DEFAULT');

    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockClear();
    getConfigurationMock.mockReturnValue({ get: () => ['existing'] } as unknown as ConfigurationRegistry);

    await navigationItemsMenuBuilder.updateNavbarPinnedItem('existing', true);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.pinnedItems',
      ['existing'],
      'DEFAULT',
    );
  });
});

describe('buildNavigationToggleMenuItems', async () => {
  test('build navigation toggle menu items', async () => {
    getConfigurationMock.mockReturnValue({ get: () => ['existing'] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'A & A', link: '', visible: true, pinned: false },
      { name: 'B', link: '', visible: false, pinned: false },
      { name: 'C', link: '', visible: true, pinned: false },
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: false },
    ]);

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();

    // 4 items (first one being a separator)
    expect(menu.length).toBe(4);

    // check the first item is a separator
    expect(menu[0]?.type).toBe('separator');

    // label should be escaped as we have an &
    expect(menu[1]?.label).toBe('A && A');
    expect(menu[1]?.checked).toBe(true);
    expect(menu[2]?.label).toBe('B');
    expect(menu[2]?.checked).toBe(false);
    expect(menu[3]?.label).toBe('C');
    expect(menu[3]?.checked).toBe(true);

    // click on the A item
    menu[1]?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(getConfigurationMock).toBeCalled();
    // if clicking it should send the item to the configuration as being disabled
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.disabledItems',
      // item A & A should not be escaped
      ['existing', 'A & A'],
      'DEFAULT',
    );

    // reset the calls
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockClear();

    // click on the B item should unhide it so disabled items should be empty
    menu[2]?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.disabledItems',
      ['existing'],
      'DEFAULT',
    );
  });

  test('unhiding (showing) an item does not touch navbar.pinnedItems', async () => {
    getConfigurationMock.mockReturnValue({ get: () => ['Pods'] } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([{ name: 'Pods', link: '', visible: false, pinned: false }]);

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();
    menu.find(i => i.label === 'Pods')?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.disabledItems', [], 'DEFAULT');
    expect(configurationRegistryMock.updateConfigurationValue).not.toBeCalledWith(
      'navbar.pinnedItems',
      expect.anything(),
      'DEFAULT',
    );
  });
});

describe('buildUnpinAllMenuItem', async () => {
  test('returns undefined when nothing is pinned, returns an "Unpin All" item otherwise', async () => {
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', link: '', visible: true, pinned: false },
      { name: 'Volumes', link: '', visible: true, pinned: false },
    ]);
    expect(navigationItemsMenuBuilder.buildUnpinAllMenuItem()).toBeUndefined();

    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', link: '', visible: true, pinned: true },
      { name: 'Volumes', link: '', visible: true, pinned: false },
    ]);
    const menu = navigationItemsMenuBuilder.buildUnpinAllMenuItem();
    expect(menu?.label).toBe('Unpin All');

    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.pinnedItems', [], 'DEFAULT');
  });
});

describe('buildNavigationMenu', async () => {
  test.each([
    { desc: 'no linkText', params: {} },
    { desc: 'outside range of navbar', params: { linkText: 'outside', x: 200, y: 0 } },
    { desc: 'outside navbar with unmatched linkURL', params: { linkURL: 'file:///unknown', x: 200, y: 100 } },
  ])('returns empty array when $desc', async ({ params }) => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    navigationItemsMenuBuilder.receiveNavigationItems([]);
    const parameters = params as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu).toStrictEqual([]);
  });

  test('should call the build if inside range of navbar', async () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const pinMenuItem = { label: 'pin' } as MenuItemConstructorOptions;
    const hideMenuItem = { label: 'hide' } as MenuItemConstructorOptions;
    const pinSpyMock = vi.spyOn(navigationItemsMenuBuilder, 'buildPinMenuItem');
    pinSpyMock.mockReturnValue(pinMenuItem);
    const hideSpyMock = vi.spyOn(navigationItemsMenuBuilder, 'buildHideMenuItem');
    hideSpyMock.mockReturnValue(hideMenuItem);
    const parameters = {
      linkText: 'inside',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu.length).toBe(2);
    expect(menu[0]).toBe(pinMenuItem);
    expect(menu[1]).toBe(hideMenuItem);
    expect(pinSpyMock).toBeCalledWith('inside');
    expect(hideSpyMock).toBeCalledWith('inside');
  });

  test('should call the submenu pin build when outside the navbar with a linkURL', async () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const pinMenuItem = { label: 'pin submenu item' } as MenuItemConstructorOptions;
    const submenuPinSpyMock = vi.spyOn(navigationItemsMenuBuilder, 'buildSubmenuPinMenuItem');
    submenuPinSpyMock.mockReturnValue(pinMenuItem);
    const parameters = {
      linkText: '',
      linkURL: 'file:///kubernetes/pods',
      x: 200,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu.length).toBe(1);
    expect(menu[0]).toBe(pinMenuItem);
    expect(submenuPinSpyMock).toBeCalledWith('file:///kubernetes/pods');
  });

  test('Unpin All placement: before checklist on bare nav, after pin/hide on specific item, omitted when nothing pinned', async () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', link: '', visible: true, pinned: true },
      { name: 'Volumes', link: '', visible: true, pinned: false },
    ]);

    // Right-clicking the nav bar background (no specific item)
    const bgMenu = navigationItemsMenuBuilder.buildNavigationMenu({ x: 30, y: 0 } as unknown as ContextMenuParams);
    expect(bgMenu[0]?.label).toBe('Unpin All');
    expect(bgMenu[1]?.type).toBe('separator');

    // Right-clicking a specific item
    const itemMenu = navigationItemsMenuBuilder.buildNavigationMenu({
      linkText: 'Pods',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams);
    expect(itemMenu[0]?.label).toBe('Unpin Pods');
    expect(itemMenu[1]?.label).toBe('Hide Pods');
    expect(itemMenu[2]?.label).toBe('Unpin All');
    expect(itemMenu[3]?.type).toBe('separator');

    // Nothing pinned — omit Unpin All
    navigationItemsMenuBuilder.receiveNavigationItems([{ name: 'Pods', link: '', visible: true, pinned: false }]);
    const noPinMenu = navigationItemsMenuBuilder.buildNavigationMenu({ x: 30, y: 0 } as unknown as ContextMenuParams);
    expect(noPinMenu.some(i => i.label === 'Unpin All')).toBe(false);
  });

  test('regression: a pinned Kubernetes Pods promoted into the primary nav is not confused with the top-level container Pods, and offers no Hide option', async () => {
    getConfigurationMock
      .mockReturnValueOnce({ get: () => 160 } as unknown as ConfigurationRegistry)
      .mockReturnValueOnce({
        get: (key: string) => (key === 'pinnedItems' ? ['/kubernetes/pods'] : []),
      } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', link: '/pods', visible: true, pinned: false },
      { name: 'Kubernetes > Pods', link: '/kubernetes/pods', visible: true, pinned: true },
    ]);
    const parameters = {
      linkText: 'Pods',
      linkURL: 'file:///kubernetes/pods',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu[0]?.label).toBe('Unpin Pods');
    expect(menu.some(i => typeof i.label === 'string' && i.label.startsWith('Hide '))).toBe(false);
    expect(menu.some(i => i.label === 'Pin Pods to Top')).toBe(false);

    menu[0]?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.pinnedItems', [], 'DEFAULT');
  });
});
