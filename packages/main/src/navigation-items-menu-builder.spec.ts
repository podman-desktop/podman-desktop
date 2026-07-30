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
  override buildNavigationToggleMenuItems(): MenuItemConstructorOptions[] {
    return super.buildNavigationToggleMenuItems();
  }
  override buildResetOrderMenuItem(): MenuItemConstructorOptions | undefined {
    return super.buildResetOrderMenuItem();
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

    // click on the menu
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(getConfigurationMock).toBeCalled();
    // if clicking it should send the item to the configuration as being disabled
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

  test.each([
    {
      desc: 'ordered item is also removed from itemOrder',
      existingOrder: ['Pods', 'Volumes'],
      hideName: 'Pods',
      expectedOrder: ['Volumes'],
    },
    {
      desc: 'non-ordered item leaves itemOrder unchanged',
      existingOrder: ['Volumes'],
      hideName: 'Pods',
      expectedOrder: ['Volumes'],
    },
    {
      desc: 'grouped item is removed from itemOrder by name',
      existingOrder: ['Settings > Resources', 'Volumes'],
      hideName: 'Settings > Resources',
      expectedOrder: ['Volumes'],
      navItems: [{ name: 'Settings > Resources', visible: true, index: 0 }],
    },
  ])('hiding side-effect on itemOrder: $desc', async ({ existingOrder, hideName, expectedOrder, navItems }) => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'itemOrder' ? existingOrder : []),
    } as unknown as ConfigurationRegistry);

    if (navItems) {
      navigationItemsMenuBuilder.receiveNavigationItems(navItems);
    }

    const menu = navigationItemsMenuBuilder.buildHideMenuItem(hideName);
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.itemOrder',
      expectedOrder,
      'DEFAULT',
    );
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith(
      'navbar.disabledItems',
      [hideName],
      'DEFAULT',
    );
  });
});

describe('buildNavigationToggleMenuItems', async () => {
  test('build navigation toggle menu items', async () => {
    getConfigurationMock.mockReturnValue({ get: () => ['existing'] } as unknown as ConfigurationRegistry);

    // send 3 items, two being visible, one being hidden
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'A & A', visible: true, index: 0 },
      { name: 'B', visible: false, index: 1 },
      { name: 'C', visible: true, index: 2 },
      { name: 'Kubernetes > Pods', visible: true, index: 3 },
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

  test('unhiding (showing) an item does not touch navbar.itemOrder', async () => {
    getConfigurationMock.mockReturnValue({ get: () => ['Pods'] } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([{ name: 'Pods', visible: false, index: 0 }]);

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();
    menu.find(i => i.label === 'Pods')?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.disabledItems', [], 'DEFAULT');
    expect(configurationRegistryMock.updateConfigurationValue).not.toBeCalledWith(
      'navbar.itemOrder',
      expect.anything(),
      'DEFAULT',
    );
  });
});

describe('buildResetOrderMenuItem', async () => {
  test('returns undefined when itemOrder is empty, returns a "Reset Order" item otherwise', async () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', visible: true, index: 0 },
      { name: 'Volumes', visible: true, index: 1 },
    ]);
    expect(navigationItemsMenuBuilder.buildResetOrderMenuItem()).toBeUndefined();

    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'itemOrder' ? ['Pods'] : []),
    } as unknown as ConfigurationRegistry);
    const menu = navigationItemsMenuBuilder.buildResetOrderMenuItem();
    expect(menu?.label).toBe('Reset Order');

    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);
    expect(configurationRegistryMock.updateConfigurationValue).toBeCalledWith('navbar.itemOrder', [], 'DEFAULT');
  });
});

describe('buildNavigationMenu', async () => {
  test.each([
    { desc: 'no linkText', params: {} },
    { desc: 'outside range of navbar', params: { linkText: 'outside', x: 200, y: 0 } },
  ])('returns empty array when $desc', async ({ params }) => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    navigationItemsMenuBuilder.receiveNavigationItems([]);
    const parameters = params as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu).toStrictEqual([]);
  });

  test('should build hide menu if inside range of navbar', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'itemOrder' ? [] : 160),
    } as unknown as ConfigurationRegistry);
    const hideMenuItem = { label: 'hide' } as MenuItemConstructorOptions;
    const hideSpyMock = vi.spyOn(navigationItemsMenuBuilder, 'buildHideMenuItem');
    hideSpyMock.mockReturnValue(hideMenuItem);
    const parameters = {
      linkText: 'inside',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu.length).toBe(1);
    expect(menu[0]).toBe(hideMenuItem);
    expect(hideSpyMock).toBeCalledWith('inside');
  });

  test('Reset Order placement: before checklist on bare nav, after hide on specific item, omitted when nothing ordered', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'itemOrder' ? ['Pods'] : 160),
    } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([
      { name: 'Pods', visible: true, index: 0 },
      { name: 'Volumes', visible: true, index: 1 },
    ]);

    const bgMenu = navigationItemsMenuBuilder.buildNavigationMenu({ x: 30, y: 0 } as unknown as ContextMenuParams);
    expect(bgMenu[0]?.label).toBe('Reset Order');
    expect(bgMenu[1]?.type).toBe('separator');

    const itemMenu = navigationItemsMenuBuilder.buildNavigationMenu({
      linkText: 'Pods',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams);
    expect(itemMenu[0]?.label).toBe('Hide Pods');
    expect(itemMenu[1]?.label).toBe('Reset Order');
    expect(itemMenu[2]?.type).toBe('separator');

    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'itemOrder' ? [] : 160),
    } as unknown as ConfigurationRegistry);
    navigationItemsMenuBuilder.receiveNavigationItems([{ name: 'Pods', visible: true, index: 0 }]);
    const noOrderMenu = navigationItemsMenuBuilder.buildNavigationMenu({ x: 30, y: 0 } as unknown as ContextMenuParams);
    expect(noOrderMenu.some(i => i.label === 'Reset Order')).toBe(false);
  });
});
