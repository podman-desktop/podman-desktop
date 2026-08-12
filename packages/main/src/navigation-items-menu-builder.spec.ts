/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

const showMessageBoxMock = vi.fn();

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
  override buildShowHiddenItemsSubmenu(): MenuItemConstructorOptions | undefined {
    return super.buildShowHiddenItemsSubmenu();
  }
  override buildResetMenuItem(): MenuItemConstructorOptions {
    return super.buildResetMenuItem();
  }
  override getNavWidth(): number {
    return super.getNavWidth();
  }
}

beforeEach(() => {
  vi.resetAllMocks();
  navigationItemsMenuBuilder = new TestNavigationItemsMenuBuilder(configurationRegistryMock, showMessageBoxMock);
});

describe('buildHideMenuItem', async () => {
  test('build hide item with updated label', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Hello');
    expect(menu?.label).toBe('Hide Hello From Navigation Bar');
    expect(menu?.click).toBeDefined();
    expect(menu?.visible).toBe(true);
  });

  test('build hide item with line feed', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Hello\nHallo');
    expect(menu?.label).toBe('Hide Hello From Navigation Bar');
    expect(menu?.click).toBeDefined();
    expect(menu?.visible).toBe(true);
  });

  test('should not create a menu item if in excluded list', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    expect(navigationItemsMenuBuilder.buildHideMenuItem('Accounts')).toBeUndefined();
    expect(navigationItemsMenuBuilder.buildHideMenuItem('Settings')).toBeUndefined();
    expect(navigationItemsMenuBuilder.buildHideMenuItem('Containers')).toBeUndefined();
    expect(navigationItemsMenuBuilder.buildHideMenuItem('Images')).toBeUndefined();
    expect(navigationItemsMenuBuilder.buildHideMenuItem('Dashboard')).toBeUndefined();
  });

  test('should not create a menu item for the active item', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [{ name: 'Pods', visible: true }],
      activeItem: 'Pods',
    });

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    expect(menu).toBeUndefined();
  });

  test('should create a menu item for non-active item', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'Pods', visible: true },
        { name: 'Volumes', visible: true },
      ],
      activeItem: 'Pods',
    });

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Volumes');
    expect(menu?.label).toBe('Hide Volumes From Navigation Bar');
  });

  test('click shows confirmation dialog when not dismissed', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? false : []),
    } as unknown as ConfigurationRegistry);
    showMessageBoxMock.mockResolvedValue({ response: 'Hide' });
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(showMessageBoxMock).toHaveBeenCalled();
    });
  });

  test('click hides item when confirmation dialog returns Hide', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? false : []),
    } as unknown as ConfigurationRegistry);
    showMessageBoxMock.mockResolvedValue({ response: 'Hide' });
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.disabledItems',
        ['Pods'],
        'DEFAULT',
      );
    });
  });

  test('click does not hide item when confirmation dialog is cancelled', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? false : []),
    } as unknown as ConfigurationRegistry);
    showMessageBoxMock.mockResolvedValue({ response: 'Cancel' });

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(showMessageBoxMock).toHaveBeenCalled();
    });

    expect(configurationRegistryMock.updateConfigurationValue).not.toHaveBeenCalledWith(
      'navbar.disabledItems',
      expect.anything(),
      expect.anything(),
    );
  });

  test('click with "Don\'t show again" hides item and dismisses confirmation', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? false : []),
    } as unknown as ConfigurationRegistry);
    showMessageBoxMock.mockResolvedValue({ response: "Don't show again" });
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.hideConfirmationDismissed',
        true,
        'DEFAULT',
      );
    });

    expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
      'navbar.disabledItems',
      ['Pods'],
      'DEFAULT',
    );
  });

  test('click skips confirmation dialog when already dismissed', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? true : []),
    } as unknown as ConfigurationRegistry);
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    const menu = navigationItemsMenuBuilder.buildHideMenuItem('Pods');
    menu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.disabledItems',
        expect.anything(),
        'DEFAULT',
      );
    });

    expect(showMessageBoxMock).not.toHaveBeenCalled();
  });
});

describe('buildNavigationToggleMenuItems', async () => {
  test('build navigation toggle menu items', async () => {
    getConfigurationMock.mockReturnValue({ get: () => ['existing'] } as unknown as ConfigurationRegistry);

    // send 3 items, two being visible, one being hidden
    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'A & A', visible: true },
        { name: 'B', visible: false },
        { name: 'C', visible: true },
      ],
    });

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

  test('should disable excluded items in toggle menu', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'Containers', visible: true },
        { name: 'Dashboard', visible: true },
        { name: 'Pods', visible: true },
      ],
    });

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();

    const containersItem = menu.find(m => m.label === 'Containers');
    expect(containersItem?.enabled).toBe(false);

    const dashboardItem = menu.find(m => m.label === 'Dashboard');
    expect(dashboardItem?.enabled).toBe(false);

    const podsItem = menu.find(m => m.label === 'Pods');
    expect(podsItem?.enabled).toBe(true);
  });

  test('should disable active item in toggle menu', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'Pods', visible: true },
        { name: 'Volumes', visible: true },
      ],
      activeItem: 'Pods',
    });

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();

    const podsItem = menu.find(m => m.label === 'Pods');
    expect(podsItem?.enabled).toBe(false);

    const volumesItem = menu.find(m => m.label === 'Volumes');
    expect(volumesItem?.enabled).toBe(true);
  });

  test('should not hide excluded items via updateNavbarHiddenItem', () => {
    getConfigurationMock.mockReturnValue({ get: () => [] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'Containers', visible: true },
        { name: 'Pods', visible: true },
      ],
    });

    const menu = navigationItemsMenuBuilder.buildNavigationToggleMenuItems();
    const containersItem = menu.find(m => m.label === 'Containers');
    containersItem?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).not.toHaveBeenCalled();
  });
});

describe('buildShowHiddenItemsSubmenu', () => {
  test('returns undefined when no items are hidden', () => {
    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'A', visible: true },
        { name: 'B', visible: true },
      ],
    });

    expect(navigationItemsMenuBuilder.buildShowHiddenItemsSubmenu()).toBeUndefined();
  });

  test('returns submenu with hidden items', () => {
    getConfigurationMock.mockReturnValue({ get: () => ['existing'] } as unknown as ConfigurationRegistry);

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'A', visible: true },
        { name: 'B', visible: false },
        { name: 'C', visible: false },
      ],
    });

    const menu = navigationItemsMenuBuilder.buildShowHiddenItemsSubmenu();
    expect(menu?.label).toBe('Show Hidden Items');
    expect(menu?.submenu).toHaveLength(2);

    const submenu = menu?.submenu as MenuItemConstructorOptions[];
    expect(submenu[0]?.label).toBe('B');
    expect(submenu[1]?.label).toBe('C');

    submenu[0]?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);
    expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
      'navbar.disabledItems',
      ['existing'],
      'DEFAULT',
    );
  });

  test('item can be hidden again after being restored via Show Hidden Items', async () => {
    getConfigurationMock.mockReturnValue({
      get: (key: string) => (key === 'hideConfirmationDismissed' ? true : []),
    } as unknown as ConfigurationRegistry);
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    // Step 1: Start with Kubernetes visible
    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'Kubernetes', visible: true },
        { name: 'Pods', visible: true },
      ],
    });

    // Step 2: Hide Kubernetes
    const hideMenu = navigationItemsMenuBuilder.buildHideMenuItem('Kubernetes');
    expect(hideMenu?.label).toBe('Hide Kubernetes From Navigation Bar');
    hideMenu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.disabledItems',
        ['Kubernetes'],
        'DEFAULT',
      );
    });

    // Step 3: Verify "Show Hidden Items" submenu appears
    const showHiddenMenu = navigationItemsMenuBuilder.buildShowHiddenItemsSubmenu();
    expect(showHiddenMenu?.label).toBe('Show Hidden Items');
    const submenu = showHiddenMenu?.submenu as MenuItemConstructorOptions[];
    expect(submenu).toHaveLength(1);
    expect(submenu[0]?.label).toBe('Kubernetes');

    // Step 4: Restore Kubernetes via "Show Hidden Items"
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockClear();
    submenu[0]?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.disabledItems',
        [],
        'DEFAULT',
      );
    });

    // Step 5: Verify Kubernetes can be hidden again (this is the bug - should not fail)
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockClear();
    const reHideMenu = navigationItemsMenuBuilder.buildHideMenuItem('Kubernetes');
    expect(reHideMenu?.label).toBe('Hide Kubernetes From Navigation Bar');
    reHideMenu?.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    await vi.waitFor(() => {
      expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
        'navbar.disabledItems',
        ['Kubernetes'],
        'DEFAULT',
      );
    });
  });
});

describe('buildResetMenuItem', () => {
  test('resets all hidden items', () => {
    vi.mocked(configurationRegistryMock.updateConfigurationValue).mockResolvedValue();

    const menu = navigationItemsMenuBuilder.buildResetMenuItem();
    expect(menu.label).toBe('Reset Navigation Bar');

    menu.click?.({} as MenuItem, browserWindowMock, {} as unknown as KeyboardEvent);

    expect(configurationRegistryMock.updateConfigurationValue).toHaveBeenCalledWith(
      'navbar.disabledItems',
      [],
      'DEFAULT',
    );
  });
});

describe('buildNavigationMenu', async () => {
  test('no items if no linktext and outside navbar', async () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const parameters = {} as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu).toStrictEqual([]);
  });

  test('no items if outside of range of navbar', async () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const parameters = {
      linkText: 'outside',
      x: 200,
      y: 0,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(menu).toStrictEqual([]);
  });

  test('should include hide item and reset when inside navbar with linkText', () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const spyMock = vi.spyOn(navigationItemsMenuBuilder, 'buildHideMenuItem');
    spyMock.mockReturnValue({ label: 'Hide Test From Navigation Bar' } as MenuItemConstructorOptions);
    const parameters = {
      linkText: 'inside',
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    expect(spyMock).toBeCalledWith('inside');
    const hideItem = menu.find(m => m.label === 'Hide Test From Navigation Bar');
    expect(hideItem).toBeDefined();
    const resetItem = menu.find(m => m.label === 'Reset Navigation Bar');
    expect(resetItem).toBeDefined();
  });

  test('should include reset when right-clicking empty navbar space', () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });
    const parameters = {
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    const resetItem = menu.find(m => m.label === 'Reset Navigation Bar');
    expect(resetItem).toBeDefined();
  });

  test('should include Show Hidden Items submenu when items are hidden', () => {
    getConfigurationMock.mockReturnValue({ get: () => 160 });

    navigationItemsMenuBuilder.receiveNavigationItems({
      items: [
        { name: 'A', visible: true },
        { name: 'B', visible: false },
      ],
    });

    const parameters = {
      x: 30,
      y: 100,
    } as unknown as ContextMenuParams;

    const menu = navigationItemsMenuBuilder.buildNavigationMenu(parameters);

    const showHidden = menu.find(m => m.label === 'Show Hidden Items');
    expect(showHidden).toBeDefined();
    expect(showHidden?.submenu).toHaveLength(1);
  });
});
