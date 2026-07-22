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
import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { CONFIGURATION_DEFAULT_SCOPE } from '@podman-desktop/core-api/configuration';
import type { ContextMenuParams, MenuItemConstructorOptions } from 'electron';

import type { ConfigurationRegistry } from './plugin/configuration-registry.js';

// items that can't be hidden
const EXCLUDED_ITEMS = ['Accounts', 'Settings'];

const EXPANDED_WIDTH = 160;

// maximum number of items that can be pinned to the top of the navigation bar
const PINNED_ITEMS_MAX = 10;

const GROUP_SEPARATOR = ' > ';
const isGroupedName = (name: string): boolean => name.includes(GROUP_SEPARATOR);
function leafName(name: string): string {
  const separatorIndex = name.lastIndexOf(GROUP_SEPARATOR);
  return separatorIndex === -1 ? name : name.slice(separatorIndex + GROUP_SEPARATOR.length);
}

// This class is responsible of creating the items to hide/pin a given selected item of the left navigation bar
// and also display a list of all items with the ability to toggle the visibility of each item.
export class NavigationItemsMenuBuilder {
  private navigationItems: NavigationItemState[] = [];

  constructor(private configurationRegistry: ConfigurationRegistry) {}

  receiveNavigationItems(data: NavigationItemState[]): void {
    this.navigationItems = data;
  }

  protected async updateNavbarHiddenItem(itemName: string, visible: boolean): Promise<void> {
    if (!visible) {
      // unpin before hiding so it doesn't stay pinned (podman-desktop/podman-desktop#16803);
      // not awaited since it writes to a separate, independent configuration key
      this.updateNavbarPinnedItem(itemName, false).catch((e: unknown) =>
        console.error('error unpinning item before hiding it', e),
      );
    }

    // grab the disabled items, and add the new one
    const configuration = this.configurationRegistry.getConfiguration('navbar');
    let items = configuration.get<string[]>('disabledItems', []);

    if (visible) {
      items = items.filter(i => i !== itemName);
    } else if (!items.includes(itemName)) {
      items.push(itemName);
    }
    await this.configurationRegistry.updateConfigurationValue(
      'navbar.disabledItems',
      items,
      CONFIGURATION_DEFAULT_SCOPE,
    );
  }

  protected async updateNavbarPinnedItem(itemName: string, pin: boolean): Promise<void> {
    // grab the pinned items, and add/remove the given one
    const configuration = this.configurationRegistry.getConfiguration('navbar');
    let items = configuration.get<string[]>('pinnedItems', []);

    if (!pin) {
      items = items.filter(i => i !== itemName);
    } else if (!items.includes(itemName) && items.length < PINNED_ITEMS_MAX) {
      // pin to the top of the list
      items = [itemName, ...items];
    }
    await this.configurationRegistry.updateConfigurationValue('navbar.pinnedItems', items, CONFIGURATION_DEFAULT_SCOPE);
  }

  protected escapeLabel(label: string): string {
    return label.replace('&', '&&');
  }

  protected computeItemName(rawItemName: string): string {
    // need to filter any counter from the item name
    // it's at the end with parenthesis like itemName (2)
    const itemName = rawItemName.replace(/\s\(\d+\)$/, '');

    // Electron sends the whole element text including sub elements, each level separated by '\n'
    return itemName.split('\n')[0] ?? itemName;
  }

  protected buildHideMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    const rawItemName = linkText;

    // need to filter any counter from the item name
    // it's at the end with parenthesis like itemName (2)
    const itemName = this.computeItemName(rawItemName);

    if (EXCLUDED_ITEMS.includes(itemName)) {
      return undefined;
    }

    // on electron, need to esccape the & character to show it
    const itemDisplayName = this.escapeLabel(itemName);

    const item: MenuItemConstructorOptions = {
      label: `Hide ${itemDisplayName}`,
      visible: true,
      click: (): void => {
        // flag the item as being disabled
        this.updateNavbarHiddenItem(itemName, false).catch((e: unknown) => console.error('error disabling item', e));
      },
    };
    return item;
  }

  protected buildPinMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    // need to filter any counter from the item name
    // it's at the end with parenthesis like itemName (2)
    const itemName = this.computeItemName(linkText);

    // a submenu child's grouped name (e.g. "Kubernetes > Pods") can never equal this bare
    // itemName, so this can't accidentally match one instead of a top-level item
    const item = this.navigationItems.find(i => i.name === itemName);
    if (!item) {
      return undefined;
    }

    // on electron, need to escape the & character to show it
    const itemDisplayName = this.escapeLabel(itemName);

    const isAtMaxCapacity = !item.pinned && this.navigationItems.filter(i => i.pinned).length >= PINNED_ITEMS_MAX;

    const menuItem: MenuItemConstructorOptions = {
      label: item.pinned ? `Unpin ${itemDisplayName}` : `Pin ${itemDisplayName} to Top`,
      visible: true,
      enabled: !isAtMaxCapacity,
      click: (): void => {
        this.updateNavbarPinnedItem(itemName, !item.pinned).catch((e: unknown) =>
          console.error('error pinning item', e),
        );
      },
    };
    return menuItem;
  }

  // Match a submenu child by the pathname of the right-clicked link's URL rather than by
  // name/position: submenu sidebars aren't confined to a known pixel region.
  protected findSubmenuItemByLinkURL(linkURL: string): NavigationItemState | undefined {
    if (!linkURL) {
      return undefined;
    }
    let pathname: string;
    try {
      pathname = new URL(linkURL).pathname;
    } catch {
      return undefined;
    }
    return this.navigationItems.find(item => isGroupedName(item.name) && item.link === pathname);
  }

  // Pin/unpin menu for a submenu child, e.g. right-clicking Kubernetes' Pods in its own
  // sidebar. Submenu children are pin-only: no hide/show support (not requested).
  protected buildSubmenuPinMenuItem(linkURL: string): MenuItemConstructorOptions | undefined {
    const item = this.findSubmenuItemByLinkURL(linkURL);
    if (!item?.link) {
      return undefined;
    }

    const itemDisplayName = this.escapeLabel(leafName(item.name));
    const isAtMaxCapacity = !item.pinned && this.navigationItems.filter(i => i.pinned).length >= PINNED_ITEMS_MAX;

    const menuItem: MenuItemConstructorOptions = {
      label: item.pinned ? `Unpin ${itemDisplayName}` : `Pin ${itemDisplayName} to Top`,
      visible: true,
      enabled: !isAtMaxCapacity,
      click: (): void => {
        // submenu children are pinned by their link, not name (see applyItemState in
        // navigation-registry.ts), since names aren't unique across the whole registry
        this.updateNavbarPinnedItem(item.link, !item.pinned).catch((e: unknown) =>
          console.error('error pinning item', e),
        );
      },
    };
    return menuItem;
  }

  protected buildNavigationToggleMenuItems(): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];

    // submenu children (e.g. Kubernetes' Pods) can only be pinned via a direct right-click on
    // them, never hidden/shown from this checklist (not requested)
    const hideableItems = this.navigationItems.filter(item => !isGroupedName(item.name));

    // add all navigation items to be able to show/hide them
    const menuForNavItems: Electron.MenuItemConstructorOptions[] = hideableItems.map(item => ({
      label: this.escapeLabel(item.name),
      type: 'checkbox',
      checked: item.visible,
      click: (): void => {
        // send the item to the frontend to show/hide it
        this.updateNavbarHiddenItem(item.name, !item.visible).catch((e: unknown) =>
          console.error('error disabling item', e),
        );
      },
    }));
    if (menuForNavItems.length > 0) {
      // add separator
      items.push({ type: 'separator' });
      // add all items
      items.push(...menuForNavItems);
    }

    return items;
  }

  protected buildUnpinAllMenuItem(): MenuItemConstructorOptions | undefined {
    if (!this.navigationItems.some(item => item.pinned)) {
      return undefined;
    }
    return {
      label: 'Unpin All',
      visible: true,
      click: (): void => {
        this.updateNavbarUnpinAllItems().catch((e: unknown) => console.error('error unpinning all items', e));
      },
    };
  }

  protected async updateNavbarUnpinAllItems(): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue('navbar.pinnedItems', [], CONFIGURATION_DEFAULT_SCOPE);
  }

  protected getNavWidth(): number {
    const configuration = this.configurationRegistry.getConfiguration(AppearanceSettings.SectionName);
    return configuration.get<number>(AppearanceSettings.NavigationBarWidth, EXPANDED_WIDTH);
  }

  buildNavigationMenu(parameters: ContextMenuParams): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];
    const navWidth = this.getNavWidth();

    // Check for a submenu child by linkURL first: once pinned, it's promoted into the primary
    // nav's Pinned section too, so it can be right-clicked there as well.
    const submenuPinMenu = parameters.linkURL ? this.buildSubmenuPinMenuItem(parameters.linkURL) : undefined;
    if (submenuPinMenu) {
      items.push(submenuPinMenu);
    } else if (parameters.linkText && parameters.x < navWidth && parameters.y > 76) {
      // a genuine top-level item, pin/unpin and hide it
      const pinMenu = this.buildPinMenuItem(parameters.linkText);
      if (pinMenu) {
        items.push(pinMenu);
      }
      const menu = this.buildHideMenuItem(parameters.linkText);
      if (menu) {
        items.push(menu);
      }
    }
    if (parameters.x < navWidth) {
      // right next to pin/unpin/hide above, not after the show/hide checklist below
      const unpinAllMenu = this.buildUnpinAllMenuItem();
      if (unpinAllMenu) {
        items.push(unpinAllMenu);
      }
      items.push(...this.buildNavigationToggleMenuItems());
    }
    return items;
  }
}
